import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import { RegisterManager } from 'src/modules/register'
import { shuffle } from 'src/utils/shuffle'

const ValidateMnemonic = observer(
  ({ register }: { register: RegisterManager }) => {
    const { t } = useTranslation()
    const [randomMnemonicList, setRandomMnemonicList] = useState(
      shuffle((register.key as string).split(' '))
    )

    const [useSelections, setUserSelections] = useState<string[]>([])

    const handleMnemonicSelect = useCallback(
      (word: string) => {
        setUserSelections([...useSelections, word])
        setRandomMnemonicList(randomMnemonicList.filter(_ => _ !== word))
      },
      [useSelections, randomMnemonicList]
    )

    const handleMnemonicUnSelect = useCallback(
      (word: string) => {
        setUserSelections(useSelections.filter(_ => _ !== word))
        setRandomMnemonicList([...randomMnemonicList, word])
      },
      [useSelections, randomMnemonicList]
    )

    const handleRegisterClick = useCallback(async () => {
      // if (register.key === useSelections.join(' ')) {
      register.setPassword('123456')
      await register.submitKey()
      window.close()
      // }
    }, [register])

    return (
      <Box>
        <ButtonGroup>
          {useSelections.map(word => (
            <Button onClick={() => handleMnemonicUnSelect(word)}>{word}</Button>
          ))}
        </ButtonGroup>
        <Divider />
        <ButtonGroup>
          {randomMnemonicList.map(word => (
            <Button onClick={() => handleMnemonicSelect(word)}>{word}</Button>
          ))}
        </ButtonGroup>
        <Box>
          <Button onClick={handleRegisterClick}>
            {t('register.register')}
          </Button>
        </Box>
      </Box>
    )
  }
)

export default ValidateMnemonic
