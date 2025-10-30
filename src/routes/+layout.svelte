<script>
  import '../app.css'
  import { searchTerm, difficultyFilter, monetizationFilter, uniqueMonetizationModels } from '$lib/stores'
  
  let mobileMenuOpen = false
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen
  }
</script>

<nav class="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-600">
  <div class="container mx-auto px-4 py-3">
    <div class="flex items-center justify-between gap-4">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 text-2xl font-bold text-gray-100 hover:text-white transition-colors whitespace-nowrap">
        <img src="/toolsdb.png" alt="ToolsDB Logo" class="h-8 w-8" />
        <span>ToolsDB</span>
      </a>
      
      <!-- Desktop Menu -->
      <div class="hidden lg:flex items-center gap-3 flex-1 max-w-4xl ml-8">
        <div class="relative flex-1 min-w-[200px]">
          <input
            type="text"
            bind:value={$searchTerm}
            placeholder="Search tools..."
            class="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-100 placeholder-gray-500 text-sm"
          />
          <svg class="absolute right-3 top-2.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        
        <select
          bind:value={$difficultyFilter}
          class="px-3 py-2 bg-[#0a0a0a] border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-100 text-sm"
        >
          <option value="all">All Difficulties</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        
        <select
          bind:value={$monetizationFilter}
          class="px-3 py-2 bg-[#0a0a0a] border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-100 text-sm"
        >
          <option value="all">All Models</option>
          {#each $uniqueMonetizationModels as model}
            <option value={model}>{model}</option>
          {/each}
        </select>
      </div>
      
      <!-- Mobile Hamburger Button -->
      <button
        on:click={toggleMobileMenu}
        class="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        {#if mobileMenuOpen}
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        {:else}
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        {/if}
      </button>
    </div>
    
    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
      <div class="lg:hidden mt-4 pb-4 space-y-3 border-t border-gray-600 pt-4">
        <div class="relative">
          <input
            type="text"
            bind:value={$searchTerm}
            placeholder="Search tools..."
            class="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-100 placeholder-gray-500 text-sm"
          />
          <svg class="absolute right-3 top-2.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        
        <select
          bind:value={$difficultyFilter}
          class="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-100 text-sm"
        >
          <option value="all">All Difficulties</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        
        <select
          bind:value={$monetizationFilter}
          class="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-100 text-sm"
        >
          <option value="all">All Models</option>
          {#each $uniqueMonetizationModels as model}
            <option value={model}>{model}</option>
          {/each}
        </select>
      </div>
    {/if}
  </div>
</nav>

<div class="pt-20 lg:pt-16 min-h-screen bg-black">
  <slot />
</div>