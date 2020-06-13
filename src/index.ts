import './index.scss'
import SliderOptions from './SliderOptions'
import Tslider from './Tslider'

$(document).ready(() => {
  const options: SliderOptions = {
    min: 100,
    max: 200,
    from: 150,
    to: 170,
    step: 5,
    labelMarginFromTrack: 5,
    // TODO: fix flickering the handle, when moved in vertical orientation
    // orientation: 'vetical',
    targetInput: document.querySelector('.tsl-target'),
  }

  new Tslider(options)
})
