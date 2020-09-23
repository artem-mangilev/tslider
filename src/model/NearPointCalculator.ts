class NearPointCalculator {
  fromSegment(point: number, segmentSize: number): number {
    const quotient = Math.floor(point / segmentSize)
    const low = segmentSize * quotient
    const high = segmentSize * (quotient + 1)

    return this.getNear(low, high, point)
  }

  fromGroup(point: number, pointsGroup: number[]): number {
    return pointsGroup.reduce((prev, curr) => this.getNear(prev, curr, point))
  }

  private getNear(n1: number, n2: number, testingPoint: number): number {
    return Math.abs(testingPoint - n1) < Math.abs(testingPoint - n2) ? n1 : n2
  }
}

export default NearPointCalculator
