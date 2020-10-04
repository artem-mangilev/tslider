import PositionedElement from './PositionedElement'

class HandleX implements PositionedElement {
  constructor(private position: number) {}

  getPosition(): number {
    return this.position
  }

  setPosition(position: number): void {
    this.position = position
  }
}

export default HandleX
