import { OneDimensionalSpacePoint, Ratio } from '../utils/aliases'

class Track {
  maxMinDiff: number
  stepSegment: number
  passiveLineMiddle: number

  constructor(
    private numberOfSteps: number,
    public width: number,
    public height: number
  ) {
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

export default Track
