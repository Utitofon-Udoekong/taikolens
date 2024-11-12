<template>
    <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900">Token Overview</h3>
            <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div class="overflow-hidden">
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Supply</dt>
                    <dd class="mt-1 text-3xl font-semibold text-gray-900">
                        {{ formatNumber(metrics?.total_supply) }}
                    </dd>
                </div>
                <div class="overflow-hidden">
                    <dt class="text-sm font-medium text-gray-500 truncate">Holders</dt>
                    <dd class="mt-1 text-3xl font-semibold text-gray-900">
                        {{ formatNumber(metrics?.holder_count) }}
                    </dd>
                </div>
                <div class="overflow-hidden">
                    <dt class="text-sm font-medium text-gray-500 truncate">Transfers</dt>
                    <dd class="mt-1 text-3xl font-semibold text-gray-900">
                        {{ formatNumber(metrics?.transfer_count) }}
                    </dd>
                </div>
            </dl>
        </div>
    </div>
</template>

<script setup>
defineProps({
    metrics: {
        type: Object,
        required: true
    }
})

const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value || 0)
}
</script>