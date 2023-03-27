import { action, makeObservable, observable } from 'mobx'
import { GotabitClient } from '@gotabit/client'

import { NetworkStore } from 'src/store/network'
import { AccountStore } from 'src/store/account'

export class WalletManager {
  @observable
  public account: string

  @observable
  public nativeBalance?: string

  @observable
  tokens: TokenWrapper<Cw20Token>[]

  constructor(account: string, tokens: TokenWrapper<Cw20Token>[]) {
    makeObservable(this)
    this.account = account
    this.tokens = tokens

    this.queryNativeBalance()
    this.queryTokenBalance()
    AccountStore.valueStream.subscribe(({ currentAccount }) => {
      this.account = currentAccount.account
    })
  }

  public async queryNativeBalance() {
    if (!this.account) return
    const network = await NetworkStore.get()
    const client = await GotabitClient.init(null, network.config)
    const stargateClient = await client.stargateClient()

    const balance = await stargateClient.getBalance(
      this.account,
      network.config.coinMinimalDenom
    )

    this.nativeBalance = balance.amount

    return balance
  }

  public async queryTokenBalance() {
    if (!this.tokens) return
    const network = await NetworkStore.get()
    const client = await GotabitClient.init(null, network.config)
    const wasmClient = await client.wasmClient()

    const tokensBalances: Array<TokenWrapper<Cw20Token>> = []

    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i] as Cw20Token
      const tokenBalance = await wasmClient
        .queryContractSmart(token.token, {
          balance: {
            address: token.token,
          },
        })
        .catch(console.error)

      tokensBalances.push({
        ...token,
        tokenType: 'cw20',
        balance: tokenBalance?.balance ?? '',
      })
    }

    this.tokens = tokensBalances

    return tokensBalances
  }
}
