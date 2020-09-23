class ValuesStore {
  constructor(private min: number, private max: number, private step: number) {
    if (this.validateMinMax(min, max)) {
      this.min = +min
      this.max = +max
    } else {
      throw new Error('Invalid min or max')
    }

    if (this.validateStep(step, max)) {
      this.step = +step
    } else {
      throw new Error('Invalid step')
    }
  }

  setMin(min: number): void {
    if (this.validateMinMax(min, this.max)) {
      this.min = +min
    }
  }

  getMin(): number {
    return this.min
  }

  setMax(max: number): void {
    if (this.validateMinMax(this.min, max)) {
      this.max = +max
    }
  }

  getMax(): number {
    return this.max
  }

  setStep(step: number): void {
    if (this.validateStep(step, this.max)) {
      this.step = +step
    }
  }

  getStep(): number {
    return this.step
  }

  private validateMinMax(min: number, max: number): boolean {
    return isFinite(min) && isFinite(max) && +min < +max
  }

  private validateStep(step: number, max: number): boolean {
    return isFinite(step) && +step <= +max
  }
}

export default ValuesStore
