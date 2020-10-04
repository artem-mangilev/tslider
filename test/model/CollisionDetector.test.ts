import { expect } from 'chai'
import 'mocha'
import CollisionDetector from '../../src/model/CollisionDetector'
import PositionedElement from '../../src/model/PositionedElement'

describe('CollisionDetector', () => {
  describe('doCollide', () => {
    it('should not detect collision if there is no elements', () => {
      const detector = new CollisionDetector()

      const doesCollisionDetected = detector.doCollide([])

      expect(doesCollisionDetected).to.equal(false)
    })

    it('should not detect collision if there is one element', () => {
      const elem: PositionedElement = {
        getPosition() {
          return 10
        },
      }
      const detector = new CollisionDetector()

      const doesCollisionDetected = detector.doCollide([elem])

      expect(doesCollisionDetected).to.equal(false)
    })

    it('should detect collision when 2 elements intersected', () => {
      const elems: PositionedElement[] = [
        {
          getPosition() {
            return 15
          },
        },
        {
          getPosition() {
            return 10
          },
        },
      ]
      const detector = new CollisionDetector()

      const doesCollisionDetected = detector.doCollide(elems)

      expect(doesCollisionDetected).to.equal(true)
    })

    it('should not detect collision when 2 elements not intersected', () => {
      const elems: PositionedElement[] = [
        {
          getPosition() {
            return 5
          },
        },
        {
          getPosition() {
            return 10
          },
        },
      ]
      const detector = new CollisionDetector()

      const doesCollisionDetected = detector.doCollide(elems)

      expect(doesCollisionDetected).to.equal(false)
    })

    it('should detect collision when some elements intersected', () => {
      const elems: PositionedElement[] = [
        {
          getPosition() {
            return 5
          },
        },
        {
          getPosition() {
            return 15
          },
        },
        {
          getPosition() {
            return 10
          },
        },
      ]
      const detector = new CollisionDetector()

      const doesCollisionDetected = detector.doCollide(elems)

      expect(doesCollisionDetected).to.equal(true)
    })
  })
})
