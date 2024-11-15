<template>
  <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">ETH Price</h3>
    <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <!-- ETH/USD Price Section -->
      <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">ETH/USD</dt>
        <!-- Show Loader if data is still loading -->
        <Loader v-if="loading" :loading="loading" />
        <div v-else>
          <!-- Display formatted ETH/USD price -->
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ formatCurrency(Number(ethPrice?.ethusd || 0)) }}
          </dd>
          <!-- Display timestamp of the last update -->
          <p class="mt-2 text-sm text-gray-500">
            Updated: {{ formatDate(Number(ethPrice?.ethusd_timestamp || 0) * 1000) }}
          </p>
        </div>
      </div>

      <!-- ETH/BTC Price Section -->
      <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">ETH/BTC</dt>
        <!-- Show Loader if data is still loading -->
        <Loader v-if="loading" :loading="loading" />
        <div v-else>
          <!-- Display formatted ETH/BTC price with 6 decimal places -->
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ Number(ethPrice?.ethbtc || 0).toFixed(6) }}
          </dd>
          <!-- Display timestamp of the last update -->
          <p class="mt-2 text-sm text-gray-500">
            Updated: {{ formatDate(Number(ethPrice?.ethbtc_timestamp || 0) * 1000) }}
          </p>
        </div>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
/**
 * Props for ETH Price component.
 * - `ethPrice`: Object containing ETH price data (`ethusd`, `ethbtc`) and their respective timestamps.
 * - `loading`: Boolean indicating whether the price data is still being loaded.
 */
defineProps<{
  ethPrice: {
    ethbtc: string
    ethbtc_timestamp: string
    ethusd: string
    ethusd_timestamp: string
  } | null,
  loading: boolean
}>()
</script>
