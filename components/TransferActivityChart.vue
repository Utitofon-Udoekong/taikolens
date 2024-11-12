<template>
    <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900">Transfer Activity</h3>
        <div class="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="dailyTransferCount" stroke="#10B981" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
</template>

<script setup>
import {
    ResponsiveContainer,
    LineChart,
    Line,
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