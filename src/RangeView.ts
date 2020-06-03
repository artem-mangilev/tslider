import Point from './utils/Point'
import { Orientation } from './aliases'
import ViewTreeNode from './utils/ViewTreeNode'

class RangeView extends ViewTreeNode {
  constructor(className: string, private orientation: Orientation) {
    super('div', className)
  }

  draw(width: number, height: number, position: Point): void {
    this.$elem
      .css('width', `${width}px`)
      .css('height', `${height}px`)
      .css('transform', `translate(${position.x}px, ${position.y}px)`)

    if (this.orientation === 'horizontal') {
      this.$elem.css('transform', 'rotate(180deg)')
    }
  }
}

export default RangeView
