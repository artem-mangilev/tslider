class PrecisionFormatter {
  constructor(private numberWithTargetPrecision: number) {}

  setNumberWithTargetPrecision(number: number): void {
    this.numberWithTargetPrecision = number
  }

  format(number: number): string {
    const afterDot = this.numberWithTargetPrecision.toString().split('.')[1]
    const afterDotLength = afterDot?.length || 0

    return number.toFixed(afterDotLength)
  }
}

export default PrecisionFormatter
