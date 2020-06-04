import Point from '../utils/Point'
import ViewTreeNode from '../utils/ViewTreeNode'

class Label extends ViewTreeNode {
  $elem: JQuery<HTMLElement>

  constructor(className: string) {
    super('div', className)
  }

  get width(): number {
    return this.$elem.width()
  }

  get height(): number {
    return this.$elem.height()
  }

  set width(newWidth: number) {
    this.$elem.css('width', `${newWidth}px`)
  }

  set height(newHeight: number) {
    this.$elem.css('height', `${newHeight}px`)
  }

  public move(position: Point): void {
    this.$elem.css('transform', `translate(${position.x}px, ${position.y}px)`)
  }

  public updateData(newData: string): void {
    this.$elem.html(newData)
  }
}

export default Label
