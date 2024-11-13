  const recentTransfers = useState<Transfer[]>('transfers',() => [])
  const loading = useState('transfer_loading',() => false)

  const fetchRecentTransfers = async (limit = 10) => {
    loading.value = true
    try {
      const { data } = await useFetch<Transfer[]>('/api/transfers/recent', {
        query: { limit }
      })
      console.log(data.value)
      if (data.value) recentTransfers.value = data.value
    } catch (error) {
      console.error('Failed to fetch recent transfers:', error)
    } finally {
      loading.value = false
    }
  }

  export {
    recentTransfers, loading, fetchRecentTransfers
  }