import Button from '@mui/material/Button'
import { createMsgSend } from '@gotabit/messages'
import browser from 'webextension-polyfill'

import { useAccountContext } from 'src/contexts/AccountContext'
import { formatAmount } from 'src/utils/format'

const test_receive_address = 'gio128h7ddsr2m9z933rngu9nknc3jjyrlq5e8k4uk'

function Account() {
  const { account, gtbBalance, tokens, client } = useAccountContext()

  const handleSendGTB = async () => {
    const msgSendToken = createMsgSend(
      account,
      test_receive_address,
      '30000',
      'ugtb'
    )

    const signStargateClient = await client?.signStargateClient()
    const result = await signStargateClient?.signAndBroadcast(
      account,
      [msgSendToken],
      'auto',
      'tx_memo_native_send_token'
    )

    console.log('====result', result)
    result?.transactionHash &&
      browser.notifications.create({
        iconUrl: 'logo512.png',
        type: 'basic',
        title: 'Tx Send',
        message: `Send GTB successful, more information see ${result?.transactionHash}`,
      })

    // chrome.extension.getBackgroundPage()
  }

  return (
    <div>
      <p>account: {account}</p>
      <p>{formatAmount(gtbBalance)} GTB</p>

      <Button onClick={handleSendGTB}>Send GTB to </Button>

      {tokens.map(_ => (
        <p key={_.name}>
          {formatAmount(_.balance.amount, _.decimals)} {_.name}
        </p>
      ))}
    </div>
  )
}

export default Account
