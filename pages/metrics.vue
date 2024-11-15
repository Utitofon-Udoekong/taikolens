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

    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 ">
      <BlockMetrics :loadingRewards="loading.blockRewards" :latest-block-reward="latestBlockReward"
        :usdt-supply="usdtSupply" :loading-supply="loading.usdtSupply" />
      <PriceMetrics :loading="loading.ethPrice" :eth-price="ethPrice" />
    </div>

    <div class="">
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center">
          <p>Page Size: </p>
          <select v-if="showDailyPage" v-model="dailyPageSize"
            class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm">
            <option value="5">5 results</option>
            <option value="10">10 results</option>
            <option value="20">20 results</option>
            <option value="30">30 results</option>
          </select>
          <select v-if="showHourlyPage" v-model="hourlyPageSize"
            class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm">
            <option value="5">5 results</option>
            <option value="10">10 results</option>
            <option value="20">20 results</option>
            <option value="30">30 results</option>
          </select>
        </div>
      </div>
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

const latestBlockReward = computed(() =>
  blockRewards.value[blockRewards.value.length - 1] || null
)

const dailyPageSize = ref(10)
const hourlyPageSize = ref(10)

const showDailyPage = ref(true)
const showHourlyPage = ref(false)

watch([dailyPageSize, hourlyPageSize], () => {
  fetchDailyMetrics(dailyPageSize.value)
  fetchHourlyMetrics(hourlyPageSize.value)
})

const tabChanged = (tab: string) => {
  if (tab == 'daily') {
    showDailyPage.value = true
    showHourlyPage.value = false
  } else {
    showDailyPage.value = false
    showHourlyPage.value = true
  }
}

const watchInterval = ref<NodeJS.Timeout>()

onBeforeRouteLeave(() => clearInterval(watchInterval.value))

onNuxtReady(async () => {
  await Promise.all([
      fetchDailyMetrics(dailyPageSize.value),
      fetchHourlyMetrics(hourlyPageSize.value),
      fetchEthPrice(),
      fetchUSDTSupply(),
      fetchBlockReward(Math.floor(new Date(dailyMetrics.value[0].date).getTime() / 1000))
    ])

  watchInterval.value = setInterval(async () => {
    await Promise.all([
      fetchDailyMetrics(dailyPageSize.value),
      fetchHourlyMetrics(hourlyPageSize.value),
      fetchEthPrice(),
      fetchUSDTSupply(),
      fetchBlockReward(Math.floor(new Date(dailyMetrics.value[0].date).getTime() / 1000))
    ])
  }, 20000);
})
</script>