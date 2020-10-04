import { expect } from 'chai'
import 'mocha'
import Model from '../../src/model/Model'
import ModelBuilder from '../../src/model/ModelBuilder'
import ModelParams from '../../src/model/ModelParams'

describe(ModelBuilder.name, () => {
  describe('build', () => {
    it('should build model', () => {
      const params: ModelParams = {
        min: 0,
        max: 10,
        step: 1,
        rulerSteps: 5,
        values: [2, 3],
        trackWidth: 100,
        trackHeight: 10,
        inputValuesSeparator: ',',
      }
      const model = new ModelBuilder(params).build()

      expect(model instanceof Model).to.be.true
    })
  })
})
