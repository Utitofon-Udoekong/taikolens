<!-- pages/minters.vue -->
<template>
    <div>
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold text-gray-900">Minters Overview</h1>
          <p class="mt-2 text-sm text-gray-700">
            Comprehensive overview of USDT minter activity and management on Taiko network.
          </p>
        </div>
      </div>
  
      <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard 
          title="Total Minters" 
          :value="activeMinters.length"
          icon="Users"
        />
        <MetricCard 
          title="24h Minting Volume" 
          :value="formatCurrency(dailyMetrics[0]?.daily_mint_volume || 0)"
          :change="mintingVolumeChange"
          icon="TrendingUp"
        />
        <MetricCard 
          title="Average Mint Size" 
          :value="formatCurrency(averageMintSize)"
          icon="BarChart"
        />
      </div>
  
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900">Minting Activity (7 Days)</h3>
          <MintingChart :chartData="mintingChartData" class="mt-4" />
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900">Minter Distribution</h3>
          <MinterDistributionChart :chartData="minterDistributionData" class="mt-4" />
        </div>
      </div>
  
      <div class="mt-8">
        <MintersList :minters="activeMinters" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { Users, TrendingUp, BarChart } from 'lucide-vue-next'
  import MetricCard from '~/components/MetricCard.vue'
  import MintingChart from '~/components/MintingChart.vue'
  import MinterDistributionChart from '~/components/MinterDistributionChart.vue'
  import MintersList from '~/components/MintersList.vue'
  
  const { 
    activeMinters, 
    dailyMetrics,
    fetchActiveMinters,
    fetchDailyMetrics 
  } = useUSDTMetrics()
  
  onMounted(async () => {
    await Promise.all([
      fetchActiveMinters(),
      fetchDailyMetrics(7)
    ])
  })
  
  const mintingVolumeChange = computed(() => {
    if (dailyMetrics.value.length < 2) return 0
    const today = dailyMetrics.value[0].daily_mint_volume
    const yesterday = dailyMetrics.value[1].daily_mint_volume
    return ((today - yesterday) / yesterday) * 100
  })
  
  const averageMintSize = computed(() => {
    if (!activeMinters.value.length) return 0
    const totalMinted = activeMinters.value.reduce((sum, minter) => sum + minter.minted_amount, 0)
    const totalMints = activeMinters.value.reduce((sum, minter) => sum + minter.mint_count, 0)
    return totalMints ? totalMinted / totalMints : 0
  })
  
  const mintingChartData = computed(() => ({
    labels: dailyMetrics.value.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [{
      label: 'Daily Minting Volume',
      data: dailyMetrics.value.map(d => d.daily_mint_volume),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true
    }]
  }))
  
  const minterDistributionData = computed(() => ({
    labels: activeMinters.value.map(m => shortenAddress(m.address)),
    datasets: [{
      data: activeMinters.value.map(m => m.minted_amount),
      backgroundColor: [
        '#10B981',
        '#3B82F6',
        '#6366F1',
        '#8B5CF6',
        '#EC4899'
      ]
    }]
  }))
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  </script>