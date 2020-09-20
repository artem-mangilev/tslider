import { Orientation } from '../utils/aliases'
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

export interface ViewRenderData {
  handles: TransferHandle[]
  inputValue: string
  rangePosition: Point
  rangeLength: number
  ruler: RulerSegment[]
}

class View extends ViewTreeNode {
  private input: Input
  private track: ViewTreeNode = new ViewTreeNode('div', 'tslider__track')
  private range: Range
  private labelsContainer: LabelsContainer
  private handlesContainer: HandlesContainer
  private ruler: Ruler

  private isRulerClickable: boolean
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
    super('div', `tslider tslider_${orientation}`)

    this.om = new OrientationManager(orientation)

    this.input = new Input(targetInput)
    this.handlesContainer = new HandlesContainer()
    this.labelsContainer = new LabelsContainer(this.om)
    this.range = new Range(this.om)
    this.ruler = new Ruler(this.om)

    this.input.after(this)
    this.add(
      this.labelsContainer,
      this.track,
      this.range,
      this.handlesContainer,
      this.ruler
    )

    this.isRulerClickable = isRulerClickable
    this.showLabels = showLabels
    this.showRuler = showRuler
  }

  getTrackWidth(): number {
    return this.om.getWidth(this.track)
  }

  getTrackHeight(): number {
    return this.om.getHeight(this.track)
  }

  toggleLabels(show: boolean): void {
    this.showLabels = show

    if (show) {
      this.labelsContainer.show()
    } else {
      this.labelsContainer.hide()
    }
  }

  toggleRuler(show: boolean): void {
    this.showRuler = show

    if (show) {
      this.ruler.show()
    } else {
      this.ruler.hide()
    }
  }

  render(data: ViewRenderData): void {
    this.renderHandles(data.handles.map((handle) => handle.position))
    this.renderRange(data.rangePosition, data.rangeLength)
    this.showLabels && this.renderLabels(data.handles)
    this.renderInput(data.inputValue)
    this.showRuler && this.renderRuler(data.ruler)
  }

  // TODO: if both handles at max point, drag doesn't work
  private renderHandles(positions: Point[]): void {
    this.handlesContainer.render(
      positions.map((position) => this.om.decodePoint(position, this.track))
    )
  }

  private renderInput(data: string): void {
    this.input.setValue(data)
  }

  private renderRange(position: Point, length: number): void {
    this.range.render({ position, length, track: this.track })
  }

  private renderLabels(handles: TransferHandle[]): void {
    const labels = handles.map(({ position, value }) => ({
      position: this.om.getX(this.om.decodePoint(position, this.track)),
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
      target.onClick(this.createTrackClickHandler(handler))
    })
  }

  onRulerClick(handler: (value: string) => void): void {
    this.isRulerClickable &&
      this.ruler.onClick(({ target }) => {
        handler(new ViewTreeNode(<HTMLElement>target).getContent())
      })
  }

  onHandleDrag(handler: (point: number, id: number) => void): void {
    this.handlesContainer.onHandleDrag((point, id) => {
      const position = this.om.encodePoint(
        this.getLocalMousePosition(point.x, point.y, this.track),
        this.track
      )
      handler(position.x, id)
    })
  }

  onTrackLengthChanged(handler: (length: number) => void): void {
    this.onResize((size) => handler(this.om.getWidth(size)))
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
        this.getLocalMousePosition(clientX, clientY, this.track),
        this.track
      )
      handler(position.x)
    }
  }

  private getRangeMiddle(): number {
    const position =
      this.om.getX(this.range.position) - this.om.getX(this.track.position)
    return position + this.om.getWidth(this.range) / 2
  }
}

export default View
