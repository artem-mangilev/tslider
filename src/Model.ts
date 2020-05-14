import { SliderOptions } from './SliderOptions'

interface Model extends Subject {
  new (options: SliderOptions, trackSize: number): Model

  /* 
    Moves handle to selected position.
    Accepts the point on the track
  */
  moveHandle(trackPointX: number): void

  /* 
    Converts a number within the range to track point
  */
  rangeMemberToTrackPoint(rangeMember: number): number
}

class Model implements Model {
  private observers: Observer[]
  private currentHandlePosition: number
  private options: SliderOptions
  private maxMinDiff: number

  constructor(options: SliderOptions, trackSize: number, handleSize: number) {
    this.observers = []

    this.options = options
    this.currentHandlePosition = this.rangeMemberToTrackPoint(
      this.options.current
    )
    this.maxMinDiff = this.diff(this.options.max, this.options.min)
  }

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

  public moveHandle(trackPointX: number): void {}

  // public rangeMemberToTrackPoint(rangeMember: number): number {
  //   const diffWithMin: number = this.diff(rangeMember, this.options.min)
  // }

  private diff(bigger: number, smaller: number): number {
    if (bigger > smaller) {
      return bigger - smaller
    }

    throw new Error('First argument must be bigger than second')
  }
}

export default Model
