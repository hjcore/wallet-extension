import { getBucket } from '@extend-chrome/storage'

import { WalletStatusEnum } from 'src/constants/status'

import { EncryptBaseStore } from './encryptBase'

export interface AccountInfo {
  name: string
  mnemonic: string
  account: string
  pubKey: string
  privateKey: string
  path?: string
}

export interface AccountStoreData {
  accountList: AccountInfo[]
  currentAccount: AccountInfo
  walletStatus: WalletStatusEnum
}

export const AccountEncryptStore = new EncryptBaseStore<AccountStoreData>(
  'AccountEncryptData'
)

export const AccountStore = getBucket<AccountStoreData>('AccountData', 'local')

export async function setDefaultAccountData() {
  await AccountStore.set({
    currentAccount: {} as any,
    accountList: [],
    walletStatus: WalletStatusEnum.Empty,
  })
}
