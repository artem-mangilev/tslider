import RulerSegment from './RulerSegment'
import ValuesToTrackPointConverter from './ValuesToTrackPointConverter'
import Shape from '../utils/Shape'

class Ruler {
  private ruler: RulerSegment[]

  constructor(
    private track: Shape,
    private converter: ValuesToTrackPointConverter,
    private steps: number
  ) {
    this.update()
  }

  update(): void {
    const step = this.track.width / this.steps

    this.ruler = []

    for (let current = 0; current <= this.track.width; current += step) {
      const value = this.converter.toFormattedValue(current)
      this.ruler.push({ point: current, value })
    }
  }

  get(): RulerSegment[] {
    return this.ruler
  }
}

export default Ruler
