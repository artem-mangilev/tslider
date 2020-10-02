import Point from '../utils/Point'
import RulerSegment from '../model/RulerSegment'
import Ruler from './Ruler'
import TransferHandle from '../model/TransferHandle'
import HandlesContainer from './HandlesContainer'
import OrientationManager from './OrientationManager'
import TransferFiller from '../model/TransferFiller'
import ViewComponent from './ViewComponent'
import { ViewElement } from './ViewElement'
import ViewDependencies from './ViewDependencies'
import Track from './Track'
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
  private track: Track
  private range: ViewComponent
  private labelsContainer: ViewComponent
  private handlesContainer: HandlesContainer
  private ruler: Ruler
  private showLabels: boolean
  private showRuler: boolean
  private om: OrientationManager

  trackPoint: number
  trackLength: number
  rulerValue: string
  handle: { point: number; id: number }

  constructor({
    element,
    input,
    track,
    handlesContainer,
    labelsContainer,
    range,
    ruler,
    om,
    showLabels,
    showRuler,
  }: ViewDependencies) {
    super()

    this.element = element
    this.om = om
    this.input = input
    this.track = track
    this.handlesContainer = handlesContainer
    this.labelsContainer = labelsContainer
    this.range = range
    this.ruler = ruler
    this.showLabels = showLabels
    this.showRuler = showRuler

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
    this.renderHandles(handles.map((handle) => handle.position))
    const { position, length } = filler
    this.range.render({ position, length, track: this.track.element })
    this.showLabels && this.renderLabels(handles, filler)
    this.input.render(inputValue)
    this.showRuler && this.ruler.render(ruler)
  }

  // TODO: if both handles at max point, drag doesn't work
  private renderHandles(positions: Point[]): void {
    this.handlesContainer.render(
      positions.map((position) =>
        this.om.decodePoint(position, this.track.element)
      )
    )
  }

  private renderLabels(
    handles: TransferHandle[],
    filler: TransferFiller
  ): void {
    const labels = handles.map(({ position, value }) => ({
      position: this.om.getX(this.om.decodePoint(position, this.track.element)),
      value,
    }))
    const rangeMiddle = filler.position.x + filler.length / 2
    this.labelsContainer.render({ labels, rangeMiddle })
  }

  bindEvents(): void {
    this.track.onClick((point) => {
      this.trackPoint = this.om.encodePoint(point, this.track.element).x

      this.notify(ViewEvents.TrackClick)
    })

    this.track.onResize((size) => {
      this.trackLength = this.om.getWidth(size)

      this.notify(ViewEvents.TrackLengthChanged)
    })

    this.ruler.onClick((value) => {
      this.rulerValue = value

      this.notify(ViewEvents.RulerClick)
    })

    this.handlesContainer.onHandleDrag((point, id) => {
      const position = this.om.encodePoint(
        this.getLocalMousePosition(point.x, point.y, this.track.element),
        this.track.element
      )
      this.handle = { point: position.x, id }

      this.notify(ViewEvents.HandleDrag)
    })
  }

  private getLocalMousePosition(
    mouseX: number,
    mouseY: number,
    { position: { x, y } }: ViewElement
  ): Point {
    return { x: mouseX - x, y: mouseY - y }
  }
}

export default View
