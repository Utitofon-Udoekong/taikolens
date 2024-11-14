<template>
  <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">ETH Price</h3>
    <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">ETH/USD</dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">
          {{ formatCurrency(Number(ethPrice?.ethusd || 0)) }}
        </dd>
        <p class="mt-2 text-sm text-gray-500">
          Updated: {{ formatDate(Number(ethPrice?.ethusd_timestamp || 0) * 1000) }}
        </p>
      </div>
      <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">ETH/BTC</dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">
          {{ Number(ethPrice?.ethbtc || 0).toFixed(6) }}
        </dd>
        <p class="mt-2 text-sm text-gray-500">
          Updated: {{ formatDate(Number(ethPrice?.ethbtc_timestamp || 0) * 1000) }}
        </p>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate } from '~/utils'

const props = defineProps<{
  ethPrice: {
    ethbtc: string
    ethbtc_timestamp: string
    ethusd: string
    ethusd_timestamp: string
  } | null
}>()
</script> 