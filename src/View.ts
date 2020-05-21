import { Point } from './Point'
import HandleView from './HandleView'
import TrackView from './TrackView'
import RangeView from './RangeView'
import LabelView from './LabelView'
import InputView from './InputView'
import { Ratio } from './aliases'

class View {
  private handle: HandleView
  private track: TrackView
  private range: RangeView
  private label: LabelView
  private targetInput: InputView

  constructor(targetInput: HTMLInputElement) {
    this.targetInput = new InputView(targetInput)

    // create the following structure of slider
    // .tslider
    //   .tslider__labels
    //     .tslider__label
    //   .tslider__track
    //     .tslider__range
    //     .tslider__handle

    // TODO: find the more nice looking way to build this structure

    // create an container for slider
    const $sliderContainer: JQuery<HTMLElement> = $('<div>', {
      class: 'tslider',
    })
    // put it after the targetInput
    this.targetInput.$element.after($sliderContainer)

    // create the container for labels
    const $labelsContainer = $('<div>', {
      class: 'tslider__labels',
    })
    // put it inside the sliderContainer
    $sliderContainer.append($labelsContainer)

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
    $sliderContainer.append($track)
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

  // TODO: position here is a Ratio (position) and a Point (newPosition), so it's better to give them different names
  public slideTo(position: Ratio, data: string): void {
    const trackMiddle: Ratio = 0.5

    const newPosition: Point = {
      x: position * this.track.width,
      y: trackMiddle * this.track.height,
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

    // update the range
    this.range.draw(position)

    // update the target input's value
    this.targetInput.setValue(data)
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
