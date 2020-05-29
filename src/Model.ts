import { Ratio, Orientation } from './aliases'
import Subject from './utils/Subject'
import ModelOptions from './ModelOptions'
import Point from './utils/Point'
import TrackModel from './TrackModel'

// TODO: simplify implementation of switching the orientation
class Model extends Subject {
  public handlePosition: Point

  private options: ModelOptions
  private maxMinDiff: number
  private orientation: Orientation
  private track: TrackModel

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
    const middleOfTrack = this.track.height / 2

    this.handlePosition = {
      x: this.orientation === 'horizontal' ? 0 : middleOfTrack,
      y: this.orientation === 'horizontal' ? middleOfTrack : 0,
    }

    this.maxMinDiff = this.options.max - this.options.min
  }

  private get numberOfSteps(): number {
    return this.maxMinDiff / this.options.step
  }

  private get stepSegment(): number {
    return this.track.width / this.numberOfSteps
  }

  public moveHandle(targetPoint: Point): void {
    const { x,  y } = this.track.getAvailablePoint(
      targetPoint
    )

    this.handlePosition.x = x
    this.handlePosition.y = y

    this.notify()
  }

  // TODO: find the better name for function and argument
  private handlePositionToRatio(): Ratio {
    switch (this.orientation) {
      case 'horizontal':
        return this.handlePosition.x / this.track.width
      case 'vetical':
        return this.handlePosition.y / this.track.width
    }
  }

  get dataAmount(): number {
    switch (this.orientation) {
      case 'horizontal':
        return this.handlePositionToRatio() * this.maxMinDiff + this.options.min
      case 'vetical':
        const reversedHandlePosition: Ratio = 1 - this.handlePositionToRatio()
        return reversedHandlePosition * this.maxMinDiff + this.options.min
    }
  }

  private dataToRatio(data: number): Ratio {
    return (data - this.options.min) / this.maxMinDiff
  }

  public convertDataToPoint(data: number): Point {
    if (this.orientation === 'horizontal') {
      const x: Ratio = this.dataToRatio(data) * this.track.width

      return { x, y: this.handlePosition.y }
    } else if (this.orientation === 'vetical') {
      const reversedDataRatio = 1 - this.dataToRatio(data)
      const y: Ratio = reversedDataRatio * this.track.width

      return { x: this.handlePosition.x, y }
    }
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
