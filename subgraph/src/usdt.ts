import { BigInt, BigDecimal, Bytes, Address, ethereum } from '@graphprotocol/graph-ts'
import {
  MinterAdded as MinterAddedEvent,
  MinterRemoved as MinterRemovedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent,
  usdt as ERC20Contract
} from "../generated/usdt/usdt"
import {
  Token,
  Account,
  Minter,
  Transfer,
  OwnershipTransferred,
  DailyMetric,
  HourlyMetric
} from "../generated/schema"

const USDT_ADDRESS = "0x9c2dc7377717603eB92b2655c5f2E7997a4945BD"
const DECIMALS = 6
const ZERO_BI = BigInt.fromI32(0)
const ZERO_BD = BigDecimal.fromString('0')

function getOrCreateAccount(address: Bytes): Account {
  let account = Account.load(address)
  if (!account) {
    account = new Account(address)
    account.balance = BigDecimal.fromString('0')
    account.lastTransactionTimestamp = BigInt.fromI32(0)
    account.isMinter = false
    account.save()
  }
  return account as Account
}

function getOrCreateToken(address: Bytes): Token {
  let token = Token.load(address)
  if (!token) {
    token = new Token(address)
    let contract = ERC20Contract.bind(Address.fromBytes(address))
    token.symbol = contract.symbol()
    token.name = contract.name()
    token.decimals = DECIMALS
    token.totalSupply = BigDecimal.fromString('0')
    token.transferCount = BigInt.fromI32(0)
    token.holderCount = BigInt.fromI32(0)
    token.lastUpdateTimestamp = BigInt.fromI32(0)
    token.owner = Bytes.empty()
    token.save()
  }
  return token as Token
}

function getDailyMetricId(timestamp: BigInt): string {
  let date = new Date(timestamp.toI64() * 1000)
  return date.toISOString().split('T')[0]
}

function getHourlyMetricId(timestamp: BigInt): string {
  let date = new Date(timestamp.toI64() * 1000)
  return date.toISOString().split(':')[0]
}

function getOrCreateDailyMetric(timestamp: BigInt): DailyMetric {
  let dateStr = getDailyMetricId(timestamp)
  let id = Bytes.fromUTF8(dateStr)
  let metric = DailyMetric.load(id)
  if (!metric) {
    metric = new DailyMetric(id)
    metric.date = dateStr
    metric.transferCount = ZERO_BI
    metric.activeUsers = ZERO_BI
    metric.volume = ZERO_BD
    metric.mintVolume = ZERO_BD
    metric.burnVolume = ZERO_BD
    metric.averageTransferValue = ZERO_BD
    metric.largestTransfer = ZERO_BD
    metric.uniqueMinters = ZERO_BI
  }
  return metric as DailyMetric
}

function getOrCreateHourlyMetric(timestamp: BigInt): HourlyMetric {
  let hourStr = getHourlyMetricId(timestamp)
  let id = Bytes.fromUTF8(hourStr)
  let metric = HourlyMetric.load(id)
  if (!metric) {
    metric = new HourlyMetric(id)
    metric.hour = hourStr
    metric.transferCount = ZERO_BI
    metric.activeUsers = ZERO_BI
    metric.volume = ZERO_BD
    metric.mintVolume = ZERO_BD
    metric.burnVolume = ZERO_BD
    metric.averageTransferValue = ZERO_BD
  }
  return metric as HourlyMetric
}

export function handleMinterAdded(event: MinterAddedEvent): void {
  let minterAddress = event.params.minter
  let minter = new Minter(minterAddress)
  
  minter.address = minterAddress
  minter.token = event.address
  minter.addedAt = event.block.timestamp
  minter.isActive = true
  minter.mintedAmount = BigDecimal.fromString('0')
  minter.mintCount = BigInt.fromI32(0)
  minter.addTransactionHash = event.transaction.hash
  
  let account = getOrCreateAccount(minterAddress)
  account.isMinter = true
  account.lastTransactionTimestamp = event.block.timestamp
  account.save()
  
  minter.save()
}

