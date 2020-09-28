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
    const { handles, filler, ruler, inputValue } = model
    this.view.render({ handles, filler, ruler, inputValue })

    this.view.onTrackClick(model.setHandle.bind(model))
    this.view.onHandleDrag(model.setHandleByIndex.bind(model))
    this.view.onTrackLengthChanged(model.resize.bind(model))
    this.view.onRulerClick(model.setHandleByValue.bind(model))
  }

  private handleUpdate({ handles, filler, ruler, inputValue }: Model): void {
    this.view.render({ handles, filler, ruler, inputValue })
  }
}

export default ModelEventsHandler
