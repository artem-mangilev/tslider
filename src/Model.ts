import { Ratio, Orientation, OneDimensionalSpacePoint } from './aliases'
import Subject from './utils/Subject'
import ModelOptions from './ModelOptions'
import Point from './utils/Point'
import TrackModel from './TrackModel'
import HandleModel from './HandleModel'
import DataModel from './DataModel'
import LabelModel from './LabelModel'

// TODO: simplify implementation of switching the orientation
class Model extends Subject {
  private options: ModelOptions
  private orientation: Orientation
  private track: TrackModel
  private handle: HandleModel
  private data: DataModel
  private label: LabelModel

  constructor(options: ModelOptions) {
    super()

    this.options = options
    this.orientation = this.options.orientation

    // initialize the data
    this.data = new DataModel(
      this.options.min,
      this.options.max,
      this.options.step,
      this.orientation
    )

    // initialize track class
    this.track = new TrackModel(
      this.data.numberOfSteps,
      this.options.trackWidth,
      this.options.trackHeight
    )
  }

  public get handlePosition(): Point {
    return this.handle.position
  }

  public get labelPosition(): Point {
    return this.label.position
  }

  // TODO: create different name for this method
  public moveHandle(targetPoint: Point): void {
    const availablePoint = this.track.getAvailablePoint(targetPoint.x)

    this.handle.move(availablePoint)

    this.label.move(availablePoint)

    this.notify()
  }

  get dataAmount(): number {
    const handlePositionRatio = this.track.pointToRatio(this.handle.position.x)

    return this.data.getAmount(handlePositionRatio)
  }

  // TODO: create different name for this method
  public initHandleWithData(data: number): Point {
    const dataRatio = this.data.getAmountAsRatio(data)

    const x: OneDimensionalSpacePoint = dataRatio * this.track.width

    this.handle = new HandleModel({ x, y: this.track.height / 2 })

    this.label = new LabelModel(
      this.options.labelWidth,
      this.options.labelHeight,
      { x, y: 0 },
      this.orientation
    )

    // TODO: probably returned value isn't expected from method with this name
    return this.handle.position
  }

  public get rangeWidth(): number {
    return this.orientation === 'horizontal'
      ? this.handle.position.x
      : this.track.width - this.handle.position.x
  }

  public get rangeHeight(): number {
    return this.track.height
  }

  public get rangeStartPosition(): Point {
    if (this.orientation === 'horizontal') {
      return { x: 0, y: 0 }
    } else if (this.orientation === 'vetical') {
      return { x: 0, y: this.handle.position.x }
    }
  }
}

export default Model
