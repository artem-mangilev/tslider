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
import { Side, Axis, Direction } from '../OrientationOptions'

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
  private labelsContainer: LabelsContainer
  private handles: Handle[] = []
  private labels: Label[] = []

  private longSide: Side
  private shortSide: Side
  private x: Axis
  private y: Axis
  private direction: Direction

  constructor({
    targetInput,
    numberOfHandles,
    orientationOption: { orientation, longSide, shortSide, x, y, direction },
  }: ViewOptions) {
    const labelsContainerClasses = `tslider__labels tslider__labels_${orientation}`
    this.labelsContainer = new LabelsContainer(labelsContainerClasses)

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

    // make properties from sides in order to use outside the constructor
    this.longSide = longSide
    this.shortSide = shortSide

    // cache the track height, in order to set it to the short side
    const height = this.track.height
    // draw the track according to orientation
    this.track[this.longSide] = this.container[this.longSide]
    this.track[this.shortSide] = height

    this.x = x
    this.y = y

    this.direction = direction
  }

  public get trackLength(): number {
    return this.track[this.longSide]
  }

  public slideTo(handlePositions: OneDimensionalSpacePoint[]): void {
    const newHandlePositions = handlePositions.map((position) =>
      // TODO: now I have no clue how type checking works for computed properties, so I just turn it off
      // @ts-ignore
      this.changeDirection({
        [this.x]: position,
        [this.y]: this.track[this.shortSide] / 2,
      })
    )
    // move the handles
    newHandlePositions.forEach((position, i) => this.handles[i].move(position))

    // // update the target input's value
    // this.targetInput.setValue(data)
  }

  public updateRange(positions: OneDimensionalSpacePoint[]): void {
    const [startPosition, endPosition] = positions

    const length = endPosition - startPosition

    this.range[this.longSide] = length
    this.range[this.shortSide] = this.track[this.shortSide]

    const [validStartPosition] = positions
      // we need to figure out the positions of the range point according to orientation
      .map((position) =>
        // @ts-ignore
        this.changeDirection({ [this.x]: position, [this.y]: 0 })
      )
      // then decide what is actual start position 
      .sort((a, b) => a[this.x] - b[this.x])

    this.range.move(validStartPosition)
  }

  public updateLabels(positions: OneDimensionalSpacePoint[], data: number[]) {
    this.labels.forEach((label, i) => {
      // @ts-ignore
      const position = this.changeDirection({
        [this.x]: positions[i],
        [this.y]: 0,
      })

      // label should be placed in the middle of handle
      const middle = label[this.longSide] / 2
      position[this.x] -= middle

      label.move(position)
      label.updateData(data[i].toString())
    })
  }

  private trackClickHandlerWrapper(
    handler: (point: OneDimensionalSpacePoint) => void
  ): (event: MouseEvent) => void {
    return (e) => {
      const position = this.changeDirection({
        x: e.clientX - this.track.positionX,
        y: e.clientY - this.track.positionY,
      })

      // filter out negative values of x
      if (position[this.x] < 0) return

      // call handler only if click occurs on track or range
      const isTrack = e.target === this.track.$elem[0]
      const isRange = e.target === this.range.$elem[0]
      const correctTarget = isTrack || isRange

      if (correctTarget) handler(position[this.x])
    }
  }

  private changeDirection(point: Point): Point {
    switch (this.direction) {
      case 'left-to-right':
        // @ts-ignore
        return {
          [this.x]: point[this.x],
          [this.y]: point[this.y],
        }
      case 'bottom-to-top':
        // @ts-ignore
        return {
          [this.x]: this.track[this.longSide] - point[this.x],
          [this.y]: point[this.y],
        }
    }
  }

  public onTrackClick(
    handler: (point: OneDimensionalSpacePoint) => void
  ): void {
    // TODO: find the way to attach an event handler with Jquery
    this.track.$elem[0].addEventListener(
      'click',
      this.trackClickHandlerWrapper(handler)
    )
  }

  private handleDragHandlerWrapper(
    handler: (point: OneDimensionalSpacePoint, handleIndex: number) => void,
    handleIndex: number
  ): (event: MouseEvent) => void {
    return (e) => {
      const position: Point = this.changeDirection({
        x: e.clientX - this.track.positionX,
        y: e.clientY - this.track.positionY,
      })

      handler(position[this.x], handleIndex)
    }
  }

  public onHandleDrag(
    handler: (point: OneDimensionalSpacePoint, handleIndex: number) => void
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
