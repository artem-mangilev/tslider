import { Orientation } from './aliases'

class LabelsContainerView {
  $element: JQuery<HTMLElement>
  orientation: Orientation

  constructor(element: HTMLElement, orientation: Orientation) {
    this.$element = $(element)
    this.orientation = orientation
  }

  get width(): number {
    return this.$element.width()
  }

  get height(): number {
    return this.$element.height()
  }

  setMarginFromTrack(margin: number): void {
    // in vertical orientation, labelsContainer should be placed above the track
    if (this.orientation === 'horizontal') {
      this.$element.css('top', `${-this.height - margin}px`)
    } else {
      this.$element.css('right', `${-this.width - margin}px`)
    }
  }
}

export default LabelsContainerView
