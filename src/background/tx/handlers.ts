import { createMsgSend } from '@gotabit/messages'
import { LocalWallet } from '@gotabit/wallet-local'
import { GotabitClient } from '@gotabit/client'

import { AccountStore } from 'src/store/account'
import { NetworkStore } from 'src/store/network'
import { formatAmount } from 'src/utils/format'
import { TxActions } from 'src/services/tx'

import { BrowserNotification } from '../notification'

export class TxClient {
  public client: GotabitClient

  public wallet: LocalWallet

  constructor(client: GotabitClient, wallet: LocalWallet) {
    this.client = client
    this.wallet = wallet
  }

  static async init() {
    const { config } = await NetworkStore.get()

    const { currentAccount } = await AccountStore.get()

    const { mnemonic } = currentAccount

    const wallet = await LocalWallet.init({
      mnemonic,
    })

    // TODO: update config
    const client = await GotabitClient.init(wallet, 'dev')

    return { client, wallet }
  }
}

export const handlers: TxActions = {
  sendNativeToken: async ({
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
    memo?: string
  }) => {
    const tx = await TxClient.init()
    const msgSendToken = createMsgSend(from, to, amount, 'ugtb')

    const signStargateClient = await tx.client.signStargateClient()

    BrowserNotification.tx('pending')
    console.log('---------', {
      from,
      to,
      amount,
      fee,
      memo,
    })
    const result = await signStargateClient
      .signAndBroadcast(from, [msgSendToken], fee, memo)
      .catch((e: Error) => {
        BrowserNotification.tx('error', e.message)
        console.log('----error', e)
      })

    result?.transactionHash && BrowserNotification.tx('success')
  },

  sendToken: async ({
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
    memo?: string
  }) => {
    const tx = await TxClient.init()
    const signWasmClient = await tx.client.signWasmClient()

    BrowserNotification.tx('pending')
    const result = await signWasmClient
      .execute(
        from,
        token.token,
        {
          transfer: {
            recipient: to,
            amount: formatAmount(amount, token.decimals),
          },
        },
        fee,
        memo
      )
      .catch((e: Error) => {
        BrowserNotification.tx('error', e.message)
      })

    result?.transactionHash && BrowserNotification.tx('success')
  },
}
