export interface TxActions {
  sendNativeToken: ({
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
  }) => Promise<any>

  sendToken: ({
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
  }) => Promise<any>
}
