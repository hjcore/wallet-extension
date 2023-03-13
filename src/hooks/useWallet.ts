import { useState } from 'react'

import { WalletManager } from 'src/modules/wallet'
import { AccountStore } from 'src/store/account'
import { NetworkStore } from 'src/store/network'
import { TokenStore } from 'src/store/token'

const { currentAccount } = await AccountStore.get()
const { tokensMap } = await TokenStore.get()
const { chainName } = await NetworkStore.get()

export function useWallet() {
  const [walletManager] = useState(
    new WalletManager(
      currentAccount ? currentAccount.account : '',
      tokensMap[chainName] ?? []
    )
  )

  return walletManager
}
