import { Ratio } from "./aliases"

class RangeView {
  $range: JQuery<HTMLElement>

  constructor(element: HTMLElement) {
    this.$range = $(element)
  }

  draw(endX: Ratio): void {
    this.$range.css('width', `${endX * 100}%`)
  }
}

export default RangeView