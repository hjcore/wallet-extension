import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { LocalWallet } from '@gotabit/wallet-local'
import { GotabitClient } from '@gotabit/client'
import { useNavigate } from 'react-router-dom'

import { NetworkStore } from 'src/store/network'
import {
  getAccountStore,
  AccountStoreData,
  AccountInfo,
} from 'src/store/account'

interface IAccountContext extends AccountStoreData {
  refreshBalances: () => void
  client?: GotabitClient
  importAccount: (mnemonic: string) => void
}

const AccountContext = createContext<IAccountContext | undefined>(undefined)

const AccountStore = await getAccountStore()
const accountDataPersist = await AccountStore.get()
const networkDataPersist = await NetworkStore.get()

export function AccountProvider({ children }: ChildrenProps) {
  const navigate = useNavigate()
  const [accountData, setAccountData] =
    useState<AccountStoreData>(accountDataPersist)

  // const [wallet, setWallet] = useState<LocalWallet>()
  const [client, setClient] = useState<GotabitClient>()

  const queryBalance = useCallback(
    async (client: GotabitClient) => {
      const stargateClient = await client.stargateClient()
      const wasmClient = await client.wasmClient()

      const balance = await stargateClient.getBalance(
        accountData.account,
        networkDataPersist.config.coinMinimalDenom
      )

      const tokensBalances: Array<TokenWrapper<Cw20Token>> = []

      for (let i = 0; i < accountData.tokens.length; i++) {
        const token = accountData.tokens[i] as Cw20Token
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
    },
    [accountData.account, accountData.tokens]
  )

  const initWallet = useCallback(
    async (mnemonic?: string) => {
      const _mnemonic = mnemonic ?? accountData.mnemonic
      const wallet = await LocalWallet.init({
        mnemonic: _mnemonic,
      })

      const accounts = await wallet.getAccounts()
      const account = accountData.account || accounts[0].address
      const client = await GotabitClient.init(wallet, networkDataPersist.type)
      const { gtbBalance, tokensBalances } = await queryBalance(client)
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
    [accountData.account, accountData.mnemonic, queryBalance]
  )

  const refreshBalances = useCallback(async () => {
    if (!client) return
    const { gtbBalance, tokensBalances } = await queryBalance(client)

    setAccountData({
      ...accountData,
      gtbBalance: gtbBalance.amount,
      tokens: tokensBalances,
    })
  }, [accountData, client, queryBalance])

  const importAccount = useCallback(
    async (mnemonic: string) => {
      await AccountStore.set({
        mnemonic,
      })
      await initWallet(mnemonic)
    },
    [initWallet]
  )

  useEffect(() => {
    if (accountDataPersist && accountDataPersist.mnemonic) {
      if (client) return
      initWallet()
    } else {
      navigate('/register')
    }
  }, [client, initWallet, navigate])

  return (
    <AccountContext.Provider
      value={{
        ...accountData,
        client,
        refreshBalances,
        importAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export function useAccountContext() {
  return useContext(AccountContext)
}
