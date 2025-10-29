export interface Tool {
  id: string
  tool_idea: string
  description: string
  search_volume: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  monetization_model: string
  created_at?: string
}

