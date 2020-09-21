import PositionedElement from './PositionedElement'

class FillerX {
  constructor(private elements: PositionedElement[]) {}

  private isRangeMode(): boolean {
    return this.elements.length === 2
  }

  getPosition(): number {
    return this.isRangeMode() ? this.elements[0].getPosition() : 0
  }

  getLength(): number {
    const first = this.elements[0]
    const last = this.elements[this.elements.length - 1]

    return this.isRangeMode()
      ? last.getPosition() - first.getPosition()
      : first.getPosition()
  }
}

export default FillerX
