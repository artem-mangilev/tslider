import { expect } from 'chai'
import 'mocha'
import CollisionDetector from '../../src/model/CollisionDetector'
import HandlesXDirector from '../../src/model/HandlesXDirector'
import NearPointCalculator from '../../src/model/NearPointCalculator'

describe(HandlesXDirector.name, () => {
  describe('setById', () => {
    it('should set handle by id', () => {
      const cd = new CollisionDetector()
      const calculator = new NearPointCalculator()
      const container = new HandlesXDirector([10], cd, calculator)

      container.setById(20, 0)

      const handle = container.getById(0)
      expect(handle.getPosition()).to.equal(20)
    })
  })

  describe('getById', () => {
    it('should get handle by id', () => {
      const cd = new CollisionDetector()
      const calculator = new NearPointCalculator()
      const container = new HandlesXDirector([10], cd, calculator)

      const handle = container.getById(0)

      expect(handle.getPosition()).to.equal(10)
    })
  })

  describe('setNear', () => {
    it('should set near handle to provided position', () => {
      const cd = new CollisionDetector()
      const calculator = new NearPointCalculator()
      const container = new HandlesXDirector([10, 15], cd, calculator)

      container.setNear(11)

      const handle = container.getById(0)
      expect(handle.getPosition()).to.equal(11)
    })
  })

  describe('getAll', () => {
    it('should get all handles', () => {
      const cd = new CollisionDetector()
      const calculator = new NearPointCalculator()
      const container = new HandlesXDirector([10, 15], cd, calculator)

      const handles = container.getAll()

      expect(handles.length).to.equal(2)
    })
  })
})
