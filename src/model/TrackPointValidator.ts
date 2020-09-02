import Handle from './HandleX'
import Shape from '../utils/Shape'
import NearPointCalculator from './NearPointCalculator'

class TrackPointValidator {
  private activeHandle: Handle | null
  private firstHandle: Handle
  private lastHandle: Handle

  constructor(
    private numberOfSteps: number,
    private track: Shape,
    private handles: Handle[],
    private pointCalculator: NearPointCalculator
  ) {
    this.activeHandle = null
    this.handles = handles
    this.firstHandle = this.handles[0]
    this.lastHandle = this.handles[this.handles.length - 1]
  }

  private isPointBeforeLeftBoundary(point: number): boolean {
    return point <= this.leftBoundary
  }

  private isPointAfterRightBoundary(point: number): boolean {
    return point >= this.rightBoundary
  }

  private isPointCollidesWithLastPoint(point: number): boolean {
    const isPointAfterLastPoint = point > this.lastHandle.getPosition()

    return (
      this.isRangeMode() &&
      this.activeHandle === this.firstHandle &&
      isPointAfterLastPoint
    )
  }

  private isPointCollidesWithFirstPoint(point: number): boolean {
    const isPointBeforeFirstPoint = point < this.firstHandle.getPosition()

    return (
      this.isRangeMode() &&
      this.activeHandle === this.lastHandle &&
      isPointBeforeFirstPoint
    )
  }

  private isRangeMode(): boolean {
    return this.handles.length === 2
  }

  private get stepSegment(): number {
    return this.track.width / this.numberOfSteps
  }

  private get leftBoundary(): number {
    return 0
  }

  private get rightBoundary(): number {
    return this.track.width
  }

  private get firstPointPosition(): number {
    return this.firstHandle.getPosition()
  }

  private get lastPointPosition(): number {
    return this.lastHandle.getPosition()
  }

  validatePoint(point: number): number {
    if (this.isPointCollidesWithLastPoint(point)) {
      return this.lastPointPosition
    } else if (this.isPointCollidesWithFirstPoint(point)) {
      return this.firstPointPosition
    } else if (this.isPointBeforeLeftBoundary(point)) {
      return this.leftBoundary
    } else if (this.isPointAfterRightBoundary(point)) {
      return this.rightBoundary
    }

    return this.pointCalculator.fromSegment(point, this.stepSegment)
  }

  getNearestPointIndex(targetPoint: number): number {
    const points = this.handles.map((handle) => handle.getPosition())
    const nearest = this.pointCalculator.fromGroup(targetPoint, points)

    return points.findIndex((point) => point === nearest)
  }

  setActiveHandle(handle: Handle | null): void {
    this.activeHandle = handle
  }
}

export default TrackPointValidator
