import Point from '../utils/Point'
import ViewTreeNode from '../utils/ViewTreeNode'

class Label extends ViewTreeNode {
  $elem: JQuery<HTMLElement>

  constructor(className: string) {
    super('div', className)
  }

  get width(): number {
    return this.$elem.outerWidth()
  }

  get height(): number {
    return this.$elem.outerHeight()
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

  public get position(): Point {
    const { x, y } = this.$elem[0].getBoundingClientRect()

    return { x, y }
  }

  public updateData(newData: string): void {
    this.$elem.html(newData)
  }

  public get data(): string {
    return this.$elem.html()
  }
}

export default Label
