import { Orientation } from '../utils/aliases'
import Point from '../utils/Point'
import Handle from './Handle'
import Input from './Input'
import Range from './Range'
import ViewOptions from './ViewOptions'
import { Side, Axis } from '../OrientationOptions'
import ViewTreeNode from '../utils/ViewTreeNode'
import RulerSegment from '../RulerSegment'
import LabelsContainer from './LabelsContainer'
import Ruler from './Ruler'
import TransferHandle from '../model/TransferHandle'

class View extends ViewTreeNode {
  private input: Input
  private track: ViewTreeNode = new ViewTreeNode('div', 'tslider__track')
  private range: Range
  private labelsContainer: LabelsContainer
  private handlesContainer: ViewTreeNode = new ViewTreeNode(
    'div',
    'tslider__handles'
  )
  private handles: Handle[] = []
  private ruler: Ruler

  private orientation: Orientation
  private longSide: Side
  private shortSide: Side
  private x: Axis
  private y: Axis

  private isRulerClickable: boolean
  private showLabels: boolean
  private showRuler: boolean

  constructor({
    targetInput,
    numberOfHandles,
    orientationOption: { orientation, longSide, shortSide, x, y },
    hideInput,
    isRulerClickable,
    showLabels,
    showRuler,
  }: ViewOptions) {
    super('div', `tslider tslider_${orientation}`)

    this.input = new Input(targetInput, hideInput)
    this.input.after(this)

    Array.from({ length: numberOfHandles }, () => {
      this.handles.push(new Handle())
    })

    this.labelsContainer = new LabelsContainer(longSide, x, y)
    this.range = new Range(longSide)
    this.ruler = new Ruler(longSide, x, y)

    this.add(
      this.labelsContainer,
      this.track,
      this.range,
      this.handlesContainer.add(...this.handles),
      this.ruler
    )

    this.orientation = orientation
    this.longSide = longSide
    this.shortSide = shortSide
    this.x = x
    this.y = y

    this.isRulerClickable = isRulerClickable
    this.showLabels = showLabels
    this.showRuler = showRuler
  }

  getTrackWidth(): number {
    return this.track[this.longSide]
  }

  getTrackHeight(): number {
    return this.track[this.shortSide]
  }

  render(data: {
    handles: TransferHandle[]
    inputValue: string
    rangePosition: Point
    rangeLength: number
    ruler: RulerSegment[]
  }): void {
    this.renderHandles(data.handles.map((handle) => handle.position))

    this.showLabels &&
      this.renderLabels(
        data.handles.map(({ position, value }) => ({
          position: position.x,
          value,
        }))
      )

    this.renderInput(data.inputValue)

    this.renderRange(data.rangePosition, data.rangeLength)

    this.showRuler && this.renderRuler(data.ruler)
  }

  // TODO: if both handles at max point, drag doesn't work
  private renderHandles(positions: Point[]): void {
    positions
      .map((position) => ({
        [this.x]: this.validateX(position.x),
        [this.y]: position.y,
      }))
      // @ts-ignore
      .forEach((position, i) => this.handles[i].move(position))
  }

  private renderInput(data: string): void {
    this.input.setValue(data)
  }

  private renderRange(position: Point, length: number): void {
    if (this.orientation === 'vertical') {
      position.x = position.x + length
    }

    this.range.render(
      // @ts-ignore
      { [this.x]: this.validateX(position.x), [this.y]: position.y },
      length
    )
  }

  private renderLabels(
    labelsData: { position: number; value: string }[]
  ): void {
    this.labelsContainer.render(
      labelsData.map(({ position, value }) => ({
        position: this.validateX(position),
        value,
      })),
      this.getRangeMiddle()
    )
  }

  private renderRuler(ruler: RulerSegment[]): void {
    this.ruler.render(
      ruler.map(({ point, value }) => ({ point: this.validateX(point), value }))
    )
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
    this.handles.forEach((handle, i) => {
      handle.onDrag(this.createHandleDragHandler(handler, i))
    })
  }

  onTrackLengthChanged(handler: (length: number) => void): void {
    this.onResize((size) => handler(size[this.longSide]))
  }

  onInputUpdate(handler: (value: string) => void): void {
    this.input.onFocusout(() => handler(this.input.getValue()))
  }

  private validateX(x: number) {
    if (this.orientation === 'horizontal') {
      return x
    }

    return this.track[this.longSide] - x
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
      const position = this.validateX(
        this.getLocalMousePosition(clientX, clientY, this.track)[this.x]
      )
      handler(position)
    }
  }

  private createHandleDragHandler(
    handler: (point: number, id: number) => void,
    id: number
  ): (event: MouseEvent) => void {
    return ({ clientX, clientY }) => {
      const position = this.validateX(
        this.getLocalMousePosition(clientX, clientY, this.track)[this.x]
      )
      handler(position, id)
    }
  }

  private getRangeMiddle(): number {
    const position = this.range.position[this.x] - this.track.position[this.x]
    return position + this.range[this.longSide] / 2
  }
}

export default View
