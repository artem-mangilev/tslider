class Input {
  constructor(private separator: string = '', private value: string = '') {}

  set(value: string): void {
    if (this.isValid(value)) {
      this.value = value
    }
  }

  setFromList(values: string[]): void {
    this.value = values.join(this.separator)
  }

  get(): string {
    return this.value
  }

  getAsList(): number[] {
    return this.value.split(this.separator).map((part) => +part)
  }

  private isValid(input: string): boolean {
    if (input.includes(this.separator)) {
      return input.split(this.separator).every((part) => Number.isFinite(+part))
    }
  }
}

export default Input
