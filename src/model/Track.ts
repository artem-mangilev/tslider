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

  private get leftBoundry(): number {
    return 0
  }

  private get rightBoundry(): number {
    return this.width
  }

  private isPointInBoundries(point: OneDimensionalSpacePoint): boolean {
    const isPointAfterLeftBoundry = point >= this.leftBoundry
    const isPointBeforeRightBoundry = point <= this.rightBoundry

    return isPointAfterLeftBoundry && isPointBeforeRightBoundry
  }

  private isPointBeforeLeftBoundry(point: OneDimensionalSpacePoint): boolean {
    return point <= this.leftBoundry
  }

  private isPointAfterRightBoundry(point: OneDimensionalSpacePoint): boolean {
    return point >= this.rightBoundry
  }

  public getAvailablePoint(
    point: OneDimensionalSpacePoint
  ): OneDimensionalSpacePoint {
    if (this.isPointInBoundries(point)) {
      const availablePointRatio: Ratio =
        this.getNearStep(point) / this.numberOfSteps
      const availablePoint: OneDimensionalSpacePoint =
        availablePointRatio * this.width

      return availablePoint
    } else if (this.isPointBeforeLeftBoundry(point)) {
      return this.leftBoundry
    } else if (this.isPointAfterRightBoundry(point)) {
      return this.rightBoundry
    }
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
