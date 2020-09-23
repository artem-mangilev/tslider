import Shape from '../utils/Shape'
import PrecisionFormatter from './PrecisionFormatter'
import { ValuesStoreGetters } from './ValuesStore'

class ValuesToPointConverter {
  constructor(
    private values: ValuesStoreGetters,
    private shape: Shape,
    private formatter: PrecisionFormatter
  ) {}

  toPoint(value: number): number {
    const ratio = (value - this.values.getMin()) / this.getMaxMinDiff()
    return ratio * this.shape.width
  }

  toValue(point: number): number {
    const ratio = point / this.shape.width
    return ratio * this.getMaxMinDiff() + this.values.getMin()
  }

  toFormattedValue(point: number): string {
    return this.formatter.format(this.values.getStep(), this.toValue(point))
  }

  private getMaxMinDiff(): number {
    return this.values.getMax() - this.values.getMin()
  }
}

export default ValuesToPointConverter