export function handleMinterRemoved(event: MinterRemovedEvent): void {
  let minter = Minter.load(event.params.minter)
  if (minter) {
    minter.isActive = false
    minter.removedAt = event.block.timestamp
    minter.removeTransactionHash = event.transaction.hash
    minter.save()
    
    let account = getOrCreateAccount(event.params.minter)
    account.isMinter = false
    account.lastTransactionTimestamp = event.block.timestamp
    account.save()
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  let token = getOrCreateToken(event.address)
  token.owner = event.params.newOwner
  token.lastUpdateTimestamp = event.block.timestamp
  token.save()
}

export function handleTransfer(event: TransferEvent): void {
  let token = getOrCreateToken(event.address)
  let fromAccount = getOrCreateAccount(event.params.from)
  let toAccount = getOrCreateAccount(event.params.to)
  
  let transfer = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  let value = event.params.value.toBigDecimal().div(BigDecimal.fromString('1' + '0'.repeat(DECIMALS)))
  
  transfer.from = fromAccount.id
  transfer.to = toAccount.id
  transfer.value = event.params.value
  transfer.blockNumber = event.block.number
  transfer.blockTimestamp = event.block.timestamp
  transfer.transactionHash = event.transaction.hash
  
  transfer.isMint = event.params.from.equals(Bytes.empty())
  transfer.isBurn = event.params.to.equals(Bytes.empty())
  
  if (!transfer.isMint) {
    fromAccount.balance = fromAccount.balance.minus(value)
    fromAccount.lastTransactionTimestamp = event.block.timestamp
    fromAccount.save()
  }
  
  if (!transfer.isBurn) {
    toAccount.balance = toAccount.balance.plus(value)
    toAccount.lastTransactionTimestamp = event.block.timestamp
    toAccount.save()
  }
  
  token.transferCount = token.transferCount.plus(BigInt.fromI32(1))
  token.lastUpdateTimestamp = event.block.timestamp
  token.save()

  transfer.save()

  // Update metrics using the helper functions
  let dailyMetric = getOrCreateDailyMetric(event.block.timestamp)
  let hourlyMetric = getOrCreateHourlyMetric(event.block.timestamp)
  
  // Update metrics
  updateMetricsForTransfer(dailyMetric, hourlyMetric, transfer, value)
}

function updateMetricsForTransfer(
  dailyMetric: DailyMetric, 
  hourlyMetric: HourlyMetric, 
  transfer: Transfer, 
  value: BigDecimal
): void {
  // Daily metrics
  dailyMetric.transferCount = dailyMetric.transferCount.plus(BigInt.fromI32(1))
  dailyMetric.volume = dailyMetric.volume.plus(value)
  dailyMetric.averageTransferValue = dailyMetric.volume.div(dailyMetric.transferCount.toBigDecimal())
  
  if (value.gt(dailyMetric.largestTransfer)) {
    dailyMetric.largestTransfer = value
  }
  
  if (transfer.isMint) {
    dailyMetric.mintVolume = dailyMetric.mintVolume.plus(value)
  }
  if (transfer.isBurn) {
    dailyMetric.burnVolume = dailyMetric.burnVolume.plus(value)
  }
  
  // Hourly metrics
  hourlyMetric.transferCount = hourlyMetric.transferCount.plus(BigInt.fromI32(1))
  hourlyMetric.volume = hourlyMetric.volume.plus(value)
  hourlyMetric.averageTransferValue = hourlyMetric.volume.div(hourlyMetric.transferCount.toBigDecimal())
  
  if (transfer.isMint) {
    hourlyMetric.mintVolume = hourlyMetric.mintVolume.plus(value)
  }
  if (transfer.isBurn) {
    hourlyMetric.burnVolume = hourlyMetric.burnVolume.plus(value)
  }
  
  dailyMetric.save()
  hourlyMetric.save()
}

export function handleBlock(block: ethereum.Block): void {
  let token = Token.load(Address.fromString(USDT_ADDRESS))
  if (!token) return

  let dailyMetric = getOrCreateDailyMetric(block.timestamp)
  let hourlyMetric = getOrCreateHourlyMetric(block.timestamp)

  // Update unique minters count
  let activeMinters = Minter.load(token.id)
  if (activeMinters) {
    dailyMetric.uniqueMinters = BigInt.fromI32(1) // Placeholder, needs proper counting logic
  }

  // Update active users (unique addresses that interacted with the contract)
  let transfers = Transfer.load(block.hash)
  if (transfers) {
    let uniqueAddresses = new Set<string>()
    uniqueAddresses.add(transfers.from.toHexString())
    uniqueAddresses.add(transfers.to.toHexString())
    
    dailyMetric.activeUsers = BigInt.fromI32(uniqueAddresses.size)
    hourlyMetric.activeUsers = BigInt.fromI32(uniqueAddresses.size)
  }

  // Save updated metrics
  dailyMetric.save()
  hourlyMetric.save()

  // Update token stats if needed
  token.lastUpdateTimestamp = block.timestamp
  token.save()
}
