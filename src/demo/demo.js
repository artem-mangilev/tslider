import './demo.scss'

import '../tsliderPlugin'

$('.slider_horizontal .slider__target').tsliderPlugin({
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

$('.slider_vertical .slider__target').tsliderPlugin({
  min: -1,
  max: 1,
  from: -0.5,
  to: 0,
  step: 0.1,
  showRuler: true,
  rulerSteps: 4,
  isRulerClickable: true,
  showLabels: true,
  inputValuesSeparator: ', ',
  orientation: 'vertical',
})

$('.slider_horizontal-single .slider__target').tsliderPlugin({
  min: 0,
  max: 100,
  from: 10,
  step: 1,
  showRuler: true,
  rulerSteps: 4,
  isRulerClickable: true,
  showLabels: true,
  inputValuesSeparator: ', ',
  orientation: 'horizontal',
})

$('.slider_vertical-single .slider__target').tsliderPlugin({
  min: 0,
  max: 100,
  from: 10,
  step: 1,
  showRuler: true,
  rulerSteps: 4,
  isRulerClickable: true,
  showLabels: true,
  inputValuesSeparator: ', ',
  orientation: 'vertical',
})

$('.slider_horizontal-resizable .slider__target').tsliderPlugin({
  min: 0,
  max: 100,
  from: 10,
  step: 1,
  showRuler: true,
  rulerSteps: 4,
  isRulerClickable: true,
  showLabels: true,
  inputValuesSeparator: ', ',
  orientation: 'horizontal',
})

$('.slider_vertical-resizable .slider__target').tsliderPlugin({
  min: 0,
  max: 100,
  from: 10,
  step: 1,
  showRuler: true,
  rulerSteps: 4,
  isRulerClickable: true,
  showLabels: true,
  inputValuesSeparator: ', ',
  orientation: 'vertical',
})

const $blocks = $('.slider')

$blocks.each(function () {
  const $block = $(this)

  const $from = $block.find('.slider__from-value')
  const $to = $block.find('.slider__to-value')
  const $min = $block.find('.slider__min-value')
  const $max = $block.find('.slider__max-value')
  const $step = $block.find('.slider__step')

  const $plugin = $block.find('.slider__target')

  $min.val($plugin.tsliderPlugin('getMin'))
  $max.val($plugin.tsliderPlugin('getMax'))
  $step.val($plugin.tsliderPlugin('getStep'))
  $from.val($plugin.tsliderPlugin('getFrom'))
  $to.val($plugin.tsliderPlugin('getTo'))

  $plugin.tsliderPlugin('onUpdate', () => {
    $from.val($plugin.tsliderPlugin('getFrom'))
    $to.val($plugin.tsliderPlugin('getTo'))
  })

  $from.on('focusout', () => {
    $plugin.tsliderPlugin('setFrom', $from.val())
  })

  $to.on('focusout', () => {
    $plugin.tsliderPlugin('setTo', $to.val())
  })

  $min.on('focusout', () => {
    $plugin.tsliderPlugin('setMin', $min.val())
  })

  $max.on('focusout', () => {
    $plugin.tsliderPlugin('setMax', $max.val())
  })

  $step.on('focusout', () => {
    $plugin.tsliderPlugin('setStep', $step.val())
  })

  const $showLabels = $block.find('.slider__show-labels')

  $showLabels.on('change', function () {
    if (this.checked) {
      $plugin.tsliderPlugin('showLabels')
    } else {
      $plugin.tsliderPlugin('hideLabels')
    }
  })

  const $showRuler = $block.find('.slider__show-ruler')

  $showRuler.on('change', function () {
    if (this.checked) {
      $plugin.tsliderPlugin('showRuler')
    } else {
      $plugin.tsliderPlugin('hideRuler')
    }
  })
})
