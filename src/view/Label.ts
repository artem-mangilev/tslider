import Point from '../utils/Point'
import ViewTreeNode from '../utils/ViewTreeNode'

class Label extends ViewTreeNode {
  $elem: JQuery<HTMLElement>

  constructor(className: string) {
    super('div', className)
  }

  public move(position: Point): void {
    this.$elem.css('transform', `translate(${position.x}px, ${position.y}px)`)
  }

  public updateData(newData: string): void {
    this.$elem.html(newData)
  }

  public get data(): string {
    return this.$elem.html()
  }
}

export default Label
