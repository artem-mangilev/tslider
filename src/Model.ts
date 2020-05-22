import { Ratio } from './aliases'
import Subject from './utils/Subject'
import ModelOptions from './ModelOptions'

// TODO: the model should compute coorditates according to orientation
class Model extends Subject {
  public handlePosition: Ratio

  private options: ModelOptions
  private maxMinDiff: number

  constructor(options: ModelOptions) {
    super()

    this.options = options

    this.handlePosition

    this.maxMinDiff = this.options.max - this.options.min
  }

  private get numberOfSteps(): number {
    return this.maxMinDiff / this.options.step
  }

  private get stepSegment(): number {
    return this.options.trackWidth / this.numberOfSteps
  }

  public moveHandle(targetPoint: number): void {
    // if targetPointX closer to right boundry of step length, put handle to this boundry
    // otherwise put handle to left boundry
    const handleStep = Math.round(targetPoint / this.stepSegment)
    this.handlePosition = handleStep / this.numberOfSteps

    this.notify()
  }

  get dataAmount(): number {
    return this.handlePosition * this.maxMinDiff + this.options.min
  }

  public convertDataToPointX(data: number): number {
    return (
      ((data - this.options.min) / this.maxMinDiff) * this.options.trackWidth
    )
  }
}

export default Model
