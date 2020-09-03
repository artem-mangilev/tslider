import { OneDimensionalSpacePoint, Orientation } from '../utils/aliases'
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

class View {
  private targetInput: Input

  private sliderRoot: ViewTreeNode
  private track: ViewTreeNode = new ViewTreeNode('div', 'tslider__track')
  private range: Range = new Range()
  private labelsContainer: LabelsContainer
  private handlesContainer: ViewTreeNode = new ViewTreeNode(
    'div',
    'tslider__handles'
  )
  private ruler: ViewTreeNode = new ViewTreeNode('div', 'tslider__ruler')
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

    // prettier-ignore
    this.sliderRoot.add(
      this.labelsContainer,
      this.track,
      this.range,
      this.handlesContainer.add(
        ...this.handles
      )
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

    this.range[this.longSide] = length
    this.range.move(
      // @ts-ignore
      this.changeDirection({ [this.x]: position.x, [this.y]: position.y })
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

  public renderRuler(ruler: RulerSegment[]): void {
    ruler.forEach((segment) => {
      const node = new RulerNode()

      node.setContent(segment.value.toString())

      // @ts-ignore
      node.move({
        [this.x]: segment.point,
        [this.y]: 0,
      })

      this.rulerNodes.push(node)
    })

    // prettier-ignore
    this.sliderRoot.add(
      this.ruler.add(
        ...this.rulerNodes
      )
    )

    ruler.forEach((segment, i) => {
      const node = this.rulerNodes[i]

      // @ts-ignore
      const position = this.changeDirection({
        [this.x]: segment.point,
        [this.y]: 0,
      })

      const middle = node[this.longSide] / 2
      position[this.x] -= middle

      this.rulerNodes[i].move(position)
    })
  }

  public updateRuler(ruler: RulerSegment[]): void {
    ruler.forEach((segment, i) => {
      const node = this.rulerNodes[i]

      // @ts-ignore
      const position = this.changeDirection({
        [this.x]: segment.point,
        [this.y]: 0,
      })

      const middle = node[this.longSide] / 2
      position[this.x] -= middle

      this.rulerNodes[i].move(position)
    })
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

  private createTrackClickHandler(
    handler: (point: OneDimensionalSpacePoint) => void
  ): (event: MouseEvent) => void {
    return (e) => {
      const position = this.changeDirection({
        x: e.clientX - this.track.position.x,
        y: e.clientY - this.track.position.y,
      })

      // filter out negative values of x
      if (position[this.x] < 0) return

      // call handler only if click occurs on track or range
      const isTrack = e.target === this.track.$elem[0]
      const isRange = e.target === this.range.$elem[0]
      const isHandles = e.target === this.handlesContainer.$elem[0]
      const correctTarget = isTrack || isRange || isHandles

      if (correctTarget) handler(position[this.x])
    }
  }

  public onTrackClick(
    handler: (point: OneDimensionalSpacePoint) => void
  ): void {
    // TODO: find the way to attach an event handler with Jquery
    this.sliderRoot.$elem[0].addEventListener(
      'click',
      this.createTrackClickHandler(handler)
    )
  }

  private createRulerClickHandler(
    handler: (point: OneDimensionalSpacePoint) => void
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

  public onRulerClick(
    handler: (point: OneDimensionalSpacePoint) => void
  ): void {
    this.ruler.$elem[0].addEventListener(
      'click',
      this.createRulerClickHandler(handler)
    )
  }

  private createHandleDragHandler(
    handler: (point: OneDimensionalSpacePoint, handleIndex: number) => void,
    handleIndex: number
  ): (event: MouseEvent) => void {
    return (e) => {
      const position: Point = this.changeDirection({
        x: e.clientX - this.track.position.x,
        y: e.clientY - this.track.position.y,
      })

      handler(position[this.x], handleIndex)
    }
  }

  public onHandleDrag(
    handler: (point: OneDimensionalSpacePoint, handleIndex: number) => void
  ): void {
    let dragHandler: (event: MouseEvent) => void

    const $root = $('html')

    $root.mousedown(({ target }) => {
      // if target is one of the handles, attach mousemove event
      this.handles.forEach((handle, i) => {
        if (target === handle.$elem[0]) {
          dragHandler = this.createHandleDragHandler(handler, i)

          $root[0].addEventListener('mousemove', dragHandler)
        }
      })
    })

    // when user releases the button in any place, remove event
    $root.mouseup(() => {
      $root[0].removeEventListener('mousemove', dragHandler)
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
