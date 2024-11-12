<template>
    <div>
        <h1 class="text-2xl font-semibold text-gray-900">USDT Dashboard Overview</h1>

        <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <TokenMetricCard title="Total Supply" :value="formatNumber(tokenMetrics?.total_supply || 0)"
                icon="CurrencyDollar" />
            <TokenMetricCard title="24h Volume" :value="formatNumber(totalVolume24h)" :change="volumeGrowth"
                icon="ArrowsUpDown" />
            <TokenMetricCard title="Holders" :value="formatNumber(tokenMetrics?.holder_count || 0)" icon="Users" />
            <TokenMetricCard title="Active Minters" :value="activeMinters.length" icon="Key" />
        </div>

        <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <VolumeChart :dailyMetrics="dailyMetrics" />
            <TransferActivityChart :dailyMetrics="dailyMetrics" />
        </div>

        <div class="mt-8">
            <RecentTransfers :transfers="recentTransfers" />
        </div>
    </div>
</template>

<script setup>
import { CurrencyDollar, ArrowsUpDown, Users, Key } from 'lucide-react'
const {
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
} = useUSDTMetrics()

onMounted(async () => {
    await Promise.all([
        fetchTokenMetrics(),
        fetchDailyMetrics(),
        fetchRecentTransfers(5),
        fetchActiveMinters()
    ])
})

const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        notation: 'compact',
        compactDisplay: 'short'
    }).format(num)
}
</script>