import './index.scss'
import Tslider from './Tslider'
import { SliderOptions } from './SliderOptions'

$(document).ready(() => {
  const options: SliderOptions = {
    min: 100,
    max: 200,
    current: 100,
    step: 10
  }

  new Tslider(options)
})
