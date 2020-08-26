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

  private getNear(n1: number, n2: number, testingPoint: number): number {
    return Math.abs(testingPoint - n1) < Math.abs(testingPoint - n2) ? n1 : n2
  }

  private getNearPointFromGroup(point: number, pointsGroup: number[]): number {
    return pointsGroup.reduce((prev, curr) => this.getNear(prev, curr, point))
  }

  private getNearPoint(point: number): number {
    const quotient = Math.floor(point / this.stepSegment)
    const low = this.stepSegment * quotient
    const high = this.stepSegment * (quotient + 1)

    return this.getNear(low, high, point)
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
    if (this.isPointCollidesWithLastPoint(point)) {
      return this.lastPointPosition
    } else if (this.isPointCollidesWithFirstPoint(point)) {
      return this.firstPointPosition
    } else if (this.isPointBeforeLeftBoundary(point)) {
      return this.leftBoundary
    } else if (this.isPointAfterRightBoundary(point)) {
      return this.rightBoundary
    }

    return this.getNearPoint(point)
  }

  getNearestPointIndex(targetPoint: number): number {
    const points = this.handles.map((handle) => handle.position)
    const nearest = this.getNearPointFromGroup(targetPoint, points)

    return points.findIndex((point) => point === nearest)
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
