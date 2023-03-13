import {
  AccountEncryptStore,
  AccountInfo,
  AccountStore,
  AccountStoreData,
} from 'src/store/account'
import { WalletStatusEnum } from 'src/constants/status'
import { PrivateActions } from 'src/services/private'

// 1d, unit seconds
// const CACHE_DURATION = 24 * 60 * 60

function getNowSeconds() {
  return Math.floor(Date.now() / 1000)
}

export class PrivateStore {
  // the lastUnlockTime is 0 when the wallet is not initialed with any account
  public lastUnlockTime = 0

  public password?: string

  // can only call setPassword func when init the first wallet
  async setPassword(pwd: string) {
    if (this.lastUnlockTime !== 0) return
    this.password = pwd
    this.lastUnlockTime = getNowSeconds()
  }

  getPassword() {
    return this.password
  }

  lock() {
    this.setPassword('')
    AccountStore.set({
      accountList: [],
      currentAccount: undefined,
      walletStatus: WalletStatusEnum.Locked,
    })
  }

  isLocked() {
    return this.password === ''
  }

  async unlock(pwd: string) {
    const store = await AccountEncryptStore.get(pwd)

    if (store.currentAccount.mnemonic) {
      this.password = pwd

      AccountStore.set({
        ...store,
        walletStatus: WalletStatusEnum.Unlocked,
      })
    }
  }

  async setAccount(accountData: AccountStoreData) {
    if (!this.password) {
      throw new Error('Please unlock the wallet first')
    }
    await AccountEncryptStore.set(accountData, this.password)
    await AccountStore.set(accountData)
  }
}

const privateStore = new PrivateStore()

export const handlers: PrivateActions = {
  setPassword(pwd: string) {
    privateStore.setPassword(pwd)
  },
  setAccount: async (accountData: AccountStoreData) => {
    privateStore.setAccount(accountData)
  },
  lock: () => privateStore.lock(),

  unlock: (pwd: string) => privateStore.unlock(pwd),
}
