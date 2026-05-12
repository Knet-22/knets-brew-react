import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function generateCode(prefix = 'KB') {
  const hash = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `${prefix}-${hash}`
}

export const peso = (n) => '₱' + Number(n).toLocaleString(undefined, {
  minimumFractionDigits: 2, maximumFractionDigits: 2
})
