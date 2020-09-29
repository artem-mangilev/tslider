import ShapeCollisionDetector from '../utils/ShapeCollisionDetector'
import HandlesContainer from './HandlesContainer'
import HTMLViewElement from './HTMLViewElement'
import HTMLViewElementDragObserver from './HTMLViewElementDragObserver'
import Input from './Input'
import LabelsContainer from './LabelsContainer'
import OrientationManager from './OrientationManager'
import RenderStatePermitter from './RenderPermitter'
import ViewParams from './ViewParams'
import Range from './Range'
import Ruler from './Ruler'
import HTMLViewElementClickObserver from './HTMLViewElementClickObserver'
import View from './View'
import ViewComponent from './ViewComponent'

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
    }
    const handlesContainer = new HandlesContainer(
      new HTMLViewElement('div', 'tslider__handles'),
      new HTMLViewElementDragObserver(),
      new RenderStatePermitter()
    )
    const labelsContainer = new LabelsContainer(
      new HTMLViewElement('div', 'tslider__labels'),
      orientationManager,
      new RenderStatePermitter(),
      new ShapeCollisionDetector()
    )
    const range = new Range(
      new HTMLViewElement('div', 'tslider__range'),
      orientationManager
    )
    const ruler = new Ruler(
      new HTMLViewElement('div', 'tslider__ruler'),
      new HTMLViewElementClickObserver(),
      orientationManager,
      new RenderStatePermitter(),
      this.params.isRulerClickable
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
