import { expect } from 'chai'
import 'mocha'
import NearPointCalculator from '../../src/model/NearPointCalculator'

describe(NearPointCalculator.name, () => {
  describe('fromSegment', () => {
    it('should get point according to segment size', () => {
      const calc = new NearPointCalculator()

      const pointA = calc.fromSegment(3, 10)
      const pointB = calc.fromSegment(7, 10)

      expect(pointA).to.equal(0)
      expect(pointB).to.equal(10)
    })
  })

  describe('fromGroup', () => {
    it('should get near point from group', () => {
      const calc = new NearPointCalculator()

      const pointA = calc.fromGroup(3, [0, 10])
      const pointB = calc.fromGroup(7, [0, 10])

      expect(pointA).to.equal(0)
      expect(pointB).to.equal(10)
    })
  })
})
