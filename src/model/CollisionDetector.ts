import PositionedElement from './PositionedElement'

class CollisionDetector {
  doCollide(elements: PositionedElement[]): boolean {
    return !this.isSorted(elements)
  }

  private isSorted(elements: PositionedElement[]) {
    return elements.slice(1).every((elem, i) => {
      return elements[i].getPosition() <= elem.getPosition()
    })
  }
}

export default CollisionDetector
