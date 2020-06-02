class ContainerView {
  $element: JQuery<HTMLElement>

  constructor(element: HTMLElement) {
    this.$element = $(element)
  }

  public get width(): number {
    return this.$element.width()
  }

  public get height(): number {
    return this.$element.height()
  }
}

export default ContainerView
