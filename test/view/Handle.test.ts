import { expect } from 'chai'
import 'mocha'
import Point from '../../src/utils/Point'
import Handle from '../../src/components/Handle'
import { ViewElement } from '../../src/io/dom/ViewElement'

describe('Handle', () => {
  describe('render', () => {
    it('should render properly', () => {
      class Element implements ViewElement {
        position: Point = { x: 0, y: 0 }
        width = 10
        move(point: Point) {
          this.position = point
        }

        // non-used
        height = 0
        add() {
          return
        }
        after() {
          return
        }
        setContent() {
          return
        }
        getContent() {
          return ''
        }
        show() {
          return
        }
        hide() {
          return
        }
        setAttribute() {
          return
        }
        getAttribute() {
          return ''
        }
      }
      const element = new Element()
      const handle = new Handle(element)

      handle.render({ x: 50, y: 50 })

      expect(element.position).to.eql({ x: 45, y: 45 })
    })
  })
})
