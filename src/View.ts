import { Point } from "./Point"

class View {
  public $track: JQuery<HTMLElement>
  public $handle: JQuery<HTMLElement>
  public $data: JQuery<HTMLElement>

  constructor() {
    this.$track = $('.track')
    this.$handle = $('.handle')
    this.$data = $('.data')
  }

  get trackWidth(): number {
    return this.$track.width()
  }

  get trackHeight(): number {
    return this.$track.height()
  }

  get trackPositionX(): number {
    return Math.floor(this.$track[0].getBoundingClientRect().x)
  }

  get trackPositionY(): number {
    return Math.floor(this.$track[0].getBoundingClientRect().y)
  }

  get handleWidth(): number {
    return this.$handle.width()
  }

  public moveHandle(positionRatioX: number, positionRatioY: number): void {
    // TODO: add type for this kind of objects
    const translateRatio: Point = {
      x: positionRatioX * this.trackWidth * 10,
      y: positionRatioY * this.trackHeight * 10,
    }

    const middleOfHandle: number = this.handleWidth / 2

    this.$handle.css(
      'transform',
      `translate(
        calc(${translateRatio.x}% - ${middleOfHandle}px),
        calc(${translateRatio.y}% - ${middleOfHandle}px)
      )`
    )
  }

  public updateHandleData(data: string): void {
    this.$data.html(data)
  }

  public trackClick(handler: (x: number) => void): void {
    this.$track.click(({ clientX, target }) => {
      const trackClickX = clientX - this.trackPositionX

      // filter out negative values of trackClickX
      if (trackClickX < 0) return

      // call handler only if click occurs on track
      if (target === this.$track[0]) handler(trackClickX)
    })
  }
}

export default View
