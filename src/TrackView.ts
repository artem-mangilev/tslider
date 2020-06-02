class TrackView {
  public $track: JQuery<HTMLElement>

  private track: HTMLElement

  constructor(element: HTMLElement) {
    this.track = element
    this.$track = $(this.track)
  }

  public get width() {
    return this.$track.width()
  }

  public get height() {
    return this.$track.height()
  }

  public set width(newWidth: number) {
    this.$track.css('width', `${newWidth}px`)
  }

  public set height(newHeight: number) {
    this.$track.css('height', `${newHeight}px`)
  }

  public get positionX(): number {
    // this is the x position of first point of the track,
    // relative to the viewport
    const x = this.track.getBoundingClientRect().x
    return Math.floor(x)
  }

  public get positionY(): number {
    // this is the y position of first point of the track,
    // relative to the viewport
    const y = this.track.getBoundingClientRect().y
    return Math.floor(y)
  }
}

export default TrackView
