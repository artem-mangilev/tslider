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

    it('should set a new width', () => {
      const node = new ViewTreeNode('div', 'some-name')

      node.width = 10

      expect(node.width).equal(10)
    })
  })

  describe('height', () => {
    it('should provide a height', () => {
      const node = new ViewTreeNode('div', 'some-name')

      expect(node.height).not.to.be.null
    })

    it('should set a new height', () => {
      const node = new ViewTreeNode('div', 'some-name')

      node.height = 10

      expect(node.height).equal(10)
    })
  })

  describe('position', () => {
    it('should provide a position of node', () => {
      const node = new ViewTreeNode('div', 'some-name')

      const pos = node.position

      expect(pos.x).not.to.be.null
      expect(pos.y).not.to.be.null
    })
  })
  })
})