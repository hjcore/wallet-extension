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

  const testBrowserMessage = () => {
    browser.runtime.sendMessage({
      port: '1000',
      message: 'test browser send',
    })
  }

  const testChromeMessage = () => {
    chrome.runtime.sendMessage({
      port: '1000',
      message: 'test browser send',
    })
  }

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
      <button onClick={testBrowserMessage}>testBrowserMessage</button>
      <button onClick={testChromeMessage}>testChromeMessage</button>
    </Box>
  )
})

export default WalletPage
