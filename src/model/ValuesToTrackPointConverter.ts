import Shape from '../utils/Shape'
import PrecisionFormatter from './PrecisionFormatter'
import ValuesValidator from './ValuesValidator'

class ValuesToTrackPointConverter {
  constructor(
    private values: ValuesValidator,
    private track: Shape,
    private formatter: PrecisionFormatter
  ) {}

  toTrackPoint(value: number): number {
    const ratio = (value - this.values.getMin()) / this.getMaxMinDiff()
    return ratio * this.track.width
  }

  toValue(trackPoint: number): number {
    const ratio = trackPoint / this.track.width
    return ratio * this.getMaxMinDiff() + this.values.getMin()
  }

  toFormattedValue(trackPoint: number): string {
    return this.formatter.format(
      this.values.getStep(),
      this.toValue(trackPoint)
    )
  }

  getNumberOfSteps(): number {
    return this.getMaxMinDiff() / this.values.getStep()
  }

  private getMaxMinDiff(): number {
    return this.values.getMax() - this.values.getMin()
  }
}

export default ValuesToTrackPointConverter
