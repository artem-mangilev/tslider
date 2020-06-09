import { OneDimensionalSpacePoint, Ratio } from '../utils/aliases'
import Point from '../utils/Point'
import Handle from './Handle'

class Track {
  maxMinDiff: number
  stepSegment: number
  passiveLineMiddle: number
  handles: Handle[]

  private activeHandle: Handle

  constructor(
    private numberOfSteps: number,
    public width: number,
    public height: number
  ) {
    this.stepSegment = this.width / this.numberOfSteps
    this.activeHandle = null
  }

  private getNearStep(point: OneDimensionalSpacePoint) {
    return Math.round(point / this.stepSegment)
  }

  private get leftBoundry(): number {
    const lastHandleIndex = this.handles.length - 1

    if (!this.activeHandle || this.activeHandle === this.handles[0]) {
      return 0
    } else if (this.activeHandle === this.handles[lastHandleIndex]) {
      return this.handles[0].position.x
    }
  }

  private get rightBoundry(): number {
    const lastHandleIndex = this.handles.length - 1
    if (
      !this.activeHandle ||
      this.activeHandle === this.handles[lastHandleIndex]
    ) {
      return this.width
    } else if (this.activeHandle === this.handles[0]) {
      return this.handles[lastHandleIndex].position.x
    }
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
    targetPoint: OneDimensionalSpacePoint
  ): OneDimensionalSpacePoint {
    if (this.isPointInBoundries(targetPoint)) {
      const availablePointRatio: Ratio =
        this.getNearStep(targetPoint) / this.numberOfSteps
      const availablePoint: OneDimensionalSpacePoint =
        availablePointRatio * this.width

      return availablePoint
    } else if (this.isPointBeforeLeftBoundry(targetPoint)) {
      return this.leftBoundry
    } else if (this.isPointAfterRightBoundry(targetPoint)) {
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

    const isTargetPointIsFirstPoint: boolean = targetPoint === firstPoint
    const isTargetPointIsLastPoint: boolean = targetPoint === lastPoint
    const isTargetPointBeforeFirstPoint: boolean = targetPoint < firstPoint
    const isTargetPointAfterLastPoint: boolean = targetPoint > lastPoint
    const isTargetPointBetweenPoints: boolean =
      targetPoint > firstPoint && targetPoint < lastPoint
    const isTargetPointCloserToFirstPoint: boolean =
      isTargetPointBetweenPoints && targetPoint <= firstLastMiddle
    const isTargetPointCloserToLastPoint: boolean =
      isTargetPointBetweenPoints && targetPoint > firstLastMiddle

    if (
      isTargetPointIsFirstPoint ||
      isTargetPointBeforeFirstPoint ||
      isTargetPointCloserToFirstPoint
    ) {
      return firstPointIndex
    } else if (
      isTargetPointIsLastPoint ||
      isTargetPointAfterLastPoint ||
      isTargetPointCloserToLastPoint
    ) {
      return lastPointIndex
    }
  }

  public pointToRatio(point: OneDimensionalSpacePoint): Ratio {
    return point / this.width
  }

  public registerHandles(handles: Handle[]) {
    this.handles = handles
  }

  public setActiveHandle(handle: Handle | null) {
    this.activeHandle = handle
  }
}

export default Track
