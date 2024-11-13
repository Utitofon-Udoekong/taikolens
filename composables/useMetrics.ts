const loading = useState('transfer_loading',() => false)
const fetchError = useState('metrics_error',() => '')
const tokenMetrics = useState<TokenMetric[]>('tokenMetrics', () => [])
  const dailyMetrics = useState<DailyMetric[]>('dailyMetrics', () => [])
  const hourlyMetrics = useState<HourlyMetric[]>('hourlyMetrics', () => [])

const fetchDailyMetrics = async (days = 30) => {
    loading.value = true
    try {
      const { data } = await useFetch<DailyMetric[]>('/api/metrics/daily', {
        query: { days }
      })
      console.log(data.value)
      if (data.value) dailyMetrics.value = data.value
    } catch (error) {
        fetchError.value = error
      console.error('Failed to fetch daily metrics:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchHourlyMetrics = async (hours = 30) => {
    loading.value = true
    try {
      const { data } = await useFetch<HourlyMetric[]>('/api/metrics/hourly', {
        query: { hours }
      })
      console.log(data.value)
      if (data.value) hourlyMetrics.value = data.value
    } catch (error) {
        fetchError.value = error
      console.error('Failed to fetch hourly metrics:', error)
    } finally {
      loading.value = false
    }
  }

export {
  dailyMetrics, hourlyMetrics, fetchError, loading, fetchDailyMetrics, fetchHourlyMetrics
}