import Point from '../utils/Point'
import Input from './Input'
import Range from './Range'
import ViewParams from './ViewParams'
import ViewTreeNode from '../utils/ViewTreeNode'
import RulerSegment from '../model/RulerSegment'
import LabelsContainer from './LabelsContainer'
import Ruler from './Ruler'
import TransferHandle from '../model/TransferHandle'
import HandlesContainer from './HandlesContainer'
import OrientationManager from './OrientationManager'
import TransferFiller from '../model/TransferFiller'
import ViewComponent from './ViewComponent'
import RenderStatePermitter from './RenderPermitter'

export interface ViewRenderData {
  handles: TransferHandle[]
  inputValue: string
  filler: TransferFiller
  ruler: RulerSegment[]
}

class View implements ViewComponent {
  element: ViewTreeNode

  private input: Input
  private track: ViewComponent = {
    element: new ViewTreeNode('div', 'tslider__track'),
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
    this.element = new ViewTreeNode('div', `tslider tslider_${orientation}`)

    this.om = new OrientationManager(orientation)

    this.input = new Input(targetInput)
    this.handlesContainer = new HandlesContainer(new RenderStatePermitter())
    this.labelsContainer = new LabelsContainer(
      this.om,
      new RenderStatePermitter()
    )
    this.range = new Range(this.om)
    this.ruler = new Ruler(
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

    possibleTargets.forEach((target) => {
      target.element.onClick(this.createTrackClickHandler(handler))
    })
  }

  onRulerClick(handler: (value: string) => void): void {
    this.ruler.onClick(({ target }) => {
      handler(new ViewTreeNode(<HTMLElement>target).getContent())
    })
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

  onTrackLengthChanged(handler: (length: number) => void): void {
    this.element.onResize((size) => handler(this.om.getWidth(size)))
  }

  private getLocalMousePosition(
    mouseX: number,
    mouseY: number,
    { position: { x, y } }: ViewTreeNode
  ): Point {
    return { x: mouseX - x, y: mouseY - y }
  }

  private createTrackClickHandler(
    handler: (point: number) => void
  ): (event: MouseEvent) => void {
    return ({ clientX, clientY }) => {
      const position = this.om.encodePoint(
        this.getLocalMousePosition(clientX, clientY, this.track.element),
        this.track.element
      )
      handler(position.x)
    }
  }

  private getRangeMiddle(): number {
    const position =
      this.om.getX(this.range.element.position) -
      this.om.getX(this.track.element.position)
    return position + this.om.getWidth(this.range.element) / 2
  }
}

export default View
