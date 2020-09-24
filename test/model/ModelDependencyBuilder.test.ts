import { expect } from 'chai'
import 'mocha'
import ModelDependencyBuilder from '../../src/model/ModelDependencyBuilder'
import ModelParams from '../../src/model/ModelParams'

describe(ModelDependencyBuilder.name, () => {
  describe('build', () => {
    it('should build model dependencies', () => {
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
      const builder = new ModelDependencyBuilder(params)

      const modelDeps = builder.build()

      expect(typeof modelDeps === 'object').to.be.true
    })
  })
})
