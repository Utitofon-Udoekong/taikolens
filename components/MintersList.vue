<template>
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg font-medium text-gray-900">Active Minters</h3>
      </div>
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Address</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Minted</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Mint Count</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="minter in minters" :key="minter.id">
                <td class="px-3 py-4 text-sm text-gray-500">{{ shortenAddress(minter.address) }}</td>
                <td class="px-3 py-4 text-sm text-gray-500">{{ formatCurrency(minter.minted_amount) }}</td>
                <td class="px-3 py-4 text-sm text-gray-500">{{ formatNumber(minter.mint_count) }}</td>
                <td class="px-3 py-4 text-sm">
                  <span :class="[
                    minter.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
                    'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                  ]">
                    {{ minter.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  minters: {
    type: Array,
    required: true
  }
})

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}
</script>