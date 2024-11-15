<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">USDT Analytics Dashboard</h1>
        <p class="mt-2 text-sm text-gray-700">
          Real-time analytics and insights for USDT activity on the Taiko network
        </p>
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <!-- Data on daily volume -->
    <div class="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
      <!-- <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <IconsDollar class="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">24h Volume</dt>
                <dd class="flex items-baseline">
                  <Loader v-if="loading.daily" :loading="loading.daily" />
                  <div v-else class="text-2xl font-semibold text-gray-900">
                    {{ formatCurrency(last24hVolume) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Data on daily transfers -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <IconsTransfer class="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">24h Transfers</dt>
                <dd class="flex items-baseline">
                  <!-- Loader while fetching data -->
                  <Loader v-if="loading.daily" :loading="loading.daily" />
                  <!-- Display 24h Transfers or Loader -->
                  <div v-else class="text-2xl font-semibold text-gray-900">
                    {{ formatAmount(last24hTransfers) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Data on active users -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <IconsUsers class="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                <dd class="flex items-baseline">
                  <!-- Loader while fetching data -->
                  <Loader v-if="loading.daily" :loading="loading.daily" />
                  <!-- Display Active Users or Loader -->
                  <div v-else class="text-2xl font-semibold text-gray-900">
                    {{ formatAmount(activeUsers) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- ETH Price data -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <IconsBarChart class="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">ETH Price</dt>
                <dd class="flex items-baseline">
                  <!-- Loader while fetching data -->
                  <Loader v-if="loading.ethPrice" :loading="loading.ethPrice" />
                  <!-- Display ETH Price or Loader -->
                  <div v-else class="text-2xl font-semibold text-gray-900">
                    {{ formatCurrency(Number(ethPrice?.ethusd || 0)) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Overview Charts -->
    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Volume Trend</h3>
        <!-- Loader while fetching data -->
        <Loader v-if="loading.daily" :loading="loading.daily" />
        <!-- LineChart component for volume data -->
        <LineChart v-else :data="volumeChartData" :options="chartOptions" class="h-[300px]" />
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Transfers</h3>
        <div class="overflow-x-auto">
          <!-- Loader while fetching data -->
          <Loader v-if="loading.transfers" :loading="loading.transfers" />
          <!-- Table displaying recent transfer data -->
          <table v-else class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Hash</th>
                <th class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Amount</th>
                <th class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Time</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- Display recent transfers if available -->
              <tr v-if="recentTransfers.length > 0" v-for="transfer in recentTransfers.slice(0, 5)" :key="getArray(transfer.id)">
                <td class="whitespace-nowrap px-3 py-4 text-sm">
                  <NuxtLink :href="`https://taikoscan.io/tx/${getArray(transfer.transaction_hash)}`" :external="true" target="_blank"
                    class="text-pink-600 hover:text-pink-900">
                    {{ truncateHash(getArray(transfer.transaction_hash)) }}
                  </NuxtLink>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-right">
                  {{ formatCurrency(transfer.value) }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-right">
                  {{ formatDate(transfer.block_timestamp) }}
                </td>
              </tr>
              <!-- Message if no transfers are available -->
              <p v-else class="text-center p-2 text-gray-500">No data available</p>
            </tbody>
          </table>
        </div>
        <div class="mt-4 text-right">
          <NuxtLink to="/transfers" class="text-sm font-medium text-pink-600 hover:text-pink-500">
            View all transfers →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line as LineChart } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

// Register necessary Chart.js components for the line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const {
  recentTransfers,
  dailyMetrics,
  ethPrice,
  loading,
  fetchRecentTransfers,
  fetchDailyMetrics,
  fetchEthPrice,
} = useTokenData()

// Computed metrics
// Get 24-hour transfer count from dailyMetrics
const last24hTransfers = computed(() => {
  if (!dailyMetrics.value.length) return 0
  return dailyMetrics.value[0].transfer_count
})

// Get average active users from dailyMetrics
const activeUsers = computed(() => {
  if (!dailyMetrics.value.length) return 0
  return Math.round(dailyMetrics.value.reduce((acc, curr) => acc + curr.transfer_count, 0) / dailyMetrics.value.length)
})

// Chart data configuration
const volumeChartData = computed(() => ({
  labels: dailyMetrics.value.map(m => new Date(m.date).toLocaleTimeString()),  
  datasets: [{
    label: 'Volume',
    data: dailyMetrics.value.map(m => m.volume),
    borderColor: '#ec4899',  
    backgroundColor: '#ec48994d', 
    fill: true,  
    tension: 0.4,  
  }]
}))

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (tickValue: string | number) => formatCurrency(Number(tickValue))
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (context: any) => `Volume: ${formatCurrency(context.raw)}`
      }
    }
  }
}

const watchInterval = ref<NodeJS.Timeout>()

onUnmounted(() => {
  clearInterval(watchInterval.value)
})

onNuxtReady(async() => {
  await Promise.all([
    fetchRecentTransfers(5),
    fetchDailyMetrics(7),
    fetchEthPrice()
  ])
  watchInterval.value = setInterval(async () => {
    await Promise.all([
      fetchRecentTransfers(5),
      fetchDailyMetrics(7),
      fetchEthPrice()
    ])
  }, 30000);
})

</script>
