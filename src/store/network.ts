import { getBucket } from '@extend-chrome/storage'
import { ChainConfig, ConfigType, getChainConfig } from '@gotabit/wallet-core'

interface NetworkStoreData {
  type: ConfigType
  config: ChainConfig
}

export const NetworkStore = getBucket<NetworkStoreData>('NetworkData', 'local')

export async function setNetwork(type: ConfigType) {
  await NetworkStore.set({
    type,
    config: getChainConfig(type),
  })
}
