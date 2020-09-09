import './index.scss'
import SliderParams from './SliderParams'
import Tslider from './Tslider'
import { Orientation } from './utils/aliases'

const orientations: Orientation[] = ['vertical', 'horizontal']

$(document).ready(() => {
  $('.tsl-target').each((i, elem) => {
    const options: SliderParams = {
      min: 0,
      max: 100,
      from: 50,
      to: 100,
      step: 1,
      showRuler: true,
      rulerSteps: 4,
      isRulerClickable: true,
      showLabels: true,
      hideInput: false,
      inputValuesSeparator: ', ',
      orientation: orientations[i],
      targetInput: <HTMLInputElement>elem,
    }

    new Tslider(options)
  })
})
