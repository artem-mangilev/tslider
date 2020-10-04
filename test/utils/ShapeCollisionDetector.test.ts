import { expect } from "chai";
import PositionedShape from "../../src/utils/PositionedShape";
import ShapeCollisionDetector from "../../src/utils/ShapeCollisionDetector";

describe(ShapeCollisionDetector.name, () => {
  describe('doCollide', () => {
    it('should detect collision of 2 shapes if they collides', () => {
      const cd = new ShapeCollisionDetector()

      const shapeA: PositionedShape = {
        width: 10,
        height: 10,
        position: {
          x: 5,
          y: 5
        }
      }

      const shapeB: PositionedShape = {
        width: 10,
        height: 10,
        position: {
          x: 10,
          y: 10
        }
      }

      const doCollide = cd.doCollide(shapeA, shapeB)

      expect(doCollide).to.be.true
    })

    it('should not detect collision of 2 shapes if they are collides', () => {
      const cd = new ShapeCollisionDetector()

      const shapeA: PositionedShape = {
        width: 10,
        height: 10,
        position: {
          x: 5,
          y: 5
        }
      }

      const shapeB: PositionedShape = {
        width: 10,
        height: 10,
        position: {
          x: 100,
          y: 100
        }
      }

      const doCollide = cd.doCollide(shapeA, shapeB)

      expect(doCollide).to.be.false
    })
  })
})