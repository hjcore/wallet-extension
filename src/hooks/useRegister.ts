import { useState } from 'react'

import { RegisterManager } from 'src/modules/register'

export function useRegister() {
  const [registerConfig] = useState(() => new RegisterManager())

  return registerConfig
}
