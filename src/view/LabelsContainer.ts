import ViewTreeNode from '../utils/ViewTreeNode'
import Label from './Label'

class LabelsContainer extends ViewTreeNode {
  private labels: Label[] = []
  private tempLabel: Label

  constructor(
    private longSide: 'width' | 'height',
    private x: 'x' | 'y',
    private y: 'x' | 'y'
  ) {
    super('div', 'tslider__labels')

    this.tempLabel = new Label(longSide, x, y)
  }

  private showTempLabel() {
    this.labels.map((label) => label.hide())
    this.tempLabel.show()
  }

  private hideTempLabel() {
    this.labels.map((label) => label.show())
    this.tempLabel.hide()
  }

  private isLabelsHaveDifferentPosition() {
    return (
      this.labels[0].position[this.x] !==
      this.labels[this.labels.length - 1].position[this.x]
    )
  }

  private doLabelsCollide(): boolean {
    // they don't collide if there is 1 label
    if (this.labels.length === 1) {
      return false
    }

    const [firstLabel, lastLabel] = this.labels

    const firstLabelX = firstLabel.position[this.x]
    const lastLabelX = lastLabel.position[this.x]

    const firstLabelWidth = firstLabel[this.longSide]
    const lastLabelWidth = lastLabel[this.longSide]

    const isCollisionDetected =
      firstLabelX < lastLabelX + lastLabelWidth &&
      firstLabelX + firstLabelWidth > lastLabelX

    return isCollisionDetected
  }

  private init(
    labels: {
      position: number
      value: string
    }[]
  ): void {
    this.labels = [
      ...labels.map(() => new Label(this.longSide, this.x, this.y)),
    ]
    this.add(...this.labels, this.tempLabel)
  }

  render(
    labels: {
      position: number
      value: string
    }[],
    rangeMiddle: number
  ): void {
    if (!this.labels.length) this.init(labels)

    labels.forEach((label, i) => {
      this.labels[i].render({
        position: label.position,
        value: label.value,
      })
    })

    if (this.doLabelsCollide() && this.isLabelsHaveDifferentPosition()) {
      this.showTempLabel()

      this.tempLabel.render({
        position: rangeMiddle,
        value: labels.map((label) => label.value).join(' - '),
      })
    } else {
      this.hideTempLabel()
    }
  }
}

export default LabelsContainer
