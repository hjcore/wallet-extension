import { MessageRequester } from '../message/requester'

import { TxActions } from './type'
import { TX_PORT } from './constants'

export class TxMessageRequester implements TxActions {
  requester: MessageRequester<keyof TxActions>

  constructor() {
    this.requester = new MessageRequester(TX_PORT)
  }

  public async sendNativeToken({
    from,
    to,
    amount,
    fee,
    memo,
  }: {
    from: string
    to: string
    amount: string
    fee: number | 'auto'
    memo?: string | undefined
  }) {
    this.requester.sendMessage({
      type: 'sendNativeToken',
      body: { from, to, amount, fee, memo },
    })
  }

  public async sendToken({
    from,
    to,
    amount,
    fee,
    memo,
    token,
  }: {
    from: string
    to: string
    amount: string
    token: Cw20Token
    fee: number
    memo?: string | undefined
  }) {
    this.requester.sendMessage({
      type: 'sendToken',
      body: { from, to, amount, fee, memo, token },
    })
  }
}
