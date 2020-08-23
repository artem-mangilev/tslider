import { OneDimensionalSpacePoint, Ratio } from '../utils/aliases'
import Handle from './Handle'

class Track {
  private activeHandle: Handle | null
  private firstHandle: Handle
  private lastHandle: Handle

  constructor(
    private numberOfSteps: number,
    public length: number,
    private handles: Handle[]
  ) {
    this.activeHandle = null
    this.handles = handles
    this.firstHandle = this.handles[0]
    this.lastHandle = this.handles[this.handles.length - 1]
  }

  private getNearStep(point: OneDimensionalSpacePoint): number {
    return Math.round(point / this.stepSegment)
  }

  private isPointBetweenPoints(point: OneDimensionalSpacePoint): boolean {
    return point >= this.firstPointPosition && point <= this.lastPointPosition
  }

  private isPointBeforeLeftBoundary(point: OneDimensionalSpacePoint): boolean {
    return point <= this.leftBoundary
  }

  private isPointAfterRightBoundary(point: OneDimensionalSpacePoint): boolean {
    return point >= this.rightBoundary
  }

  private isPointCollidesWithLastPoint(
    point: OneDimensionalSpacePoint
  ): boolean {
    const isPointAfterLastPoint = point > this.lastHandle.position

    return this.activeHandle === this.firstHandle && isPointAfterLastPoint
  }

  private isPointCollidesWithFirstPoint(
    point: OneDimensionalSpacePoint
  ): boolean {
    const isPointBeforeFirstPoint = point < this.firstHandle.position

    return this.activeHandle === this.lastHandle && isPointBeforeFirstPoint
  }

  private isRangeMode(): boolean {
    return this.handles.length === 2
  }

  private get stepSegment(): number {
    return this.length / this.numberOfSteps
  }

  private get leftBoundary(): number {
    return 0
  }

  private get rightBoundary(): number {
    return this.length
  }

  private get firstPointPosition(): OneDimensionalSpacePoint {
    return this.firstHandle.position
  }

  private get lastPointPosition(): OneDimensionalSpacePoint {
    return this.lastHandle.position
  }

  getAvailablePoint(
    targetPoint: OneDimensionalSpacePoint
  ): OneDimensionalSpacePoint {
    const isPointCollidesWithLastPoint =
      this.isRangeMode() && this.isPointCollidesWithLastPoint(targetPoint)

    const isPointCollidesWithFirstPoint =
      this.isRangeMode() && this.isPointCollidesWithFirstPoint(targetPoint)

    if (isPointCollidesWithLastPoint) {
      return this.lastPointPosition
    } else if (isPointCollidesWithFirstPoint) {
      return this.firstPointPosition
    } else if (this.isPointBeforeLeftBoundary(targetPoint)) {
      return this.leftBoundary
    } else if (this.isPointAfterRightBoundary(targetPoint)) {
      return this.rightBoundary
    }

    const availablePointRatio =
      this.getNearStep(targetPoint) / this.numberOfSteps
    const availablePoint = availablePointRatio * this.length

    return availablePoint
  }

  // TODO: improve naming
  getNearestPointIndex(targetPoint: OneDimensionalSpacePoint): number {
    const firstPointIndex = 0
    const lastPointIndex = this.handles.length - 1

    const firstPoint = this.firstHandle.position
    const lastPoint = this.lastHandle.position

    const firstLastMiddle = (lastPoint + firstPoint) / 2

    const isTargetPointIsFirstPoint = targetPoint === firstPoint
    const isTargetPointIsLastPoint = targetPoint === lastPoint
    const isTargetPointBeforeFirstPoint = targetPoint < firstPoint
    const isTargetPointAfterLastPoint = targetPoint > lastPoint
    const isTargetPointBetweenPoints = this.isPointBetweenPoints(targetPoint)
    const isTargetPointCloserToFirstPoint =
      isTargetPointBetweenPoints && targetPoint <= firstLastMiddle
    const isTargetPointCloserToLastPoint =
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

  pointToRatio(point: OneDimensionalSpacePoint): Ratio {
    return point / this.length
  }

  ratioToPoint(ratio: Ratio): OneDimensionalSpacePoint {
    return ratio * this.length
  }

  setActiveHandle(handle: Handle | null): void {
    this.activeHandle = handle
  }

  get rangeStartPosition(): OneDimensionalSpacePoint {
    return this.isRangeMode() ? this.firstHandle.position : this.leftBoundary
  }

  get rangeEndPosition(): OneDimensionalSpacePoint {
    return this.isRangeMode()
      ? this.lastHandle.position
      : this.firstHandle.position
  }
}

export default Track
