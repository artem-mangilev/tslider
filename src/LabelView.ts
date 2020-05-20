import { Point } from './Point'

class LabelView {
  $label: JQuery<HTMLElement>

  constructor(element: HTMLElement) {
    this.$label = $(element)
  }

  get width(): number {
    return this.$label.width()
  }

  public move(position: Point): void {
    const middle = this.width / 2

    // TODO: this number helps to align label with handle vertically. This behaviour should be implemented with a different way.
    const magicNumber = 1

    this.$label.css(
      'transform',
      `translate(${position.x - middle + magicNumber}px, ${position.y}px)`
    )
  }

  public updateData(newData: string): void {
    this.$label.html(newData)
  }
}

export default LabelView
