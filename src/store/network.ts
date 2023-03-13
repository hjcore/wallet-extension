import { getBucket } from '@extend-chrome/storage'
import {
  ChainConfig,
  GotaBitConfig,
  getChainConfig,
} from '@gotabit/wallet-core'

import { DEFAULT_NETWORK_LIST, DEFAULT_NETWORK } from 'src/constants/network'

interface NetworkStoreData {
  chainName: string
  config: ChainConfig
  networkList: GotaBitConfig[]
}

export const NetworkStore = getBucket<NetworkStoreData>('NetworkData', 'local')

export function setDefaultNetworkData() {
  NetworkStore.set({
    chainName: DEFAULT_NETWORK.chainName,
    config: getChainConfig(DEFAULT_NETWORK),
    networkList: DEFAULT_NETWORK_LIST,
  })
}
