import browser from 'webextension-polyfill'

import { setDefaultAccountData } from 'src/store/account'
import { setDefaultAddressBookData } from 'src/store/addressBook'
import { setDefaultNetworkData } from 'src/store/network'
import { setDefaultTokenData } from 'src/store/token'

import openChromeExtension from './misc/openChromeExtension'
import { initPrivateServer } from './private'
import { initTxServer } from './tx'

setDefaultAccountData()
setDefaultAddressBookData()
setDefaultNetworkData()
setDefaultTokenData()

initPrivateServer()

initTxServer()
