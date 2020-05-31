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
    const newHandlePosition = this.track.getAvailablePoint(
      this.handle.getActiveAxisPoint(targetPoint)
    )

    this.handle.move(newHandlePosition)

    this.label.move(newHandlePosition)

    this.notify()
  }

  get dataAmount(): number {
    const handlePositionRatio = this.track.pointToRatio(
      this.handle.currentPositionActiveAxis
    )

    return this.data.getAmount(handlePositionRatio)
  }

  // TODO: create different name for this method
  public initHandleWithData(data: number): Point {
    const dataRatio = this.data.getAmountAsRatio(data)

    const x: OneDimensionalSpacePoint = dataRatio * this.track.width

    // TODO: handle and label has simular switching coordinate algorithm,
    // so it could be separated somehow in order to avoid code duplication
    this.handle = new HandleModel(
      { x, y: this.track.height / 2 },
      this.orientation
    )

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
    if (this.orientation === 'horizontal') {
      return this.handlePosition.x
    } else if (this.orientation === 'vetical') {
      return this.track.height
    }
  }

  public get rangeHeight(): number {
    if (this.orientation === 'horizontal') {
      return this.track.height
    } else if (this.orientation === 'vetical') {
      return this.track.width - this.handlePosition.y
    }
  }

  public get rangeStartPosition(): Point {
    if (this.orientation === 'horizontal') {
      return { x: 0, y: 0 }
    } else if (this.orientation === 'vetical') {
      return { x: 0, y: this.handlePosition.y }
    }
  }
}

export default Model
