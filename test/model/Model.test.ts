import { expect } from 'chai'
import 'mocha'
import Model from '../../src/model/Model'

describe('Model', () => {
  describe('updateHandlesByValues in pick single value mode', () => {
    let model: Model

    beforeEach(() => {
      model = new Model({
        min: 0,
        max: 10,
        step: 1,
        trackLength: 100,
        rulerSteps: 1,
        values: [5],
      })
    })

    it('should set 1st handle position if one value passed', () => {
      model.updateHandlesByValues([6])

      expect(model.handlePositions[0]).to.equal(60)
    })

    it('should ignore the values after first one', () => {
      model.updateHandlesByValues([6, 7])

      expect(model.handlePositions[0]).to.equal(60)
      expect(model.handlePositions[1]).to.be.undefined
    })
  })

  describe('updateHandlesByValues in range mode', () => {
    let model: Model

    beforeEach(() => {
      model = new Model({
        min: 0,
        max: 10,
        step: 1,
        trackLength: 100,
        rulerSteps: 1,
        values: [5, 9],
      })
    })

    it('should set 1st handle position if one value passed', () => {
      model.updateHandlesByValues([6])

      expect(model.handlePositions[0]).to.equal(60)
      expect(model.handlePositions[1]).to.equal(90)
    })

    it('should set both handle positions if two values passed', () => {
      model.updateHandlesByValues([6, 7])

      expect(model.handlePositions[0]).to.equal(60)
      expect(model.handlePositions[1]).to.equal(70)
    })

    it('should ignore values after second one', () => {
      model.updateHandlesByValues([6, 7, 8])

      expect(model.handlePositions[0]).to.equal(60)
      expect(model.handlePositions[1]).to.equal(70)
      expect(model.handlePositions[2]).to.be.undefined
    })
  })
})
