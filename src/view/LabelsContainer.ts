import { Orientation } from '../utils/aliases'
import ViewTreeNode from '../utils/ViewTreeNode'

class LabelsContainer extends ViewTreeNode {
  orientation: Orientation

  constructor(className: string, orientation: Orientation) {
    super('div', className)

    this.orientation = orientation
  }

  get width(): number {
    return this.$elem.width()
  }

  get height(): number {
    return this.$elem.height()
  }

  setMarginFromTrack(margin: number): void {
    // in vertical orientation, labelsContainer should be placed above the track
    if (this.orientation === 'horizontal') {
      this.$elem.css('top', `${-this.height - margin}px`)
    } else {
      this.$elem.css('right', `${-this.width - margin}px`)
    }
  }
}

export default LabelsContainer
