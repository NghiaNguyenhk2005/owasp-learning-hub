/**
 * Severity config cho từng OWASP item
 * Dùng để tô màu card, badge, header
 */
export const SEVERITY = {
  A01: { level: 'critical', color: 'red',    label: 'Critical' },
  A02: { level: 'high',     color: 'orange',  label: 'High'     },
  A03: { level: 'critical', color: 'red',    label: 'Critical' },
  A04: { level: 'high',     color: 'orange',  label: 'High'     },
  A05: { level: 'medium',   color: 'yellow',  label: 'Medium'   },
  A06: { level: 'high',     color: 'orange',  label: 'High'     },
  A07: { level: 'critical', color: 'red',    label: 'Critical' },
  A08: { level: 'high',     color: 'orange',  label: 'High'     },
  A09: { level: 'medium',   color: 'yellow',  label: 'Medium'   },
  A10: { level: 'high',     color: 'orange',  label: 'High'     },
}

export const SEVERITY_STYLES = {
  critical: {
    badge:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    border: 'border-red-200 dark:border-red-900/60',
    accent: 'bg-red-500',
    dot:    'bg-red-500',
    text:   'text-red-600 dark:text-red-400',
    glow:   'hover:border-red-300 dark:hover:border-red-800',
  },
  high: {
    badge:  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-900/60',
    accent: 'bg-orange-500',
    dot:    'bg-orange-500',
    text:   'text-orange-600 dark:text-orange-400',
    glow:   'hover:border-orange-300 dark:hover:border-orange-800',
  },
  medium: {
    badge:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-900/60',
    accent: 'bg-yellow-500',
    dot:    'bg-yellow-500',
    text:   'text-yellow-600 dark:text-yellow-400',
    glow:   'hover:border-yellow-300 dark:hover:border-yellow-800',
  },
}

export function getSeverity(lessonId) {
  return SEVERITY[lessonId] ?? { level: 'medium', color: 'yellow', label: 'Medium' }
}

export function getSeverityStyles(lessonId) {
  const s = getSeverity(lessonId)
  return SEVERITY_STYLES[s.level]
}
