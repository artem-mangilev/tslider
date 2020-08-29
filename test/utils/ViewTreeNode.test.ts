import { expect } from 'chai'
import 'mocha'
import { JSDOM } from 'jsdom'
const { window } = new JSDOM('')
const $ = require('jquery')(window)
import ViewTreeNode from '../../src/utils/ViewTreeNode'

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
global.$ = $

describe('ViewTreeNode', () => {
  describe('width', () => {
    it('should provide a width', () => {
      const node = new ViewTreeNode('div', 'some-name')

      expect(node.width).not.to.be.null
    })
  })

  describe('height', () => {
    it('should provide a height', () => {
      const node = new ViewTreeNode('div', 'some-name')

      expect(node.height).not.to.be.null
    })
  })
})
