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
    public height: number
  ) {
    this.maxMinDiff = max - min
    this.numberOfSteps = this.maxMinDiff / step
    this.stepSegment = this.width / this.numberOfSteps
  }

  private getNearStep(point: OneDimensionalSpacePoint) {
    return Math.round(point / this.stepSegment)
  }

  public getAvailablePoint(
    point: OneDimensionalSpacePoint
  ): OneDimensionalSpacePoint {
    const availablePointRatio: Ratio =
      this.getNearStep(point) / this.numberOfSteps
    const availablePoint: OneDimensionalSpacePoint =
      availablePointRatio * this.width

    return availablePoint
  }

  public pointToRatio(point: OneDimensionalSpacePoint): Ratio {
    return point / this.width
  }
}

export default TrackModel
