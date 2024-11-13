export const formatGas = (gas: string) => {
  return parseInt(gas).toLocaleString()
}

export const formatTime = (timestamp: string) => {
  return new Date(parseInt(timestamp) * 1000).toLocaleString()
}

export const shortenAddress = (address: string | any[]) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

//   export const formatNumber = (value) => {
//     return new Intl.NumberFormat('en-US').format(value)
//   }
export const formatNumber = (value: string) => {
  return parseInt(value).toLocaleString()
}

export const formatEther = (value: string) => {
  return (parseInt(value) / 1e18).toFixed(2)
}

export const formatGwei = (value: string) => {
  return (parseInt(value) / 1e9).toFixed(2)
}


export const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2
  }).format(amount)
}

export const formatDate = (timestamp: string | number | Date) => {
  return new Date(timestamp).toLocaleString()
}
export const truncateHash = (hash: string) => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

export const json = (param: any): any => {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
  );
};