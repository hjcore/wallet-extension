import browser from 'webextension-polyfill'

import { setDefaultAccountData, AccountStore } from 'src/store/account'
import { setDefaultAddressBookData } from 'src/store/addressBook'
import { setDefaultNetworkData } from 'src/store/network'
import { setDefaultTokenData } from 'src/store/token'

import openChromeExtension from './misc/openChromeExtension'
import { initPrivateServer } from './private'
import { initTxServer } from './tx'

AccountStore.get('walletStatus').then(async account => {
  if (account.walletStatus === undefined) {
    await setDefaultAccountData()
    await setDefaultAddressBookData()
    await setDefaultNetworkData()
    await setDefaultTokenData()
  }

  initPrivateServer()

  initTxServer()
})
