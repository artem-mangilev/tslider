import ViewTreeNode from '../utils/ViewTreeNode'

class Track extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }

  public get width() {
    return this.$elem.width()
  }

  public get height() {
    return this.$elem.height()
  }

  public set width(newWidth: number) {
    this.$elem.css('width', `${newWidth}px`)
  }

  public set height(newHeight: number) {
    this.$elem.css('height', `${newHeight}px`)
  }

  public get positionX(): number {
    // this is the x position of first point of the track,
    // relative to the viewport
    const x = this.$elem[0].getBoundingClientRect().x
    return Math.floor(x)
  }

  public get positionY(): number {
    // this is the y position of first point of the track,
    // relative to the viewport
    const y = this.$elem[0].getBoundingClientRect().y
    return Math.floor(y)
  }
}

export default Track
