import './demo.scss'

import '../tsliderPlugin'

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
  step: 1,
  showRuler: true,
  rulerSteps: 4,
  isRulerClickable: true,
  showLabels: true,
  inputValuesSeparator: ', ',
  orientation: 'horizontal',
})

$plugin1.tsliderPlugin('setTo', 80)

$plugin2.tsliderPlugin('setFrom', 40)

console.log($plugin2.tsliderPlugin('getFrom'))

$plugin2.tsliderPlugin('hideRuler')
// $plugin2.tsliderPlugin('hideLabels')
$plugin2.tsliderPlugin('onUpdate', (value) => {
  console.log(value)
})
