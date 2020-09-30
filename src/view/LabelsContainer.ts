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
  ) {}

  render(data: LabelsContainerRenderData): void {
    this.init && this.init()

    if (this.permitter.shouldRerender(data)) {
      this.renderLabels(data.labels)
      this.renderTempLabelIfNeeded(data.labels, data.rangeMiddle)
    }
  }

  private init(): void {
    this.element.add(
      ...this.labels.map((label) => label.element),
      this.tempLabel.element
    )

    this.init = undefined
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
    if (values.every((value) => value === values[0])) {
      return values[0]
    }
    return values.join(' - ')
  }
}

export default LabelsContainer
