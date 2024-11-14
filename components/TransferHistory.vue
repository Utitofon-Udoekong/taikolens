<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium text-gray-900">Recent Transfers</h3>
    </div>
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">From</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">To</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="transfer in transfers" :key="transfer.block_number">
                <td class="px-3 py-4 text-sm text-gray-500">{{ shortenAddress(transfer.from) }}</td>
                <td class="px-3 py-4 text-sm text-gray-500">{{ shortenAddress(transfer.to) }}</td>
                <td class="px-3 py-4 text-sm text-gray-500">{{ formatNumber(transfer.value) }}</td>
                <td class="px-3 py-4 text-sm text-gray-500">{{ formatDate(transfer.block_timestamp) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  transfers: Transfer[]
}>()

const shortenAddress = (address: string | any[]) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (timestamp: string | number | Date) => {
  return new Date(timestamp).toLocaleString()
}
</script>