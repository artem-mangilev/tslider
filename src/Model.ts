import { Ratio, Orientation } from './aliases'
import Subject from './utils/Subject'
import ModelOptions from './ModelOptions'
import Point from './utils/Point'
import RatioPoint from './utils/RatioPoint'
import TrackModel from './TrackModel'

// TODO: simplify implementation of switching the orientation
class Model extends Subject {
  public handlePosition: RatioPoint

  private options: ModelOptions
  private maxMinDiff: number
  private orientation: Orientation

  constructor(options: ModelOptions) {
    super()

    this.options = options
    this.orientation = this.options.orientation

    this.handlePosition = {
      x: this.orientation === 'horizontal' ? 0 : 0.5,
      y: this.orientation === 'horizontal' ? 0.5 : 0,
    }

    this.maxMinDiff = this.options.max - this.options.min
  }

  private get numberOfSteps(): number {
    return this.maxMinDiff / this.options.step
  }

  private get stepSegment(): number {
    return this.options.trackWidth / this.numberOfSteps
  }

  public moveHandle(targetPoint: Point): void {
    if (this.orientation === 'horizontal') {
      // if targetPointX closer to right boundry of step length, put handle to this boundry
      // otherwise put handle to left boundry
      const handleStep = Math.round(targetPoint.x / this.stepSegment)
      this.handlePosition.x = handleStep / this.numberOfSteps
    } else if (this.orientation === 'vetical') {
      const handleStep = Math.round(targetPoint.y / this.stepSegment)
      this.handlePosition.y = handleStep / this.numberOfSteps
    }

    this.notify()
  }

  get dataAmount(): number {
    if (this.orientation === 'horizontal') {
      return this.handlePosition.x * this.maxMinDiff + this.options.min
    } else if (this.orientation === 'vetical') {
      const reversedHandlePositionY: Ratio = 1 - this.handlePosition.y
      return reversedHandlePositionY * this.maxMinDiff + this.options.min
    }
  }

  public convertDataToPoint(data: number): RatioPoint {
    if (this.orientation === 'horizontal') {
      const x: Ratio =
        ((data - this.options.min) / this.maxMinDiff) * this.trackWidth

      return { x, y: this.handlePosition.y }
    } else if (this.orientation === 'vetical') {
      const reversedDataRatio = 1 - (data - this.options.min) / this.maxMinDiff
      const y: Ratio = reversedDataRatio * this.trackHeight

      return { x: this.handlePosition.x, y }
    }
  }

  public get trackWidth() {
    return this.orientation === 'horizontal'
      ? this.options.trackWidth
      : this.options.trackHeight
  }

  public get trackHeight() {
    return this.orientation === 'horizontal'
      ? this.options.trackHeight
      : this.options.trackWidth
  }

  public get rangeWidth(): number {
    if (this.orientation === 'horizontal') {
      return this.handlePosition.x * this.trackWidth
    } else if (this.orientation === 'vetical') {
      return this.trackWidth
    }
  }

  public get rangeHeight(): number {
    if (this.orientation === 'horizontal') {
      return this.trackHeight
    } else if (this.orientation === 'vetical') {
      const invertedHandlePositionY: Ratio = 1 - this.handlePosition.y
      return invertedHandlePositionY * this.trackHeight
    }
  }

  public get rangeStartPosition(): Point {
    if (this.orientation === 'horizontal') {
      return {
        x: 0,
        y: 0,
      }
    } else if (this.orientation === 'vetical') {
      return {
        x: 0,
        y: this.handlePosition.y * this.trackHeight,
      }
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
        x: this.handlePosition.x * this.trackWidth - middle,
        y: 0,
      }
    }
    const middle = this.labelHeight / 2
    return {
      x: 0,
      y: this.handlePosition.y * this.trackHeight - middle,
    }
    // TODO: implement vertical label position
  }
}

export default Model
