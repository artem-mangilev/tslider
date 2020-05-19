import { Point } from './Point'

class HandleView {
  $handle: JQuery<HTMLElement>

  constructor(element: HTMLElement) {
    this.$handle = $(element)
  }

  get size(): number {
    const width = this.$handle.width()
    const height = this.$handle.height()

    if (width === height) {
      return width
    }

    throw 'Width and height of the handle have to be the same.'
  }

  public move(position: Point): void {
    const middle = this.size / 2

    this.$handle.css(
      'transform',
      `translate(${position.x - middle}px, ${position.y - middle}px)`
    )
  }
}

export default HandleView
