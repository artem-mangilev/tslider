class ValuesToTrackPointConverter {
  constructor(
    private min: number,
    private max: number,
    private step: number,
  ) {}

  private getMaxMinDiff(): number {
    return this.max - this.min
  }

  toTrackPoint(value: number, trackLength: number): number {
    const ratio = (value - this.min) / this.getMaxMinDiff()
    return ratio * trackLength
  }

  toValue(trackPoint: number, trackLength: number): number {
    const ratio = trackPoint / trackLength
    return ratio * this.getMaxMinDiff() + this.min
  }

  // getTrackStep(trackLength: number): number {
  //   const ratio = this.step / this.getMaxMinDiff()
  //   return ratio * trackLength
  // }

  getNumberOfSteps(): number {
    return this.getMaxMinDiff() / this.step
  }
}

export default ValuesToTrackPointConverter
