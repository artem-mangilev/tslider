class Input {
  input: HTMLInputElement
  $element: JQuery<HTMLInputElement>

  constructor(input: HTMLInputElement) {
    this.input = input
    this.$element = $(this.input)

    // TODO: probably i should add this flag to global parameters
    // the input should be hidden
    this.input.hidden = true
  }

  public setValue(value: string): void {
    this.input.value = value
  }
}

export default Input
