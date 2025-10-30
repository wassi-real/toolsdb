<script lang="ts">
  const email = 'wassi@softodesign.com'
  const subject = encodeURIComponent('Sponsor ToolsDB - $99 lifetime ad')
  const body = encodeURIComponent(
    'Hi,\n\nI would like to sponsor a lifetime ad on ToolsDB. Please share the next steps.\n\nThanks,'
  )
  const mailtoHref = `mailto:${email}?subject=${subject}&body=${body}`
</script>

<div class="min-h-screen bg-black text-gray-100 relative overflow-hidden">
  <!-- Decorative background glow -->
  <div class="pointer-events-none absolute inset-0">
    <div class="absolute -top-24 -left-24 h-72 w-72 bg-blue-700/20 blur-3xl rounded-full"></div>
    <div class="absolute -bottom-24 -right-16 h-72 w-72 bg-purple-700/20 blur-3xl rounded-full"></div>
  </div>

  <div class="container mx-auto px-4 py-16">
    <!-- Hero -->
    <div class="max-w-3xl mx-auto text-center mb-10">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-4">
        <svg class="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
        Sponsor a Lifetime Ad on <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ToolsDB</span>
      </h1>
      <p class="mt-3 text-gray-400">
        Get your product in front of developers browsing real tool ideas. One-time fee, lifetime placement.
      </p>
    </div>

    <!-- Content Grid -->
    <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Pricing Card -->
      <div class="lg:col-span-1 bg-[#0a0a0a] border border-gray-700 rounded-2xl p-6 shadow-xl relative">
        <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5"></div>
        <h2 class="text-xl font-bold text-white">Lifetime Ad</h2>
        <p class="text-gray-400 mt-1">Simple pricing. No renewals.</p>

        <div class="mt-6 flex items-baseline gap-2">
          <div class="text-5xl font-extrabold text-white tracking-tight">$99</div>
          <span class="text-sm text-gray-400">one-time</span>
        </div>

        <ul class="mt-6 space-y-3 text-sm">
          <li class="flex items-start gap-3">
            <span class="mt-0.5 inline-block w-5 h-5 rounded-full bg-green-900/40 text-green-300 grid place-items-center">✓</span>
            <span class="text-gray-300">Placement in the tools list</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-0.5 inline-block w-5 h-5 rounded-full bg-green-900/40 text-green-300 grid place-items-center">✓</span>
            <span class="text-gray-300">Randomized visibility across pages</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-0.5 inline-block w-5 h-5 rounded-full bg-green-900/40 text-green-300 grid place-items-center">✓</span>
            <span class="text-gray-300">Link to your website or landing page</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-0.5 inline-block w-5 h-5 rounded-full bg-green-900/40 text-green-300 grid place-items-center">✓</span>
            <span class="text-gray-300">Optional image or logo</span>
          </li>
        </ul>

        <a
          href={mailtoHref}
          class="mt-8 inline-flex items-center justify-center w-full px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
        >
          Email {email}
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>

        <p class="mt-3 text-xs text-gray-500 text-center">
          Opens your email client with a pre-filled message
        </p>
      </div>

      <!-- Details / Specs -->
      <div class="lg:col-span-2 bg-[#0a0a0a] border border-gray-700 rounded-2xl p-6 shadow-xl">
        <h3 class="text-lg font-semibold text-white">What we need</h3>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-black/40 border border-gray-800 rounded-xl p-4">
            <div class="text-sm text-gray-400">Title</div>
            <div class="mt-1 text-gray-200">Up to 60 characters</div>
          </div>
          <div class="bg-black/40 border border-gray-800 rounded-xl p-4">
            <div class="text-sm text-gray-400">Description</div>
            <div class="mt-1 text-gray-200">1–2 short sentences about your product</div>
          </div>
          <div class="bg-black/40 border border-gray-800 rounded-xl p-4">
            <div class="text-sm text-gray-400">Link</div>
            <div class="mt-1 text-gray-200">Any URL (https://...)</div>
          </div>
          <div class="bg-black/40 border border-gray-800 rounded-xl p-4">
            <div class="text-sm text-gray-400">Image (optional)</div>
            <div class="mt-1 text-gray-200">Square 256×256 PNG/JPG looks best</div>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-black/40 border border-gray-800 rounded-xl p-4">
            <div class="text-sm text-gray-400">Placement</div>
            <div class="mt-1 text-gray-200">Random row within each page</div>
          </div>
          <div class="bg-black/40 border border-gray-800 rounded-xl p-4">
            <div class="text-sm text-gray-400">Duration</div>
            <div class="mt-1 text-gray-200">Lifetime (one-time payment)</div>
          </div>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href={mailtoHref}
            class="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors w-full sm:w-auto"
          >
            Sponsor for $99
          </a>
          <a
            href="/"
            class="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 transition-colors w-full sm:w-auto"
          >
            Back to Tools
          </a>
        </div>
      </div>
    </div>
  </div>
</div>


