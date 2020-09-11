class PrecisionFormatter {
  private afterDotLength: number

  constructor(private numberWithTargetPrecision: number) {
    const afterDot = this.numberWithTargetPrecision.toString().split('.')[1]
    this.afterDotLength = afterDot?.length || 0
  }

  format(number: number): string {
    return number.toFixed(this.afterDotLength)
  }
}

export default PrecisionFormatter
