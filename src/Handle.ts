class Handle {
  size: number
  lineLength: number
  numberOnLine: number

  constructor(size: number, lineLength: number, numberOnLine: number = 0) {
    this.size = size
    this.lineLength = lineLength
    this.numberOnLine = numberOnLine
  }

  get position(): number {
    return this.numberOnLine - this.size / 2
  }

  set position(numberOnLine) {
    this.numberOnLine = numberOnLine
  }
}

export default Handle
