import { expect } from 'chai'
import 'mocha'
import { JSDOM } from 'jsdom'
import Handle from '../../src/view/Handle'
const { window } = new JSDOM('')
const $ = require('jquery')(window)

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
global.$ = $

describe('Handle', () => {
  describe('move', () => {
    it('should change handle position on screen', () => {
      const handle = new Handle()

      handle.move({ x: 5, y: 5 })

      const doesPositionChanged =
        handle.$elem.css('transform') === 'translate(5px, 5px)'
      expect(doesPositionChanged).to.be.true
    })
  })
})
