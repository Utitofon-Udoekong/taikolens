<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Transfer History</h1>
        <p class="mt-2 text-sm text-gray-700">
          A detailed list of all USDT transfers on the Taiko network.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 flex justify-between gap-x-4">
        <div class="flex space-x-4">
          <!-- Transfer filter selector for Mint, Burn, and All transfers -->
          <select v-model="filterType"
            class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm">
            <option value="all">All Transfers</option>
            <option disabled value="mints">Mints Only(coming soon)</option>
            <option disabled value="burns">Burns Only(coming soon)</option>
          </select>
        </div>
        <!-- Pagination and page size selector -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <!-- Page size selector for how many transfers to display per page -->
            <select v-model="pageSize"
              class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm">
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <!-- Pagination Buttons Placeholder -->
            <!-- TODO: Implement pagination -->
          </div>
        </div>
      </div>
    </div>

    <!-- Transfer history table layout -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <!-- Table headers for transaction data -->
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Transaction
                  </th>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Block
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    From
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    To
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Time
                  </th>
                </tr>
              </thead>
              <!-- Loader displayed if data is still loading -->
              <div class="flex justify-center p-4 w-full" v-if="loading.transfers">
                <Loader :loading="loading.transfers" />
              </div>
              <tbody v-else class="divide-y divide-gray-200 bg-white">
                <!-- Display transfer data when available -->
                <tr v-if="(filteredTransfers?.length || 0) > 0" v-for="transfer, index in filteredTransfers"
                  :key="index">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                    <a :href="`https://taikoscan.io/tx/${getArray(transfer.transaction_hash)}`" target="_blank"
                      class="text-pink-600 hover:text-pink-900">
                      {{ truncateHash(getArray(transfer.transaction_hash)) }}
                    </a>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <a :href="`https://taikoscan.io/block/${transfer.block_number}`" target="_blank"
                      class="text-pink-600 hover:text-pink-900">
                      {{ transfer.block_number }}
                    </a>
                    <!-- {{ transfer.block_number }} -->
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ truncateHash(getArray(transfer.from)) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ truncateHash(getArray(transfer.to)) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatCurrency(transfer.value) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatDate(transfer.block_timestamp) }}
                  </td>
                </tr>
                <!-- Display a message when no transfers are available -->
                <p v-else class="text-center p-2 text-gray-500">No data available</p>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
const { recentTransfers, loading, fetchRecentTransfers } = useTokenData()
const filterType = ref('all')
const pageSize = ref(10)

// Computed property to filter transfers based on selected filter (all, mints, or burns)
const filteredTransfers = computed(() => {
  if (filterType.value === 'all') return recentTransfers.value
  if (filterType.value === 'mints') return recentTransfers.value.filter(t => t.is_mint)
  if (filterType.value === 'burns') return recentTransfers.value.filter(t => t.is_burn)
})

// Watch for changes in pageSize and fetch new data accordingly
watch([pageSize], () => {
  fetchRecentTransfers(pageSize.value)
})

// Interval to periodically refresh transfer data every 20 seconds
const watchInterval = ref<NodeJS.Timeout>()

// Clear interval when leaving the route
onUnmounted(() => {
  clearInterval(watchInterval.value)
})

// Fetch initial transfer data when the page is ready
onNuxtReady(async () => {
  await fetchRecentTransfers(pageSize.value)

  watchInterval.value = setInterval(async () => {
    await fetchRecentTransfers(pageSize.value)
  }, 20000);
})
</script>
