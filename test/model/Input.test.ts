import { expect } from 'chai'
import 'mocha'
import Input from '../../src/model/Input'

describe(Input.name, () => {
  describe('constructor', () => {
    it('should create initial value', () => {
      const input = new Input(' - ', 'hello', 'world')

      expect(input.get()).to.equal('hello - world')
    })
  })

  describe('set', () => {
    it('should set new value', () => {
      const input = new Input(' - ', 'hello', 'world')

      input.set('goodbye', 'world')

      expect(input.get()).to.equal('goodbye - world')
    })
  })

  describe('get', () => [
    it('should get value', () => {
      const input = new Input(' - ', 'hello', 'world')

      expect(input.get()).to.equal('hello - world')
    })
  ])
})