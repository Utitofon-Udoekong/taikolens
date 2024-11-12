import { ref, computed } from 'vue'
import { useSupabaseClient } from '@nuxtjs/supabase'

export const useUSDTMetrics = () => {
  const supabase = useSupabaseClient()
  const tokenMetrics = ref(null)
  const dailyMetrics = ref([])
  const recentTransfers = ref([])
  const activeMinters = ref([])

  const fetchTokenMetrics = async () => {
    const { data, error } = await supabase
      .from('token_metrics')
      .select('*')
      .single()
    
    if (error) throw error
    tokenMetrics.value = data
  }

  const fetchDailyMetrics = async (days = 7) => {
    const { data, error } = await supabase
      .from('daily_metrics')
      .select('*')
      .order('date', { ascending: false })
      .limit(days)
    
    if (error) throw error
    dailyMetrics.value = data
  }

  const fetchRecentTransfers = async (limit = 50) => {
    const { data, error } = await supabase
      .from('transfers')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    recentTransfers.value = data
  }

  const fetchActiveMinters = async () => {
    const { data, error } = await supabase
      .from('minters')
      .select('*')
      .eq('is_active', true)
      .order('minted_amount', { ascending: false })
    
    if (error) throw error
    activeMinters.value = data
  }

  const totalVolume24h = computed(() => {
    if (!dailyMetrics.value.length) return 0
    return dailyMetrics.value[0].daily_volume
  })

  const volumeGrowth = computed(() => {
    if (dailyMetrics.value.length < 2) return 0
    const today = dailyMetrics.value[0].daily_volume
    const yesterday = dailyMetrics.value[1].daily_volume
    return ((today - yesterday) / yesterday) * 100
  })

  return {
    tokenMetrics,
    dailyMetrics,
    recentTransfers,
    activeMinters,
    totalVolume24h,
    volumeGrowth,
    fetchTokenMetrics,
    fetchDailyMetrics,
    fetchRecentTransfers,
    fetchActiveMinters
  }
}