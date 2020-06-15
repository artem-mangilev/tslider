import { OneDimensionalSpacePoint } from '../utils/aliases'
import Point from '../utils/Point'
import Container from './Container'
import Handle from './Handle'
import Input from './Input'
import Label from './Label'
import LabelsContainer from './LabelsContainer'
import Range from './Range'
import Track from './Track'
import ViewOptions from './ViewOptions'
import { Side } from '../OrientationOptions'

class View {
  private targetInput: Input

  // TODO: probably tslider now doesn't make sense and creates unnecessary nesting, so it should be removed
  // create the following structure of slider
  // .tslider
  //   .tslider__track
  //     .tslider__labels
  //       .tslider__label
  //     .tslider__range
  //     .tslider__handle

  private container: Container = new Container('tslider')
  private track: Track = new Track('tslider__track')
  private range: Range = new Range('tslider__range')
  private labelsContainer: LabelsContainer = new LabelsContainer(
    'tslider__labels'
  )
  private handles: Handle[] = []
  private labels: Label[] = []

  private longSide: Side
  private shortSide: Side

  constructor({
    targetInput,
    numberOfHandles,
    labelMarginFromTrack,
    orientationOption: { longSide, shortSide },
  }: ViewOptions) {
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

    // make properties from sides in order to use outside the constructor
    this.longSide = longSide
    this.shortSide = shortSide

    // cache the track height, in order to set it to the short side
    const height = this.track.height
    // draw the track according to orientation
    this.track[this.longSide] = this.container[this.longSide]
    this.track[this.shortSide] = height
  }

  public get trackLength(): number {
    return this.track[this.longSide]
  }

  public slideTo(handlePositions: OneDimensionalSpacePoint[]): void {
    // move the handles
    this.handles.forEach((handle, i) => {
      handle.move({
        x: handlePositions[i],
        y: this.track[this.shortSide] / 2,
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
