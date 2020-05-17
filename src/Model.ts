import { SliderOptions } from './SliderOptions'

class Model implements Subject {
  public handlePositionRatioX: number
  public handlePositionRatioY: number

  private options: SliderOptions
  private maxMinDiff: number
  private trackWidth: number

  constructor(options: SliderOptions, trackWidth: number, trackHeight: number) {
    this.options = options

    this.handlePositionRatioX
    this.handlePositionRatioY

    this.trackWidth = trackWidth

    this.maxMinDiff = this.options.max - this.options.min
  }

  // --- start of Subject functionality (Observer pattern) ---

  private observers: Observer[] = []

  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer)
    if (isExist) {
      return console.log('Subject: Observer has been attached already.')
    }

    console.log('Subject: Attached an observer.')
    this.observers.push(observer)
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer)
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.')
    }

    this.observers.splice(observerIndex, 1)
    console.log('Subject: Detached an observer.')
  }

  public notify(): void {
    console.log('Subject: Notifying observers...')
    for (const observer of this.observers) {
      observer.update(this)
    }
  }

  // --- end of Subject functionality ---

  get numberOfSteps(): number {
    return this.maxMinDiff / this.options.step
  }

  get stepSegment(): number {
    return this.trackWidth / this.numberOfSteps
  }

  public moveHandle(targetPointX: number): void {
    // if targetPointX closer to right boundry of step length, put handle to this boundry
    // otherwise put handle to left boundry
    const handleStep = Math.round(targetPointX / this.stepSegment)
    this.handlePositionRatioX = handleStep / this.numberOfSteps

    this.handlePositionRatioY = 0.5

    this.notify()
  }

  get dataAmount(): number {
    return this.handlePositionRatioX * this.maxMinDiff + this.options.min
  }
}

export default Model
