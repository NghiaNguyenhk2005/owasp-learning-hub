/**
 * sandboxService — thực thi code an toàn trong trình duyệt.
 *
 * SQL  → sql.js (SQLite WebAssembly), hoàn toàn client-side
 * JS   → iframe với sandbox attribute + srcdoc, isolated execution
 *
 * Interface chuẩn: tất cả hàm đều trả về { success, output, error }
 * Sau này muốn thêm Judge0/backend: chỉ thêm một case mới, không đụng component.
 */

// ─── SQL Executor ────────────────────────────────────────────────────────────

let _sqlJs = null

async function _getSqlJs() {
  if (_sqlJs) return _sqlJs
  const initSqlJs = (await import('sql.js')).default
  _sqlJs = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  })
  return _sqlJs
}

/**
 * Thực thi SQL trong SQLite WebAssembly
 * @param {string} userSql     - câu lệnh SQL của người dùng
 * @param {string} setupSql    - câu lệnh khởi tạo DB (tạo bảng, insert dữ liệu)
 * @param {object} [expected]  - { columns, values } để so sánh kết quả (tuỳ chọn)
 * @returns {Promise<{ success: boolean, output: any, error: string | null }>}
 */
export async function executeSql(userSql, setupSql = '', expected = null) {
  try {
    const SQL = await _getSqlJs()
    const db = new SQL.Database()

    if (setupSql) db.run(setupSql)

    const results = db.exec(userSql)
    db.close()

    const output = results.length > 0 ? results[0] : { columns: [], values: [] }

    // Nếu có expected, kiểm tra kết quả
    let success = true
    if (expected) {
      const actualValues = JSON.stringify(output.values)
      const expectedValues = JSON.stringify(expected.values)
      success = actualValues === expectedValues
    }

    return { success, output, error: null }
  } catch (err) {
    return { success: false, output: null, error: err.message }
  }
}

// ─── JS Executor (iframe sandbox) ────────────────────────────────────────────

/**
 * Thực thi JavaScript trong iframe sandbox cách ly
 * @param {string} userCode   - code của người dùng
 * @param {object[]} testCases - [{ input: any[], expected: any }]
 * @returns {Promise<{ success: boolean, output: TestResult[], error: string | null }>}
 */
export function executeJs(userCode, testCases = []) {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe')
    iframe.setAttribute('sandbox', 'allow-scripts')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    const timeout = setTimeout(() => {
      document.body.removeChild(iframe)
      resolve({ success: false, output: [], error: 'Timeout: code chạy quá 5 giây' })
    }, 5000)

    window.addEventListener(
      'message',
      function handler(event) {
        if (event.data?.type !== 'SANDBOX_RESULT') return
        clearTimeout(timeout)
        window.removeEventListener('message', handler)
        document.body.removeChild(iframe)
        resolve(event.data.payload)
      },
      { once: false }
    )

    const srcdoc = `
      <script>
        try {
          ${userCode}

          const testCases = ${JSON.stringify(testCases)};
          const results = testCases.map(({ input, expected }) => {
            try {
              // Gọi function đầu tiên được định nghĩa trong userCode
              const fnName = (${JSON.stringify(userCode)}.match(/function\\s+(\\w+)/) || [])[1];
              const fn = fnName ? eval(fnName) : undefined;
              if (!fn) throw new Error('Không tìm thấy function');
              const actual = fn(...input);
              return {
                input,
                expected,
                actual,
                passed: JSON.stringify(actual) === JSON.stringify(expected),
              };
            } catch (e) {
              return { input, expected, actual: null, passed: false, error: e.message };
            }
          });

          const success = results.every(r => r.passed);
          window.parent.postMessage({ type: 'SANDBOX_RESULT', payload: { success, output: results, error: null } }, '*');
        } catch (e) {
          window.parent.postMessage({ type: 'SANDBOX_RESULT', payload: { success: false, output: [], error: e.message } }, '*');
        }
      <\/script>
    `

    iframe.srcdoc = srcdoc
  })
}
