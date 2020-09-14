/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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
      const sliders = <Tslider[]>$(this).data('sliders')
      sliders.forEach((slider) => slider.setFrom(from))
    },

    setTo: function (to: number) {
      const sliders = <Tslider[]>$(this).data('sliders')
      sliders.forEach((slider) => slider.setTo(to))
    },

    getFrom: function () {
      return $(this).data('sliders')[0].getFrom()
    },

    getTo: function () {
      return $(this).data('sliders')[0].getTo()
    },

    setMin: function (min: number) {
      const sliders = <Tslider[]>$(this).data('sliders')
      sliders.forEach((slider) => slider.setMin(min))
    },

    setMax: function (max: number) {
      const sliders = <Tslider[]>$(this).data('sliders')
      sliders.forEach((slider) => slider.setMax(max))
    },

    setStep: function(step: number) {
      const sliders = <Tslider[]>$(this).data('sliders')
      sliders.forEach((slider) => slider.setStep(step))
    },

    hideLabels: function () {
      const sliders = <Tslider[]>$(this).data('sliders')
      sliders.forEach((slider) => slider.hideLabels())
    },

    showLabels: function () {
      const sliders = <Tslider[]>$(this).data('sliders')
      sliders.forEach((slider) => slider.showLabels())
    },

    hideRuler: function () {
      const sliders = <Tslider[]>$(this).data('sliders')
      sliders.forEach((slider) => slider.hideRuler())
    },

    showRuler: function () {
      const sliders = <Tslider[]>$(this).data('sliders')
      sliders.forEach((slider) => slider.showRuler())
    },

    onUpdate: function (handler: (value: string) => void) {
      const sliders = <Tslider[]>$(this).data('sliders')
      sliders.forEach((slider) => slider.onUpdate(handler))
    },
  }

  if (methods[<Methods>method]) {
    return methods[<Methods>method].apply(this, args)
  } else if (typeof method === 'object' || !method) {
    return methods.init.call(this, method)
  } else {
    $.error(`Method ${method} is not found.`)
  }
}
