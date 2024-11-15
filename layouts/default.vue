<template>
    <div class="min-h-screen bg-gray-50 relative">
        <nav class="bg-white shadow-md fixed inset-x-0 top-0">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <div class="flex-shrink-0 flex items-center">
                            <img class="h-8 w-auto" src="/logo.png" alt="USDT Analytics" />
                        </div>
                        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <NuxtLink v-for="item in navigation" :key="item.path" :to="item.path"
                                class="inline-flex items-center px-1 pt-1 border-b-2" :class="[
                                    $route.path === item.path
                                        ? 'border-pink-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                ]">
                                {{ item.name }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div class="py-6 mt-14">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const navigation = [
    { name: 'Overview', path: '/' },
    { name: 'Accounts', path: '/account' },
    { name: 'Transfers', path: '/transfers' },
    { name: 'Metrics', path: '/metrics' }
]
</script>

<style>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900;
}
</style> 