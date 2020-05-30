import { Ratio, Orientation } from './aliases'

class DataModel {
  maxMinDiff: number

  constructor(
    private min: number,
    private max: number,
    private orientation: Orientation
  ) {
    this.maxMinDiff = max - min
  }

  public getAmount(ratio: Ratio): number {
    return ratio * this.maxMinDiff + this.min
  }

  public getAmountAsRatio(dataAmount: number): Ratio {
    return (dataAmount - this.min) / this.maxMinDiff
  }

  
}

export default DataModel
