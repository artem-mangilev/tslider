import { LabelRenderData } from './Label'
import { RenderPermitter } from './RenderPermitter'
import ViewComponent from './ViewComponent'
import { ViewElement } from './ViewElement'
import { CollisionDetector } from '../utils/CollisionDetector'

export interface LabelsContainerRenderData {
  labels: LabelRenderData[]
  rangeMiddle: number
}

class LabelsContainer implements ViewComponent {
  constructor(
    public element: ViewElement,
    private permitter: RenderPermitter,
    private cd: CollisionDetector,
    private tempLabel: ViewComponent,
    private labels: ViewComponent[]
  ) {
    this.element.add(
      ...this.labels.map((label) => label.element),
      this.tempLabel.element
    )
  }

  render(data: LabelsContainerRenderData): void {
    if (this.permitter.shouldRerender(data)) {
      this.renderLabels(data.labels)
      this.renderTempLabelIfNeeded(data.labels, data.rangeMiddle)
    }
  }

  private renderLabels(labels: LabelRenderData[]) {
    labels.forEach(({ position, value }, i) =>
      this.labels[i].render({ position, value })
    )
  }

  private renderTempLabelIfNeeded(
    labels: LabelRenderData[],
    rangeMiddle: number
  ) {
    if (this.doLabelsCollide()) {
      this.showTempLabel()

      const values = labels.map((label) => label.value)
      this.tempLabel.render({
        position: rangeMiddle,
        value: this.getTempLabelValue(values),
      })
    } else {
      this.hideTempLabel()
    }
  }

  private showTempLabel() {
    this.labels.map((label) => label.element.hide())
    this.tempLabel.element.show()
  }

  private hideTempLabel() {
    this.labels.map((label) => label.element.show())
    this.tempLabel.element.hide()
  }

  private doLabelsCollide(): boolean {
    return (
      this.labels.length === 2 &&
      this.cd.doCollide(this.labels[0].element, this.labels[1].element)
    )
  }

  private getTempLabelValue(values: string[]): string {
    const valuesAreSame = values.every((value) => value === values[0])
    return valuesAreSame ? values[0] : values.join(' - ')
  }
}

export default LabelsContainer
