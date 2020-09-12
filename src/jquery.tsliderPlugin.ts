interface TsliderParams {
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

type PluginParams = Omit<TsliderParams, 'targetInput'>

type Methods = 'setFrom' | 'setTo' | 'getFrom' | 'getTo'

interface JQuery {
  tsliderPlugin(method: PluginParams | Methods, ...args: any[]): JQuery
}
