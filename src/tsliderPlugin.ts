/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import Tslider from './Tslider'

$.fn.tsliderPlugin = function (method, ...args) {
  const sliders = <Tslider[]>$(this).data('sliders')

  const methods = {
    init(options: PluginParams) {
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

    setFrom(from: number) {
      sliders.forEach((slider) => slider.setFrom(from))
    },

    setTo(to: number) {
      sliders.forEach((slider) => slider.setTo(to))
    },

    getFrom() {
      return $(this).data('sliders')[0].getFrom()
    },

    getTo() {
      return $(this).data('sliders')[0].getTo()
    },

    setMin(min: number) {
      sliders.forEach((slider) => slider.setMin(min))
    },

    setMax(max: number) {
      sliders.forEach((slider) => slider.setMax(max))
    },

    getMin() {
      return sliders[0].getMin()
    },

    getMax() {
      return sliders[0].getMax()
    },

    setStep(step: number) {
      sliders.forEach((slider) => slider.setStep(step))
    },

    getStep() {
      return sliders[0].getStep()
    },

    hideLabels() {
      sliders.forEach((slider) => slider.hideLabels())
    },

    showLabels() {
      sliders.forEach((slider) => slider.showLabels())
    },

    hideRuler() {
      sliders.forEach((slider) => slider.hideRuler())
    },

    showRuler() {
      sliders.forEach((slider) => slider.showRuler())
    },

    onUpdate(handler: (value: string) => void) {
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
