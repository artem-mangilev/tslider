import { Ratio } from '../utils/aliases'
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

  private getNearPoint(point: number): number {
    const quotient = Math.floor(point / this.stepSegment)
    const low = this.stepSegment * quotient
    const high = this.stepSegment * (quotient + 1)

    return Math.abs(point - low) < Math.abs(point - high) ? low : high
  }

  private isPointBetweenPoints(point: number): boolean {
    return point >= this.firstPointPosition && point <= this.lastPointPosition
  }

  private isPointBeforeLeftBoundary(point: number): boolean {
    return point <= this.leftBoundary
  }

  private isPointAfterRightBoundary(point: number): boolean {
    return point >= this.rightBoundary
  }

  private isPointCollidesWithLastPoint(point: number): boolean {
    const isPointAfterLastPoint = point > this.lastHandle.position

    return this.activeHandle === this.firstHandle && isPointAfterLastPoint
  }

  private isPointCollidesWithFirstPoint(point: number): boolean {
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

  private get firstPointPosition(): number {
    return this.firstHandle.position
  }

  private get lastPointPosition(): number {
    return this.lastHandle.position
  }

  validatePoint(point: number): number {
    const isPointCollidesWithLastPoint =
      this.isRangeMode() && this.isPointCollidesWithLastPoint(point)

    const isPointCollidesWithFirstPoint =
      this.isRangeMode() && this.isPointCollidesWithFirstPoint(point)

    if (isPointCollidesWithLastPoint) {
      return this.lastPointPosition
    } else if (isPointCollidesWithFirstPoint) {
      return this.firstPointPosition
    } else if (this.isPointBeforeLeftBoundary(point)) {
      return this.leftBoundary
    } else if (this.isPointAfterRightBoundary(point)) {
      return this.rightBoundary
    }

    return this.getNearPoint(point)
  }

  // TODO: improve naming
  getNearestPointIndex(targetPoint: number): number {
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

  pointToRatio(point: number): Ratio {
    return point / this.length
  }

  ratioToPoint(ratio: Ratio): number {
    return ratio * this.length
  }

  setActiveHandle(handle: Handle | null): void {
    this.activeHandle = handle
  }

  get rangeStartPosition(): number {
    return this.isRangeMode() ? this.firstHandle.position : this.leftBoundary
  }

  get rangeEndPosition(): number {
    return this.isRangeMode()
      ? this.lastHandle.position
      : this.firstHandle.position
  }
}

export default Track
