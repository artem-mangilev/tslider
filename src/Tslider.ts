import View from './View'
import Model from './Model'
import { SliderOptions } from './SliderOptions'

class Tslider implements Observer {
  constructor(options: SliderOptions) {
    const view = new View()
    // const model = new Model()

    view.trackClick((trackClickX) => {
      // compute the middle of the handle in order to correctly put
      // it on the track
      const handlePositionX = trackClickX - view.handleWidth / 2

      // move handle to new position
      view.moveHandleX(handlePositionX)

      // figure out how much data is represented by current handle position:

      // 1. Convert handle position to ratio
      const handlePositionXRatio = trackClickX / view.trackWidth

      // 2. Multiply this ratio to max value in range
      const ratioDataAmount = (handlePositionXRatio * options.max).toString()

      // 3. Update the data
      view.updateHandleData(ratioDataAmount)
    })
  }

  public update(subject: Subject): void {}
}

export default Tslider
