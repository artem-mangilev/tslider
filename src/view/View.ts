import Point from '../utils/Point'
import Input from './Input'
import Range from './Range'
import RulerSegment from '../model/RulerSegment'
import LabelsContainer from './LabelsContainer'
import Ruler from './Ruler'
import TransferHandle from '../model/TransferHandle'
import HandlesContainer from './HandlesContainer'
import OrientationManager from './OrientationManager'
import TransferFiller from '../model/TransferFiller'
import ViewComponent from './ViewComponent'
import { ViewElement } from './ViewElement'
import HTMLViewElementClickObserver from './HTMLViewElementClickObserver'
import HTMLViewElementResizeObserver from './HTMLViewElementResizeObserver'
import ViewDependencies from './ViewDependencies'

export interface ViewRenderData {
  handles: TransferHandle[]
  inputValue: string
  filler: TransferFiller
  ruler: RulerSegment[]
}

class View implements ViewComponent {
  element: ViewElement

  private input: Input
  private track: ViewComponent
  private range: Range
  private labelsContainer: LabelsContainer
  private handlesContainer: HandlesContainer
  private ruler: Ruler
  private showLabels: boolean
  private showRuler: boolean
  private om: OrientationManager

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
    this.showLabels && this.renderLabels(handles)
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

  private renderLabels(handles: TransferHandle[]): void {
    const labels = handles.map(({ position, value }) => ({
      position: this.om.getX(this.om.decodePoint(position, this.track.element)),
      value,
    }))

    this.labelsContainer.render({ labels, rangeMiddle: this.getRangeMiddle() })
  }

  onTrackClick(handler: (point: number) => void): void {
    const possibleTargets = [this.track, this.range, this.handlesContainer]
    const observer = new HTMLViewElementClickObserver()
    observer.listen(...possibleTargets.map((target) => target.element))
    observer.bind((e) => {
      const position = this.om.encodePoint(
        this.getLocalMousePosition(e.point.x, e.point.y, this.track.element),
        this.track.element
      )
      handler(position.x)
    })
  }

  onTrackLengthChanged(handler: (length: number) => void): void {
    const observer = new HTMLViewElementResizeObserver()
    observer.listen(this.element)
    observer.bind((e) => handler(this.om.getWidth(e.target)))
  }

  onRulerClick(handler: (value: string) => void): void {
    this.ruler.onClick(handler)
  }

  onHandleDrag(handler: (point: number, id: number) => void): void {
    this.handlesContainer.onHandleDrag((point, id) => {
      const position = this.om.encodePoint(
        this.getLocalMousePosition(point.x, point.y, this.track.element),
        this.track.element
      )
      handler(position.x, id)
    })
  }

  private getLocalMousePosition(
    mouseX: number,
    mouseY: number,
    { position: { x, y } }: ViewElement
  ): Point {
    return { x: mouseX - x, y: mouseY - y }
  }

  private getRangeMiddle(): number {
    const position =
      this.om.getX(this.range.element.position) -
      this.om.getX(this.track.element.position)
    return position + this.om.getWidth(this.range.element) / 2
  }
}

export default View
