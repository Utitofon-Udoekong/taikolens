const formatGas = (gas: string) => {
    return parseInt(gas).toLocaleString()
  }
  
  const formatTime = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString()
  }

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
  
//   const formatNumber = (value) => {
//     return new Intl.NumberFormat('en-US').format(value)
//   }
  const formatNumber = (value: string) => {
    return parseInt(value).toLocaleString()
  }
  
  const formatEther = (value: string) => {
    return (parseInt(value) / 1e18).toFixed(2)
  }
  
  const formatGwei = (value: string) => {
    return (parseInt(value) / 1e9).toFixed(2)
  }


const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2
    }).format(amount)
}

const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
}
const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }
  
  