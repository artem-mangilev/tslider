import Point from '../utils/Point'
import ViewTreeNode from '../utils/ViewTreeNode'

class Handle extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }

  move(position: Point): void {
    const middle = this.width / 2

    this.$elem.css(
      'transform',
      `translate(${position.x - middle}px, ${position.y - middle}px)`
    )
  }
}

export default Handle
