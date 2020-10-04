import RulerSegment from '../../model/RulerSegment'
import TransferHandle from '../../model/TransferHandle'
import { OrientationManager } from '../../utils/OrientationManager'
import TransferFiller from '../../model/TransferFiller'
import ViewComponent from '../../io/dom/ViewComponent'
import { ViewElement } from '../../io/dom/ViewElement'
import ViewDependencies from './ViewDependencies'
import Subject from '../../utils/Subject'
import { ViewEvents } from './ViewEvents'

export interface ViewRenderData {
  handles: TransferHandle[]
  inputValue: string
  filler: TransferFiller
  ruler: RulerSegment[]
}

class View extends Subject implements ViewComponent {
  element: ViewElement
  private input: ViewComponent
  private track: ViewComponent
  private range: ViewComponent
  private labelsContainer: ViewComponent
  private handlesContainer: ViewComponent
  private ruler: ViewComponent
  private om: OrientationManager

  trackPoint: number
  rulerValue: string
  handle: { point: number; id: number }

  constructor(deps: ViewDependencies) {
    super()

    this.element = deps.element
    this.om = deps.om
    this.input = deps.input
    this.track = deps.track
    this.handlesContainer = deps.handlesContainer
    this.labelsContainer = deps.labelsContainer
    this.range = deps.range
    this.ruler = deps.ruler

    this.input.element.after(this.element)
    this.element.add(
      this.labelsContainer.element,
      this.track.element,
      this.range.element,
      this.handlesContainer.element,
      this.ruler.element
    )

    this.toggleLabels(deps.showLabels)
    this.toggleRuler(deps.showRuler)
  }

  getTrackWidth(): number {
    return this.om.getWidth(this.track.element)
  }

  getTrackHeight(): number {
    return this.om.getHeight(this.track.element)
  }

  toggleLabels(show: boolean): void {
    // TODO: maybe put this to labels container
    this.toggleComponent(this.labelsContainer, show)
  }

  toggleRuler(show: boolean): void {
    // TODO: maybe put this to ruler
    this.toggleComponent(this.ruler, show)
  }

  render({ handles, filler, inputValue, ruler }: ViewRenderData): void {
    handles = handles.map(({ position, value }) => ({
      position: this.om.decodePoint(position, this.track.element),
      value,
    }))

    this.handlesContainer.render(handles.map((handle) => handle.position))
    const { position, length } = filler
    this.range.render({ position, length, track: this.track.element })
    this.renderLabels(handles, filler)
    this.input.render(inputValue)
    this.ruler.render(ruler)
  }

  private renderLabels(
    handles: TransferHandle[],
    filler: TransferFiller
  ): void {
    const labels = handles.map(({ position, value }) => ({
      position: this.om.getX(position),
      value,
    }))

    const x = this.om.getX(
      this.om.decodePoint(filler.position, this.track.element)
    )
    const rangeMiddle = x + filler.length / 2

    this.labelsContainer.render({ labels, rangeMiddle })
  }

  bindEvents(): void {
    this.track.onClick((e) => {
      const localPoint = {
        x: e.point.x - this.track.element.position.x,
        y: e.point.y - this.track.element.position.y,
      }
      this.trackPoint = this.om.encodePoint(localPoint, this.track.element).x

      this.notify(ViewEvents.TrackClick)
    })

    this.handlesContainer.onDrag((e) => {
      const localPoint = {
        x: e.point.x - this.track.element.position.x,
        y: e.point.y - this.track.element.position.y,
      }
      const point = this.om.encodePoint(localPoint, this.track.element).x
      this.handle = { point, id: e.targetIndex }

      this.notify(ViewEvents.HandleDrag)
    })

    this.track.onResize(() => {
      this.notify(ViewEvents.TrackLengthChanged)
    })

    this.ruler.onClick((e) => {
      this.rulerValue = e.target.getContent()

      this.notify(ViewEvents.RulerClick)
    })
  }

  private toggleComponent(component: ViewComponent, show: boolean): void {
    if (show) {
      component.element.show()
    } else {
      component.element.hide()
    }
  }
}

export default View
