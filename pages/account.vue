<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">account History</h1>
        <p class="mt-2 text-sm text-gray-700">
          A detailed list of all USDT accounts on the Taiko network. {{ accounts.length}}
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <div class="flex space-x-4">
          <!-- v-model="filterType" -->
          <select
            class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
          >
            <option value="all">All accounts</option>
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
                    id
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Balance
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Minter
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Network
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Block Range
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Last Transaction
                  </th>
                </tr>
              </thead>
              <Loader class="mx-auto p-4" v-if="loading.accounts" :loading="loading.accounts" />
              <tbody v-else class="divide-y divide-gray-200 bg-white">
                <tr v-for="(account, index) of filteredAccounts" :key="index">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                    <a
                      :href="`https://explorer.test.taiko.xyz/tx/${getArray(account.id)}`"
                      target="_blank"
                      class="text-pink-600 hover:text-pink-900"
                    >
                      {{ truncateHash(getArray(account.id)) }}
                    </a>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-black">
                    {{ formatAmount(account.balance) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-black">
                    {{ account.is_minter }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-black">
                    <p class="text-pink-600 bg-pink-600/20 inline p-1 rounded-md">{{ account.gs_chain }}</p>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-black">
                    {{ account.block_range }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-black">
                    {{ formatDate(account.last_transaction_timestamp) }}
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
          class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- ///TODO -->
        <!-- <button
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
        </button> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const {loading,accounts, fetchAccounts} = useTokenData()


const filterType = ref('all')
const pageSize = ref(10)

const filteredAccounts = computed(() => {
  if (filterType.value === 'all') return accounts.value
  if (filterType.value === 'minters') return accounts.value.filter(t => t.is_minter)
})

watch([pageSize], () => {
  fetchAccounts(pageSize.value)
})
onMounted(async () => {
  await fetchAccounts(pageSize.value)
})
</script>

<style>

</style>