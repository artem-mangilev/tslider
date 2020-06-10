import { OneDimensionalSpacePoint, Ratio } from '../utils/aliases'
import Point from '../utils/Point'
import Subject from '../utils/Subject'
import Data from './Data'
import Handle from './Handle'
import Label from './Label'
import ModelOptions from './ModelOptions'
import { ModelUpdateTypes } from './ModelUpdateTypes'
import Range from './Range'
import Track from './Track'

// TODO: simplify implementation of switching the orientation
class Model extends Subject {
  private track: Track
  private data: Data
  private range: Range
  private handles: Handle[] = []
  private labels: Label[] = []

  constructor(private options: ModelOptions) {
    super()
  }

  public get trackWidth(): number {
    return this.track.width
  }

  public get trackHeight(): number {
    return this.track.height
  }

  public get rangeWidth(): number {
    return this.range.width
  }

  public get rangeHeight(): number {
    return this.range.height
  }

  public get handlePositions(): Point[] {
    return this.handles.map((handle) => handle.position)
  }

  public get labelPositions(): Point[] {
    return this.labels.map((label) => label.position)
  }

  public get rangeStartPosition(): Point {
    return this.range.startPosition
  }

  public initSlider(handlesData: number[]): void {
    // initialize the data
    this.data = new Data(
      this.options.min,
      this.options.max,
      this.options.step,
      this.options.orientation
    )

    // initialize track class
    this.track = new Track(
      this.data.numberOfSteps,
      this.options.trackWidth,
      this.options.trackHeight
    )

    handlesData.forEach((data) => {
      const dataRatio = this.data.getAmountAsRatio(data)

      const x: OneDimensionalSpacePoint = dataRatio * this.track.width

      this.handles.push(new Handle({ x, y: this.track.height / 2 }))

      this.labels.push(
        new Label(
          this.options.labelWidth,
          this.options.labelHeight,
          { x, y: 0 },
          this.options.orientation
        )
      )
    })

    this.track.registerHandles(this.handles)

    // this.range = new Range(
    //   this.track.width,
    //   this.track.height,
    //   { x, y: 0 },
    //   this.orientation
    // )

    this.notify(ModelUpdateTypes.Initialization)
  }

  // TODO: create different name for this method
  public moveHandle(targetPoint: Point, handleIndex?: number): void {
    let activeHandleIndex
    // these conditions help the Model to decide how to act when user drags particular handle
    // or just click on some area of the track
    if (handleIndex !== undefined) {
      activeHandleIndex = handleIndex

      this.track.setActiveHandle(this.handles[activeHandleIndex])
    } else {
      this.track.setActiveHandle(null)
      // decide which handle should move to this point
      activeHandleIndex = this.track.getClothestPointIndex(targetPoint.x)
    }

    const availablePoint = this.track.getAvailablePoint(targetPoint.x)

    this.handles[activeHandleIndex].move(availablePoint)

    this.labels[activeHandleIndex].move(availablePoint)

    // this.range.startPosition = { x: availablePoint, y: 0 }

    this.notify(ModelUpdateTypes.Slide)
  }

  get dataAmount(): number[] {
    const handlePositionRatios: Ratio[] = this.handlePositions.map((position) =>
      this.track.pointToRatio(position.x)
    )

    return handlePositionRatios.map((ratio) => this.data.getAmount(ratio))
  }
}

export default Model
