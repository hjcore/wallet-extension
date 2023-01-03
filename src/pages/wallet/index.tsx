import { useNavigate } from 'react-router-dom'
import browser from 'webextension-polyfill'

import { AccountProvider } from 'src/contexts/AccountContext'

import Account from './Account'

function WalletPage() {
  const navigate = useNavigate()

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
    <AccountProvider>
      <p>Wallet page</p>
      <button onClick={handleAddAccount}>Add account</button>
      <Account />
    </AccountProvider>
  )
}

export default WalletPage
