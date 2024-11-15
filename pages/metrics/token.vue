<template>
    <div class="space-y-8">
        <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900">Token Overview</h3>
                <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div class="overflow-hidden">
                        <dt class="text-sm font-medium text-gray-500 truncate">Total Supply</dt>
                        <Loader v-if="loading.tokenSupply" :loading="loading.tokenSupply" />
                        <dd v-else class="mt-1 text-3xl font-semibold text-gray-900">
                            {{ formatNumber(tokenSupply, true) }} {{ tokenMetrics?.symbol }}
                        </dd>
                    </div>
                    <div class="overflow-hidden">
                        <dt class="text-sm font-medium text-gray-500 truncate">Address</dt>
                        <dd class="mt-1 text-3xl font-semibold text-gray-900">
                            <NuxtLink :external="true" target="_blank" class="hover:text-pink-500"
                                :href="`https://taikoscan.io/token/${runtimeConfig.public.contractAddress}`">{{
                                    truncateHash(runtimeConfig.public.contractAddress) }}</NuxtLink>
                        </dd>
                    </div>
                    <div class="overflow-hidden">
                        <dt class="text-sm font-medium text-gray-500 truncate">Transfers</dt>
                        <Loader v-if="loading.token" :loading="loading.token" />
                        <dd v-else class="mt-1 text-3xl font-semibold text-gray-900">
                            {{ tokenMetrics?.transfer_count }}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>


        <!-- Page Header -->
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-2xl font-semibold text-gray-900">{{ tokenMetrics?.symbol }} Account Metrics</h1>
                <p class="mt-2 text-sm text-gray-700">
                    A detailed list of {{ tokenMetrics?.symbol }} accounts on the Taiko network.
                </p>
            </div>
            <!-- Filters -->
            <div class="mt-4 sm:mt-0 sm:ml-16 flex justify-between gap-x-4">
                <select v-model="pageSize"
                    class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm">
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                </select>
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
                                    <th scope="col"
                                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                        Address
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
                                <tr v-if="accounts.length > 0" v-for="(account, index) in accounts" :key="index">
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                                        <NuxtLink :href="`https://taikoscan.io/address/${getArray(account.id)}`"
                                            :external="true" target="_blank" class="text-pink-600 hover:text-pink-900">
                                            {{ truncateHash(getArray(account.id)) }}
                                        </NuxtLink>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-black">
                                        {{ formatAmount(account.balance) }} USDT
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-black">
                                        {{ account.is_minter }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-black">
                                        <p class="text-pink-600 bg-pink-600/20 inline p-1 rounded-md">{{
                                            account.gs_chain }}</p>
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

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

const {
    tokenMetrics,
    tokenSupply,
    loading,
    accounts,
    fetchAccounts,
    fetchTokenMetrics,
    fetchTokenSupply
} = useTokenData()

const pageSize = ref(10)


/**
 * Watches for changes in page size and fetches account data accordingly.
 */
watch([pageSize], () => {
    fetchAccounts(pageSize.value)
})

/**
 * Fetches initial data when the app is ready.
 */

onNuxtReady(async () => {
    await Promise.all([
        fetchAccounts(pageSize.value),
        fetchTokenMetrics(),
        fetchTokenSupply()
    ])
})
</script>
