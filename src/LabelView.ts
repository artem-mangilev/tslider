import { Point } from './Point'

class LabelView {
  $label: JQuery<HTMLElement>

  constructor(element: HTMLElement) {
    this.$label = $(element)
  }

  get width(): number {
    return this.$label[0].offsetWidth
  }

  public move(position: Point): void {
    const middle = this.width / 2

    this.$label.css(
      'transform',
      `translate(${position.x - middle}px, ${position.y}px)`
    )
  }

  public updateData(newData: string): void {
    this.$label.html(newData)
  }
}

export default LabelView
