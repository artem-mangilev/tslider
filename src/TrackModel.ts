import { OneDimensionalSpacePoint, Ratio } from './aliases'

// TODO: probably this class could work without knowledge about min, max and step values (if use ratio)
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
