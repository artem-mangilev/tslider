import './index.scss'
import SliderOptions from './SliderOptions'
import Tslider from './Tslider'

$(document).ready(() => {
  const options: SliderOptions = {
    min: 100,
    max: 200,
    from: 150,
    to: 170,
    step: 10,
    labelMarginFromTrack: 5,
    orientation: 'horizontal',
    targetInput: document.querySelector('.tsl-target'),
  }

  new Tslider(options)
})
