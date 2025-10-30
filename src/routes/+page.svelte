<script lang="ts">
  import type { PageData } from './$types'
  import type { Tool, Ad } from '$lib/types'
  import { searchTerm, difficultyFilter, monetizationFilter, uniqueMonetizationModels } from '$lib/stores'

  export let data: PageData
  let currentPage = 1
  const itemsPerPage = 50
  
  // Type for mixed items (tools and ads)
  type DisplayItem = 
    | { type: 'tool'; data: Tool }
    | { type: 'ad'; data: Ad }

  // Clipboard copy feedback - track by row index to avoid undefined ids
  let copiedRowIndex: number | null = null
  function copyTool(tool: Tool, rowIndex: number) {
    const name = tool.tool_idea || 'N/A'
    const description = tool.description || 'N/A'
    const text = `${name}, ${description}`
    navigator.clipboard?.writeText(text).then(() => {
      copiedRowIndex = rowIndex
      setTimeout(() => {
        if (copiedRowIndex === rowIndex) copiedRowIndex = null
      }, 1500)
    })
  }

  // Map filter values to database values
  function getDifficultyValue(filterValue: string): string {
    const mapping: Record<string, string> = {
      'Low': 'Easy',
      'Medium': 'Medium',
      'High': 'Hard',
      'all': 'all'
    }
    return mapping[filterValue] || filterValue
  }

  // Map database values to display values
  function getDisplayDifficulty(dbValue: string): string {
    const mapping: Record<string, string> = {
      'Easy': 'Low',
      'Medium': 'Medium',
      'Hard': 'High'
    }
    return mapping[dbValue] || dbValue
  }

  $: {
    console.log('Data received:', data.tools?.length || 0, 'tools')
    console.log('Raw tools:', data.tools)
  }

  $: filteredTools = (data.tools || []).filter((tool: Tool) => {
    const matchesSearch = tool.tool_idea?.toLowerCase().includes($searchTerm.toLowerCase()) ||
                         tool.description?.toLowerCase().includes($searchTerm.toLowerCase())
    
    let matchesDifficulty = true
    if ($difficultyFilter !== 'all') {
      const filterDifficulty = getDifficultyValue($difficultyFilter)
      const displayDifficulty = getDisplayDifficulty(tool.difficulty)
      // Check against both the mapped database value (Easy/Medium/Hard) and display value (Low/Medium/High)
      matchesDifficulty = tool.difficulty === filterDifficulty || 
                         tool.difficulty === $difficultyFilter || 
                         displayDifficulty === $difficultyFilter
    }
    
    const matchesMonetization = $monetizationFilter === 'all' || tool.monetization_model === $monetizationFilter

    return matchesSearch && matchesDifficulty && matchesMonetization
  })
  
  // Function to insert ads at random positions across the entire list
  function insertAdsRandomly(tools: Tool[], ads: Ad[]): DisplayItem[] {
    const items: DisplayItem[] = tools.map((tool) => ({ type: 'tool' as const, data: tool }))
    if (!ads || ads.length === 0) return items

    // Shuffle ads for randomness
    const shuffledAds = [...ads]
    for (let i = shuffledAds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledAds[i], shuffledAds[j]] = [shuffledAds[j], shuffledAds[i]]
    }

    // Decide how many ads to insert based on list size (at least 1)
    const approxFrequency = Math.max(5, Math.floor(tools.length / Math.max(ads.length, 1)))
    const numAdsToInsert = Math.max(1, Math.floor(tools.length / approxFrequency))

    const usedPositions = new Set<number>()
    for (let i = 0; i < numAdsToInsert; i++) {
      // Choose a random insertion index anywhere from start to end
      let pos = Math.floor(Math.random() * (items.length + 1))
      while (usedPositions.has(pos)) {
        pos = Math.floor(Math.random() * (items.length + 1))
      }
      usedPositions.add(pos)
      const ad = shuffledAds[i % shuffledAds.length]
      items.splice(pos, 0, { type: 'ad', data: ad })
    }

    return items
  }
  
  // Compute total pages based on tools only (ads are injected per page)
  $: totalPages = Math.ceil(filteredTools.length / itemsPerPage)

  // Get the tools for the current page
  $: currentPageTools = filteredTools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Insert exactly one ad at a random position within the current page
  function insertOneAdIntoPage(toolsInPage: Tool[], ads: Ad[]): DisplayItem[] {
    const pageItems: DisplayItem[] = toolsInPage.map((t) => ({ type: 'tool' as const, data: t }))
    if (!ads || ads.length === 0) return pageItems
    const ad = ads[Math.floor(Math.random() * ads.length)]
    const insertIndex = Math.floor(Math.random() * (pageItems.length + 1))
    pageItems.splice(insertIndex, 0, { type: 'ad', data: ad })
    return pageItems
  }

  $: paginatedItems = insertOneAdIntoPage(currentPageTools, data.ads || [])

  // Footer counts
  $: adsAvailable = (data.ads || []).length
  $: adsOnThisPage = (paginatedItems || []).filter((i) => i.type === 'ad').length
  $: toolsOnThisPage = (paginatedItems || []).length - adsOnThisPage

  // Calculate which page numbers to show
  let paginationStart = 1
  let paginationEnd = 5
  
  $: {
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, currentPage + 2)
    
    // Adjust if we're near the beginning
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages)
      startPage = 1
    }
    // Adjust if we're near the end
    if (currentPage >= totalPages - 2 && totalPages > 5) {
      startPage = Math.max(1, totalPages - 4)
      endPage = totalPages
    }
    
    paginationStart = startPage
    paginationEnd = endPage
  }

  $: uniqueMonetizationModels.set([...new Set((data.tools || []).map((tool: Tool) => tool.monetization_model).filter(Boolean))])

  // Reset to page 1 when filters change or if current page is invalid
  let prevSearchTerm = ''
  let prevDifficultyFilter = 'all'
  let prevMonetizationFilter = 'all'

  $: {
    const filtersChanged = prevSearchTerm !== $searchTerm || 
                          prevDifficultyFilter !== $difficultyFilter || 
                          prevMonetizationFilter !== $monetizationFilter
    
    if (filtersChanged) {
      currentPage = 1
      prevSearchTerm = $searchTerm
      prevDifficultyFilter = $difficultyFilter
      prevMonetizationFilter = $monetizationFilter
    }
    
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = 1
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToPage(page: number) {
    const newPage = Math.max(1, Math.min(page, totalPages))
    if (newPage !== currentPage) {
      currentPage = newPage
      scrollToTop()
    }
  }

  function previousPage() {
    if (currentPage > 1) {
      currentPage--
      scrollToTop()
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++
      scrollToTop()
    }
  }
</script>

<div class="min-h-screen bg-black text-gray-100">
  <div class="container mx-auto px-4 py-8">
    <!-- Tools Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-600">
      <table class="w-full">
        <thead class="bg-[#0a0a0a]">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">Tool Idea</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">Description</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">Search Volume</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">Difficulty</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">Monetization Model</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-600">
          {#if !data.tools || data.tools.length === 0}
            <tr>
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                No tools in database. {data.tools?.length || 0} tools loaded.
              </td>
            </tr>
          {:else if filteredTools.length === 0}
            <tr>
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                No tools found matching your criteria (out of {data.tools.length} total tools)
              </td>
            </tr>
          {:else}
            {#each paginatedItems as item, idx}
              {#if item.type === 'tool'}
                {@const tool = item.data}
                {@const displayDifficulty = getDisplayDifficulty(tool.difficulty)}
                <tr class="hover:bg-[#0a0a0a]/50 transition-colors">
                  <td class="px-6 py-4 text-sm font-medium text-gray-100">{tool.tool_idea || 'N/A'}</td>
                  <td class="px-6 py-4 text-sm text-gray-400">{tool.description || 'N/A'}</td>
                  <td class="px-6 py-4 text-sm text-gray-400">{tool.search_volume?.toLocaleString() || 0}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full
                      {displayDifficulty === 'Low' ? 'bg-green-900/30 text-green-400' : ''}
                      {displayDifficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' : ''}
                      {displayDifficulty === 'High' ? 'bg-red-900/30 text-red-400' : ''}
                      {!['Low', 'Medium', 'High'].includes(displayDifficulty) ? 'bg-gray-900/30 text-gray-400' : ''}">
                      {displayDifficulty || tool.difficulty || 'N/A'}
                    </span>
                  </td>
                <td class="px-6 py-4 text-sm text-gray-400">
                  <div class="flex items-center justify-between gap-3">
                    <span class="truncate">{tool.monetization_model || 'N/A'}</span>
                    <button
                      on:click={() => copyTool(tool, idx)}
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 bg-gray-900"
                      aria-label="Copy tool name and description"
                      title="Copy name, description"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2H10a2 2 0 01-2-2v-2" />
                      </svg>
                      <span class="text-xs">Copy</span>
                    </button>
                  </div>
                  {#if copiedRowIndex === idx}
                    <div class="mt-1 text-xs text-green-400">Copied!</div>
                  {/if}
                </td>
                </tr>
              {:else if item.type === 'ad'}
                {@const ad = item.data}
                <tr class="bg-gradient-to-r from-blue-900/20 to-purple-900/20 hover:from-blue-900/30 hover:to-purple-900/30 transition-colors border-l-4 border-blue-500">
                  <td colspan="5" class="px-6 py-6">
                    <div class="flex items-center gap-4">
                      {#if ad.image_url}
                        <img src={ad.image_url} alt={ad.title} class="w-16 h-16 rounded-lg object-cover" />
                      {/if}
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          {#if ad.is_placeholder}
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-900/40 text-purple-300">
                              Ad Spot Available
                            </span>
                          {:else}
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-900/40 text-blue-300">
                              Sponsored
                            </span>
                          {/if}
                          <h3 class="text-lg font-bold text-white">{ad.title}</h3>
                        </div>
                        {#if ad.description}
                          <p class="text-sm text-gray-300 mb-2">{ad.description}</p>
                        {/if}
                        {#if ad.link_url}
                          <a 
                            href={ad.link_url} 
                            class="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                            target={ad.is_placeholder ? '_self' : '_blank'}
                            rel={ad.is_placeholder ? '' : 'noopener noreferrer'}
                          >
                            {ad.is_placeholder ? 'Contact Us' : 'Learn More'}
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                          </a>
                        {/if}
                      </div>
                    </div>
                  </td>
                </tr>
              {/if}
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="mt-6 flex items-center justify-center gap-2">
        <button
          on:click={previousPage}
          disabled={currentPage === 1}
          class="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-100 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <div class="flex gap-1 items-center">
          {#if paginationStart > 1}
            <button
              on:click={() => goToPage(1)}
              class="px-3 py-2 min-w-[40px] bg-gray-900 border border-gray-800 rounded-lg text-gray-100 hover:bg-gray-800 transition-colors"
            >
              1
            </button>
            {#if paginationStart > 2}
              <span class="px-2 text-gray-500">...</span>
            {/if}
          {/if}
          
          {#each Array(paginationEnd - paginationStart + 1) as _, i}
            {@const page = paginationStart + i}
            <button
              on:click={() => goToPage(page)}
              class="px-3 py-2 min-w-[40px] bg-gray-900 border rounded-lg text-gray-100 hover:bg-gray-800 transition-colors {currentPage === page ? 'bg-blue-600 border-blue-500 font-semibold' : 'border-gray-800'}"
            >
              {page}
            </button>
          {/each}
          
          {#if paginationEnd < totalPages}
            {#if paginationEnd < totalPages - 1}
              <span class="px-2 text-gray-500">...</span>
            {/if}
            <button
              on:click={() => goToPage(totalPages)}
              class="px-3 py-2 min-w-[40px] bg-gray-900 border border-gray-800 rounded-lg text-gray-100 hover:bg-gray-800 transition-colors"
            >
              {totalPages}
            </button>
          {/if}
        </div>
        
        <button
          on:click={nextPage}
          disabled={currentPage === totalPages}
          class="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-100 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    {/if}
    
    <div class="mt-6 text-center text-sm text-gray-500">
      Showing {paginatedItems.length} rows this page ({toolsOnThisPage} tools + {adsOnThisPage} ad{adsOnThisPage === 1 ? '' : 's'})
      — Filtered tools: {filteredTools.length} of {data.tools?.length || 0}; Ads available: {adsAvailable}
      {#if totalPages > 1}
        - Page {currentPage} of {totalPages}
      {/if}
    </div>
  </div>
</div>