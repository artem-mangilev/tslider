import CollisionDetector from './CollisionDetector'
import HandleX from './HandleX'
import NearPointCalculator from './NearPointCalculator'

class HandlesXContainer {
  private handles: HandleX[]

  constructor(
    positions: number[],
    private cd: CollisionDetector,
    private calculator: NearPointCalculator
  ) {
    this.handles = positions.map((position) => new HandleX(position))
  }

  setById(point: number, id: number): void {
    const handle = this.handles[id]
    if (handle) {
      this.setPosition(handle, point)
    }
  }

  getById(id: number): HandleX {
    const handle = this.handles[id]
    if (handle) {
      return handle
    }
  }

  setNear(position: number): void {
    const near = this.findNear(position)
    this.setPosition(near, position)
  }

  getAll(): HandleX[] {
    return this.handles
  }

  private setPosition(handle: HandleX, position: number): void {
    const oldPoint = handle.getPosition()
    handle.setPosition(position)

    if (this.cd.doCollide(this.handles)) {
      handle.setPosition(oldPoint)
    }
  }

  private findNear(position: number): HandleX {
    const handlePositions = this.handles.map((handle) => handle.getPosition())
    const nearest = this.calculator.fromGroup(position, handlePositions)

    return this.handles.find((handle) => handle.getPosition() === nearest)
  }
}

export default HandlesXContainer
