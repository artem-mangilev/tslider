import { expect } from "chai";
import RulerNode from "../../src/components/RulerNode";
import { MockElement, MockOrientationManager } from "./MockClasses";

describe(RulerNode.name, () => {
  describe('render', () => {
    it('should be rendered', () => {
      const element = new MockElement()
      const om = new MockOrientationManager()
      const node = new RulerNode(element, om)

      node.render({ segment: { point: 10, value: '5' } })

      expect(element.getContent()).to.equal('5')
      expect(element.position).eql({ x: 5, y: 0 })
    })
  })
})