import HandlesCollisionDetector from './HandlesCollisionDetector'
import HandleX from './HandleX'

class HandlesXContainer {
  constructor(
    private handles: HandleX[],
    private cd: HandlesCollisionDetector
  ) {}

  setById(point: number, id: number): void {
    if (this.handles[id]) {
      const handle = this.handles[id]
      this.setByPosition(handle, point)
    }
  }

  setByPosition(handle: HandleX, position: number): void{
    const oldPoint = handle.getPosition()
    handle.setPosition(position)

    if (this.cd.doCollide()) {
      handle.setPosition(oldPoint)
    }
  }
}

export default HandlesXContainer
