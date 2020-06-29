import { OneDimensionalSpacePoint } from '../utils/aliases'
import Point from '../utils/Point'
import Handle from './Handle'
import Input from './Input'
import Label from './Label'
import Range from './Range'
import ViewOptions from './ViewOptions'
import { Side, Axis, Direction } from '../OrientationOptions'
import ViewTreeNode from '../utils/ViewTreeNode'
import RulerSegment from '../RulerSegment'
import RulerNode from './RulerNode'

class View {
  private targetInput: Input

  private sliderRoot: ViewTreeNode
  private track: ViewTreeNode = new ViewTreeNode('div', 'tslider__track')
  private range: Range = new Range('tslider__range')
  private labelsContainer: ViewTreeNode = new ViewTreeNode(
    'div',
    'tslider__labels'
  )
  private handlesContainer: ViewTreeNode = new ViewTreeNode(
    'div',
    'tslider__handles'
  )
  private ruler: ViewTreeNode = new ViewTreeNode('div', 'tslider__ruler')
  private rulerNodes: RulerNode[] = []
  private handles: Handle[] = []
  private labels: Label[] = []
  private tempLabel: Label

  private longSide: Side
  private shortSide: Side
  private x: Axis
  private y: Axis
  private direction: Direction

  private labelFlag: boolean
  private inputValuesSeparator: string

  constructor({
    targetInput,
    numberOfHandles,
    orientationOption: { orientation, longSide, shortSide, x, y, direction },
    label,
    hideInput,
    inputValuesSeparator,
  }: ViewOptions) {
    this.sliderRoot = new ViewTreeNode('div', `tslider tslider_${orientation}`)

    // put it after the targetInput
    this.targetInput = new Input(targetInput, hideInput)
    this.targetInput.$element.after(this.sliderRoot.$elem)

    // this is the functional way to iterate when only finish number is given
    // for example, if length === 2, callback will be evaluated 2 times.
    // this code just generates labels and handles
    Array.from({ length: numberOfHandles }, () => {
      this.handles.push(new Handle('tslider__handle'))
      this.labels.push(new Label('tslider__label'))
    })

    this.tempLabel = new Label('tslider__label')

    // prettier-ignore
    this.sliderRoot.add(
      label && this.labelsContainer.add(
        ...this.labels,
        this.tempLabel
      ),
      this.track.add(
      ),
      this.range,
      this.handlesContainer.add(
        ...this.handles
      )
    )

    // make properties from sides in order to use outside the constructor
    this.longSide = longSide
    this.shortSide = shortSide
    this.x = x
    this.y = y
    this.direction = direction

    this.labelFlag = label
    this.inputValuesSeparator = inputValuesSeparator
  }

  public get trackLength(): number {
    return this.track[this.longSide]
  }

  // TODO: if both handles at max point, drag doesn't work
  public slideTo(handlePositions: OneDimensionalSpacePoint[]): void {
    const newHandlePositions = handlePositions.map((position) =>
      // TODO: now I have no clue how type checking works for computed properties, so I just turn it off
      // @ts-ignore
      this.changeDirection({
        [this.x]: position,
        [this.y]: this.track[this.shortSide] / 2,
      })
    )
    // move the handles
    newHandlePositions.forEach((position, i) => this.handles[i].move(position))
  }

  public updateInput(data: string): void {
    this.targetInput.setValue(data)
  }

  public updateRange(positions: OneDimensionalSpacePoint[]): void {
    const [startPosition, endPosition] = positions

    const length = endPosition - startPosition

    this.range[this.longSide] = length
    this.range[this.shortSide] = this.track[this.shortSide]

    const [validStartPosition] = positions
      // we need to figure out the positions of the range point according to orientation
      .map((position) =>
        // @ts-ignore
        this.changeDirection({ [this.x]: position, [this.y]: 0 })
      )
      // then decide what is actual start position
      .sort((a, b) => a[this.x] - b[this.x])

    this.range.move(validStartPosition)
  }

  public updateLabels(positions: OneDimensionalSpacePoint[], data: number[]) {
    if (!this.labelFlag) {
      return
    }

    this.labels.forEach((label, i) => {
      // @ts-ignore
      const position = this.changeDirection({
        [this.x]: positions[i],
        [this.y]: 0,
      })

      // TODO: combine updateData with move, because these methods depends on each other (this should be placed BEFORE move)
      label.updateData(data[i].toString())

      // label should be placed in the middle of handle
      const middle = label[this.longSide] / 2
      position[this.x] -= middle

      label.move(position)
    })

    const firstLabel = this.labels[0]
    const lastLabel = this.labels[this.labels.length - 1]

    const isHandlesHaveSamePosition =
      firstLabel.position[this.x] === lastLabel.position[this.x]

    if (this.doLabelsCollide(this.labels) && !isHandlesHaveSamePosition) {
      firstLabel.$elem.css('visibility', 'hidden')
      lastLabel.$elem.css('visibility', 'hidden')

      // the temp label should show the data of both labels
      this.tempLabel.updateData(`${firstLabel.data} - ${lastLabel.data}`)
      this.tempLabel.$elem.css('visibility', 'visible')

      const rangePosition =
        this.range.position[this.x] - this.track.position[this.x]
      // single label should be placed at the middle of the range
      const rangeMiddlePosition: number =
        rangePosition + this.range[this.longSide] / 2

      const labelMiddle = this.tempLabel[this.longSide] / 2
      const labelPosition = rangeMiddlePosition - labelMiddle

      // @ts-ignore
      this.tempLabel.move({
        [this.x]: labelPosition,
        [this.y]: 0,
      })
    } else {
      firstLabel.$elem.css('visibility', 'visible')
      lastLabel.$elem.css('visibility', 'visible')

      this.tempLabel.$elem.css('visibility', 'hidden')
    }
  }

  // TODO: maybe this method could be more general
  private doLabelsCollide(labels: Label[]): boolean {
    // they don't collide if there is 1 label
    if (labels.length === 1) {
      return false
    }

    const [firstLabel, lastLabel] = labels

    const firstLabelX = firstLabel.position[this.x]
    const lastLabelX = lastLabel.position[this.x]

    const firstLabelWidth = firstLabel[this.longSide]
    const lastLabelWidth = lastLabel[this.longSide]

    const isCollisionDetected =
      firstLabelX < lastLabelX + lastLabelWidth &&
      firstLabelX + firstLabelWidth > lastLabelX

    return isCollisionDetected
  }

  public renderRuler(ruler: RulerSegment[]): void {
    ruler.forEach((segment) => {
      const node = new RulerNode('tslider__ruler-node')

      node.value = segment.value.toString()

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
        handler(Number(targetRulerNode.value))
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
