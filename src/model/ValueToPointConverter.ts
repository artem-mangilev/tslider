import Shape from '../utils/Shape'
import NumberConverter from './NumberConverter'
import { ValuesStoreGetters } from './ValuesStore'

class ValueToPointConverter implements NumberConverter {
  constructor(private values: ValuesStoreGetters, private shape: Shape) {}

  convert(value: number): number {
    const ratio = (value - this.values.getMin()) / this.getMaxMinDiff()
    return ratio * this.shape.width
  }

  private getMaxMinDiff(): number {
    return this.values.getMax() - this.values.getMin()
  }
}

export default ValueToPointConverter
