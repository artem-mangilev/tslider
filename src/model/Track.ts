import { OneDimensionalSpacePoint, Ratio } from '../utils/aliases'
import Point from '../utils/Point'

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

  // TODO: improve naming
  public getClothestPointIndex(
    targetPoint: OneDimensionalSpacePoint,
    points: OneDimensionalSpacePoint[]
  ): number {
    const firstPointIndex: number = 0
    const lastPointIndex: number = points.length - 1

    const firstPoint: number = points[firstPointIndex]
    const lastPoint: number = points[lastPointIndex]

    const firstLastMiddle: number = (lastPoint + firstPoint) / 2

    const isTargetPointBeforeFirstPoint: boolean = targetPoint < firstPoint
    const isTargetPointAfterLastPoint: boolean = lastPoint < targetPoint
    const isTargetPointBetweenPoints: boolean =
      targetPoint > firstPoint && targetPoint < lastPoint
    const isTargetPointCloserToFirstPoint: boolean =
      isTargetPointBetweenPoints && targetPoint < firstLastMiddle
    const isTargetPointCloserToLastPoint: boolean =
      isTargetPointBetweenPoints && targetPoint > firstLastMiddle

    if (isTargetPointBeforeFirstPoint || isTargetPointCloserToFirstPoint) {
      return firstPointIndex
    } else if (isTargetPointAfterLastPoint || isTargetPointCloserToLastPoint) {
      return lastPointIndex
    }
  }

  public pointToRatio(point: OneDimensionalSpacePoint): Ratio {
    return point / this.width
  }
}

export default Track
