<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900">Latest Blocks</h3>
    <div class="mt-4">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">Error: {{ error.message }}</div>
      <div v-else class="space-y-4">
        <Line
          v-if="chartData"
          :data="chartData"
          :options="chartOptions"
        />
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gas Used</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="block in blocks" :key="block.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ block.number }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ block.transactionCount }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatGas(block.gasUsed) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatTime(block.timestamp) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { Line } from 'vue-chartjs'
import { GetTaikoStats } from '~/graphql/schema'

const { result, loading, error } = useQuery(GetTaikoStats)

const blocks = computed(() => result.value?.blocks || [])

const chartData = computed(() => ({
  labels: blocks.value.map(block => block.number),
  datasets: [{
    label: 'Transactions per Block',
    data: blocks.value.map(block => block.transactionCount),
    borderColor: '#3b82f6',
    tension: 0.1
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}


</script> 