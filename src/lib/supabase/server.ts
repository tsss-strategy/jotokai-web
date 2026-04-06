import { createClient } from "@supabase/supabase-js"

export function createServerSupabaseClient() {
  // サーバー側ではSERVICE_ROLE_KEYを優先使用（RLSバイパス）
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey
  )
}
