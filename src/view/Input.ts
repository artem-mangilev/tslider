class Input {
  input: HTMLInputElement
  $element: JQuery<HTMLInputElement>

  constructor(input: HTMLInputElement, hide: boolean) {
    this.input = input
    this.$element = $(this.input)

    this.input.hidden = hide
  }

  setValue(value: string): void {
    this.input.value = value
  }
}

export default Input
