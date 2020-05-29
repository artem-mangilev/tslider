import { Orientation, OneDimensionalSpacePoint, Ratio } from './aliases'
import Point from './utils/Point'

class TrackModel {
  maxMinDiff: number
  numberOfSteps: number
  stepSegment: number
  passiveLineMiddle: number

  constructor(
    min: number,
    max: number,
    step: number,
    public width: number,
    public height: number,
    private orientation: Orientation
  ) {
    this.maxMinDiff = max - min
    this.numberOfSteps = this.maxMinDiff / step
    this.stepSegment = this.width / this.numberOfSteps
    this.passiveLineMiddle = this.height / 2

  }

  private getActiveAxisPoint(point: Point): OneDimensionalSpacePoint {
    return this.orientation === 'horizontal' ? point.x : point.y
  }

  private get activeAxisName(): string {
    return this.orientation === 'horizontal' ? 'x' : 'y'
  }

  private get passiveAxisName(): string {
    return this.orientation === 'horizontal' ? 'y' : 'x'
  }

  private getNearStep(point: OneDimensionalSpacePoint) {
    return Math.round(point / this.stepSegment)
  }

  // track decides which point is available for handle
  public getAvailablePoint(point: Point) {
    const activeAxis = this.getActiveAxisPoint(point)

    const availablePointRatio: Ratio =
      this.getNearStep(activeAxis) / this.numberOfSteps
    const availablePoint: OneDimensionalSpacePoint =
      availablePointRatio * this.width

    return {
      [this.activeAxisName]: availablePoint,
      [this.passiveAxisName]: this.passiveLineMiddle,
    }
  }
}

export default TrackModel
