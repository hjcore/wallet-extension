import { getBucket, Bucket } from '@extend-chrome/storage'
import { SafeBotXChaCha20 } from '@gotabit/crypto'
import { toUtf8, fromUtf8, toBase64, fromBase64 } from '@cosmjs/encoding'

export class EncryptBaseStore<T extends object> {
  public store: Bucket<{ [k in keyof T]: string }>

  constructor(bucketName: string) {
    this.store = getBucket(bucketName, 'local')
  }

  async set(setter: Partial<T>, password: string) {
    const encryptSetter: { [k in keyof T]?: string } = {}
    const keys = Object.keys(setter)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as keyof T
      const valueStr =
        typeof setter[key] === 'string'
          ? (setter[key] as string)
          : JSON.stringify(setter[key])

      encryptSetter[key] = toBase64(
        await SafeBotXChaCha20.encrypt(toUtf8(valueStr), password)
      )
    }

    return this.store.set(encryptSetter)
  }

  get(password: string): Promise<T>

  get(password: string, key: keyof T): Promise<Partial<T>>

  async get(password: string, key?: keyof T) {
    const data = await this.store.get(key as any)
    const decryptData: Partial<T> = {}

    const keys = Object.keys(data)

    for (let i = 0; i < keys.length; i++) {
      const _key = keys[i] as keyof T
      const valueStr = fromUtf8(
        await SafeBotXChaCha20.decrypt(fromBase64(data[_key]), password)
      )

      try {
        decryptData[_key] = JSON.parse(valueStr)
      } catch (error) {
        decryptData[_key] = valueStr as any
      }
    }

    return decryptData
  }

  clear() {
    this.store.clear()
  }
}
