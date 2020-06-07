import { Orientation } from '../utils/aliases'
import Point from '../utils/Point'
import RatioPoint from '../utils/RatioPoint'
import Container from './Container'
import Handle from './Handle'
import Input from './Input'
import Label from './Label'
import LabelsContainer from './LabelsContainer'
import Range from './Range'
import Track from './Track'
import ViewOptions from './ViewOptions'

class View {
  private track: Track
  private range: Range
  private targetInput: Input
  private orientation: Orientation
  private container: Container
  private labelsContainer: LabelsContainer
  private handles: Handle[] = []
  private labels: Label[] = []

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
    this.labelsContainer = new LabelsContainer(
      'tslider__labels',
      this.orientation
    )
    this.range = new Range('tslider__range', this.orientation)

    // put it after the targetInput
    this.targetInput = new Input(this.options.targetInput)
    this.targetInput.$element.after(this.container.$elem)

    // this is the functional way to iterate when only finish number is given
    // for example, if length === 2, callback will be evaluated 2 times.
    // this code just generates labels and handles
    Array.from({ length: options.numberOfHandles }, () => {
      this.handles.push(new Handle('tslider__handle'))
      this.labels.push(new Label('tslider__label'))
    })

    // prettier-ignore
    this.container.add(
      this.track.add(
        this.labelsContainer.add(
          ...this.labels
        ),
        this.range,
        ...this.handles
      )
    )

    // set margin from track
    this.labelsContainer.setMarginFromTrack(this.options.labelMarginFromTrack)
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
    return this.labels[0].width
  }

  public get labelHeight() {
    return this.labels[0].height
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

  public slideTo(handlePositions: Point[]): void {
    // move the handles
    handlePositions.forEach((position, i) => {
      this.handles[i].move(position)
    })

    // // update the target input's value
    // this.targetInput.setValue(data)
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

  public updateLabels(positions: Point[], data: number[]) {
    positions.forEach((position, i) => {
      this.labels[i].move(position)
      this.labels[i].updateData(data[i].toString())
    })
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

      // TODO: probably these computations should be performed in Model
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

    // TODO: when first handle meet other handle, other handle's position should be the max position of first handle
    // when user pushes left button
    $root.mousedown((e) => {
      // if target is one of the handles, attach mousemove event
      this.handles.forEach((handle) => {
        if (e.target === handle.$elem[0]) {
          $root[0].addEventListener('mousemove', mouseMoveHandler)
        }
      })
    })

    // when user releases the button in any place, remove event
    $root.mouseup(() => {
      $root[0].removeEventListener('mousemove', mouseMoveHandler)
    })
  }
}

export default View
