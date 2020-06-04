import Point from '../utils/Point'
import Handle from './Handle'
import Track from './Track'
import Range from './Range'
import Label from './Label'
import Input from './Input'
import { Orientation } from '../utils/aliases'
import ViewOptions from './ViewOptions'
import RatioPoint from '../utils/RatioPoint'
import LabelsContainer from './LabelsContainer'
import Container from './Container'

class View {
  private handle: Handle
  private track: Track
  private range: Range
  private label: Label
  private targetInput: Input
  private orientation: Orientation
  private container: Container
  private labels: LabelsContainer

  constructor(private options: ViewOptions) {
    this.orientation = options.orientation

    // TODO: probably tslider now doesn't make sense and creates unnesessary nesting, so it should be removed
    // create the following structure of slider
    // .tslider
    //   .tslider__track
    //     .tslider__labels
    //       .tslider__label
    //     .tslider__range
    //     .tslider__handle

    this.container = new Container('tslider')
    this.track = new Track('tslider__track')
    this.labels = new LabelsContainer('tslider__labels', this.orientation)
    this.label = new Label('tslider__label')
    this.range = new Range('tslider__range', this.orientation)
    this.handle = new Handle('tslider__handle')

    // put it after the targetInput
    this.targetInput = new Input(this.options.targetInput)
    this.targetInput.$element.after(this.container.$elem)

    // prettier-ignore
    this.container.add(
      this.track.add(
        this.labels.add(
          this.label
        ), 
        this.range,
        this.handle
      )
    )

    // set margin from track
    this.labels.setMarginFromTrack(this.options.labelMarginFromTrack)
  }

  public get containerWidth(): number {
    return this.container.width
  }

  public get containerHeight(): number {
    return this.container.height
  }

  // These getters just duplicates the ones from the Track, so
  // TODO: find the way to remove these getters
  public get trackWidth() {
    return this.track.width
  }

  public get trackHeight() {
    return this.track.height
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
