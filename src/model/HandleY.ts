import PositionedElement from "./PositionedElement";

class HandleY implements PositionedElement {
  constructor(private containerHeight: number) {}

  getPosition(): number {
    return this.containerHeight / 2
  }
}

export default HandleY