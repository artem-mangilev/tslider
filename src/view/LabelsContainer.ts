import ViewTreeNode from '../utils/ViewTreeNode'
import Label, { LabelRenderData } from './Label'

export interface LabelsContainerRenderData {
  labels: LabelRenderData[]
  rangeMiddle: number
}

class LabelsContainer extends ViewTreeNode {
  private labels: Label[] = []
  private tempLabel: Label

  private data: LabelsContainerRenderData

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

  private init(labels: LabelRenderData[]): void {
    this.labels = [
      ...labels.map(() => new Label(this.longSide, this.x, this.y)),
    ]
    this.add(...this.labels, this.tempLabel)

    this.init = undefined
  }

  render(data: LabelsContainerRenderData): void {
    this.init && this.init(data.labels)

    if (this.shouldRender(this.data, data)) {
      this.renderLabels(data.labels)

      if (this.doLabelsCollide() && this.isLabelsHaveDifferentPosition()) {
        this.showTempLabel()
        this.renderTempLabel(data.labels, data.rangeMiddle)
      } else {
        this.hideTempLabel()
      }
    }

    this.data = data
  }

  private renderLabels(labels: LabelRenderData[]) {
    labels.forEach(({ position, value }, i) =>
      this.labels[i].render({ position, value })
    )
  }

  private renderTempLabel(labels: LabelRenderData[], rangeMiddle: number) {
    const value = labels.map((label) => label.value).join(' - ')
    this.tempLabel.render({ position: rangeMiddle, value })
  }
}

export default LabelsContainer
