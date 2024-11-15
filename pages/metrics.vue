<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
        <p class="mt-2 text-sm text-gray-700">
          Detailed analytics and metrics for USDT activity on Taiko network.
        </p>
      </div>
    </div>

    <!-- Grid Layout for Key Metrics -->
    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 ">
      <!-- Block Metrics Component -->
      <BlockMetrics :loadingRewards="loading.blockRewards" :latest-block-reward="latestBlockReward"
        :usdt-supply="usdtSupply" :loading-supply="loading.usdtSupply" />
      <!-- Price Metrics Component -->
      <PriceMetrics :loading="loading.ethPrice" :eth-price="ethPrice" />
    </div>

    <!-- Pagination and Charts Section -->
    <div class="">
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center">
          <p>Page Size: </p>
          <!-- Page size selector for Daily Metrics -->
          <select v-if="showDailyPage" v-model="dailyPageSize"
            class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm">
            <option value="5">5 results</option>
            <option value="10">10 results</option>
            <option value="20">20 results</option>
            <option value="30">30 results</option>
          </select>
          <!-- Page size selector for Hourly Metrics -->
          <select v-if="showHourlyPage" v-model="hourlyPageSize"
            class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm">
            <option value="5">5 results</option>
            <option value="10">10 results</option>
            <option value="20">20 results</option>
            <option value="30">30 results</option>
          </select>
        </div>
      </div>
      <!-- Metrics Chart Section -->
      <MetricsCharts :daily-metrics="dailyMetrics" :hourly-metrics="hourlyMetrics" @tab-changed="tabChanged" />
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  dailyMetrics,
  hourlyMetrics,
  blockRewards,
  ethPrice,
  usdtSupply,
  loading,
  fetchDailyMetrics,
  fetchHourlyMetrics,
  fetchBlockReward,
  fetchEthPrice,
  fetchUSDTSupply
} = useTokenData()

// Compute the latest block reward from blockRewards array
const latestBlockReward = computed(() =>
  blockRewards.value[blockRewards.value.length - 1] || null
)

// Default page sizes for daily and hourly metrics
const dailyPageSize = ref(10)
const hourlyPageSize = ref(10)

// Boolean values to control which page (Daily or Hourly) is visible
const showDailyPage = ref(true)
const showHourlyPage = ref(false)

// Watchers for updating data when page sizes change
watch([dailyPageSize, hourlyPageSize], () => {
  fetchDailyMetrics(dailyPageSize.value)  // Fetch updated daily metrics
  fetchHourlyMetrics(hourlyPageSize.value)  // Fetch updated hourly metrics
})

// Method to handle tab change between Daily and Hourly views
const tabChanged = (tab: string) => {
  if (tab == 'daily') {
    showDailyPage.value = true  // Show daily metrics
    showHourlyPage.value = false  // Hide hourly metrics
  } else {
    showDailyPage.value = false  // Hide daily metrics
    showHourlyPage.value = true  // Show hourly metrics
  }
}

// Interval to periodically refresh data every 20 seconds
const watchInterval = ref<NodeJS.Timeout>()

// Clear interval when leaving the route
onUnmounted(() => {
  clearInterval(watchInterval.value)
})

// Fetch initial data when the page is ready
onNuxtReady(async () => {
  // Fetch all initial data in parallel
  await Promise.all([
    fetchDailyMetrics(dailyPageSize.value),
    fetchHourlyMetrics(hourlyPageSize.value),
    fetchEthPrice(),
    fetchUSDTSupply(),
    fetchBlockReward(Math.floor(new Date().getTime() / 1000))
  ])

  watchInterval.value = setInterval(async () => {
    await Promise.all([
      fetchDailyMetrics(dailyPageSize.value),
      fetchHourlyMetrics(hourlyPageSize.value),
      fetchEthPrice(),
      fetchUSDTSupply(),
      fetchBlockReward(Math.floor(new Date(dailyMetrics.value[0].date).getTime() / 1000))
    ])
  }, 20000);  // Refresh every 20 seconds
})
</script>
