export interface SliderOptions {
  min: number
  max: number
  current: number
  step: number
  orientation: 'vertical' | 'horizontal'
  targetInput: HTMLInputElement
}
