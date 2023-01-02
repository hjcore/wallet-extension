import Button from '@mui/material/Button'

import { useAccountContext } from 'src/contexts/AccountContext'

const test_mnemonic =
  'dinner proud piano mention silk plunge forest fold trial duck electric define'

function RegisterPage() {
  const { importAccount } = useAccountContext()

  const handleImport = () => {
    importAccount(test_mnemonic)
  }

  return (
    <div>
      <Button variant="contained" onClick={handleImport}>
        import existing account
      </Button>
    </div>
  )
}

export default RegisterPage
