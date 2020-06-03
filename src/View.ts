import Point from './utils/Point'
import HandleView from './HandleView'
import TrackView from './TrackView'
import RangeView from './RangeView'
import LabelView from './LabelView'
import InputView from './InputView'
import { Orientation } from './aliases'
import ViewOptions from './ViewOptions'
import RatioPoint from './utils/RatioPoint'
import LabelsContainerView from './LabelsContainerView'
import ContainerView from './ContainerView'

class View {
  private handle: HandleView
  private track: TrackView
  private range: RangeView
  private label: LabelView
  private targetInput: InputView
  private orientation: Orientation
  private container: ContainerView
  private labels: LabelsContainerView

  constructor(options: ViewOptions) {
    this.orientation = options.orientation

    // TODO: probably tslider now doesn't make sense and creates unnesessary nesting, so it should be removed
    // create the following structure of slider
    // .tslider
    //   .tslider__track
    //     .tslider__labels
    //       .tslider__label
    //     .tslider__range
    //     .tslider__handle

    this.container = new ContainerView('tslider')
    this.track = new TrackView('tslider__track')
    this.labels = new LabelsContainerView('tslider__labels', this.orientation)
    this.label = new LabelView('tslider__label')
    this.range = new RangeView('tslider__range', this.orientation)
    this.handle = new HandleView('tslider__handle')

    // put it after the targetInput
    this.targetInput = new InputView(options.targetInput)
    this.targetInput.$element.after(this.container.$elem)

    // prettier-ignore
    this.container.childs(
      this.track.childs(
        this.labels.childs(
          this.label
        ), 
        this.range,
        this.handle
      )
    )

    // set margin from track
    this.labels.setMarginFromTrack(options.labelMarginFromTrack)
  }

  public get containerWidth(): number {
    return this.container.width
  }

  public get containerHeight(): number {
    return this.container.height
  }

  // These getters just duplicates the ones from the TrackView, so
  // TODO: find the way to remove these getters
  public get trackWidth() {
    return this.track.width
  }

  public get trackHeight() {
    return this.track.height
  }

  public drawTrack(width: number, height: number): void {
    switch (this.orientation) {
      case 'horizontal':
        this.track.width = width
        this.track.height = height
        break
      case 'vetical':
        this.track.width = height
        this.track.height = width
    }
  }

  public slideTo(position: Point, data: string): void {
    // move the handle
    this.handle.move(position)

    // update the target input's value
    this.targetInput.setValue(data)
  }

  public updateRange(
    width: number,
    height: number,
    position: RatioPoint
  ): void {
    switch (this.orientation) {
      case 'horizontal':
        this.range.draw(width, height, position)
        break
      case 'vetical':
        this.range.draw(height, width, position)
        break
    }
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
      const isTrack = e.target === this.track.$elem[0]
      const isRange = e.target === this.range.$elem[0]
      const correctTarget = isTrack || isRange

      if (correctTarget) handler({ x, y })
    }

    // TODO: find the way to attach an event handler with Jquery
    this.track.$elem[0].addEventListener('click', handlerWrapper)
  }

  public handleDrag(handler: (point: Point) => void): void {
    const mouseMoveHandler = (e: MouseEvent): void => {
      const x = e.clientX - this.track.positionX
      const y = e.clientY - this.track.positionY

      // TODO: handle could move outside the track, should be fixed
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
      if (e.target === this.handle.$elem[0]) {
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
