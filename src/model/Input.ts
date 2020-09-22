class Input {
  private value: string

  constructor(private separator: string = '', ...subValues: string[]) {
    this.set(...subValues)
  }

  set(...subValues: string[]): void {
    this.value = subValues.join(this.separator)
  }

  get(): string {
    return this.value
  }
}

export default Input
