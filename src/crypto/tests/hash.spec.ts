import { Buffer } from 'buffer/'
import BIP32Factory from 'bip32'
import * as ecc from 'tiny-secp256k1'
import bip39 from 'bip39'
import bs58check from 'bs58check'

import { Hash } from '../hash'

console.log(ecc, '----')
describe('Test hash', () => {
  it('sha256', () => {
    expect(
      Buffer.from(Hash.sha256(Buffer.from('12345678', 'hex'))).toString('hex')
    ).toBe('b2ed992186a5cb19f6668aade821f502c1d00970dfd0e35128d51bac4649916c')
  })

  it('keccak256', () => {
    expect(
      Buffer.from(Hash.keccak256(Buffer.from('12345678', 'hex'))).toString(
        'hex'
      )
    ).toBe('30ca65d5da355227c97ff836c9c6719af9d3835fc6bc72bddc50eeecc1bb2b25')
  })
})
