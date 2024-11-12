<template>
    <div>
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold text-gray-900">Transfer History</h1>
          <p class="mt-2 text-sm text-gray-700">
            A detailed list of all USDT transfers on the Taiko network.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div class="flex space-x-4">
            <select
              v-model="filterType"
              class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
            >
              <option value="all">All Transfers</option>
              <option value="mints">Mints Only</option>
              <option value="burns">Burns Only</option>
            </select>
          </div>
        </div>
      </div>
  
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Transaction
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
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="transfer in filteredTransfers" :key="transfer.id">
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                      <a
                        :href="`https://explorer.test.taiko.xyz/tx/${transfer.transaction_hash}`"
                        target="_blank"
                        class="text-green-600 hover:text-green-900"
                      >
                        {{ shortenHash(transfer.transaction_hash) }}
                      </a>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ shortenAddress(transfer.from_address) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ shortenAddress(transfer.to_address) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ formatAmount(transfer.value) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ formatDate(transfer.timestamp) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center">
          <select
            v-model="pageSize"
            class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="prevPage"
            :disabled="page === 1"
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            :class="page === 1 ? 'opacity-50 cursor-not-allowed' : ''"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="!hasMorePages"
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            :class="!hasMorePages ? 'opacity-50 cursor-not-allowed' : ''"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const { transfers, fetchTransfers } = useUSDTMetrics()
  const filterType = ref('all')
  const page = ref(1)
  const pageSize = ref(25)
  
  const filteredTransfers = computed(() => {
    if (filterType.value === 'all') return transfers.value
    if (filterType.value === 'mints') return transfers.value.filter(t => t.is_mint)
    if (filterType.value === 'burns') return transfers.value.filter(t => t.is_burn)
  })
  
  const hasMorePages = computed(() => {
    return transfers.value.length === pageSize.value
  })
  
  watch([page, pageSize, filterType], () => {
    fetchTransfers(pageSize.value, (page.value - 1) * pageSize.value)
  })
  
  const shortenHash = (hash) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }
  
  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2
    }).format(amount)
  }
  
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }
  
  onMounted(() => {
    fetchTransfers(pageSize.value, 0)
  })
  </script>