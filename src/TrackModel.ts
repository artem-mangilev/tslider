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

  private getPassiveAxisPoint(point: Point): OneDimensionalSpacePoint {
    return this.orientation === 'horizontal' ? point.y : point.x
  }

  private getNearStep(point: OneDimensionalSpacePoint) {
    return Math.round(point / this.stepSegment)
  }

  // track decides which point is available for handle
  public getAvailablePoint(point: Point): Point {
    const activeAxis = this.getActiveAxisPoint(point)
    const passiveAxis = this.getPassiveAxisPoint(point)

    const availablePointRatio: Ratio =
      this.getNearStep(activeAxis) / this.numberOfSteps
    const availablePoint: OneDimensionalSpacePoint =
      availablePointRatio * this.width

    return {
      x:
        this.orientation === 'horizontal'
          ? availablePoint
          : this.passiveLineMiddle,
      y:
        this.orientation === 'horizontal'
          ? this.passiveLineMiddle
          : availablePoint,
    }
  }

  public pointToRatio(point: Point): Ratio {
    return this.getActiveAxisPoint(point) / this.width
  }
}

export default TrackModel
