import Model from './model/Model'
import View from './view/View'
import Observer from './utils/Observer'
import { ModelEvents } from './model/ModelEvents'

class ModelEventsHandler implements Observer {
  constructor(private view: View) {}

  update(event: ModelEvents, state: Model): void {
    if (event === ModelEvents.Init) {
      this.handleInit(state)
    }

    if (event === ModelEvents.Update) {
      this.handleUpdate(state)
    }
  }

  private handleInit(model: Model): void {
    this.view.onTrackClick(model.updateHandle.bind(model))
    this.view.onHandleDrag(model.updateHandleByIndex.bind(model))
    this.view.onTrackLengthChanged(model.resize.bind(model))
    this.view.onRulerClick(model.updateHandleByValue.bind(model))
  }

  private handleUpdate({
    handles,
    rangePosition,
    rangeLength,
    ruler,
    inputValue,
  }: Model): void {
    this.view.render({
      handles,
      rangePosition,
      rangeLength,
      ruler,
      inputValue,
    })
  }
}

export default ModelEventsHandler
