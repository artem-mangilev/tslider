import { expect } from 'chai'
import Range from '../../src/components/Range'
import { MockElement, MockOrientationManager } from './MockClasses'

describe(Range.name, () => {
  describe('render', () => {
    it('should be rendered', () => {
      const element = new MockElement()
      const om = new MockOrientationManager()
      const range = new Range(element, om)

      range.render({
        length: 10,
        position: { x: 10, y: 10 },
        track: { width: 5, height: 5 },
      })

      expect(element.width).to.equal(10)
      expect(element.position).to.eql({ x: 10, y: 10 })
    })

    it('should be rendered in vertical orientation', () => {
      const element = new MockElement()
      const om = new MockOrientationManager()
      const range = new Range(element, om)
      om.changeOrientation('vertical')
      
      range.render({
        length: 10,
        position: { x: 10, y: 10 },
        track: { width: 5, height: 5 },
      })

      expect(element.height).to.equal(10)
      expect(element.position).to.eql({ x: 20, y: 10 })
    })
  })
})
