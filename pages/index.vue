<template>
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">USDT Dashboard Overview</h1>
  
      <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- These metrics are all available in our schema -->
        <TokenMetricCard 
          title="Total Supply" 
          :value="formatNumber(tokenMetrics?.total_supply || 0)"
          icon="CurrencyDollar" 
        />
        <TokenMetricCard 
          title="Transfer Count" 
          :value="formatNumber(tokenMetrics?.transfer_count || 0)" 
          icon="ArrowsUpDown" 
        />
        <TokenMetricCard 
          title="Holders" 
          :value="formatNumber(tokenMetrics?.holder_count || 0)" 
          icon="Users" 
        />
        <TokenMetricCard 
          title="Active Minters" 
          :value="activeMinters.length" 
          icon="Key" 
        />
      </div>
  
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- These charts use data available in daily_metrics -->
        <VolumeChart :dailyMetrics="dailyMetrics" />
        <TransferActivityChart :dailyMetrics="dailyMetrics" />
      </div>
  
      <div class="mt-8">
        <RecentTransfers :transfers="recentTransfers" />
      </div>
    </div>
  </template> 
  
  <script setup lang="ts">
  import { useTokenData } from '~/composables/useTokenData'
  import type { TokenMetrics, Transfer } from '~/types'
  
  const {
    tokenMetrics,
    dailyMetrics,
    recentTransfers,
    activeMinters,
    loading,
    fetchTokenMetrics,
    fetchDailyMetrics,
    fetchRecentTransfers,
    fetchActiveMinters
  } = useTokenData()
  
  // Format utilities
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(num)
  }
  
  // Fetch data on mount
  onMounted(async () => {
    await Promise.all([
      fetchTokenMetrics(),
      fetchDailyMetrics(),
      fetchRecentTransfers(),
      fetchActiveMinters()
    ])
  })
  </script> 