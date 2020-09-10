/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { expect } from 'chai'
import 'mocha'
import { JSDOM } from 'jsdom'
import Input from '../../src/view/Input'
const { window } = new JSDOM('')

const $ = require('jquery')(window)

global.$ = $

describe('Input', () => {
  describe('setValue', () => {
    it('should set value', () => {
      const $input: JQuery = $('<input/>', {
        type: 'text',
      })
      const input = new Input(<HTMLInputElement>$input[0])

      input.setValue('test val')

      expect($input.val()).to.equal('test val')
    })
  })
})
