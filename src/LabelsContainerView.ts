class LabelsContainerView {
  $element: JQuery<HTMLElement>

  constructor(element: HTMLElement) {
    this.$element = $(element)  }

  get width(): number {
    return this.$element.width()
  }

  get height(): number {
    return this.$element.height()
  }

  setMarginFromTrack(margin: number): void {
    // in vertical orientation, labelsContainer should be placed above the track
    this.$element.css('top', `${-this.height - margin}px`)

  }
}

export default LabelsContainerView
