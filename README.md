# TAIKOLENS. A view into USDT related metrics on the taiko network

A comprehensive analytics dashboard for monitoring USDT activity on the Taiko network. This project provides real-time insights into token transfers, volume metrics, and network activity.

## Features

- **Real-time Metrics**
  - 24h Volume and Transfer Count
  - Active Users Analytics
  - ETH Price Integration
  - Historical Volume Trends

- **Detailed Analytics**
  - Daily and Hourly Metrics
  - Transfer History
  - Account Activity
  - Block Rewards
  - Network Statistics

- **Interactive Visualizations**
  - Volume Trend Charts
  - Transfer Activity Graphs
  - Price Movement Tracking
  - User Activity Heatmaps

## Technology Stack

- **Frontend**: Vue.js with Nuxt 3
- **Styling**: TailwindCSS
- **Charts**: Chart.js with Vue-ChartJS
- **Data**: Integration with TaikoScan API, Goldsky’s Subgraphs and Goldsky mirrors
- **State Management**: Vue 3 Reactivity api
- **Database**: Prisma with NeonDB Pooling

## Addressing the Bounty Challenge

This project leverages Goldsky’s powerful real-time indexing and analytics tools to create a dynamic, data-driven application that enhances the monitoring of the Taiko network. 

### Real-Time Data Analytics with Subgraphs
- The dashboard utilizes Goldsky’s Subgraphs to track and analyze specific on-chain events, such as transaction volumes and user activity metrics. This allows for the creation of a live performance dashboard that visualizes key protocol data, providing users with immediate insights into network dynamics.

### Data Streaming with Mirror
- Additionally, the application is designed to integrate with Goldsky’s Mirror for streaming and processing Taiko network data in real time. This capability enables DeFi platforms on Taiko to dynamically adjust their strategies based on incoming market data streams, ensuring optimal performance and decision-making.

## Project Structure

```
app.vue
[components]
    ├── BlockMetrics.vue
    ├── Loader.vue
    ├── MetricsCharts.vue
    ├── PriceMetrics.vue
    ├── TokenMetricCard.vue
    ├── TokenOverview.vue
    └── [icons]
        ├── barChart.vue
        ├── dollar.vue
        ├── github.vue
        ├── telegram.vue
        ├── transfer.vue
        └── users.vue
[composables]
    └── useTokenData.ts
[docs]
    ├── .project_structure_ignore
    └── project_structure.txt
[layouts]
    └── default.vue
[lib]
    └── prisma.ts
nuxt.config.ts
package.json
[pages]
    ├── account.vue
    ├── index.vue
    ├── metrics.vue
    └── transfers.vue
[prisma]
    ├── [migrations]
        └── [0_init]
            └── migration.sql
    └── schema.prisma
[public]
    ├── favicon.ico
    ├── logo.png
    └── robots.txt
[server]
    ├── [api]
        ├── [accounts]
            └── index.ts
        ├── [metrics]
            ├── daily.get.ts
            └── hourly.get.ts
        ├── [token]
            └── metrics.ts
        └── [transfers]
            └── recent.ts
    └── [utils]
        └── index.ts
[subgraph]
    ├── [abis]
        └── usdt.json
    ├── [build]
        ├── schema.graphql
        ├── subgraph.yaml
        └── [usdt]
            ├── usdt.json
            └── usdt.wasm
    ├── docker-compose.yml
    ├── [generated]
        ├── schema.ts
        └── [usdt]
            └── usdt.ts
    ├── networks.json
    ├── package.json
    ├── schema.graphql
    ├── [src]
        └── usdt.ts
    ├── subgraph.yaml
    ├── [tests]
        ├── usdt-utils.ts
        └── usdt.test.ts
[utils]
    └── index.ts
```

## Installation

To get started with the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Utiiofon-Udoekong/taikolens.git
   ```

2. Navigate to the project directory:

   ```bash
   cd taikolens
   ```

3. Install the dependencies:

   ```bash
   pnpm install
   ```

## Usage

To run the development server, use the following command:

```bash
pnpm run dev
```

This will start the application, and you can access it at `http://localhost:3000`.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please fork the repository and submit a pull request. 

1. Fork the project
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## Acknowledgments

- Thanks to the Taiko community for their support and resources.
- Special thanks to Goldsky for their powerful tools that made this project possible.
