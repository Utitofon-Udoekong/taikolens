<template>
    <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900">Trading Volume</h3>
        <div class="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="dailyVolume" fill="#10B981" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
</template>

<script setup>
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts'

defineProps({
    dailyMetrics: {
        type: Array,
        required: true
    }
})
</script>