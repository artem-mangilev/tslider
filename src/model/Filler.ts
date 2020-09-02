import HandleX from './HandleX'

class Filler {
  constructor(private handles: HandleX[]) {}

  private isRangeMode(): boolean {
    return this.handles.length === 2
  }

  getPosition(): number {
    return this.isRangeMode() ? this.handles[0].getPosition() : 0
  }

  getLength(): number {
    const first = this.handles[0]
    const last = this.handles[this.handles.length - 1]

    return this.isRangeMode()
      ? last.getPosition() - first.getPosition()
      : first.getPosition()
  }
}

export default Filler
