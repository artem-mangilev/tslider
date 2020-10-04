import Shape from '../utils/Shape'

class Ruler {
  private ruler: number[]

  constructor(private track: Shape, private steps: number) {
    this.update()
  }

  update(): void {
    const stepSize = this.getStepSize()

    const rulerMarks = { length: this.steps + 1 }
    this.ruler = Array.from(rulerMarks, (_, mark) => mark * stepSize)
  }

  get(): number[] {
    return this.ruler
  }

  private getStepSize() {
    return this.track.width / this.steps
  }
}

export default Ruler
