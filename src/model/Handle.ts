import { OneDimensionalSpacePoint } from '../utils/aliases'

class Handle {
  private currentPosition: OneDimensionalSpacePoint

  constructor(initialCoord: OneDimensionalSpacePoint) {
    // when this class is initialized, it assumes that
    // passed coordinate is for horizontal orientation,
    // so Y uses as a passive axis which isn't changes
    this.currentPosition = initialCoord
  }

  public get position(): OneDimensionalSpacePoint {
    return this.currentPosition
  }

  public set position(newPosition) {
    this.currentPosition = newPosition
  }
}

export default Handle
