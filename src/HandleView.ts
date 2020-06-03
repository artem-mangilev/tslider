import Point from './utils/Point'
import ViewTreeNode from './utils/ViewTreeNode'

class HandleView extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }

  get size(): number {
    const width = this.$elem.width()
    const height = this.$elem.height()

    if (width === height) {
      return width
    }

    throw 'Width and height of the handle have to be the same.'
  }

  public move(position: Point): void {
    const middle = this.size / 2

    this.$elem.css(
      'transform',
      `translate(${position.x - middle}px, ${position.y - middle}px)`
    )
  }
}

export default HandleView
