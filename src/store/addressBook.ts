import { getBucket } from '@extend-chrome/storage'

export interface AddressItem {
  name: string
  address: string
  memo?: string
}

export type AddressBookStoreData = {
  /* The key is network name */
  [key in string]: Array<AddressItem>
}

export const AddressBookStore = getBucket<AddressBookStoreData>(
  'AddressBookData',
  'local'
)

export function setDefaultAddressBookData() {
  AddressBookStore.set({})
}
