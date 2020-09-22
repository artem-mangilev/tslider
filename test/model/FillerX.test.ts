import { expect } from 'chai'
import 'mocha'
import FillerX from '../../src/model/FillerX'
import PositionedElement from '../../src/model/PositionedElement'

describe('FillerX', () => {
  describe('getPosition', () => {
    it('should get 0 if there only one element', () => {
      const elem: PositionedElement = {
        getPosition: () => 10,
      }
      const filler = new FillerX(elem)

      const position = filler.getPosition()

      expect(position).to.equal(0)
    })

    it('should get left element position if there are 2 elements', () => {
      const [left, right]: PositionedElement[] = [
        {
          getPosition: () => 10,
        },
        {
          getPosition: () => 20,
        },
      ]
      const filler = new FillerX(left, right)

      const position = filler.getPosition()

      expect(position).to.equal(left.getPosition())
    })
  })

  describe('getLength', () => {
    it('should get length that equal left elem position if 1 element provided', () => {
      const elem: PositionedElement = {
        getPosition: () => 10,
      }
      const filler = new FillerX(elem)

      const length = filler.getLength()

      expect(length).to.equal(elem.getPosition())
    })

    it('should get difference between right and left if 2 elements provided', () => {
      const [left, right]: PositionedElement[] = [
        {
          getPosition: () => 10,
        },
        {
          getPosition: () => 20,
        },
      ]
      const filler = new FillerX(left, right)

      const length = filler.getLength()

      expect(length).to.equal(10)
    })
  })
})
