import ViewTreeNode from '../utils/ViewTreeNode'
import Point from '../utils/Point'

class Track extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }

  public get width() {
    return this.$elem.width()
  }

  public get height() {
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

    return { x: Math.floor(x), y: Math.floor(y) }
  }
}

export default Track
