import { expect } from 'chai'
import 'mocha'
import Input from '../../src/model/Input'

describe(Input.name, () => {
  describe('constructor', () => {
    it('should set default separator if arg is not provided', () => {
      const input = new Input()

      input.set('hello', 'world')

      expect(input.get()).to.equal('helloworld')
    })
  })

  describe('set/get', () => {
    it('should set value and then get it', () => {
      const input = new Input(' - ')

      input.set('goodbye', 'world')

      expect(input.get()).to.equal('goodbye - world')
    })
  })
})