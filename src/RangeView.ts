import Point from './utils/Point'
import { Orientation } from './aliases'

class RangeView {
  $range: JQuery<HTMLElement>

  constructor(element: HTMLElement, private orientation: Orientation) {
    this.$range = $(element)
  }

  draw(width: number, height: number, position: Point): void {
    this.$range
      .css('width', `${width}px`)
      .css('height', `${height}px`)
      .css('transform', `translate(${position.x}px, ${position.y}px)`)

    if (this.orientation === 'horizontal') {
      this.$range.css('transform', 'rotate(180deg)')
    }
  }
}

export default RangeView
