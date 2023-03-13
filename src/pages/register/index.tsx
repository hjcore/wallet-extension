import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'

import { useRegister } from 'src/hooks/useRegister'
import { NetworkStore } from 'src/store/network'

import CreateNewAccount from './CreateNewAccount'
import ValidateMnemonic from './ValidateMnemonic'

const RegisterPage = observer(() => {
  const { t } = useTranslation()
  const register = useRegister()
  const handleCreateAccount = async () => {
    register.setStep('create')
  }

  return (
    <Box>
      {register.step === 'register' && (
        <Box>
          <Button variant="contained" onClick={handleCreateAccount}>
            {t('register.createNewAccount')}
          </Button>
        </Box>
      )}
      {register.step === 'create' && <CreateNewAccount register={register} />}
      {register.step === 'validate' && <ValidateMnemonic register={register} />}
    </Box>
  )
})

export default RegisterPage
