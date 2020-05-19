import { Point } from './Point'
import { Ratio } from './aliases'
import HandleView from './HandleView'
import TrackView from './TrackView'
import RangeView from './RangeView'

class View {
  public $data: JQuery<HTMLElement>

  private handle: HandleView
  private track: TrackView
  private range: RangeView

  constructor() {
    this.$data = $('.data')

    const trackElement = <HTMLElement>document.querySelector('.track')
    this.track = new TrackView(trackElement)

    // TODO: read about type casting
    const handleElement = <HTMLElement>document.querySelector('.handle')
    this.handle = new HandleView(handleElement)

    const rangeElement = <HTMLElement>document.querySelector('.range')
    this.range = new RangeView(rangeElement)
  }

  // These getters just duplicates the ones from the TrackView, so
  // TODO: find the way to remove these getters
  public get trackWidth() {
    return this.track.width
  }

  public get trackHeight() {
    return this.track.height
  }


  public moveHandle(positionX: Ratio, positionY: Ratio): void {
    const translateRatio: Point = {
      x: positionX * this.track.width * 10,
      y: positionY * this.track.height * 10,
    }

    this.handle.move(translateRatio)
  }

  public updateHandleData(data: string): void {
    this.$data.html(data)
  }

  public updateRange(positionRatioX: number): void {
    this.range.draw(positionRatioX)
  }

  public trackClick(handler: (x: number) => void): void {
    const handlerWrapper = (e: MouseEvent): any => {
      const trackClickX = e.clientX - this.track.positionX

      // filter out negative values of trackClickX
      if (trackClickX < 0) return

      // call handler only if click occurs on track or range
      const isTrack = e.target === this.track.$track[0]
      const isRange = e.target === this.range.$range[0]
      const correctTarget = isTrack || isRange

      if (correctTarget) handler(trackClickX)
    }

    // TODO: find the way to attach an event handler with Jquery
    this.track.$track[0].addEventListener('click', handlerWrapper)
  }

  public handleDrag(handler: (x: number) => void): void {
    const mouseMoveHandler = (e: MouseEvent): void => {
      const trackMouseX = e.clientX - this.track.positionX

      // evaluate handler only if mouse is inside of vertical track scope
      if (trackMouseX <= this.track.width) handler(trackMouseX)
    }

    const $root = $('html')

    // when user pushes left button
    $root.mousedown((e) => {
      // if target is handle, attach mousemove event
      if (e.target === this.handle.$handle[0]) {
        $root[0].addEventListener('mousemove', mouseMoveHandler)
      }
    })

    // when user releases the button in any place, remove event
    $root.mouseup(() => {
      $root[0].removeEventListener('mousemove', mouseMoveHandler)
    })
  }
}

export default View
