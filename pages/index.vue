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
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CurrencyDollarIcon class="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">24h Volume</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatCurrency(last24hVolume) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ArrowsRightLeftIcon class="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">24h Transfers</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatAmount(last24hTransfers) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UsersIcon class="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatAmount(activeUsers) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ChartBarIcon class="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">ETH Price</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
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
        <LineChart
          :data="volumeChartData"
          :options="chartOptions"
          class="h-[300px]"
        />
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Transfers</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Hash</th>
                <th class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Amount</th>
                <th class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Time</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="transfer in recentTransfers.slice(0, 5)" :key="getArray(transfer.id)">
                <td class="whitespace-nowrap px-3 py-4 text-sm">
                  <a
                    :href="`https://explorer.test.taiko.xyz/tx/${getArray(transfer.transaction_hash)}`"
                    target="_blank"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    {{ truncateHash(getArray(transfer.transaction_hash)) }}
                  </a>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-right">
                  {{ formatCurrency(transfer.value) }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-right">
                  {{ formatDate(transfer.block_timestamp) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 text-right">
          <NuxtLink
            to="/transfers"
            class="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all transfers →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { CurrencyDollarIcon, ArrowsRightLeftIcon, UsersIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import { Line as LineChart } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const {
  recentTransfers,
  dailyMetrics,
  ethPrice,
  fetchRecentTransfers,
  fetchDailyMetrics,
  fetchEthPrice,
} = useTokenData()

// Computed metrics
const last24hVolume = computed(() => {
  if (!dailyMetrics.value.length) return 0
  return dailyMetrics.value[0].volume
})

const last24hTransfers = computed(() => {
  if (!dailyMetrics.value.length) return 0
  return dailyMetrics.value[0].transfer_count
})

const activeUsers = computed(() => {
  if (!dailyMetrics.value.length) return 0
  return Math.round(dailyMetrics.value.reduce((acc, curr) => acc + curr.transfer_count, 0) / dailyMetrics.value.length)
})

// Chart data
const volumeChartData = computed(() => ({
  labels: dailyMetrics.value.map(m => new Date(m.date).toLocaleDateString()),
  datasets: [{
    label: 'Volume',
    data: dailyMetrics.value.map(m => m.volume),
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f64d',
    fill: true,
    tension: 0.4
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number) => formatCurrency(value)
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

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    fetchRecentTransfers(5),
    fetchDailyMetrics(7),
    fetchEthPrice()
  ])
})
</script>