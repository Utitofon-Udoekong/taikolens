<template>
  <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Block Metrics</h3>
    <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">Latest Block Reward</dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">
          {{ formatEther(latestBlockReward?.blockReward || '0') }} ETH
        </dd>
        <p class="mt-2 text-sm text-gray-500">
          Block #{{ latestBlockReward?.blockNumber || '0' }}
        </p>
      </div>
      <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">Total ETH Supply</dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">
          {{ formatNumber(ethSupply || '0') }} ETH
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { formatEther, formatNumber } from '~/utils'

const props = defineProps<{
  latestBlockReward: { blockNumber: string; blockReward: string } | null
  ethSupply: string
}>()
</script> 