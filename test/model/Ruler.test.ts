import { expect } from 'chai'
import 'mocha'
import Ruler from '../../src/model/Ruler'
import Shape from '../../src/utils/Shape'

describe(Ruler.name, () => {
  describe('constructor', () => {
    it('should init with generated ruler segments', () => {
      const shape: Shape = { width: 100, height: 10 }
      const ruler = new Ruler(shape, 2)

      const segments = ruler.get()

      expect(segments).to.eql([0, 50, 100])
    })
  })

  describe('update/get', () => {
    it('should update ruler and get it', () => {
      const shape: Shape = { width: 100, height: 10 }
      const ruler = new Ruler(shape, 2)

      expect(ruler.get()).to.eql([0, 50, 100])

      shape.width = 200
      ruler.update()

      expect(ruler.get()).to.eql([0, 100, 200])
    })
  })
})
