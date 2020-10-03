import { expect } from 'chai'
import 'mocha'
import Input from '../../src/view/Input'
import { MockElement } from './MockClasses'

describe(Input.name, () => {
  describe('render', () => {
    it('should render provided value', () => {
      const element = new MockElement()
      const input = new Input(element)

      input.render('hello world')

      expect(element.getAttribute('value')).to.equal('hello world')
    })
  })

  describe('getValue', () => {
    it('should get value', () => {
      const element = new MockElement()
      const input = new Input(element)

      input.render('hello world')

      expect(input.getValue()).to.equal('hello world')
    })
  })
})
