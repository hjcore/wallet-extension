import { LocalWallet } from '@gotabit/wallet-local'
import { toBase64 } from '@cosmjs/encoding'

import {
  AccountStore,
  AccountStoreData,
  AccountEncryptStore,
} from 'src/store/account'

export interface AccountArguments {
  name: string
  path?: string
  from?: 'mnemonic' | 'privateKey'
  key: string
}

export async function getAccount(accountParams: AccountArguments) {
  const { name, path, from, key } = accountParams

  const wallet =
    from === 'mnemonic'
      ? await LocalWallet.init({ mnemonic: key, path })
      : await LocalWallet.init({ privateKey: key, path })

  const [account] = await wallet.getAccounts()
  const privKey = await wallet.getPrivateKey()

  return {
    name,
    account: account.address,
    mnemonic: key,
    privateKey: privKey,
    pubKey: toBase64(account.pubkey),
    path,
  }
}

export async function persistAccountData(
  accountData: AccountStoreData,
  password: string
) {
  await AccountEncryptStore.set(accountData, password)
  await AccountStore.set(accountData)
}
