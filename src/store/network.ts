import { getBucket } from '@extend-chrome/storage'
import { ChainConfig, ConfigType } from '@gotabit/wallet-core'

interface NetworkStoreData {
  type: ConfigType
  config: ChainConfig
}

export const NetworkStore = getBucket<NetworkStoreData>('NetworkData', 'local')
