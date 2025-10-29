<script lang="ts">
  import type { PageData } from './$types'
  import type { Tool } from '$lib/types'
  import { searchTerm, difficultyFilter, monetizationFilter, uniqueMonetizationModels } from '$lib/stores'

  export let data: PageData
  let currentPage = 1
  const itemsPerPage = 50

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

  $: totalPages = Math.ceil(filteredTools.length / itemsPerPage)
  
  $: paginatedTools = filteredTools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
            {#each paginatedTools as tool}
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
                <td class="px-6 py-4 text-sm text-gray-400">{tool.monetization_model || 'N/A'}</td>
              </tr>
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
      Showing {paginatedTools.length} of {filteredTools.length} filtered tools 
      {filteredTools.length !== data.tools?.length ? `(out of ${data.tools?.length || 0} total)` : ''}
      {#if totalPages > 1}
        - Page {currentPage} of {totalPages}
      {/if}
    </div>
  </div>
</div>