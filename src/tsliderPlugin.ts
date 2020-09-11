/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import './index.scss'
import Tslider from './Tslider'

$.fn.tsliderPlugin = function (options) {
  return this.each((_: any, element: HTMLInputElement) => {
    new Tslider({
      from: options.from,
      to: options.to,
      max: options.max,
      min: options.min,
      orientation: options.orientation,
      step: options.step,
      inputValuesSeparator: options.inputValuesSeparator,
      isRulerClickable: options.isRulerClickable,
      rulerSteps: options.rulerSteps,
      showLabels: options.showLabels,
      showRuler: options.showRuler,
      targetInput: element,
    })
  })
}

$(document).ready(() => {
  $('.tsl-target').tsliderPlugin({
    min: 0,
    max: 100,
    from: 0,
    to: 10,
    step: 10,
    showRuler: true,
    rulerSteps: 4,
    isRulerClickable: true,
    showLabels: true,
    inputValuesSeparator: ', ',
    orientation: 'horizontal',
  })
})
