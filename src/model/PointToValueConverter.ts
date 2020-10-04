import Shape from '../utils/Shape'
import NumberConverter from './NumberConverter'
import { ValuesStoreGetters } from './ValuesStore'

class PointToValueConverter implements NumberConverter {
  constructor(private values: ValuesStoreGetters, private shape: Shape) {}

  convert(point: number): number {
    const ratio = point / this.shape.width
    return ratio * this.getMaxMinDiff() + this.values.getMin()
  }

  private getMaxMinDiff(): number {
    return this.values.getMax() - this.values.getMin()
  }
}

export default PointToValueConverter
