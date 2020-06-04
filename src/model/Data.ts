import { Orientation, Ratio } from '../utils/aliases'

class Data {
  private maxMinDiff: number

  constructor(
    private min: number,
    private max: number,
    private step: number,
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

  public get numberOfSteps(): number {
    return this.maxMinDiff / this.step
  }
}

export default Data