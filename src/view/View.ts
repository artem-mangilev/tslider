import Point from '../utils/Point'
import Input from './Input'
import Range from './Range'
import ViewParams from './ViewParams'
import RulerSegment from '../model/RulerSegment'
import LabelsContainer from './LabelsContainer'
import Ruler from './Ruler'
import TransferHandle from '../model/TransferHandle'
import HandlesContainer from './HandlesContainer'
import OrientationManager from './OrientationManager'
import TransferFiller from '../model/TransferFiller'
import ViewComponent from './ViewComponent'
import RenderStatePermitter from './RenderPermitter'
import { ViewElement } from './ViewElement'
import HTMLViewElement from "./HTMLViewElement"
import HTMLViewElementDragObserver from './HTMLViewElementDragObserver'
import HTMLViewElementClickObserver from './HTMLViewElementClickObserver'
import HTMLViewElementResizeObserver from './HTMLViewElementResizeObserver'

export interface ViewRenderData {
  handles: TransferHandle[]
  inputValue: string
  filler: TransferFiller
  ruler: RulerSegment[]
}

class View implements ViewComponent {
  element: ViewElement

  private input: Input
  private track: ViewComponent = {
    element: new HTMLViewElement('div', 'tslider__track'),
  }
  private range: Range
  private labelsContainer: LabelsContainer
  private handlesContainer: HandlesContainer
  private ruler: Ruler

  private showLabels: boolean
  private showRuler: boolean
  private om: OrientationManager

  constructor({
    targetInput,
    orientation,
    isRulerClickable,
    showLabels,
    showRuler,
  }: ViewParams) {
    this.element = new HTMLViewElement('div', `tslider tslider_${orientation}`)

    this.om = new OrientationManager(orientation)

    this.input = new Input(new HTMLViewElement(targetInput))
    this.handlesContainer = new HandlesContainer(
      new HTMLViewElement('div', 'tslider__handles'),
      new HTMLViewElementDragObserver(),
      new RenderStatePermitter()
    )
    this.labelsContainer = new LabelsContainer(
      new HTMLViewElement('div', 'tslider__labels'),
      this.om,
      new RenderStatePermitter()
    )
    this.range = new Range(
      new HTMLViewElement('div', 'tslider__range'),
      this.om
    )
    this.ruler = new Ruler(
      new HTMLViewElement('div', 'tslider__ruler'),
      new HTMLViewElementClickObserver(),
      this.om,
      new RenderStatePermitter(),
      isRulerClickable
    )

    this.input.element.after(this.element)
    this.element.add(
      this.labelsContainer.element,
      this.track.element,
      this.range.element,
      this.handlesContainer.element,
      this.ruler.element
    )

    this.showLabels = showLabels
    this.showRuler = showRuler
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

  render(data: ViewRenderData): void {
    this.renderHandles(data.handles.map((handle) => handle.position))
    this.renderRange(data.filler)
    this.showLabels && this.renderLabels(data.handles)
    this.renderInput(data.inputValue)
    this.showRuler && this.renderRuler(data.ruler)
  }

  // TODO: if both handles at max point, drag doesn't work
  private renderHandles(positions: Point[]): void {
    this.handlesContainer.render(
      positions.map((position) =>
        this.om.decodePoint(position, this.track.element)
      )
    )
  }

  private renderInput(data: string): void {
    this.input.setValue(data)
  }

  private renderRange({ position, length }: TransferFiller): void {
    this.range.render({ position, length, track: this.track.element })
  }

  private renderLabels(handles: TransferHandle[]): void {
    const labels = handles.map(({ position, value }) => ({
      position: this.om.getX(this.om.decodePoint(position, this.track.element)),
      value,
    }))

    this.labelsContainer.render({ labels, rangeMiddle: this.getRangeMiddle() })
  }

  private renderRuler(ruler: RulerSegment[]): void {
    this.ruler.render(ruler)
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
