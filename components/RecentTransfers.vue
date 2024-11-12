<template>
    <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900">Recent Transfers</h3>
            <div class="mt-4 flow-root">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">From</th>
                                    <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">To</th>
                                    <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                                    <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="transfer in transfers" :key="transfer.id">
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                                        {{ shortenAddress(transfer.from_address) }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {{ shortenAddress(transfer.to_address) }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
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
    </div>
</template>

<script setup>
defineProps({
    transfers: {
        type: Array,
        required: true
    }
})

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
</script>