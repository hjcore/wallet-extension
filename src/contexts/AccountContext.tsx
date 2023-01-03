import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { LocalWallet } from '@gotabit/wallet-local'
import { GotabitClient } from '@gotabit/client'
import browser from 'webextension-polyfill'

import { NetworkStore } from 'src/store/network'
import {
  getAccountStore,
  AccountStoreData,
  AccountInfo,
} from 'src/store/account'

interface IAccountContext extends AccountStoreData {
  refreshBalances: () => void
  client?: GotabitClient
}

const defaultAccountContext: IAccountContext = {
  privateKey: '',
  mnemonic: '',
  tokens: [],
  gtbBalance: '',
  account: '',
  accountList: [],
  refreshBalances: () => void 0,
}

const AccountContext = createContext<IAccountContext>(defaultAccountContext)

const AccountStore = await getAccountStore()
const accountDataPersist = await AccountStore.get()
const networkDataPersist = await NetworkStore.get()

console.log('---accountDataPersist', accountDataPersist)

async function queryBalance({
  client,
  account,
  tokens,
}: {
  client: GotabitClient
  account: string
  tokens: TokenWrapper<Token>[]
}) {
  const stargateClient = await client.stargateClient()
  const wasmClient = await client.wasmClient()

  const balance = await stargateClient.getBalance(
    account,
    networkDataPersist.config.coinMinimalDenom
  )

  const tokensBalances: Array<TokenWrapper<Cw20Token>> = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i] as Cw20Token
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

  return {
    gtbBalance: balance,
    tokensBalances,
  }
}

export function AccountProvider({ children }: ChildrenProps) {
  const [accountData, setAccountData] = useState<AccountStoreData>({
    ...defaultAccountContext,
    ...accountDataPersist,
  })

  // const [wallet, setWallet] = useState<LocalWallet>()
  const [client, setClient] = useState<GotabitClient>()

  const initWallet = useCallback(
    async (mnemonic?: string) => {
      const _mnemonic = mnemonic ?? accountData.mnemonic
      const wallet = await LocalWallet.init({
        mnemonic: _mnemonic,
      })

      const accounts = await wallet.getAccounts()
      const account = accountData.account || accounts[0].address

      console.log('---accounts', accounts)
      const client = await GotabitClient.init(wallet, networkDataPersist.type)
      const { gtbBalance, tokensBalances } = await queryBalance({
        client,
        account,
        tokens: accountData.tokens,
      })
      const privateKey = await wallet.getPrivateKey()
      const accountList = accounts.filter(_ => {
        return {
          account: _.address,
          privateKey,
          tokens: [],
        }
      }) as unknown as AccountInfo[]

      setAccountData({
        accountList,
        gtbBalance: gtbBalance.amount,
        tokens: tokensBalances,
        mnemonic: _mnemonic,
        privateKey,
        account,
      })
      setClient(client)

      // setWallet(wallet)
    },
    [accountData.account, accountData.mnemonic, accountData.tokens]
  )

  const refreshBalances = useCallback(async () => {
    if (!client) return
    const { gtbBalance, tokensBalances } = await queryBalance({
      client,
      account: accountData.account,
      tokens: accountData.tokens,
    })

    setAccountData({
      ...accountData,
      gtbBalance: gtbBalance.amount,
      tokens: tokensBalances,
    })
  }, [accountData, client])

  useEffect(() => {
    if (accountDataPersist && accountDataPersist.mnemonic) {
      if (client) return
      initWallet()
    } else {
      browser.tabs.create({
        url: '/index.html#/register',
      })
    }
  }, [client, initWallet])

  console.log('=====accountData', accountData, networkDataPersist)

  return (
    <AccountContext.Provider
      value={{
        ...accountData,
        client,
        refreshBalances,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export function useAccountContext() {
  return useContext(AccountContext)
}
