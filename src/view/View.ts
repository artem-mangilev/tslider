import { Orientation } from '../utils/aliases'
import Point from '../utils/Point'
import Handle from './Handle'
import Input from './Input'
import Range from './Range'
import ViewOptions from './ViewOptions'
import { Side, Axis, Direction } from '../OrientationOptions'
import ViewTreeNode from '../utils/ViewTreeNode'
import RulerSegment from '../RulerSegment'
import RulerNode from './RulerNode'
import LabelsContainer from './LabelsContainer'
import Ruler from './Ruler'

class View {
  private targetInput: Input

  private sliderRoot: ViewTreeNode
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
  private direction: Direction

  private inputValuesSeparator: string
  private orientation: Orientation

  constructor({
    targetInput,
    numberOfHandles,
    orientationOption: { orientation, longSide, shortSide, x, y, direction },
    hideInput,
    inputValuesSeparator,
  }: ViewOptions) {
    this.sliderRoot = new ViewTreeNode('div', `tslider tslider_${orientation}`)

    this.targetInput = new Input(targetInput, hideInput)
    this.targetInput.$element.after(this.sliderRoot.$elem)

    Array.from({ length: numberOfHandles }, () => {
      this.handles.push(new Handle())
    })

    this.labelsContainer = new LabelsContainer(longSide, x, y)
    this.range = new Range(longSide)
    this.ruler = new Ruler(longSide, x ,y)

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
    this.direction = direction

    this.inputValuesSeparator = inputValuesSeparator
  }

  getTrackWidth(): number {
    return this.track[this.longSide]
  }

  getTrackHeight(): number {
    return this.track[this.shortSide]
  }

  // TODO: if both handles at max point, drag doesn't work
  slideTo(handlePositions: Point[]): void {
    handlePositions
      .map((pos) => this.changeDirection({ x: pos[this.x], y: pos[this.y] }))
      .forEach((position, i) => this.handles[i].move(position))
  }

  public updateInput(data: string): void {
    this.targetInput.setValue(data)
  }

  updateRange(position: Point, length: number): void {
    if (this.orientation === 'vertical') {
      position.x = position.x + length
    }

    this.range.render(
      // @ts-ignore
      this.changeDirection({ [this.x]: position.x, [this.y]: position.y }),
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
      ruler.map((segment) => ({
        point: this.validateX(segment.point),
        value: segment.value,
      }))
    )
  }

  private changeDirection(point: Point): Point {
    switch (this.direction) {
      case 'left-to-right':
        // @ts-ignore
        return {
          [this.x]: point[this.x],
          [this.y]: point[this.y],
        }
      case 'bottom-to-top':
        // @ts-ignore
        return {
          [this.x]: this.track[this.longSide] - point[this.x],
          [this.y]: point[this.y],
        }
    }
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
    return ({ target, clientX, clientY }) => {
      const isTrack = target === this.track.$elem[0]
      const isRange = target === this.range.$elem[0]
      const isHandles = target === this.handlesContainer.$elem[0]
      const correctTarget = isTrack || isRange || isHandles

      if (correctTarget) {
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
    return (e) => {
      const targetRulerNode = this.rulerNodes.find(
        (node) => node.$elem[0] === e.target
      )

      if (targetRulerNode) {
        handler(Number(targetRulerNode.getContent()))
      }
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
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        handler(entry.contentRect[this.longSide])
      }
    })

    // at this moment this API didn't allow to get border-box size of element
    // so I decide to track the roor of slider, which length is same as track's border-box length
    ro.observe(this.sliderRoot.$elem[0])
  }

  public onInputUpdate(handler: (values: string[]) => void): void {
    const input = this.targetInput.$element[0]

    input.addEventListener('focusout', () => {
      const values = input.value.split(this.inputValuesSeparator)

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
