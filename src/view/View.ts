import RulerSegment from '../model/RulerSegment'
import TransferHandle from '../model/TransferHandle'
import { OrientationManager } from './OrientationManager'
import TransferFiller from '../model/TransferFiller'
import ViewComponent from './ViewComponent'
import { ViewElement } from './ViewElement'
import ViewDependencies from './ViewDependencies'
import Subject from '../utils/Subject'
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
  private showLabels: boolean
  private showRuler: boolean
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
    this.showLabels = deps.showLabels
    this.showRuler = deps.showRuler

    this.input.element.after(this.element)
    this.element.add(
      this.labelsContainer.element,
      this.track.element,
      this.range.element,
      this.handlesContainer.element,
      this.ruler.element
    )
  }

  getTrackWidth(): number {
    return this.om.getWidth(this.track.element)
  }

  getTrackHeight(): number {
    return this.om.getHeight(this.track.element)
  }

  toggleLabels(show: boolean): void {
    this.showLabels = show

    // TODO: maybe put this to labels container
    if (show) {
      this.labelsContainer.element.show()
    } else {
      this.labelsContainer.element.hide()
    }
  }

  toggleRuler(show: boolean): void {
    this.showRuler = show

    // TODO: maybe put this to ruler
    if (show) {
      this.ruler.element.show()
    } else {
      this.ruler.element.hide()
    }
  }

  render({ handles, filler, inputValue, ruler }: ViewRenderData): void {
    handles = handles.map(({ position, value }) => ({
      position: this.om.decodePoint(position, this.track.element),
      value,
    }))

    this.handlesContainer.render(handles.map((handle) => handle.position))
    const { position, length } = filler
    this.range.render({ position, length, track: this.track.element })
    this.showLabels && this.renderLabels(handles, filler)
    this.input.render(inputValue)
    this.showRuler && this.ruler.render(ruler)
  }

  private renderLabels(
    handles: TransferHandle[],
    filler: TransferFiller
  ): void {
    const labels = handles.map(({ position, value }) => ({
      position: this.om.getX(position),
      value,
    }))

    let rangeMiddle
    if (this.om.isVertical()) {
      rangeMiddle =
        this.track.element.height - filler.position.x + filler.length / 2
    } else {
      rangeMiddle = filler.position.x + filler.length / 2
    }

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
}

export default View
