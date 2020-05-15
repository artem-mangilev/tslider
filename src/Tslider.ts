import View from './View'
import Model from './Model'
import { SliderOptions } from './SliderOptions'

class Tslider implements Observer {
  constructor(options: SliderOptions) {
    const view = new View()
    // const model = new Model()

    view.trackClick((trackClickX) => {
      // decide where to put handle according to step size.
      const numberOfSteps: number = options.max / options.step

      const pixelsPerStep: number = view.trackWidth / numberOfSteps

      // if trackClickX closer to right boundry of step length, put handle to this boundry
      // otherwise put handle to left boundry
      const handleStep = Math.round(trackClickX / pixelsPerStep)

      // figure out how much data is represented by current handle position:

      // 1. Convert handle position to ratio
      const handlePositionRatioX = handleStep / numberOfSteps

      // move handle to new position
      view.moveHandleX(handlePositionRatioX)

      // 2. Multiply this ratio to max value in range
      const ratioDataAmount = (handlePositionRatioX * options.max).toString()

      // 3. Update the data
      view.updateHandleData(ratioDataAmount)
    })
  }

  public update(subject: Subject): void {}
}

export default Tslider
