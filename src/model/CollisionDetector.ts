import PositionedElement from './PositionedElement'

class CollisionDetector {
  doCollide(elements: PositionedElement[]): boolean {
    if (elements.length === 1) return false

    if (elements.length === 2) {
      return elements[0].getPosition() > elements[1].getPosition()
    }
  }
}

export default CollisionDetector
