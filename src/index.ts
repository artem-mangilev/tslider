import './index.scss'
import SliderOptions from './SliderOptions'
import Tslider from './Tslider'

$(document).ready(() => {
  $('.tsl-target').each((_, elem) => {
    const options: SliderOptions = {
      min: 100,
      max: 200,
      from: 150,
      to: 170,
      step: 5,
      orientation: 'horizontal',
      targetInput: <HTMLInputElement>elem,
    }

    new Tslider(options)
  })
})
