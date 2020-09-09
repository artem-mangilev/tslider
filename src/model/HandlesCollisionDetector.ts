import HandleX from './HandleX'

class HandlesCollisionDetector {
  constructor(private handles: HandleX[]) {}

  doCollide(): boolean {
    if (this.handles.length === 1) return false

    if (this.handles.length === 2) {
      return this.handles[0].getPosition() > this.handles[1].getPosition()
    }
  }
}

export default HandlesCollisionDetector
