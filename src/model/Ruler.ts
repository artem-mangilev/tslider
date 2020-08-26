import Track from './Track'
import RulerSegment from '../RulerSegment'
import ValuesToTrackPointConverter from './ValuesToTrackPointConverter'

class Ruler {
  constructor(
    private track: Track,
    private converter: ValuesToTrackPointConverter
  ) {}

  getSegments(steps: number): RulerSegment[] {
    const step = this.track.length / steps

    const ruler = []

    for (let current = 0; current <= this.track.length; current += step) {
      const value = this.converter.toValue(current, this.track.length)
      ruler.push({ point: current, value })
    }

    return ruler
  }
}

export default Ruler
