import { Ratio, Orientation, OneDimensionalSpacePoint } from './aliases'
import Subject from './utils/Subject'
import ModelOptions from './ModelOptions'
import Point from './utils/Point'
import TrackModel from './TrackModel'
import HandleModel from './HandleModel'
import DataModel from './DataModel'
import LabelModel from './LabelModel'
import RangeModel from './RangeModel'

// TODO: simplify implementation of switching the orientation
class Model extends Subject {
  private options: ModelOptions
  private orientation: Orientation
  private track: TrackModel
  private handle: HandleModel
  private data: DataModel
  private label: LabelModel
  private range: RangeModel

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

    this.range.startPosition = { x: availablePoint, y: 0 }

    this.notify()
  }

  get dataAmount(): number {
    const handlePositionRatio = this.track.pointToRatio(this.handle.position.x)

    return this.data.getAmount(handlePositionRatio)
  }

  public initSlider(data: number): void {
    const dataRatio = this.data.getAmountAsRatio(data)

    const x: OneDimensionalSpacePoint = dataRatio * this.track.width

    this.handle = new HandleModel({ x, y: this.track.height / 2 })

    this.label = new LabelModel(
      this.options.labelWidth,
      this.options.labelHeight,
      { x, y: 0 },
      this.orientation
    )

    this.range = new RangeModel(
      this.track.width,
      this.track.height,
      { x, y: 0 },
      this.orientation
    )

    this.notify()
  }

  public get trackWidth(): number {
    return this.track.width
  }

  
  public get trackHeight() : number {
    return this.track.height
  }
  

  public get rangeWidth(): number {
    return this.range.width
  }

  public get rangeHeight(): number {
    return this.range.height
  }

  public get rangeStartPosition(): Point {
    return this.range.startPosition
  }
}

export default Model
