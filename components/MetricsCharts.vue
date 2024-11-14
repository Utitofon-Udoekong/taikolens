<template>
  <div class="mt-8 space-y-8">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="currentTab = tab.id"
          :class="[
            currentTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Daily Metrics View -->
    <div v-if="currentTab === 'daily'">
      <!-- Existing Daily Charts -->
      <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Daily Volume Trends</h3>
        <LineChart
          :data="volumeChartData"
          :options="volumeChartOptions"
          class="h-[300px]"
        />
      </div>

      <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Daily Transfer Activity</h3>
        <BarChart
          :data="transferChartData"
          :options="transferChartOptions"
          class="h-[300px]"
        />
      </div>

      <!-- Existing Daily Metrics Table -->
      <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Daily Metrics</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Volume</th>
                  <th class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Transfers</th>
                  <th class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Avg Transfer</th>
                  <th class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Largest Transfer</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="metric in sortedDailyMetrics" :key="metric.date">
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ new Date(metric.date).toLocaleDateString() }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                    {{ formatCurrency(metric.volume) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                    {{ formatAmount(metric.transfer_count) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                    {{ formatCurrency(metric.average_transfer_value) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                    {{ formatCurrency(metric.largest_transfer) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Hourly Metrics View -->
    <div v-else-if="currentTab === 'hourly'" class="space-y-8">
      <!-- 24h Activity Heatmap -->
      <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">24h Activity Heatmap</h3>
        <HeatMap
          :data="hourlyHeatmapData"
          :options="heatmapOptions"
          class="h-[300px]"
        />
      </div>

      <!-- Hourly Active Users -->
      <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Hourly Active Users</h3>
        <LineChart
          :data="hourlyUsersChartData"
          :options="hourlyUsersOptions"
          class="h-[300px]"
        />
      </div>

      <!-- Hourly Volume -->
      <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Hourly Volume</h3>
        <BarChart
          :data="hourlyVolumeChartData"
          :options="hourlyVolumeOptions"
          class="h-[300px]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Line as LineChart, Bar as BarChart, HeatMap } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import type { DailyMetric, HourlyMetric } from '~/utils'
import { formatCurrency, formatAmount } from '~/utils'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  dailyMetrics: DailyMetric[]
  hourlyMetrics: HourlyMetric[]
}>()

const currentTab = ref('daily')
const tabs = [
  { id: 'daily', name: 'Daily Metrics' },
  { id: 'hourly', name: 'Hourly Metrics' }
]

const sortedDailyMetrics = computed(() => {
  return [...props.dailyMetrics].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// Volume Chart Data
const volumeChartData = computed(() => ({
  labels: props.dailyMetrics.map(m => new Date(m.date).toLocaleDateString()),
  datasets: [
    {
      label: 'Total Volume',
      data: props.dailyMetrics.map(m => m.volume),
      borderColor: '#3b82f6',
      tension: 0.1
    },
    {
      label: 'Mint Volume',
      data: props.dailyMetrics.map(m => m.mint_volume),
      borderColor: '#22c55e',
      tension: 0.1
    },
    {
      label: 'Burn Volume',
      data: props.dailyMetrics.map(m => m.burn_volume),
      borderColor: '#ef4444',
      tension: 0.1
    }
  ]
}))

const volumeChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(tickValue: number | string) {
          return formatCurrency(Number(tickValue))
        }
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return `${context.dataset.label}: ${formatCurrency(context.raw)}`
        }
      }
    }
  }
}

// Transfer Activity Chart
const transferChartData = computed(() => ({
  labels: props.dailyMetrics.map(m => new Date(m.date).toLocaleDateString()),
  datasets: [{
    label: 'Number of Transfers',
    data: props.dailyMetrics.map(m => m.transfer_count),
    backgroundColor: '#3b82f6'
  }]
}))

const transferChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(tickValue: number | string) {
          return formatAmount(Number(tickValue))
        }
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return `Transfers: ${formatAmount(context.raw)}`
        }
      }
    }
  }
}

// Hourly Metrics Computeds
const hourlyHeatmapData = computed(() => {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  return {
    labels: hours,
    datasets: days.map(day => ({
      label: day,
      data: hours.map(hour => {
        const metrics = props.hourlyMetrics.filter(m => {
          const date = new Date(m.hour)
          return date.getDay() === days.indexOf(day) && date.getHours() === hour
        })
        return metrics.reduce((sum, m) => sum + m.transfer_count, 0)
      })
    }))
  }
})

const hourlyUsersChartData = computed(() => ({
  labels: props.hourlyMetrics.map(m => new Date(m.hour).toLocaleTimeString()),
  datasets: [{
    label: 'Active Users',
    data: props.hourlyMetrics.map(m => m.active_users),
    borderColor: '#3b82f6',
    tension: 0.1
  }]
}))

const hourlyVolumeChartData = computed(() => ({
  labels: props.hourlyMetrics.map(m => new Date(m.hour).toLocaleTimeString()),
  datasets: [{
    label: 'Volume',
    data: props.hourlyMetrics.map(m => m.volume),
    backgroundColor: '#3b82f6'
  }]
}))

// Hourly Chart Options
const heatmapOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context: any) => `Transfers: ${formatAmount(context.raw)}`
      }
    }
  }
}

const hourlyUsersOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number) => formatAmount(value)
      }
    }
  }
}

const hourlyVolumeOptions = {
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
</script>