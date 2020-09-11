import './index.scss'
import SliderParams from './SliderParams'
import Tslider from './Tslider'
import { Orientation } from './utils/aliases'

const orientations: Orientation[] = ['vertical', 'horizontal']

$(document).ready(() => {
  $('.tsl-target').each((i, elem) => {
    const options: SliderParams = {
      min: 0,
      max: 10,
      from: 5,
      to: 10,
      step: 0.5,
      showRuler: true,
      rulerSteps: 4,
      isRulerClickable: true,
      showLabels: true,
      inputValuesSeparator: ', ',
      orientation: orientations[i],
      targetInput: <HTMLInputElement>elem,
    }

    new Tslider(options)
  })
})
