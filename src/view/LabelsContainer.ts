import ViewTreeNode from '../utils/ViewTreeNode'
import Label from './Label'

class LabelsContainer extends ViewTreeNode {
  private labels: Label[] = []
  private tempLabel: Label = new Label('tslider__label')

  constructor(
    className: string,
    private longSide: 'width' | 'height',
    private x: 'x' | 'y',
    private y: 'x' | 'y'
  ) {
    super('div', className)
  }

  private showTempLabel() {
    this.labels[0].$elem.css('visibility', 'hidden')
    this.labels[this.labels.length - 1].$elem.css('visibility', 'hidden')

    this.tempLabel.$elem.css('visibility', 'visible')
  }

  private hideTempLabel() {
    this.labels[0].$elem.css('visibility', 'visible')
    this.labels[this.labels.length - 1].$elem.css('visibility', 'visible')

    this.tempLabel.$elem.css('visibility', 'hidden')
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

  render(
    labels: {
      position: number
      value: string
    }[],
    rangeMiddle: number,
  ): void {
    // if labels is empty, fill it and render
    if (!this.labels.length) {
      labels.forEach(() => this.labels.push(new Label('tslider__label')))
      this.add(...this.labels, this.tempLabel)
    }

    // make render with passed data
    labels.forEach((label, i) => {
      this.labels[i].render({
        position: label.position,
        value: label.value,
        longSide: this.longSide,
        x: this.x,
        y: this.y,
      })
    })

    if (this.doLabelsCollide() && this.isLabelsHaveDifferentPosition()) {
      this.showTempLabel()

      this.tempLabel.render({
        position: rangeMiddle,
        value: labels.map((label) => label.value).join(' - '),
        longSide: this.longSide,
        x: this.x,
        y: this.y,
      })
    } else {
      this.hideTempLabel()
    }
  }
}

export default LabelsContainer
