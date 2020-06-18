import './index.scss'
import SliderOptions from './SliderOptions'
import Tslider from './Tslider'

$(document).ready(() => {
  $('.tsl-target').each((_, elem) => {
    const options: SliderOptions = {
      min: 0,
      max: 100,
      from: 50,
      to: 100,
      step: 5,
      // TODO: implement these options
      // handleMotion: 'smooth' | 'discrete'
      // labelVisibility: 'visible' | 'hidden' | 'appears-on-hover'
      orientation: 'vertical',
      targetInput: <HTMLInputElement>elem,
    }

    new Tslider(options)
  })
})
