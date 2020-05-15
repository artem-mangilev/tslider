import './index.scss'
import Tslider from './Tslider'
import { SliderOptions } from './SliderOptions'

$(document).ready(() => {
  const options: SliderOptions = {
    min: 0,
    max: 100,
    current: 20,
    step: 10
  }

  new Tslider(options)
})
