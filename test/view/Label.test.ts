import { expect } from 'chai'
import 'mocha'
import Label from '../../src/view/Label'
import {
  MockElement,
  MockOrientationManager,
  MockPermitter,
} from './MockClasses'

describe(Label.name, () => {
  describe('render', () => {
    it('should be rendered', () => {
      const element = new MockElement()
      const om = new MockOrientationManager()
      const permitter = new MockPermitter()
      const label = new Label(element, om, permitter)

      label.render({ position: 10, value: 'hello world' })

      expect(element.getContent()).to.equal('hello world')
      expect(element.position).to.eql({ x: 5, y: 0 })
    })
  })
})
