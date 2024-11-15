
export const useTokenData = () => {
  const runtimeConfig = useRuntimeConfig()
  const accounts = ref<Account[]>([])
  const tokenMetrics = ref<TokenMetric[]>([])
  const dailyMetrics = ref<DailyMetric[]>([])
  const hourlyMetrics = ref<HourlyMetric[]>([])
  const recentTransfers = ref<Transfer[]>([])
  const loading = ref<TokenLoader>({
    token: false,
    daily: false,
    hourly: false,
    transfers: false,
    accounts: false,
    blockRewards: false,
    ethPrice: false,
    usdtSupply: false
  })
  const blockRewards = ref<BlockReward[]>([])
  const ethPrice = ref<EthPrice | null>(null)
  const usdtSupply = ref<string>('')

  /// TODO
  // const fetchTokenMetrics = async () => {
  //   loading.value.token = true
  //   try {
  //     const { data } = await useFetch<TokenMetric[]>('/api/token/metrics')
  //     if (data.value) tokenMetrics.value == data.value
  //   } catch (error) {
  //     console.error('Failed to fetch token metrics:', error)
  //   } finally {
  //     loading.value.token = false
  //   }
  // }

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

  const fetchHourlyMetrics = async (hours = 30) => {
    loading.value.hourly = true
    try {
      const { data } = await useFetch<HourlyMetric[]>('/api/metrics/hourly', {
        query: { hours }
      })
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
      if (data.value) accounts.value = data.value
    } catch (error) {
      console.error('Failed to fetch active minters:', error)
    } finally {
      loading.value.accounts = false
    }
  }

  const fetchTaikoScanData = async (module: string, action: string, params = {}) => {
    try {
      const { data } = await useFetch(`https://api.taikoscan.io/api`, {
        params: {
          module,
          action,
          apikey: runtimeConfig.public.taikoscanApiKey,
          ...params
        },
        headers: {
          'Accept': 'application/json',
        }
      })
      return data.value
    } catch (error) {
      console.error(`Failed to fetch ${module}/${action}:`, error)
      return null
    }
  }

  const fetchBlockNoByTimestamp = async (timestamp: number) => {
    try {
      const data = await fetchTaikoScanData('block', 'getblocknobytime', {
        timestamp: timestamp,
        closest: 'before'
      })
      if(data?.result){
        return data?.result
      }
      return null
    } catch (error) {
      console.error(`Failed to fetch getblocknobytime:`, timestamp)
      return null
    }
  }

  const fetchBlockReward = async (timeStamp: number) => {
    loading.value.blockRewards = true
    try {
      const blockNo = await fetchBlockNoByTimestamp(timeStamp)
      const data = await fetchTaikoScanData('block', 'getblockreward', {
        blockno: blockNo
      })
      if (data?.result) {
        blockRewards.value.push(data.result)
      }
    } finally {
      loading.value.blockRewards = false
    }
  }

  const fetchEthPrice = async () => {
    loading.value.ethPrice = true
    try {
      const data = await fetchTaikoScanData('stats', 'ethprice')
      if (data?.result) {
        ethPrice.value = data.result
      }
    } finally {
      loading.value.ethPrice = false
    }
  }

  const fetchUSDTSupply = async () => {
    loading.value.usdtSupply = true
    try {
      const data = await fetchTaikoScanData('stats', 'tokensupply', {
        contractaddress: runtimeConfig.public.contractAddress
      })
      console.log(data)
      if (data?.result) {
        usdtSupply.value = data.result
      }
    } finally {
      loading.value.usdtSupply = false
    }
  }

  return {
    accounts,
    tokenMetrics,
    dailyMetrics,
    hourlyMetrics,
    recentTransfers,
    loading,
    blockRewards,
    ethPrice,
    usdtSupply,
    fetchAccounts,
    fetchDailyMetrics,
    fetchHourlyMetrics,
    fetchRecentTransfers,
    fetchBlockReward,
    fetchEthPrice,
    fetchUSDTSupply,
  }
} 