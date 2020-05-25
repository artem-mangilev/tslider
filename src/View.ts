import { Point } from './Point'
import HandleView from './HandleView'
import TrackView from './TrackView'
import RangeView from './RangeView'
import LabelView from './LabelView'
import InputView from './InputView'
import { Ratio, Orientation } from './aliases'
import ViewOptions from './ViewOptions'
import { RatioPoint } from './RatioPoint'

class View {
  private handle: HandleView
  private track: TrackView
  private range: RangeView
  private label: LabelView
  private targetInput: InputView
  orientation: Orientation

  constructor(options: ViewOptions) {
    this.targetInput = new InputView(options.targetInput)
    this.orientation = options.orientation

    // create the following structure of slider
    // .tslider
    //   .tslider__labels
    //     .tslider__label
    //   .tslider__track
    //     .tslider__range
    //     .tslider__handle

    // TODO: find the more nice looking way to build this structure

    // create an container for slider
    const $slider: JQuery<HTMLElement> = $('<div>', {
      class: 'tslider',
    })
    // put it after the targetInput
    this.targetInput.$element.after($slider)

    // create the container for labels
    const $labelsContainer = $('<div>', {
      class: 'tslider__labels',
    })
    // put it inside the sliderContainer
    $slider.append($labelsContainer)

    // create the label
    const $label = $('<div>', {
      class: 'tslider__label',
    })
    // put it inside the labelsContainer
    $labelsContainer.append($label)
    // initialize the label class
    this.label = new LabelView($label[0])

    // create the track
    const $track = $('<div>', {
      class: 'tslider__track',
    })
    // put it inside the sliderContainer
    $slider.append($track)
    // initialize the TrackView class
    this.track = new TrackView($track[0])

    // create the range
    const $range = $('<div>', {
      class: 'tslider__range',
    })
    // put it inside the track
    $track.append($range)
    // initialize the class
    this.range = new RangeView($range[0])

    // create the handle
    // TODO: read about type casting
    const $handle = $('<div>', {
      class: 'tslider__handle',
    })
    // put it inside the track
    $track.append($handle)
    // initialize the class
    this.handle = new HandleView($handle[0])
  }

  // These getters just duplicates the ones from the TrackView, so
  // TODO: find the way to remove these getters
  public get trackWidth() {
    return this.track.width
  }

  public get trackHeight() {
    return this.track.height
  }

  public set trackWidth(width) {
    this.track.width = width
  }

  public set trackHeight(height) {
    this.track.height = height
  }

  // TODO: position here is a Ratio (position) and a Point (newPosition), so it's better to give them different names
  public slideTo(position: RatioPoint, data: string): void {
    const newPosition: Point = {
      x: position.x * this.track.width,
      y: position.y * this.track.height,
    }

    // move the handle
    this.handle.move(newPosition)

    // update the target input's value
    this.targetInput.setValue(data)
  }

  public updateRange(
    width: number,
    height: number,
    position: RatioPoint
  ): void {
    this.range.draw(width, height, position)
  }

  public updateLabel(position: Point, data: number) {
    this.label.move(position)
    this.label.updateData(data.toString())
  }

  public get labelWidth() {
    return this.label.width
  }

  public set labelWidth(newWidth) {
    this.label.width = newWidth
  }

  public get labelHeight() {
    return this.label.height
  }

  public set labelHeight(newHeight) {
    this.label.height = newHeight
  }

  public onTrackClick(handler: (point: Point) => void): void {
    const handlerWrapper = (e: MouseEvent): any => {
      const x = e.clientX - this.track.positionX
      const y = e.clientY - this.track.positionY

      // filter out negative values of x
      if (x < 0) return

      // call handler only if click occurs on track or range
      const isTrack = e.target === this.track.$track[0]
      const isRange = e.target === this.range.$range[0]
      const correctTarget = isTrack || isRange

      if (correctTarget) handler({ x, y })
    }

    // TODO: find the way to attach an event handler with Jquery
    this.track.$track[0].addEventListener('click', handlerWrapper)
  }

  public handleDrag(handler: (point: Point) => void): void {
    const mouseMoveHandler = (e: MouseEvent): void => {
      const x = e.clientX - this.track.positionX
      const y = e.clientY - this.track.positionY

      // evaluate handler only if mouse is inside of horizontal or vertical track scope
      let isMousePositionValid
      if (this.orientation === 'horizontal') {
        const isMouseAfterLeftBoundry = x >= 0
        const isMouseBeforeRightBoundry = x <= this.track.width
        isMousePositionValid =
          isMouseAfterLeftBoundry && isMouseBeforeRightBoundry
      } else if (this.orientation === 'vetical') {
        const isMouseAfterTopBoundry = y >= 0
        const isMouseBeforeBottomBoundry = y <= this.track.height
        isMousePositionValid =
          isMouseAfterTopBoundry && isMouseBeforeBottomBoundry
      }

      if (isMousePositionValid) handler({ x, y })
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
