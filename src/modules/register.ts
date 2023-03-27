import { action, makeObservable, observable } from 'mobx'
import { useState } from 'react'
import { DEFAULT_HD_PATH } from '@gotabit/wallet-core'

import { AccountStore, AccountStoreData } from 'src/store/account'
import { WalletStatusEnum } from 'src/constants/status'
import { PrivateMessageRequester } from 'src/services/private'

import { getAccount, persistAccountData } from './helpers/account'

export type RegisterStep =
  | 'register'
  | 'import'
  | 'create'
  | 'validate'
  | 'ledger'
  | 'google'

export class RegisterManager {
  @observable
  public step: RegisterStep = 'register'

  @observable
  public name?: string

  @observable
  public path: string = DEFAULT_HD_PATH

  @observable
  public from: 'mnemonic' | 'privateKey' = 'mnemonic'

  @observable
  public key?: string

  @observable
  public password?: string

  @observable
  public isValid = false

  @observable
  public isNeedPassword = false

  public requester: PrivateMessageRequester

  constructor() {
    makeObservable(this)
    AccountStore.get().then(data => {
      if (data.walletStatus === WalletStatusEnum.Empty) {
        this.setIsNeedPassword(true)
      }
    })
    this.requester = new PrivateMessageRequester()
  }

  @action
  setIsNeedPassword(val: boolean) {
    this.isNeedPassword = val
  }

  @action
  setStep(step: RegisterStep) {
    this.step = step
  }

  @action
  setName(name: string) {
    this.name = name
  }

  @action
  setPath(path: string) {
    this.path = path
  }

  @action
  setPassword(pwd: string) {
    this.password = pwd
  }

  @action
  setIsValid(val: boolean) {
    this.isValid = val
  }

  @action
  setKey(key: string) {
    this.key = key
  }

  @action
  async submitKey() {
    if (!this.name || !this.step || !this.key) return

    const { accountList = [] } = await AccountStore.get('accountList')

    console.log('----accountList', accountList)
    if (accountList.find(_ => _.name === this.name))
      throw new Error('The account name is already exist!')

    const newAccount = await getAccount({
      name: this.name,
      path: this.path,
      from: this.from,
      key: this.key,
    })
    const accountData: AccountStoreData = {
      accountList: [...accountList, newAccount],
      currentAccount: newAccount,
      walletStatus: WalletStatusEnum.Unlocked,
    }

    this.password && this.requester.setPassword(this.password)

    this.requester.setAccount(accountData)

    return new Promise(resolve => {
      AccountStore.valueStream.subscribe(values => {
        console.log('========changed', values)
        if (
          values.walletStatus === WalletStatusEnum.Unlocked &&
          values.currentAccount
        ) {
          values.currentAccount.account && resolve(values)
        }
      })
    })
  }
}

export function useRegister() {
  const [registerConfig] = useState(() => new RegisterManager())

  return registerConfig
}
