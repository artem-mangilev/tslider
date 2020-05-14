import './index.scss'
import Tslider from './Tslider'
import { SliderOptions } from './SliderOptions'

$(document).ready(() => {
  const options: SliderOptions = {
    min: 0,
    max: 500,
    current: 250,
  }

  new Tslider(options)
})
