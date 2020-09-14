import Shape from "../utils/Shape"

class ValuesToTrackPointConverter {
  constructor(
    private min: number,
    private max: number,
    private step: number,
    private track: Shape
  ) {}

  setMin(min: number): void {
    this.min = min
  }

  setMax(max: number): void {
    this.max = max
  }

  toTrackPoint(value: number): number {
    const ratio = (value - this.min) / this.getMaxMinDiff()
    return ratio * this.track.width
  }

  toValue(trackPoint: number): number {
    const ratio = trackPoint / this.track.width
    return ratio * this.getMaxMinDiff() + this.min
  }

  getNumberOfSteps(): number {
    return this.getMaxMinDiff() / this.step
  }

  private getMaxMinDiff(): number {
    return this.max - this.min
  }
}

export default ValuesToTrackPointConverter
