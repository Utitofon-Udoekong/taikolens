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
  
      <MetricsCharts :metrics="dailyMetrics" />
  
      <div class="mt-8">
        <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900">Key Statistics</h3>
            <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt class="text-sm font-medium text-gray-500 truncate">Average Daily Volume</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {{ formatCurrency(averageDailyVolume) }}
                </dd>
              </div>
              <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt class="text-sm font-medium text-gray-500 truncate">Average Transfer Size</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {{ formatCurrency(averageTransferSize) }}
                </dd>
              </div>
              <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt class="text-sm font-medium text-gray-500 truncate">Daily Active Users</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {{ formatNumber(averageActiveUsers) }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import MetricsCharts from '~/components/MetricsCharts.vue'
  
  const { dailyMetrics, fetchDailyMetrics } = useUSDTMetrics()
  
  onMounted(() => {
    fetchDailyMetrics(30)
  })
  
  const averageDailyVolume = computed(() => {
    if (!dailyMetrics.value.length) return 0
    const sum = dailyMetrics.value.reduce((acc, curr) => acc + curr.daily_volume, 0)
    return sum / dailyMetrics.value.length
  })
  
  const averageTransferSize = computed(() => {
    if (!dailyMetrics.value.length) return 0
    const totalVolume = dailyMetrics.value.reduce((acc, curr) => acc + curr.daily_volume, 0)
    const totalTransfers = dailyMetrics.value.reduce((acc, curr) => acc + Number(curr.daily_transfer_count), 0)
    return totalTransfers ? totalVolume / totalTransfers : 0
  })
  
  const averageActiveUsers = computed(() => {
    if (!dailyMetrics.value.length) return 0
    const sum = dailyMetrics.value.reduce((acc, curr) => acc + Number(curr.daily_active_users), 0)
    return Math.round(sum / dailyMetrics.value.length)
  })
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value)
  }
  </script>