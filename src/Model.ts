import { SliderOptions } from './SliderOptions'
import { Ratio } from './aliases'
import Subject from './utils/Subject'

class Model extends Subject {
  public handlePositionX: Ratio
  public handlePositionY: Ratio

  private options: SliderOptions
  private maxMinDiff: number
  private trackWidth: number

  constructor(options: SliderOptions, trackWidth: number, trackHeight: number) {
    super()

    this.options = options

    this.handlePositionX
    this.handlePositionY

    this.trackWidth = trackWidth

    this.maxMinDiff = this.options.max - this.options.min
  }

  private get numberOfSteps(): number {
    return this.maxMinDiff / this.options.step
  }

  private get stepSegment(): number {
    return this.trackWidth / this.numberOfSteps
  }

  public moveHandle(targetPointX: number): void {
    // if targetPointX closer to right boundry of step length, put handle to this boundry
    // otherwise put handle to left boundry
    const handleStep = Math.round(targetPointX / this.stepSegment)
    this.handlePositionX = handleStep / this.numberOfSteps

    this.handlePositionY = 0.5

    this.notify()
  }

  get dataAmount(): number {
    return this.handlePositionX * this.maxMinDiff + this.options.min
  }

  public convertDataToPointX(data: number): number {
    return ((data - this.options.min) / this.maxMinDiff) * this.trackWidth
  }
}

export default Model
