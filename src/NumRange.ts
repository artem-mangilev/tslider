class NumRange {
  //TODO: read about this
  min: number
  max: number
  maxMinDiff: number

  constructor(min: number, max: number) {
    this.min = min
    this.max = max

    this.maxMinDiff = this.max - this.min
  }

  getNumberRatio(number: number): number {
    if (this.isNumberValid(number)) {
      return this.getDifferenceWithMin(number) / (this.maxMinDiff / 100)
    }
    throw Error(`Passed number must be between ${this.min} and ${this.max}`)
  }

  getNumber(ratio: number): number {
    if (this.isRatioValid(ratio)) {
      return (ratio / 100) * this.maxMinDiff + this.min
    }
    throw Error('Ratio must be between 0 and 100')
  }

  isNumberValid(number: number): boolean {
    if (number < this.min || number > this.max) {
      return false
    }
    return true
  }

  isRatioValid(ratio: number): boolean {
    if (ratio < 0 || ratio > 100) {
      return false
    }
    return true
  }

  getDifferenceWithMin(number: number): number {
    if (this.isNumberValid(number)) {
      return number - this.min
    }
    throw Error(
      `Passed number must be bigger than minimal number which is eqaual to: ${this.min}`
    )
  }
}

export default NumRange
