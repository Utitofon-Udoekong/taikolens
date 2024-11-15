<template>
  <div>
    <!-- Page Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Account History</h1>
        <p class="mt-2 text-sm text-gray-700">
          A detailed list of USDT accounts on the Taiko network.
        </p>
      </div>
      <!-- Filters -->
      <div class="mt-4 sm:mt-0 sm:ml-16 flex justify-between gap-x-4">
        <!-- Pagination Section -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
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

        <!-- Filter account type -->
        <div class="flex space-x-4">
          <select v-model="filterType"
            class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm">
            <option value="all">All accounts</option>
            <option disabled value="mints">Mints Only(coming soon)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table Section -->
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
                    Last Transaction
                  </th>
                </tr>
              </thead>
              <!-- Show Loader if accounts are loading -->
              <Loader class="mx-auto p-4" v-if="loading.accounts" :loading="loading.accounts" />
              <tbody v-else class="divide-y divide-gray-200 bg-white">
                <!-- Render accounts if data exists -->
                <tr v-if="(filteredAccounts?.length || 0) > 0" v-for="(account, index) in filteredAccounts"
                  :key="index">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                    <a :href="`https://taikoscan.io/address/${getArray(account.id)}`" target="_blank"
                      class="text-pink-600 hover:text-pink-900">
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
                    {{ formatDate(account.last_transaction_timestamp) }}
                  </td>
                </tr>
                <!-- Shown if no accounts are available -->
                <p v-else class="text-center p-2 text-gray-500">No data available</p>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script lang="ts" setup>
/**
 * Handles fetching and filtering account data.
 * - `loading`: Tracks loading state for account data.
 * - `accounts`: Full list of accounts retrieved from the API.
 * - `filterType`: Filter criteria for displaying accounts (`all` or `mints`).
 * - `pageSize`: Number of accounts displayed per page.
 * - `filteredAccounts`: Computed list of accounts based on the selected filter.
 */
const { loading, accounts, fetchAccounts } = useTokenData()

const filterType = ref('all')
const pageSize = ref(10)

/**
 * Filters the accounts based on the selected type.
 * - Returns all accounts if `filterType` is `all`.
 * - Filters accounts with `is_minter` if `filterType` is `mints`.
 */
const filteredAccounts = computed(() => {
  if (filterType.value === 'all') return accounts.value
  if (filterType.value === 'mints') return accounts.value.filter(t => t.is_minter)
})

/**
 * Watches for changes in page size and fetches account data accordingly.
 */
watch([pageSize], () => {
  fetchAccounts(pageSize.value)
})

/**
 * Fetches initial account data when the app is ready.
 */
onNuxtReady(async () => {
  await fetchAccounts(pageSize.value)
})
</script>
