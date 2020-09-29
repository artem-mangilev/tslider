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
import Handle from './Handle'
import Label from './Label'

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
    const labels = Array.from(
      { length: this.params.handles },
      () =>
        new Label(
          new HTMLViewElement('div', 'tslider__label'),
          orientationManager,
          new RenderStatePermitter()
        )
    )
    const tempLabel = new Label(
      new HTMLViewElement('div', 'tslider__handle'),
      orientationManager,
      new RenderStatePermitter()
    )
    const labelsContainer = new LabelsContainer(
      new HTMLViewElement('div', 'tslider__labels'),
      orientationManager,
      new RenderStatePermitter(),
      new ShapeCollisionDetector(),
      labels,
      tempLabel
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
