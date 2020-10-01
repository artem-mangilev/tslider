import Model from './model/Model'
import Observer from './utils/Observer'
import View from './view/View'
import { ViewEvents } from './view/ViewEvents'

class ViewEventsHandler implements Observer {
  constructor(private model: Model) {}

  update(event: ViewEvents, state: View): void {
    if (event === ViewEvents.TrackClick) {
      this.model.setHandle(state.trackPoint)
    }

    if (event === ViewEvents.HandleDrag) {
      this.model.setHandleByIndex(state.handle.point, state.handle.id)
    }

    if (event === ViewEvents.TrackLengthChanged) {
      this.model.resize(state.trackLength)
    }

    if (event === ViewEvents.RulerClick) {
      this.model.setHandleByValue(+state.rulerValue)
    }
  }
}

export default ViewEventsHandler
