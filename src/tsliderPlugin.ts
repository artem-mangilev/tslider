/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import './index.scss'
import Tslider from './Tslider'

$.fn.tsliderPlugin = function (method, ...args) {
  const methods = {
    init: function (options: PluginParams) {
      const data = <Tslider[]>$(this).data('sliders')
      if (data) {
        data.forEach((slider) => $(slider.getInstance()).remove())
      }

      const sliders: Tslider[] = []
      $(this).data('sliders', sliders)
      return this.each((_: any, element: HTMLInputElement) => {
        sliders.push(new Tslider({ ...options, targetInput: element }))
      })
    },

    setFrom: function (from: number) {
      ;(<Tslider[]>$(this).data('sliders')).forEach((slider) => {
        slider.setFrom(from)
      })
    },

    setTo: function (to: number) {
      ;(<Tslider[]>$(this).data('sliders')).forEach((slider) => {
        slider.setTo(to)
      })
    },

    getFrom: function () {},

    getTo: function () {},
  }

  if (methods[<Methods>method]) {
    return methods[<Methods>method].apply(this, args)
  } else if (typeof method === 'object' || !method) {
    return methods.init.call(this, method)
  } else {
    $.error(`Method ${method} is not found.`)
  }
}

$(document).ready(() => {
  let $plugin1 = $('.tsl-target-1').tsliderPlugin({
    min: 0,
    max: 100,
    from: 0,
    to: 20,
    step: 10,
    showRuler: true,
    rulerSteps: 4,
    isRulerClickable: true,
    showLabels: true,
    inputValuesSeparator: ', ',
    orientation: 'horizontal',
  })

  $plugin1 = $('.tsl-target-1').tsliderPlugin({
    min: 0,
    max: 100,
    from: 0,
    to: 50,
    step: 10,
    showRuler: true,
    rulerSteps: 4,
    isRulerClickable: true,
    showLabels: true,
    inputValuesSeparator: ', ',
    orientation: 'horizontal',
  })

  const $plugin2 = $('.tsl-target-2').tsliderPlugin({
    min: 0,
    max: 100,
    from: 10,
    to: 50,
    step: 10,
    showRuler: true,
    rulerSteps: 4,
    isRulerClickable: true,
    showLabels: true,
    inputValuesSeparator: ', ',
    orientation: 'horizontal',
  })

  $plugin1.tsliderPlugin('setTo', 80)

  $plugin2.tsliderPlugin('setFrom', 40)
})
