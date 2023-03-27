import { useNavigate } from 'react-router-dom'
import browser from 'webextension-polyfill'
import Box from '@mui/material/Box'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

import { useAccount } from 'src/hooks/useAccount'
import { useWallet } from 'src/hooks/useWallet'

import Account from './Account'

const WalletPage = observer(() => {
  const accountManager = useAccount()
  const walletManager = useWallet()
  const navigate = useNavigate()

  useEffect(() => {
    browser.runtime.onMessage.addListener((msg, sender) => {
      console.log('=======popup received', msg, sender)
    })
  }, [])

  const handleAddAccount = () => {
    try {
      browser.tabs.create({
        url: '/index.html#/register',
      })
    } catch (error) {
      navigate('/register')
    }
  }

  return (
    <Box>
      <p>Wallet page</p>
      <button onClick={handleAddAccount}>Add account</button>
      <Account account={accountManager} wallet={walletManager} />
    </Box>
  )
})

export default WalletPage
