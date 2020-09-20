import ViewTreeNode from '../utils/ViewTreeNode'
import Label, { LabelRenderData } from './Label'
import OrientationManager from './OrientationManager'

export interface LabelsContainerRenderData {
  labels: LabelRenderData[]
  rangeMiddle: number
}

class LabelsContainer extends ViewTreeNode {
  private labels: Label[] = []
  private tempLabel: Label

  private data: LabelsContainerRenderData

  constructor(private om: OrientationManager) {
    super('div', 'tslider__labels')

    this.tempLabel = new Label(om)
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
      this.om.getX(this.labels[0].position) !==
      this.om.getX(this.labels[this.labels.length - 1].position)
    )
  }

  private doLabelsCollide(): boolean {
    if (this.labels.length === 1) {
      return false
    }

    const [firstLabel, lastLabel] = this.labels

    const firstLabelX = this.om.getX(firstLabel.position)
    const lastLabelX = this.om.getX(lastLabel.position)

    const firstLabelWidth = this.om.getWidth(firstLabel)
    const lastLabelWidth = this.om.getWidth(lastLabel)

    const isCollisionDetected =
      firstLabelX < lastLabelX + lastLabelWidth &&
      firstLabelX + firstLabelWidth > lastLabelX

    return isCollisionDetected
  }

  private init(labels: LabelRenderData[]): void {
    this.labels = [...labels.map(() => new Label(this.om))]
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
