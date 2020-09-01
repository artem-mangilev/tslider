import HandleAxle from "./HandleAxle";

class HandleY implements HandleAxle {
  constructor(private containerHeight: number) {}

  getPosition(): number {
    return this.containerHeight / 2
  }
}

export default HandleY