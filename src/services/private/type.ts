import {
  AccountEncryptStore,
  AccountInfo,
  AccountStore,
  AccountStoreData,
} from 'src/store/account'

export interface PrivateActions {
  setPassword: (pwd: string) => void

  lock: () => void

  unlock: (pwd: string) => void

  setAccount: (accountData: AccountStoreData) => Promise<void>
}
