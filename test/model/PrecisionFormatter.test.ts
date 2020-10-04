import { expect } from 'chai'
import 'mocha'
import PrecisionFormatter from '../../src/model/PrecisionFormatter'

describe(PrecisionFormatter.name, () => {
  describe('format', () => {
    it('should get string that represents a number with target precision', () => {
      const formatter = new PrecisionFormatter()

      const formattedA = formatter.format(0.001, 5)
      const formattedB = formatter.format(0, 5.0000001)

      expect(formattedA).to.equal('5.000')
      expect(formattedB).to.equal('5')
    })
  })
})