import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'

import { WalletStatusEnum } from 'src/constants/status'
import { AccountManager } from 'src/modules/account'
import { AccountStore } from 'src/store/account'

const { currentAccount, accountList, walletStatus } = await AccountStore.get()

export function useAccount() {
  const [accountManager] = useState(
    new AccountManager(accountList, currentAccount ?? {}, walletStatus)
  )

  return accountManager
}
