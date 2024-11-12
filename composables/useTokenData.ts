import { ref } from 'vue'
import type { TokenMetrics, DailyMetric, Transfer, Minter } from '../types'

export const useTokenData = () => {
  const tokenMetrics = ref<TokenMetrics | null>(null)
  const dailyMetrics = ref<DailyMetric[]>([])
  const recentTransfers = ref<Transfer[]>([])
  const activeMinters = ref<Minter[]>([])
  const loading = ref({
    token: false,
    daily: false,
    transfers: false,
    minters: false
  })

  const fetchTokenMetrics = async () => {
    loading.value.token = true
    try {
      const { data } = await useFetch<TokenMetrics>('/api/token/metrics')
      if (data.value) tokenMetrics.value = data.value
    } catch (error) {
      console.error('Failed to fetch token metrics:', error)
    } finally {
      loading.value.token = false
    }
  }

  const fetchDailyMetrics = async (days = 30) => {
    loading.value.daily = true
    try {
      const { data } = await useFetch<DailyMetric[]>('/api/metrics/daily', {
        query: { days }
      })
      if (data.value) dailyMetrics.value = data.value
    } catch (error) {
      console.error('Failed to fetch daily metrics:', error)
    } finally {
      loading.value.daily = false
    }
  }

  const fetchRecentTransfers = async (limit = 10) => {
    loading.value.transfers = true
    try {
      const { data } = await useFetch<Transfer[]>('/api/transfers/recent', {
        query: { limit }
      })
      if (data.value) recentTransfers.value = data.value
    } catch (error) {
      console.error('Failed to fetch recent transfers:', error)
    } finally {
      loading.value.transfers = false
    }
  }

  const fetchActiveMinters = async () => {
    loading.value.minters = true
    try {
      const { data } = await useFetch<Minter[]>('/api/minters/active')
      if (data.value) activeMinters.value = data.value
    } catch (error) {
      console.error('Failed to fetch active minters:', error)
    } finally {
      loading.value.minters = false
    }
  }

  return {
    tokenMetrics,
    dailyMetrics,
    recentTransfers,
    activeMinters,
    loading,
    fetchTokenMetrics,
    fetchDailyMetrics,
    fetchRecentTransfers,
    fetchActiveMinters
  }
} 