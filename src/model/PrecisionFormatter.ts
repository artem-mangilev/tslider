class PrecisionFormatter {
  format(numberWithTargetPrecision: number, number: number): string {
    const afterDot = numberWithTargetPrecision.toString().split('.')[1]
    const afterDotLength = afterDot?.length || 0

    return number.toFixed(afterDotLength)
  }
}

export default PrecisionFormatter
