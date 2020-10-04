class Input {
  private value = ''

  constructor(private separator: string = '') {}

  set(...subValues: string[]): void {
    this.value = subValues.join(this.separator)
  }

  get(): string {
    return this.value
  }
}

export default Input
