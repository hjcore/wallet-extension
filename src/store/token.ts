import { getBucket } from '@extend-chrome/storage'
import { ConfigType } from '@gotabit/wallet-core'

Array<TokenWrapper & { chain: ConfigType }>

interface TokenStoreData {
  /** the key is network name **/
  tokensMap: { [key in string]: TokenWrapper<Cw20Token>[] }
}

export const TokenStore = getBucket<TokenStoreData>('TokenData', 'local')

export async function setDefaultTokenData() {
  await TokenStore.set({
    tokensMap: {},
  })
}
