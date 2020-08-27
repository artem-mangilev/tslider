import { expect } from 'chai'
import 'mocha'
import ValuesToTrackPointConverter from '../../src/model/ValuesToTrackPointConverter'

describe('ValuesToTrackPointConverter', () => {
  let converter: ValuesToTrackPointConverter, length: number

  beforeEach(() => {
    converter = new ValuesToTrackPointConverter(5, 10, 1)
    length = 100
  })

  describe('toTrackPoint', () => {
    it('should convert value to point on track', () => {
      const pointA = converter.toTrackPoint(5, length)
      const pointB = converter.toTrackPoint(7.5, length)
      const pointC = converter.toTrackPoint(10, length)

      expect(pointA).to.equal(0)
      expect(pointB).to.equal(50)
      expect(pointC).to.equal(length)
    })
  })

  describe('toValue', () => {
    it('should convert point on track to value', () => {
      const valueA = converter.toValue(0, length)
      const valueB = converter.toValue(50, length)
      const valueC = converter.toValue(length, length)

      expect(valueA).to.equal(5)
      expect(valueB).to.equal(7.5)
      expect(valueC).to.equal(10)
    })
  })

  describe('getNumberOfSteps', () => {
    it('should return number of steps', () => {
      const steps = converter.getNumberOfSteps()

      expect(steps).to.equal(5)
    })
  })
})
