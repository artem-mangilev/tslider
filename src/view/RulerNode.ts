import ViewTreeNode from '../utils/ViewTreeNode'
import Point from '../utils/Point'

class RulerNode extends ViewTreeNode {
  constructor(className: string) {
    super('span', className)
  }

  public move(position: Point): void {
    this.$elem.css('transform', `translate(${position.x}px, ${position.y}px)`)
  }

  public value(value: string): void {
    this.$elem.html(value)
  }
}

export default RulerNode
