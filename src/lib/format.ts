export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function createOrderCode() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `KB-${date}-${random}`
}

export function getProductEmoji(name: string, category: string): string {
  const map: Record<string, string> = {
    'luwak': '🌿',
    'ivory': '🐘',
    'geisha': '🌸',
    'mountain': '⛰️',
    'latte': '🥛',
    'espresso': '☕',
    'cappuccin': '☕',
    'croissant': '🥐',
    'chocolat': '🍫',
    'cheesecake': '🍰',
    'matcha': '🍵',
    'gold': '✨',
    'boholano': '🌴',
  }
  
  const lowerName = name.toLowerCase()
  for (const [keyword, emoji] of Object.entries(map)) {
    if (lowerName.includes(keyword)) return emoji
  }
  
  if (category.includes('Pastries')) return '🥐'
  return '☕'
}
