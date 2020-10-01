import ShapeCollisionDetector from '../utils/ShapeCollisionDetector'
import HandlesContainer from './HandlesContainer'
import HTMLViewElement from './HTMLViewElement'
import HTMLViewElementDragObserver from './HTMLComponentDragObserver'
import Input from './Input'
import LabelsContainer from './LabelsContainer'
import OrientationManager from './OrientationManager'
import RenderStatePermitter from './RenderPermitter'
import ViewParams from './ViewParams'
import Range from './Range'
import Ruler from './Ruler'
import HTMLViewElementClickObserver from './HTMLComponentClickObserver'
import View from './View'
import ViewComponent from './ViewComponent'
import Handle from './Handle'
import Label from './Label'
import RulerNode from './RulerNode'

class ViewBuilder {
  constructor(private params: ViewParams) {}

  build(): View {
    const element = new HTMLViewElement(
      'div',
      `tslider tslider_${this.params.orientation}`
    )
    const orientationManager = new OrientationManager(this.params.orientation)
    const input = new Input(new HTMLViewElement(this.params.targetInput))
    const track: ViewComponent = {
      element: new HTMLViewElement('div', 'tslider__track'),
      render() {
        return
      },
    }
    const handles = Array.from(
      { length: this.params.handles },
      () => new Handle(new HTMLViewElement('div', 'tslider__handle'))
    )
    const handlesContainer = new HandlesContainer(
      new HTMLViewElement('div', 'tslider__handles'),
      new HTMLViewElementDragObserver(),
      new RenderStatePermitter(),
      handles
    )
    const [tempLabel, ...labels] = Array.from(
      { length: this.params.handles + 1 },
      () =>
        new Label(
          new HTMLViewElement('div', 'tslider__label'),
          orientationManager,
          new RenderStatePermitter()
        )
    )
    const labelsContainer = new LabelsContainer(
      new HTMLViewElement('div', 'tslider__labels'),
      new RenderStatePermitter(),
      new ShapeCollisionDetector(),
      tempLabel,
      labels
    )
    const range = new Range(
      new HTMLViewElement('div', 'tslider__range'),
      orientationManager
    )
    const rulerNodes = Array.from(
      { length: this.params.rulerSteps + 1 },
      () => {
        const element = new HTMLViewElement('span', 'tslider__ruler-node')
        return new RulerNode(element, orientationManager)
      }
    )
    const ruler = new Ruler(
      new HTMLViewElement('div', 'tslider__ruler'),
      new HTMLViewElementClickObserver(),
      new RenderStatePermitter(),
      this.params.isRulerClickable,
      orientationManager,
      rulerNodes
    )

    return new View({
      element,
      input,
      track,
      handlesContainer,
      labelsContainer,
      range,
      ruler,
      om: orientationManager,
      showLabels: this.params.showLabels,
      showRuler: this.params.showRuler,
    })
  }
}

export default ViewBuilder
