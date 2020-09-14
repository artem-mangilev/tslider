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

type Args = number | ((value: string) => void)

type Methods =
  | 'setFrom'
  | 'setTo'
  | 'getFrom'
  | 'getTo'
  | 'hideLabels'
  | 'showLabels'
  | 'hideRuler'
  | 'showRuler'
  | 'onUpdate'
  | 'setMin'
  | 'setMax'
  | 'setStep'

interface JQuery {
  tsliderPlugin(method: PluginParams | Methods, ...args: Args[]): JQuery
}
