import { Orientation, OneDimensionalSpacePoint } from '../utils/aliases'
import Point from '../utils/Point'
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
  private container: Container
  private labelsContainer: LabelsContainer
  private handles: Handle[] = []
  private labels: Label[] = []

  constructor({
    targetInput,
    numberOfHandles,
    labelMarginFromTrack,
  }: ViewOptions) {
    // TODO: probably tslider now doesn't make sense and creates unnecessary nesting, so it should be removed
    // create the following structure of slider
    // .tslider
    //   .tslider__track
    //     .tslider__labels
    //       .tslider__label
    //     .tslider__range
    //     .tslider__handle

    this.container = new Container('tslider')
    this.track = new Track('tslider__track')
    this.labelsContainer = new LabelsContainer('tslider__labels')
    this.range = new Range('tslider__range')

    // put it after the targetInput
    this.targetInput = new Input(targetInput)
    this.targetInput.$element.after(this.container.$elem)

    // this is the functional way to iterate when only finish number is given
    // for example, if length === 2, callback will be evaluated 2 times.
    // this code just generates labels and handles
    Array.from({ length: numberOfHandles }, () => {
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
    this.labelsContainer.setMarginFromTrack(labelMarginFromTrack)
  }

  public get containerWidth(): number {
    return this.container.width
  }

  public get containerHeight(): number {
    return this.container.height
  }

  public slideTo(handlePositions: OneDimensionalSpacePoint[]): void {
    // move the handles
    this.handles.forEach((handle, i) => {
      handle.move({
        x: handlePositions[i],
        y: this.track.height / 2,
      })
    })

    // // update the target input's value
    // this.targetInput.setValue(data)
  }

  public updateRange(length: number, position: OneDimensionalSpacePoint): void {
    this.range.draw(length, this.range.height, position)
  }

  public updateLabels(positions: OneDimensionalSpacePoint[], data: number[]) {
    this.labels.forEach((label, i) => {
      label.move({ x: positions[i], y: 0 })

      label.updateData(data[i].toString())
    })
  }

  private trackClickHandlerWrapper(
    handler: (point: Point) => void
  ): (event: MouseEvent) => void {
    return (e) => {
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
  }

  public onTrackClick(handler: (point: Point) => void): void {
    // TODO: find the way to attach an event handler with Jquery
    this.track.$elem[0].addEventListener(
      'click',
      this.trackClickHandlerWrapper(handler)
    )
  }

  private handleDragHandlerWrapper(
    handler: (point: Point, handleIndex: number) => void,
    handleIndex: number
  ): (event: MouseEvent) => void {
    return (e) => {
      const x = e.clientX - this.track.positionX
      const y = e.clientY - this.track.positionY

      handler({ x, y }, handleIndex)
    }
  }

  public onHandleDrag(
    handler: (point: Point, handleIndex: number) => void
  ): void {
    let dragHandler: (event: MouseEvent) => void

    const $root = $('html')

    $root.mousedown(({ target }) => {
      // if target is one of the handles, attach mousemove event
      this.handles.forEach((handle, i) => {
        if (target === handle.$elem[0]) {
          dragHandler = this.handleDragHandlerWrapper(handler, i)

          $root[0].addEventListener('mousemove', dragHandler)
        }
      })
    })

    // when user releases the button in any place, remove event
    $root.mouseup(() => {
      $root[0].removeEventListener('mousemove', dragHandler)
    })
  }
}

export default View
