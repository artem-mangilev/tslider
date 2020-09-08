import RulerSegment from '../RulerSegment'
import ValuesToTrackPointConverter from './ValuesToTrackPointConverter'
import Shape from '../utils/Shape'

class Ruler {
  constructor(
    private track: Shape,
    private converter: ValuesToTrackPointConverter
  ) {}

  getSegments(steps: number): RulerSegment[] {
    const step = this.track.width / steps

    const ruler = []

    for (let current = 0; current <= this.track.width; current += step) {
      const value = this.converter.toValue(current)
      ruler.push({ point: current, value })
    }

    return ruler
  }
}

export default Ruler
