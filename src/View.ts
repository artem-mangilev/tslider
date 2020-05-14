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

  get trackPositionX(): number {
    return Math.floor(this.$track[0].getBoundingClientRect().x)
  }

  get trackPositionY(): number {
    return Math.floor(this.$track[0].getBoundingClientRect().y)
  }

  get handleWidth(): number {
    return this.$handle.width()
  }

  public moveHandleX(positionRatioX: number): void {
    const translateRatio = positionRatioX * this.trackWidth * 10
    const middleOfHandle = this.handleWidth / 2

    this.$handle.css(
      'transform',
      `translateX(calc(${translateRatio}% - ${middleOfHandle}px))`
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
