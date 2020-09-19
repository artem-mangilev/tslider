import ValuesValidator from './ValuesValidator'

class PrecisionFormatter {
  constructor(private values: ValuesValidator) {}

  format(number: number): string {
    const afterDot = this.values.getStep().toString().split('.')[1]
    const afterDotLength = afterDot?.length || 0

    return number.toFixed(afterDotLength)
  }
}

export default PrecisionFormatter
