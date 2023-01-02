import { storage } from '@extend-chrome/storage'

export class BaseStore<T = Record<string, any>> {
  public prefix: string

  constructor(prefix: string) {
    this.prefix = prefix
  }

  public get(key: keyof T) {
    return storage.local.get(this.prefix + (key as string))
  }

  public set(setter: Partial<T>) {
    return storage.local.set(setter)
  }

  public remove(key: keyof T | Array<keyof T>) {
    return storage.local.remove(key as string)
  }
}