import { Ratio, Orientation } from './aliases'

class DataModel {
  private maxMinDiff: number

  constructor(
    private min: number,
    private max: number,
    private orientation: Orientation
  ) {
    this.maxMinDiff = max - min
  }

  private validateRatio(ratio: Ratio): Ratio {
    const totalRatio: Ratio = 1
    return this.orientation === 'horizontal' ? ratio : totalRatio - ratio
  }

  public getAmount(ratio: Ratio): number {
    const dataAmountRatio = this.validateRatio(ratio)

    return dataAmountRatio * this.maxMinDiff + this.min
  }

  public getAmountAsRatio(dataAmount: number): Ratio {
    const dataAmountRatio = (dataAmount - this.min) / this.maxMinDiff

    return this.validateRatio(dataAmountRatio)
  }
}

export default DataModel
