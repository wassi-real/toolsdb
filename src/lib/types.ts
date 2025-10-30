export interface Tool {
  id: string
  tool_idea: string
  description: string
  search_volume: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  monetization_model: string
  created_at?: string
}

export interface Ad {
  id: string
  title: string
  description: string | null
  link_url: string | null
  image_url: string | null
  is_active: boolean
  is_placeholder: boolean
  created_at?: string
  updated_at?: string
}

