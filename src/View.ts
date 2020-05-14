class View {
  public $track: JQuery<HTMLElement>
  public $handle: JQuery<HTMLElement>
  public $data: JQuery<HTMLElement>

  constructor() {
    this.$track = $('.track')
    this.$handle = $('.handle')
    this.$data = $('.data')
  }

  get trackWidth() {
    return this.$track.width()
  }

  get trackPositionX() {
    return Math.floor(this.$track[0].getBoundingClientRect().x)
  }

  get trackPositionY() {
    return Math.floor(this.$track[0].getBoundingClientRect().y)
  }

  get handleWidth() {
    return this.$handle.width()
  }

  public moveHandleX(positionX: number): void {
    this.$handle.css('left', positionX)
  }

  public updateHandleData(data: string) {
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
