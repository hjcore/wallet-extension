import Button from '@mui/material/Button'

import { getAccountStore } from 'src/store/account'
import { setNetwork, NetworkStore } from 'src/store/network'

const test_mnemonic =
  'dinner proud piano mention silk plunge forest fold trial duck electric define'

const AccountStore = await getAccountStore()

function RegisterPage() {
  const handleImport = async () => {
    await AccountStore.set({
      mnemonic: test_mnemonic,
    })

    setNetwork('dev')
    console.log('--------imported')
  }

  const clearAccountStore = async () => {
    AccountStore.clear()
    NetworkStore.clear()
    console.log('--------cleared')
  }

  return (
    <div>
      <Button variant="contained" onClick={handleImport}>
        import existing account
      </Button>
      <Button onClick={clearAccountStore}>Clear Account storage</Button>
    </div>
  )
}

export default RegisterPage
