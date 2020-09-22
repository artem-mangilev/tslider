import PositionedElement from './PositionedElement'

class FillerX {
  constructor(
    private left: PositionedElement,
    private right?: PositionedElement
  ) {}

  private isRangeMode(): boolean {
    return !!this.right
  }

  getPosition(): number {
    return this.isRangeMode() ? this.left.getPosition() : 0
  }

  getLength(): number {
    return this.isRangeMode()
      ? this.right.getPosition() - this.left.getPosition()
      : this.left.getPosition()
  }
}

export default FillerX
