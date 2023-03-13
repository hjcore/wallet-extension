import {
  AccountEncryptStore,
  AccountInfo,
  AccountStore,
  AccountStoreData,
} from 'src/store/account'

import { MessageRequester } from '../message/requester'

import { PrivateActions } from './type'
import { PRIVATE_PORT } from './constants'

export class PrivateMessageRequester implements PrivateActions {
  requester: MessageRequester<keyof PrivateActions>

  constructor() {
    this.requester = new MessageRequester(PRIVATE_PORT)
  }

  setPassword(pwd: string) {
    this.requester.sendMessage({
      type: 'setPassword',
      body: pwd,
    })
  }

  lock() {
    this.requester.sendMessage({
      type: 'setPassword',
    })
  }

  async setAccount(accountData: AccountStoreData) {
    this.requester.sendMessage({
      type: 'setAccount',
      body: accountData,
    })
  }

  unlock(pwd: string) {
    this.requester.sendMessage({
      type: 'unlock',
      body: pwd,
    })
  }
}
