import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import browser from 'webextension-polyfill'

import { WalletStatusEnum } from 'src/constants/status'
import { AccountStore } from 'src/store/account'
import AppRoutes from 'src/routes/routes'
import theme from 'src/theme'

import './App.css'

const {
  currentAccount,
  accountList = [],
  walletStatus = WalletStatusEnum.Empty,
} = await AccountStore.get()

function App() {
  if (
    walletStatus === WalletStatusEnum.Empty ||
    !currentAccount ||
    !accountList.length
  ) {
    if (window.location.hash !== '#/register') {
      browser.tabs.create({
        url: '/index.html#/register',
      })

      return null
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
