<template>
  <div class="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Gas Metrics</h3>
    <LineChart
      :data="gasChartData"
      :options="gasChartOptions"
      class="h-[300px]"
    />
  </div>
</template> 