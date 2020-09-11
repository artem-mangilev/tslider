interface SliderParams {
  min: number
  max: number
  from: number
  to?: number
  step: number
  showRuler?: boolean
  rulerSteps?: number
  isRulerClickable?: boolean
  showLabels?: boolean
  inputValuesSeparator?: string
  targetInput: HTMLInputElement
  orientation: 'horizontal' | 'vertical'
}

interface JQuery {
  tsliderPlugin(params: Omit<SliderParams, 'targetInput'>): JQuery
}
