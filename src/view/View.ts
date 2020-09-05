import { Orientation } from '../utils/aliases'
import Point from '../utils/Point'
import Handle from './Handle'
import Input from './Input'
import Range from './Range'
import ViewOptions from './ViewOptions'
import { Side, Axis } from '../OrientationOptions'
import ViewTreeNode from '../utils/ViewTreeNode'
import RulerSegment from '../RulerSegment'
import RulerNode from './RulerNode'
import LabelsContainer from './LabelsContainer'
import Ruler from './Ruler'
import SliderRoot from './SliderRoot'

class View {
  private input: Input

  private sliderRoot: SliderRoot
  private track: ViewTreeNode = new ViewTreeNode('div', 'tslider__track')
  private range: Range
  private labelsContainer: LabelsContainer
  private handlesContainer: ViewTreeNode = new ViewTreeNode(
    'div',
    'tslider__handles'
  )
  private ruler: Ruler
  private rulerNodes: RulerNode[] = []
  private handles: Handle[] = []

  private longSide: Side
  private shortSide: Side
  private x: Axis
  private y: Axis

  private inputValuesSeparator: string
  private orientation: Orientation

  constructor({
    targetInput,
    numberOfHandles,
    orientationOption: { orientation, longSide, shortSide, x, y },
    hideInput,
    inputValuesSeparator,
  }: ViewOptions) {
    this.sliderRoot = new SliderRoot(orientation)

    this.input = new Input(targetInput, hideInput)
    this.input.after(this.sliderRoot)

    Array.from({ length: numberOfHandles }, () => {
      this.handles.push(new Handle())
    })

    this.labelsContainer = new LabelsContainer(longSide, x, y)
    this.range = new Range(longSide)
    this.ruler = new Ruler(longSide, x, y)

    // prettier-ignore
    this.sliderRoot.add(
      this.labelsContainer,
      this.track,
      this.range,
      this.handlesContainer.add(
        ...this.handles
      ),
      this.ruler
    )

    this.orientation = orientation
    this.longSide = longSide
    this.shortSide = shortSide
    this.x = x
    this.y = y

    this.inputValuesSeparator = inputValuesSeparator
  }

  getTrackWidth(): number {
    return this.track[this.longSide]
  }

  getTrackHeight(): number {
    return this.track[this.shortSide]
  }

  // TODO: if both handles at max point, drag doesn't work
  slideTo(positions: Point[]): void {
    positions
      .map((position) => ({
        [this.x]: this.validateX(position.x),
        [this.y]: position.y,
      }))
      // @ts-ignore
      .forEach((position, i) => this.handles[i].move(position))
  }

  public updateInput(data: string): void {
    this.input.setValue(data)
  }

  updateRange(position: Point, length: number): void {
    if (this.orientation === 'vertical') {
      position.x = position.x + length
    }

    this.range.render(
      // @ts-ignore
      { [this.x]: this.validateX(position.x), [this.y]: position.y },
      length
    )
  }

  private getRangeMiddle(): number {
    const position = this.range.position[this.x] - this.track.position[this.x]
    return position + this.range[this.longSide] / 2
  }

  updateLabels(labelsData: { position: number; value: string }[]): void {
    this.labelsContainer.render(
      labelsData.map(({ position, value }) => ({
        position: this.validateX(position),
        value,
      })),
      this.getRangeMiddle()
    )
  }

  renderRuler(ruler: RulerSegment[]): void {
    this.ruler.render(
      ruler.map(({ point, value }) => ({ point: this.validateX(point), value }))
    )
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

  private getIfOneOf(element: HTMLElement, nodes: ViewTreeNode[]) {
    return nodes.find((node) => node.$elem[0] === element)
  }

  private createTrackClickHandler(
    handler: (point: number) => void
  ): (event: MouseEvent) => void {
    return ({ target, clientX, clientY }) => {
      const possibleTargets = [this.track, this.range, this.handlesContainer]

      if (this.getIfOneOf(<HTMLElement>target, possibleTargets)) {
        const position = this.validateX(
          this.getLocalMousePosition(clientX, clientY, this.track)[this.x]
        )
        handler(position)
      }
    }
  }

  public onTrackClick(handler: (point: number) => void): void {
    this.sliderRoot.onClick(this.createTrackClickHandler(handler))
  }

  private createRulerClickHandler(
    handler: (point: number) => void
  ): (event: MouseEvent) => void {
    return ({ target }) => {
      const node = this.getIfOneOf(<HTMLElement>target, this.rulerNodes)
      if (node) handler(Number(node.getContent()))
    }
  }

  public onRulerClick(handler: (point: number) => void): void {
    this.ruler.onClick(this.createRulerClickHandler(handler))
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

  public onHandleDrag(handler: (point: number, id: number) => void): void {
    this.handles.forEach((handle, i) => {
      handle.onDrag(this.createHandleDragHandler(handler, i))
    })
  }

  public onTrackLengthChanged(handler: (length: number) => void): void {
    this.sliderRoot.onResize((size) => handler(size[this.longSide]))
  }

  public onInputUpdate(handler: (values: string[]) => void): void {
    this.input.onFocusout(() => {
      const values = this.input.getValue().split(this.inputValuesSeparator)

      for (const value of values) {
        if (isNaN(Number(value))) {
          return
        }
      }

      handler(values)
    })
  }
}

export default View
