import { LocalWallet } from '@gotabit/wallet-local'

export async function generateMnemonic(length: 12 | 24 = 12) {
  const wallet = await LocalWallet.init({ walletGenerateLength: length })
  const mnemonic = wallet.getMnemonic()

  return mnemonic
}
