import { Point } from './Point'
import { Ratio } from './aliases'
import HandleView from './HandleView'

class View {
  public $track: JQuery<HTMLElement>
  public $data: JQuery<HTMLElement>
  public $range: JQuery<HTMLElement>

  private handle: HandleView

  constructor() {
    this.$track = $('.track')
    this.$range = $('.range')
    this.$data = $('.data')

    // TODO: read about type casting
    const handleElement = <HTMLElement>document.querySelector('.handle')
    this.handle = new HandleView(handleElement)
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

  public moveHandle(positionX: Ratio, positionY: Ratio): void {
    const translateRatio: Point = {
      x: positionX * this.trackWidth * 10,
      y: positionY * this.trackHeight * 10,
    }

    // TODO: this probably should be in the Model
    const middleOfHandle: number = this.handle.size / 2

    this.handle.$handle.css(
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

  public updateRange(positionRatioX: number): void {
    this.$range.css('width', `${positionRatioX * 100}%`)
  }

  public trackClick(handler: (x: number) => void): void {
    const handlerWrapper = (e: MouseEvent): any => {
      const trackClickX = e.clientX - this.trackPositionX

      // filter out negative values of trackClickX
      if (trackClickX < 0) return

      // call handler only if click occurs on track or range
      const isTrack = e.target === this.$track[0]
      const isRange = e.target === this.$range[0]
      const correctTarget = isTrack || isRange

      if (correctTarget) handler(trackClickX)
    }

    // TODO: find the way to attach an event handler with Jquery
    this.$track[0].addEventListener('click', handlerWrapper)
  }

  public handleDrag(handler: (x: number) => void): void {
    const mouseMoveHandler = (e: MouseEvent): void => {
      const trackMouseX = e.clientX - this.trackPositionX

      // evaluate handler only if mouse is inside of vertical track scope
      if (trackMouseX <= this.trackWidth) handler(trackMouseX)
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
