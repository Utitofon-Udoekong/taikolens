
export const useTokenData = () => {
  const accounts = ref<Account[]>([])
  const tokenMetrics = ref<TokenMetric[]>([])
  const dailyMetrics = ref<DailyMetric[]>([])
  const hourlyMetrics = ref<HourlyMetric[]>([])
  const recentTransfers = ref<Transfer[]>([])
  const loading = ref({
    token: false,
    daily: false,
    hourly: false,
    transfers: false,
    accounts: false
  })

  const fetchTokenMetrics = async () => {
    loading.value.token = true
    try {
      const { data } = await useFetch<TokenMetric[]>('/api/token/metrics')
      console.log(data.value)
      if (data.value) tokenMetrics.value == data.value
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
      console.log(data.value)
      if (data.value) dailyMetrics.value = data.value
    } catch (error) {
      console.error('Failed to fetch daily metrics:', error)
    } finally {
      loading.value.daily = false
    }
  }

  const fetchHourlyMetrics = async (hours = 30) => {
    loading.value.hourly = true
    try {
      const { data } = await useFetch<HourlyMetric[]>('/api/metrics/hourly', {
        query: { hours }
      })
      console.log(data.value)
      if (data.value) hourlyMetrics.value = data.value
    } catch (error) {
      console.error('Failed to fetch hourly metrics:', error)
    } finally {
      loading.value.hourly = false
    }
  }

  const fetchRecentTransfers = async (limit = 10) => {
    loading.value.transfers = true
    try {
      const { data } = await useFetch<Transfer[]>('/api/transfers/recent', {
        query: { limit }
      })
      console.log(data.value)
      if (data.value) recentTransfers.value = data.value
    } catch (error) {
      console.error('Failed to fetch recent transfers:', error)
    } finally {
      loading.value.transfers = false
    }
  }

  const fetchAccounts = async (limit = 10) => {
    loading.value.accounts = true
    try {
      const { data } = await useFetch<Account[]>('/api/accounts', {
        query: { limit }
      })
      console.log(data.value)
      if (data.value) accounts.value = data.value
    } catch (error) {
      console.error('Failed to fetch active minters:', error)
    } finally {
      loading.value.accounts = false
    }
  }

  return {
    accounts,
    tokenMetrics,
    dailyMetrics,
    hourlyMetrics,
    recentTransfers,
    loading,
    fetchAccounts,
    fetchTokenMetrics,
    fetchDailyMetrics,
    fetchHourlyMetrics,
    fetchRecentTransfers,
  }
} 