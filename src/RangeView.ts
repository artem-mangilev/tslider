import Point from './utils/Point'

class RangeView {
  $range: JQuery<HTMLElement>

  constructor(element: HTMLElement) {
    this.$range = $(element)
  }

  draw(width: number, height: number, position: Point): void {
    this.$range
      .css('width', `${width}px`)
      .css('height', `${height}px`)
      .css('transform', `translate(${position.x}px, ${position.y}px)`)
  }
}

export default RangeView
