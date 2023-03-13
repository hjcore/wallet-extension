import { useCallback, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Input from '@mui/material/Input'
import FormLabel from '@mui/material/FormLabel'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'

import { RegisterManager } from 'src/modules/register'

import { generateMnemonic } from './helpers/mnemonic'

type MnemonicLength = 12 | 24

const test_mnemonic =
  'dinner proud piano mention silk plunge forest fold trial duck electric define'

const getButtonVariant = (isContained: boolean) =>
  isContained ? 'contained' : 'outlined'

const CreateNewAccount = observer(
  ({ register }: { register: RegisterManager }) => {
    const { t } = useTranslation()
    const [mnemonicLength, setMnemonicLength] = useState<MnemonicLength>(12)
    const [mnemonic, setNnemonic] = useState<string>()

    const handleMnemonic = useCallback(
      async (num: MnemonicLength) => {
        setMnemonicLength(num)
        const mnemonic = await generateMnemonic(num)

        setNnemonic(mnemonic)
        register.setKey(mnemonic)
      },
      [register]
    )

    const isLength12 = useMemo(() => mnemonicLength === 12, [mnemonicLength])
    const isLength24 = useMemo(() => mnemonicLength === 24, [mnemonicLength])

    useEffect(() => {
      !mnemonic && handleMnemonic(12)
    }, [mnemonic, handleMnemonic])

    return (
      <Box>
        <Box display={'flex'} justifyContent="space-between">
          <h3>Mnemonic Seed</h3>
          <Box>
            <Button
              variant={getButtonVariant(isLength12)}
              onClick={() => handleMnemonic(12)}
            >
              12 words
            </Button>
            <Button
              variant={getButtonVariant(isLength24)}
              onClick={() => handleMnemonic(24)}
            >
              24 words
            </Button>
          </Box>
        </Box>
        <Box>{mnemonic}</Box>
        <FormLabel>{t('register.name')}</FormLabel>
        <Input onChange={e => register.setName(e.target.value)} />

        <Button onClick={() => register.setStep('validate')}>
          {t('register.next')}
        </Button>
      </Box>
    )
  }
)

export default CreateNewAccount
