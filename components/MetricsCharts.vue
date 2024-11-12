<template>
    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900">Daily Volume</h3>
            <Line :data="volumeChartData" :options="chartOptions" class="mt-4" />
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900">Active Users</h3>
            <Line :data="usersChartData" :options="chartOptions" class="mt-4" />
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900">Transfer Count</h3>
            <Bar :data="transfersChartData" :options="chartOptions" class="mt-4" />
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900">Average Transfer Value</h3>
            <Line :data="avgValueChartData" :options="chartOptions" class="mt-4" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line, Bar } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const props = defineProps({
    metrics: {
        type: Array,
        required: true
    }
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: (value) => {
                    return new Intl.NumberFormat('en-US', {
                        notation: 'compact',
                        compactDisplay: 'short'
                    }).format(value)
                }
            }
        }
    }
}

const labels = computed(() => {
    return props.metrics.map(m => new Date(m.date).toLocaleDateString())
})

const volumeChartData = computed(() => ({
    labels: labels.value,
    datasets: [{
        label: 'Daily Volume',
        data: props.metrics.map(m => m.daily_volume),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true
    }]
}))

const usersChartData = computed(() => ({
    labels: labels.value,
    datasets: [{
        label: 'Active Users',
        data: props.metrics.map(m => m.daily_active_users),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true
    }]
}))

const transfersChartData = computed(() => ({
    labels: labels.value,
    datasets: [{
        label: 'Transfer Count',
        data: props.metrics.map(m => m.daily_transfer_count),
        backgroundColor: '#6366F1'
    }]
}))

const avgValueChartData = computed(() => ({
    labels: labels.value,
    datasets: [{
        label: 'Average Transfer Value',
        data: props.metrics.map(m => m.average_transfer_value),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true
    }]
}))
</script>