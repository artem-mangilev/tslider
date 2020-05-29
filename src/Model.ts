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
      this.options.trackHeight,
      this.orientation
    )

    // middle of short side of the track,
    // handle position is static at thix axle
    this.middleOfTrack = this.track.height / 2

    // initialize the handle
    const handleInitialPosition = this.track.getAvailablePoint({
      x: 0,
      y: this.middleOfTrack,
    })
    this.handle = new HandleModel(handleInitialPosition)

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
    const newHandlePosition = this.track.getAvailablePoint(targetPoint)

    this.handle.position = newHandlePosition

    this.notify()
  }

  get dataAmount(): number {
    const handlePositionRatio = this.track.pointToRatio(this.handlePosition)

    return this.data.getAmount(
      this.orientation === 'horizontal'
        ? handlePositionRatio
        : 1 - handlePositionRatio
    )
  }

  private dataToRatio(data: number): Ratio {
    return (data - this.options.min) / this.maxMinDiff
  }

  public convertDataToHandlePoint(data: number): Point {
    if (this.orientation === 'horizontal') {
      const x: Ratio = this.dataToRatio(data) * this.track.width

      return { x, y: this.handle.position.y }
    } else if (this.orientation === 'vetical') {
      const reversedDataRatio = 1 - this.dataToRatio(data)
      const y: Ratio = reversedDataRatio * this.track.width

      return { x: this.handle.position.x, y }
    }

    // const dataRatio =
    //   this.orientation === 'horizontal'
    //     ? this.dataToRatio(data)
    //     : 1 - this.dataToRatio(data)
    // const point: OneDimensionalSpacePoint = dataRatio * this.track.width

    // return this.track.getAvailablePoint({
    //   x: point,
    //   y: this.middleOfTrack,
    // })
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
