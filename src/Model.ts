import { Ratio, Orientation } from './aliases'
import Subject from './utils/Subject'
import ModelOptions from './ModelOptions'
import Point from './utils/Point'
import RatioPoint from './utils/RatioPoint'

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

    const middleOfTrack = this.options.trackHeight / 2

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
    return this.options.trackWidth / this.numberOfSteps
  }

  public moveHandle(targetPoint: Point): void {
    if (this.orientation === 'horizontal') {
      // if targetPointX closer to right boundry of step length, put handle to this boundry
      // otherwise put handle to left boundry
      const handleStep = Math.round(targetPoint.x / this.stepSegment)
      this.handlePosition.x =
        (handleStep / this.numberOfSteps) * this.trackWidth
    } else if (this.orientation === 'vetical') {
      const handleStep = Math.round(targetPoint.y / this.stepSegment)
      this.handlePosition.y =
        (handleStep / this.numberOfSteps) * this.trackHeight
    }

    this.notify()
  }

  // TODO: find the better name for function and argument
  private handlePositionToRatio(): Ratio {
    switch (this.orientation) {
      case 'horizontal':
        return this.handlePosition.x / this.trackWidth
      case 'vetical':
        return this.handlePosition.y / this.trackHeight
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
      const x: Ratio = this.dataToRatio(data) * this.trackWidth

      return { x, y: this.handlePosition.y }
    } else if (this.orientation === 'vetical') {
      const reversedDataRatio = 1 - this.dataToRatio(data)
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
      return this.handlePosition.x
    } else if (this.orientation === 'vetical') {
      return this.trackWidth
    }
  }

  public get rangeHeight(): number {
    if (this.orientation === 'horizontal') {
      return this.trackHeight
    } else if (this.orientation === 'vetical') {
      return this.trackHeight - this.handlePosition.y
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
