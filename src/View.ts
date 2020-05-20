import { Point } from './Point'
import HandleView from './HandleView'
import TrackView from './TrackView'
import RangeView from './RangeView'
import { RatioPoint } from './RatioPoint'
import LabelView from './LabelView'

class View {
  private handle: HandleView
  private track: TrackView
  private range: RangeView
  private label: LabelView

  constructor() {
    const trackElement = <HTMLElement>document.querySelector('.track')
    this.track = new TrackView(trackElement)

    // TODO: read about type casting
    const handleElement = <HTMLElement>document.querySelector('.handle')
    this.handle = new HandleView(handleElement)

    const rangeElement = <HTMLElement>document.querySelector('.range')
    this.range = new RangeView(rangeElement)

    const labelElement = <HTMLElement>document.querySelector('.current-label')
    this.label = new LabelView(labelElement)
  }

  // These getters just duplicates the ones from the TrackView, so
  // TODO: find the way to remove these getters
  public get trackWidth() {
    return this.track.width
  }

  public get trackHeight() {
    return this.track.height
  }

  public slideTo(position: RatioPoint, data: string): void {
    const newPosition: Point = {
      x: position.x * this.track.width,
      y: position.y * this.track.height,
    }

    // move the handle
    this.handle.move(newPosition)

    // label should only be moved vertically
    const labelPosition: Point = {
      x: newPosition.x,
      y: 0,
    }
    // update the label's position and data
    this.label.move(labelPosition)
    this.label.updateData(data)
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

      // evaluate handler only if mouse is inside of track scope
      const isMouseAfterLeftBoundry = trackMouseX >= 0
      const isMouseBeforeRightBoundry = trackMouseX <= this.track.width
      const isMousePositionValid =
        isMouseAfterLeftBoundry && isMouseBeforeRightBoundry

      if (isMousePositionValid) handler(trackMouseX)
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
