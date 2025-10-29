import { writable } from 'svelte/store'

export const searchTerm = writable('')
export const difficultyFilter = writable('all')
export const monetizationFilter = writable('all')
export const uniqueMonetizationModels = writable<string[]>([])

