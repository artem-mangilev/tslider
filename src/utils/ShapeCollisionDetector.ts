import { CollisionDetector } from './CollisionDetector'
import PositionedShape from './PositionedShape'

class ShapeCollisionDetector implements CollisionDetector {
  doCollide(shapeA: PositionedShape, shapeB: PositionedShape): boolean {
    const shapeAx = shapeA.position.x
    const shapeBx = shapeB.position.x
    const shapeAWidth = shapeA.width
    const shapeBWidth = shapeB.width

    const isHorizontalCollisionDetected =
      shapeAx < shapeBx + shapeBWidth && shapeAx + shapeAWidth > shapeBx

    const shapeAy = shapeA.position.y
    const shapeBy = shapeB.position.y
    const shapeAHeight = shapeA.height
    const shapeBHeight = shapeB.height

    const isVerticalCollisionDetected =
      shapeAy < shapeBy + shapeBHeight && shapeAy + shapeAHeight > shapeBHeight

    return isHorizontalCollisionDetected && isVerticalCollisionDetected
  }
}

export default ShapeCollisionDetector
