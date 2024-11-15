<template>
  <!-- Wrapper for the block metrics panel -->
  <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
    <!-- Title of the metrics panel -->
    <h3 class="text-lg font-medium text-gray-900 mb-4">Block Metrics</h3>
    
    <!-- Grid layout for displaying metrics -->
    <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <!-- Latest Block Reward Metric -->
      <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
        <!-- Metric label -->
        <dt class="text-sm font-medium text-gray-500 truncate">Latest Block Reward</dt>
        <!-- Loader shown while data is loading -->
        <Loader v-if="loadingRewards" :loading="loadingRewards" />
        <div v-else>
          <!-- Display the latest block reward formatted as Ether with currency label -->
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ formatEther(latestBlockReward?.blockReward || '0') }} USDT
          </dd>
          <!-- Display the block number -->
          <p class="mt-2 text-sm text-gray-500">
            Block #{{ latestBlockReward?.blockNumber || '0' }}
          </p>
        </div>
      </div>

      <!-- Total USDT Supply Metric -->
      <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
        <!-- Metric label -->
        <dt class="text-sm font-medium text-gray-500 truncate">Total USDT Supply</dt>
        <!-- Loader shown while data is loading -->
        <Loader v-if="loadingSupply" :loading="loadingSupply" />
        <!-- Display the total USDT supply, abbreviated if large -->
        <dd v-else class="mt-1 text-3xl font-semibold text-gray-900">
          {{ formatNumber(tokenSupply || '0', true) }} USDT
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">

/**
 * Props:
 * - `latestBlockReward`: Contains the latest block's number and reward (or null if unavailable).
 * - `tokenSupply`: Total USDT supply as a string.
 * - `loadingRewards`: Indicates whether the block reward data is loading.
 * - `loadingSupply`: Indicates whether the USDT supply data is loading.
 */
defineProps<{
  latestBlockReward: { blockNumber: string; blockReward: string } | null,
  tokenSupply: string,
  loadingRewards: boolean,
  loadingSupply: boolean
}>()
</script>
