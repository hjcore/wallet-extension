import { action, makeObservable, observable } from 'mobx'

import { WalletStatusEnum } from 'src/constants/status'
import {
  AccountEncryptStore,
  AccountInfo,
  AccountStore,
  AccountStoreData,
} from 'src/store/account'
import { PrivateMessageRequester } from 'src/services/private'

import { getAccount, AccountArguments } from './helpers/account'

export class AccountManager {
  @observable
  public accountList: AccountInfo[]

  @observable
  public accountInfo: AccountInfo

  @observable
  public accountName: string

  @observable
  public account: string

  @observable
  public walletStatus: WalletStatusEnum

  public requester: PrivateMessageRequester

  constructor(
    accountList: AccountInfo[],
    accountInfo: AccountInfo,
    walletStatus: WalletStatusEnum
  ) {
    makeObservable(this)

    this.accountList = accountList
    this.accountInfo = accountInfo
    this.account = accountInfo.account
    this.accountName = accountInfo.name
    this.walletStatus = walletStatus

    this.requester = new PrivateMessageRequester()
    AccountStore.valueStream.subscribe(
      ({ accountList, currentAccount, walletStatus }) => {
        this.accountInfo = currentAccount
        this.account = currentAccount.account
        this.accountList = accountList
        this.accountName = currentAccount.name
        this.walletStatus = walletStatus
      }
    )
  }

  @action
  public lock() {
    this.requester.lock()
  }

  @action
  public async unlock(password: string) {
    this.requester.unlock(password)
  }

  // add account when you already init your wallet with password
  @action
  async addAccount(accountParams: AccountArguments) {
    const { name } = accountParams

    const { accountList } = await AccountStore.get('accountList')

    if (accountList.find(_ => _.name === name))
      throw new Error('The account name is already exist!')

    const newAccount = await getAccount(accountParams)

    const accountData: AccountStoreData = {
      accountList: [...accountList, newAccount],
      currentAccount: newAccount,
      walletStatus: WalletStatusEnum.Unlocked,
    }

    this.requester.setAccount(accountData)
  }

  @action
  async remove(accountName: string) {
    const { accountList } = await AccountStore.get('accountList')

    const newAccountList = accountList.filter(_ => _.name !== accountName)

    if (newAccountList.length) {
      const accountData: AccountStoreData = {
        accountList: newAccountList,
        currentAccount: newAccountList[0],
        walletStatus: WalletStatusEnum.Unlocked,
      }

      this.requester.setAccount(accountData)
    } else {
      AccountStore.clear()
    }
  }

  @action
  async changeName(oldName: string, newName: string) {
    const { accountList } = await AccountStore.get()

    let newAccount: AccountInfo | undefined

    const newAccountList = accountList.map(_ => {
      if (_.name === oldName) {
        newAccount = { ..._, name: newName }

        return newAccount
      }

      return _
    })

    if (!newAccount) {
      throw new Error('The old name is not found!')
    }

    const accountData: AccountStoreData = {
      accountList: newAccountList,
      currentAccount: newAccount,
      walletStatus: WalletStatusEnum.Unlocked,
    }

    this.requester.setAccount(accountData)
  }
}
