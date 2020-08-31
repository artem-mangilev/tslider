import { expect } from 'chai'
import 'mocha'
import { JSDOM } from 'jsdom'
import Label from '../../src/view/Label'
const { window } = new JSDOM('')

const $ = require('jquery')(window)

global.$ = $

describe('Label', () => {
  describe('updateData', () => {
    it('should set new value to this element', () => {
      const label = new Label('label')

      label.updateData('test data')

      expect(label.$elem.text()).to.equal('test data')
    })

    it('should get the value', () => {
      const label = new Label('label')
      label.updateData('test data')

      const value = label.data

      expect(value).to.equal('test data')
    })
  })
})
