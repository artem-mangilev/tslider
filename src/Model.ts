import { SliderOptions } from './SliderOptions'

class Model implements Subject {
  public currentHandlePositionX: number
  private options: SliderOptions
  private maxMinDiff: number
  private trackWidth: number

  constructor(options: SliderOptions, trackWidth: number, handleSize: number) {
    this.options = options
    this.currentHandlePositionX = 0
    this.maxMinDiff = this.diff(this.options.max, this.options.min)
    this.trackWidth = trackWidth  
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

  // public rangeMemberToTrackPoint(rangeMember: number): number {
  //   const diffWithMin: number = this.diff(rangeMember, this.options.min)
  // }

  private diff(bigger: number, smaller: number): number {
    if (bigger > smaller) {
      return bigger - smaller
    }

    throw new Error('First argument must be bigger than second')
  }

  get numberOfSteps(): number {
    return this.options.max / this.options.step
  }

  get stepSegment(): number {
    return this.trackWidth / this.numberOfSteps
  }

  public handlePositionRatioX(targetPointX: number): void {
    // if targetPointX closer to right boundry of step length, put handle to this boundry
    // otherwise put handle to left boundry
    const handleStep = Math.round(targetPointX / this.stepSegment)

    this.currentHandlePositionX = handleStep / this.numberOfSteps

    this.notify()
  }
}

export default Model
