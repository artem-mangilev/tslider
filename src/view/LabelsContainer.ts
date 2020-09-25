import ViewTreeNode from '../utils/ViewTreeNode'
import Label, { LabelRenderData } from './Label'
import OrientationManager from './OrientationManager'
import ViewComponent from './ViewComponent'

export interface LabelsContainerRenderData {
  labels: LabelRenderData[]
  rangeMiddle: number
}

class LabelsContainer implements ViewComponent {
  element = new ViewTreeNode('div', 'tslider__labels')

  private labels: Label[] = []
  private tempLabel: Label

  private data: LabelsContainerRenderData

  constructor(private om: OrientationManager) {
    this.tempLabel = new Label(om)
  }

  private showTempLabel() {
    this.labels.map((label) => label.element.hide())
    this.tempLabel.element.show()
  }

  private hideTempLabel() {
    this.labels.map((label) => label.element.show())
    this.tempLabel.element.hide()
  }

  private isLabelsHaveDifferentPosition() {
    return (
      this.om.getX(this.labels[0].element.position) !==
      this.om.getX(this.labels[this.labels.length - 1].element.position)
    )
  }

  private doLabelsCollide(): boolean {
    if (this.labels.length === 1) {
      return false
    }

    const [firstLabel, lastLabel] = this.labels

    const firstLabelX = this.om.getX(firstLabel.element.position)
    const lastLabelX = this.om.getX(lastLabel.element.position)

    const firstLabelWidth = this.om.getWidth(firstLabel.element)
    const lastLabelWidth = this.om.getWidth(lastLabel.element)

    const isCollisionDetected =
      firstLabelX < lastLabelX + lastLabelWidth &&
      firstLabelX + firstLabelWidth > lastLabelX

    return isCollisionDetected
  }

  private init(labels: LabelRenderData[]): void {
    this.labels = [...labels.map(() => new Label(this.om))]
    this.element.add(
      ...this.labels.map((label) => label.element),
      this.tempLabel.element
    )

    this.init = undefined
  }

  render(data: LabelsContainerRenderData): void {
    this.init && this.init(data.labels)

    if (this.element.shouldRender(this.data, data)) {
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
