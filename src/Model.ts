import { Ratio, Orientation, OneDimensionalSpacePoint } from './aliases'
import Subject from './utils/Subject'
import ModelOptions from './ModelOptions'
import Point from './utils/Point'
import TrackModel from './TrackModel'
import HandleModel from './HandleModel'
import DataModel from './DataModel'

// TODO: simplify implementation of switching the orientation
class Model extends Subject {
  private options: ModelOptions
  private maxMinDiff: number
  private orientation: Orientation
  private track: TrackModel
  handle: HandleModel
  data: DataModel
  middleOfTrack: number

  constructor(options: ModelOptions) {
    super()

    this.options = options
    this.orientation = this.options.orientation

    // initialize track class
    this.track = new TrackModel(
      this.options.min,
      this.options.max,
      this.options.step,
      this.options.trackWidth,
      this.options.trackHeight
    )

    // middle of short side of the track,
    // handle position is static at thix axis
    this.middleOfTrack = this.track.height / 2

    // initialize the data
    this.data = new DataModel(
      this.options.min,
      this.options.max,
      this.orientation
    )

    this.maxMinDiff = this.options.max - this.options.min
  }

  public get handlePosition(): Point {
    return this.handle.position
  }

  public moveHandle(targetPoint: Point): void {
    const newHandlePosition = this.track.getAvailablePoint(
      this.handle.getActiveAxisPoint(targetPoint)
    )

    this.handle.move(newHandlePosition)

    this.notify()
  }

  get dataAmount(): number {
    const handlePositionRatio = this.track.pointToRatio(
      this.handle.currentPositionActiveAxis
    )

    return this.data.getAmount(
      this.orientation === 'horizontal'
        ? handlePositionRatio
        : 1 - handlePositionRatio
    )
  }

  private dataToRatio(data: number): Ratio {
    return (data - this.options.min) / this.maxMinDiff
  }

  public initHandleWithData(data: number): Point {
    const dataRatio =
      this.orientation === 'horizontal'
        ? this.dataToRatio(data)
        : 1 - this.dataToRatio(data)
    const point: OneDimensionalSpacePoint = dataRatio * this.track.width

    // TODO: make initialization less verbose 
    this.handle = new HandleModel(
      { x: 0, y: this.middleOfTrack },
      this.orientation
    )
    this.handle.move(point)

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

  private get labelWidth(): number {
    return this.options.labelWidth
  }

  private get labelHeight(): number {
    return this.options.labelHeight
  }

  public get labelPosition(): Point {
    if (this.orientation === 'horizontal') {
      const middle = this.labelWidth / 2
      return {
        x: this.handlePosition.x - middle,
        y: 0,
      }
    }
    const middle = this.labelHeight / 2
    return {
      x: 0,
      y: this.handlePosition.y - middle,
    }
  }
}

export default Model
