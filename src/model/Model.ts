import { OneDimensionalSpacePoint, Orientation } from '../utils/aliases'
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
  private options: ModelOptions
  private orientation: Orientation
  private track: Track
  private handle: Handle
  private data: Data
  private label: Label
  private range: Range

  constructor(options: ModelOptions) {
    super()

    this.options = options
    this.orientation = this.options.orientation

    // initialize the data
    this.data = new Data(
      this.options.min,
      this.options.max,
      this.options.step,
      this.orientation
    )

    // initialize track class
    this.track = new Track(
      this.data.numberOfSteps,
      this.options.trackWidth,
      this.options.trackHeight
    )
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

  public get handlePosition(): Point {
    return this.handle.position
  }

  public get labelPosition(): Point {
    return this.label.position
  }

  public get rangeStartPosition(): Point {
    return this.range.startPosition
  }

  public initSlider(fromData: number, toData: number): void {
    const dataRatio = this.data.getAmountAsRatio(fromData)

    const x: OneDimensionalSpacePoint = dataRatio * this.track.width

    this.handle = new Handle({ x, y: this.track.height / 2 })

    this.label = new Label(
      this.options.labelWidth,
      this.options.labelHeight,
      { x, y: 0 },
      this.orientation
    )

    this.range = new Range(
      this.track.width,
      this.track.height,
      { x, y: 0 },
      this.orientation
    )

    this.notify(ModelUpdateTypes.Initialization)
  }

  // TODO: create different name for this method
  public moveHandle(targetPoint: Point): void {
    const availablePoint = this.track.getAvailablePoint(targetPoint.x)

    this.handle.move(availablePoint)

    this.label.move(availablePoint)

    this.range.startPosition = { x: availablePoint, y: 0 }

    this.notify(ModelUpdateTypes.Slide)
  }

  get dataAmount(): number {
    const handlePositionRatio = this.track.pointToRatio(this.handle.position.x)

    return this.data.getAmount(handlePositionRatio)
  }
}

export default Model
