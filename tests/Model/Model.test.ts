import { expect } from 'chai'
import 'mocha'
import Model from '../../src/model/Model'

describe('Model', () => {
  describe('ruler', () => {
    it('should return array of ruler segments', () => {
      const model = new Model({
        min: 5,
        max: 10,
        step: 1,
        values: [5, 6],
        trackLength: 100,
        rulerSteps: 2,
      })

      const ruler = model.ruler

      expect(ruler[0]).to.eql({ point: 0, value: 5 })
      expect(ruler[1]).to.eql({ point: 50, value: 7.5 })
      expect(ruler[2]).to.eql({ point: 100, value: 10 })
    })
  })
})
