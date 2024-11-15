<template>
  <div class="mt-8 space-y-8">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button v-for="tab in tabs" :key="tab.name" @click="handleTabChanged(tab)" :class="[
          currentTab === tab.id
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
          'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
        ]">
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Daily Metrics View -->
    <div v-if="currentTab === 'daily'" class="space-y-8">
      <!-- Existing Daily Charts -->
      <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Daily Volume Trends</h3>
        <LineChart :data="dailyVolumeChartData" :options="dailyVolumeChartOptions" class="h-[300px]" />
      </div>

      <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Daily Transfer Activity</h3>
        <BarChart :data="transferChartData" :options="transferChartOptions" class="h-[300px]" />
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

      <!-- Hourly Volume -->
      <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Hourly Volume</h3>
        <LineChart :data="hourlydailyVolumeChartData" :options="hourlyVolumeOptions" class="h-[300px]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line as LineChart, Bar as BarChart } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

interface Tab {
  id: string;
  name: string;
}
const props = defineProps<{
  dailyMetrics: DailyMetric[]
  hourlyMetrics: HourlyMetric[]
}>()

const emit = defineEmits<{
  tabChanged: [value: string]
}>()

const currentTab = ref('daily')
const tabs: Tab[] = [
  { id: 'daily', name: 'Daily Metrics' },
  { id: 'hourly', name: 'Hourly Metrics' }
]

const sortedDailyMetrics = computed(() => {
  return [...props.dailyMetrics].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// Volume Chart Data
const dailyVolumeChartData = computed(() => ({
  labels: props.dailyMetrics.map(m => new Date(m.date).toLocaleDateString()),
  datasets: [
    {
      label: 'Total Daily Volume',
      data: props.dailyMetrics.map(m => m.volume),
      backgroundColor: '#3b82f64e',
      borderColor: '#3b82f6',
      fill: true,
      tension: 0.1,
    },
    {
      label: 'Mint Volume',
      data: props.dailyMetrics.map(m => m.mint_volume),
      backgroundColor: '#22c55e4e',
      borderColor: '#22c55e',
      fill: true,
      tension: 0.1,
    },
    {
      label: 'Burn Volume',
      data: props.dailyMetrics.map(m => m.burn_volume),
      backgroundColor: '#ef44444e',
      borderColor: '#ef4444',
      fill: true,
      tension: 0.1,
    }
  ]
}))

const dailyVolumeChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (tickValue: number | string) {
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
    },
    // interaction: {
    //   intersect: false,
    // }
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
  maintainAspectRatio: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (tickValue: number | string) {
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

const hourlydailyVolumeChartData = computed(() => ({
  labels: props.hourlyMetrics.map(m => new Date(m.hour + ":00:00").toLocaleTimeString()),
  datasets: [
    {
      label: 'Volume',
      data: props.hourlyMetrics.map(m => m.volume),
      backgroundColor: '#3b82f64e',
      borderColor: '#3b82f6',
      fill: true,
      tension: 0.1,
    },
    {
      label: 'Average Hourly Transfers',
      data: props.hourlyMetrics.map(m => m.average_transfer_value),
      backgroundColor: '#22c55e4e',
      borderColor: '#22c55e',
      fill: true,
      tension: 0.1,
    },
    {
      label: 'Transfer Count',
      data: props.hourlyMetrics.map(m => m.transfer_count),
      backgroundColor: '#ef44444e',
      borderColor: '#ef4444',
      fill: true,
      tension: 0.1,
    },
  ]
}))

// Hourly Chart Options
// const heatmapOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     tooltip: {
//       callbacks: {
//         label: (context: any) => `Transfers: ${formatAmount(context.raw)}`
//       }
//     }
//   }
// }

// const hourlyUsersOptions = {
//   responsive: true,
//   maintainAspectRatio: true,
//   scales: {
//     y: {
//       beginAtZero: true,
//       ticks: {
//         callback: function (tickValue: string | number) {
//           return formatAmount(Number(tickValue))
//         }
//       }
//     }
//   }
// }

const hourlyVolumeOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (tickValue: number | string) {
          return formatCurrency(Number(tickValue))
        }
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (context: any) => {
          switch (context.dataset.label) {
            case 'Volume':
              return `${context.dataset.label}: ${formatCurrency(context.raw)}`
            case 'Average Hourly Transfers':
              return `${context.dataset.label}: ${formatCurrency(context.raw)}`
            case 'Transfer Count':
              return `${context.dataset.label}: ${context.raw}`
            default:
              return `${context.dataset.label}: ${context.raw}`
          }
        }
      }
    }
  }
}

const handleTabChanged = (tab: Tab) => {
  currentTab.value = tab.id
  emit('tabChanged', tab.id)
}
</script>
