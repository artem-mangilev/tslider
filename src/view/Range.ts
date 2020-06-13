import { Orientation, OneDimensionalSpacePoint } from '../utils/aliases'
import Point from '../utils/Point'
import ViewTreeNode from '../utils/ViewTreeNode'

class Range extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }

  public get height() {
    return this.$elem.height()
  }

  draw(width: number, height: number, position: OneDimensionalSpacePoint): void {
    this.$elem
      .css('width', `${width}px`)
      .css('height', `${height}px`)
      .css('transform', `translate(${position}px, 0px)`)
  }
}

export default Range
