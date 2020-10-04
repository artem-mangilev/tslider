export interface ValuesStoreGetters {
  getMax(): number

  getMin(): number

  getStep(): number
}

class ValuesStore implements ValuesStoreGetters {
  constructor(private min: number, private max: number, private step: number) {
    if (this.isMinMaxValid(min, max) && this.isStepValid(step, max)) {
      this.min = +min
      this.max = +max
      this.step = +step
    } else {
      throw new Error('Min must be < than max, step must be <= than max')
    }
  }

  setMin(min: number): void {
    if (this.isMinMaxValid(min, this.max)) {
      this.min = +min
    }
  }

  getMin(): number {
    return this.min
  }

  setMax(max: number): void {
    if (this.isMinMaxValid(this.min, max)) {
      this.max = +max
    }
  }

  getMax(): number {
    return this.max
  }

  setStep(step: number): void {
    if (this.isStepValid(step, this.max)) {
      this.step = +step
    }
  }

  getStep(): number {
    return this.step
  }

  private isMinMaxValid(min: number, max: number): boolean {
    return this.isNumeric(min, max) && +min < +max
  }

  private isStepValid(step: number, max: number): boolean {
    return this.isNumeric(step) && +step <= +max
  }

  private isNumeric(...args: (number | string)[]): boolean {
    return args.every((arg) => isFinite(<number>arg))
  }
}

export default ValuesStore
