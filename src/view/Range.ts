import { Orientation, OneDimensionalSpacePoint } from '../utils/aliases'
import Point from '../utils/Point'
import ViewTreeNode from '../utils/ViewTreeNode'

class Range extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }

  
  public get width() : number {
    return this.$elem.width()
  }
  
  
  public get height(): number {
    return this.$elem.height()
  }

  public set width(newWidth: number) {
    this.$elem.css('width', `${newWidth}px`)
  }

  public set height(newHeight: number) {
    this.$elem.css('height', `${newHeight}px`)
  }

  public get position(): Point {
    const { x, y } = this.$elem[0].getBoundingClientRect()

    return { x, y }
  }

  public move(position: Point): void {
    this.$elem.css('transform', `translate(${position.x}px, ${position.y}px)`)
  }
}

export default Range
