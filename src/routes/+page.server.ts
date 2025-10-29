import type { PageServerLoad } from './$types'
import type { Tool } from '$lib/types'
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { SUPABASE_SERVICE_KEY } from '$env/static/private'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ depends }) => {
  depends('tools:table')
  
  // Create server-side client with service key (bypasses RLS)
  const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  const { data: tools, error: supabaseError } = await supabase
    .from('tools')
    .select('*')

  if (supabaseError) {
    console.error('Supabase error:', supabaseError)
    throw error(500, `Failed to fetch tools: ${supabaseError.message}`)
  }

  // Randomize the tools array
  const shuffled = [...(tools || [])]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  console.log('Tools loaded:', shuffled.length)
  
  return {
    tools: shuffled
  }
}

