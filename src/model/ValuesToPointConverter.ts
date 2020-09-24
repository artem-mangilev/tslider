import Shape from '../utils/Shape'
import { ValuesStoreGetters } from './ValuesStore'

class ValuesToPointConverter {
  constructor(private values: ValuesStoreGetters, private shape: Shape) {}

  toPoint(value: number): number {
    const ratio = (value - this.values.getMin()) / this.getMaxMinDiff()
    return ratio * this.shape.width
  }

  toValue(point: number): number {
    const ratio = point / this.shape.width
    return ratio * this.getMaxMinDiff() + this.values.getMin()
  }

  private getMaxMinDiff(): number {
    return this.values.getMax() - this.values.getMin()
  }
}

export default ValuesToPointConverter
