import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Input from '@mui/material/Input'
import FormLabel from '@mui/material/FormLabel'
import browser from 'webextension-polyfill'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { formatAmount } from 'src/utils/format'
import { AccountManager } from 'src/modules'
import { WalletManager } from 'src/modules/wallet'
import { TxMessageRequester } from 'src/services/tx'

const test_receive_address = 'gio128h7ddsr2m9z933rngu9nknc3jjyrlq5e8k4uk'

const Account = observer(
  ({ account, wallet }: { account: AccountManager; wallet: WalletManager }) => {
    const [toAddress, setToAddress] = useState<string>('')
    const handleSendGTB = () => {
      if (!toAddress) return
      const tx = new TxMessageRequester()

      tx.sendNativeToken({
        from: account.account,
        to: toAddress,
        amount: '30000',
        fee: 'auto',
      })
    }

    return (
      <div>
        <p>account: {account.accountInfo.name}</p>
        <p>{formatAmount(wallet.nativeBalance ?? '')} GTB</p>

        <Box>
          <FormLabel>Receive address:</FormLabel>
          <Input onChange={e => setToAddress(e.target.value)} />
        </Box>
        <Button onClick={handleSendGTB}>Send GTB to {toAddress}</Button>

        {wallet.tokens.map(_ => (
          <p key={_.name}>
            {formatAmount(_.balance.amount, _.decimals)} {_.name}
          </p>
        ))}
      </div>
    )
  }
)

export default Account
