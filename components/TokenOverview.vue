<template>
    <div class="bg-white shadow rounded-lg">
        {{  tokenMetrics }}
        <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900">Token Overview</h3>
            <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div class="overflow-hidden">
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Supply</dt>
                    <Loader v-if="loading" :loading="loading" />
                    <dd v-else class="mt-1 text-3xl font-semibold text-gray-900">
                        ts{{ tokenMetrics.total_supply }}
                    </dd>
                </div>
                <div class="overflow-hidden">
                    <dt class="text-sm font-medium text-gray-500 truncate">Holders</dt>
                    <Loader v-if="loading" :loading="loading" />
                    <dd v-else class="mt-1 text-3xl font-semibold text-gray-900">
                       h {{ tokenMetrics.holder_count }}
                    </dd>
                </div>
                <div class="overflow-hidden">
                    <dt class="text-sm font-medium text-gray-500 truncate">Transfers</dt>
                    <Loader v-if="loading" :loading="loading" />
                    <dd v-else class="mt-1 text-3xl font-semibold text-gray-900">
                      tr  {{ tokenMetrics.transfer_count }}
                    </dd>
                </div>
            </dl>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    tokenMetrics: TokenMetric,
    loading: boolean
}>()

</script>