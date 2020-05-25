import { Point } from './Point'

class LabelView {
  $label: JQuery<HTMLElement>

  constructor(element: HTMLElement) {
    this.$label = $(element)
  }

  get width(): number {
    return this.$label.width()
  }

  get height(): number {
    return this.$label.height()
  }

  set width(newWidth: number) {
    this.$label.css('width', `${newWidth}px`)
  }

  set height(newHeight: number) {
    this.$label.css('height', `${newHeight}px`)
  }

  public move(position: Point): void {
    this.$label.css('transform', `translate(${position.x}px, ${position.y}px)`)
  }

  public updateData(newData: string): void {
    this.$label.html(newData)
  }
}

export default LabelView
