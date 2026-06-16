# OWASP Learning Hub

Ứng dụng học OWASP Top 10 qua thực hành — lý thuyết, ví dụ thực tế, quiz, và sandbox "Hack It" chạy hoàn toàn trên trình duyệt.

## Tính năng

- **10 bài học** covering A01–A10 với nội dung đầy đủ: khái niệm, ví dụ real-world, code snippet có syntax highlight
- **Quiz** tương tác với feedback chi tiết và giải thích đáp án
- **Hack It sandbox**: SQL Injection chạy qua sql.js (SQLite WebAssembly), JavaScript challenges qua iframe sandbox — không cần backend
- **Tiến độ** lưu vào localStorage, progress bar tổng quan, xuất JSON
- **Practice Mode**: random quiz từ tất cả bài học, chấm điểm và review
- **Planning Mode**: đặt mục tiêu hoàn thành trong X ngày, nhắc nhở qua browser notification
- **Dark mode** toggle

## Cài đặt

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # chạy unit tests
npm run build     # build production
```

## Cấu trúc dự án

```
src/
├── data/
│   └── owasp.json              # Toàn bộ nội dung 10 bài học
├── services/                   # Business logic, tách biệt khỏi UI
│   ├── contentService.js       # Load và query bài học
│   ├── progressService.js      # Lưu/đọc tiến độ (localStorage)
│   ├── quizService.js          # Chấm điểm, tạo đề thi ngẫu nhiên
│   ├── sandboxService.js       # Thực thi SQL và JS an toàn
│   └── planningService.js      # Kế hoạch học tập, notification
├── store/
│   └── useAppStore.js          # Zustand global state
├── components/
│   ├── ui/                     # Generic components (Navbar, Tabs, Toast...)
│   └── features/               # Feature components (LessonCard, QuizPanel, CodeEditor...)
└── pages/
    ├── HomePage.jsx
    ├── LessonPage.jsx
    └── PracticePage.jsx
```

## Tech stack

| Công nghệ | Mục đích |
|---|---|
| React 18 + Vite | Framework và build tool |
| Tailwind CSS | Styling |
| Zustand | Global state management |
| React Router DOM | Client-side routing |
| sql.js (SQLite WASM) | Chạy SQL trong trình duyệt |
| Monaco Editor | Code editor (VS Code engine) |
| Vitest | Unit testing |

## Mở rộng nội dung

Thêm hoặc chỉnh sửa bài học trong `src/data/owasp.json`. Mỗi bài học có cấu trúc:

```json
{
  "id": "A01",
  "name": "Tên lỗ hổng",
  "shortDesc": "Mô tả ngắn",
  "concept": "Giải thích cốt lõi",
  "conceptDetails": [ { "type": "text|code|callout", "content": "..." } ],
  "examples": [ { "title": "...", "text": "...", "code": "...", "language": "..." } ],
  "bestPractices": "Tóm tắt",
  "bestPracticesList": ["item 1", "item 2"],
  "quiz": { "question": "...", "options": [], "correct": 0, "explanation": "..." },
  "tryAndCode": { "language": "sql|javascript", "initialCode": "...", "testCases": [] }
}
```

## Thêm backend trong tương lai

Tất cả services đều có interface chuẩn — chỉ cần thay đổi implementation bên trong service, không cần đụng đến component:

- `progressService.js`: thay `localStorage` → API call
- `contentService.js`: thay `import JSON` → `fetch('/api/lessons')`
- `sandboxService.js`: thay iframe → Judge0 API hoặc Docker sandbox

## License

MIT
