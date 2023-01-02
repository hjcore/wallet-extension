import { getBucket } from '@extend-chrome/storage'

import { NetworkStore } from './network'

export interface AccountInfo {
  account: string
  tokens: Array<TokenWrapper>
  privateKey: string
}

export interface AccountStoreData extends AccountInfo {
  accountList: AccountInfo[]
  gtbBalance: string
  tokens: Array<TokenWrapper>
  mnemonic: string
}

export const MainAccountStore = getBucket<AccountStoreData>(
  'AccountData_main',
  'local'
)

export const TestAccountStore = getBucket<AccountStoreData>(
  'AccountData_test',
  'local'
)

export const DevAccountStore = getBucket<AccountStoreData>(
  'AccountData_dev',
  'local'
)

export const LocalAccountStore = getBucket<AccountStoreData>(
  'AccountData_local',
  'local'
)

export async function getAccountStore() {
  const networkStore = await NetworkStore.get('type')

  switch (networkStore.type) {
    case 'local':
      return LocalAccountStore
    case 'dev':
      return DevAccountStore
    case 'test':
      return TestAccountStore
    case 'main':
      return MainAccountStore
    default:
      return MainAccountStore
  }
}
