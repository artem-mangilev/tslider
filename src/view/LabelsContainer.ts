import Label, { LabelRenderData } from './Label'
import OrientationManager from './OrientationManager'
import RenderStatePermitter, { RenderPermitter } from './RenderPermitter'
import ViewComponent from './ViewComponent'
import { ViewElement } from './ViewElement'
import HTMLViewElement from './HTMLViewElement'
import { CollisionDetector } from '../utils/CollisionDetector'

export interface LabelsContainerRenderData {
  labels: LabelRenderData[]
  rangeMiddle: number
}

class LabelsContainer implements ViewComponent {
  private labels: Label[] = []
  private tempLabel: Label

  constructor(
    public element: ViewElement,
    private om: OrientationManager,
    private permitter: RenderPermitter,
    private cd: CollisionDetector
  ) {
    this.tempLabel = new Label(
      new HTMLViewElement('div', 'tslider__label'),
      om,
      new RenderStatePermitter()
    )
  }

  render(data: LabelsContainerRenderData): void {
    this.init && this.init(data.labels)

    if (this.permitter.shouldRerender(data)) {
      this.renderLabels(data.labels)
      this.renderTempLabelIfNeeded(data.labels, data.rangeMiddle)
    }
  }

  private init(labels: LabelRenderData[]): void {
    this.labels = labels.map(() => {
      const element = new HTMLViewElement('div', 'tslider__label')
      return new Label(element, this.om, new RenderStatePermitter())
    })

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
    if (this.doLabelsCollide() && this.isLabelsHaveDifferentPosition()) {
      this.showTempLabel()

      const value = labels.map((label) => label.value).join(' - ')
      this.tempLabel.render({ position: rangeMiddle, value })
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

  private isLabelsHaveDifferentPosition() {
    return (
      this.om.getX(this.labels[0].element.position) !==
      this.om.getX(this.labels[this.labels.length - 1].element.position)
    )
  }

  private doLabelsCollide(): boolean {
    return (
      this.labels.length === 2 &&
      this.cd.doCollide(this.labels[0].element, this.labels[1].element)
    )
  }
}

export default LabelsContainer
