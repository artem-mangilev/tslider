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

  public getClothestPointIndex(
    targetPoint: OneDimensionalSpacePoint,
    points: OneDimensionalSpacePoint[]
  ): OneDimensionalSpacePoint {
    const firstPointIndex = 0
    const lastPointIndex = points.length - 1

    const firstPoint = points[firstPointIndex]
    const lastPoint = points[lastPointIndex]

    const firstLastMiddle = (lastPoint - firstPoint) / 2

    const isTargetPointBeforeFirstPoint = targetPoint < firstPoint
    const isTargetPointAfterLastPoint = lastPoint < targetPoint
    const isTargetPointBetweenPoints =
      targetPoint > firstPoint && targetPoint < lastPoint
    const isTargetPointCloserToFirstPoint =
      isTargetPointBetweenPoints && targetPoint < firstLastMiddle
    const isTargetPointCloserToLastPoint =
      isTargetPointBetweenPoints && targetPoint > firstLastMiddle

    if (isTargetPointBeforeFirstPoint) {
      return firstPointIndex
    }

    if (isTargetPointAfterLastPoint) {
      return lastPointIndex
    }

    if (isTargetPointCloserToFirstPoint) {
      return firstPointIndex
    }

    if (isTargetPointCloserToLastPoint) {
      return lastPointIndex
    }
  }

  public pointToRatio(point: OneDimensionalSpacePoint): Ratio {
    return point / this.width
  }
}

export default Track
