```vue
<template>
  <div class="mt-8 space-y-8">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <!-- Loop through available tabs and set appropriate styles based on the selected tab -->
        <button 
          v-for="tab in tabs" 
          :key="tab.name" 
          @click="handleTabChanged(tab)" 
          :class="[
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
      <!-- Daily Volume Trends Chart -->
      <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Daily Volume Trends</h3>
        <LineChart :data="dailyVolumeChartData" :options="dailyVolumeChartOptions" class="h-[300px]" />
      </div>

      <!-- Daily Transfer Activity Chart -->
      <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Daily Transfer Activity</h3>
        <BarChart :data="transferChartData" :options="transferChartOptions" class="h-[300px]" />
      </div>

      <!-- Recent Daily Metrics Table -->
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
                <!-- Loop through and display sorted daily metrics -->
                <tr 
                  v-if="sortedDailyMetrics.length > 0" 
                  v-for="metric in sortedDailyMetrics" 
                  :key="getArray(metric.id)">
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
                <!-- Fallback message if no data is available -->
                <p v-else class="text-center p-2 text-gray-500">No data available</p>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Hourly Metrics View -->
    <div v-else-if="currentTab === 'hourly'" class="space-y-8">
      <!-- Hourly Volume Chart -->
      <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Hourly Volume</h3>
        <LineChart :data="hourlyVolumeChartData" :options="hourlyVolumeOptions" class="h-[300px]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Imports and Chart.js registration:
 * - Register required Chart.js components for rendering charts.
 */
import { Line as LineChart, Bar as BarChart } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

/**
 * Interface for defining the tab structure.
 */
interface Tab {
  id: string;
  name: string;
}

/**
 * Props:
 * - `dailyMetrics`: List of daily metrics data.
 * - `hourlyMetrics`: List of hourly metrics data.
 */
const props = defineProps<{
  dailyMetrics: DailyMetric[],
  hourlyMetrics: HourlyMetric[]
}>()

/**
 * Emits:
 * - `tabChanged`: Event triggered when the active tab changes.
 */
const emit = defineEmits<{
  tabChanged: [value: string]
}>()

/**
 * State:
 * - `currentTab`: Tracks the currently active tab.
 * - `tabs`: Array defining available tabs and their properties.
 */
const currentTab = ref('daily')
const tabs: Tab[] = [
  { id: 'daily', name: 'Daily Metrics' },
  { id: 'hourly', name: 'Hourly Metrics' }
]

/**
 * Computed property to sort daily metrics by date in descending order.
 */
const sortedDailyMetrics = computed(() => {
  return [...props.dailyMetrics].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

/**
 * Daily Volume Chart Data:
 * - Generates datasets and labels for the daily volume trends chart.
 */
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

/**
 * Daily Volume Chart Options:
 * - Configures responsiveness, scales, and tooltips for the daily volume chart.
 */
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
    }
  }
}

/**
 * Transfer Activity Chart Data and Options:
 * - Data and configuration for the daily transfer activity bar chart.
 */
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

/**
 * Hourly Volume Chart Data and Options:
 * - Data and configuration for the hourly volume chart.
 */
 const hourlyVolumeChartData = computed(() => ({
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
  ]
}))

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
          return `${context.dataset.label}: ${formatCurrency(context.raw)}`
        }
      }
    }
  }
}

/**
 * Event Handler:
 * - `handleTabChanged`: Changes the current active tab and emits the tabChanged event.
 */
function handleTabChanged(tab: Tab) {
  currentTab.value = tab.id
  emit('tabChanged', tab.id)
}
</script>

```