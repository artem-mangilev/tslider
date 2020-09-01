import HandleAxle from "./HandleAxle";

class HandleX implements HandleAxle {
  constructor(private position: number) {}

  getPosition(): number {
    return this.position
  }

  setPosition(position: number): void {
    this.position = position
  }
}

export default HandleX
