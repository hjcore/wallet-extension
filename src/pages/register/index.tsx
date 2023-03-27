import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'

import { useRegister } from 'src/hooks/useRegister'
import { RegisterStep } from 'src/modules/register'

import ImportAccount from './ImportAccount'
import CreateNewAccount from './CreateNewAccount'
import ValidateMnemonic from './ValidateMnemonic'

const RegisterPage = observer(() => {
  const { t } = useTranslation()
  const register = useRegister()
  const handleStep = async (step: RegisterStep) => {
    register.setStep(step)
  }

  return (
    <Box>
      {register.step === 'register' && (
        <Box>
          <Box>
            <Button variant="contained" onClick={() => handleStep('create')}>
              {t('register.createNewAccount')}
            </Button>
          </Box>
          <Button variant="contained" onClick={() => handleStep('import')}>
            {t('register.importExistingAccount')}
          </Button>
        </Box>
      )}
      {register.step === 'import' && <ImportAccount register={register} />}
      {register.step === 'create' && <CreateNewAccount register={register} />}
      {register.step === 'validate' && <ValidateMnemonic register={register} />}
    </Box>
  )
})

export default RegisterPage
