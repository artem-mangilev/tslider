import { expect } from 'chai'
import 'mocha'
import PointValidator from '../../src/model/PointValidator'
import NearPointCalculator from '../../src/model/NearPointCalculator'
import { ValuesStoreGetters } from '../../src/model/ValuesStore'
import Shape from '../../src/utils/Shape'

describe(PointValidator.name, () => {
  describe('validatePoint', () => {
    it('should get valid point', () => {
      const values: ValuesStoreGetters = {
        getMin: () => 10,
        getMax: () => 20,
        getStep: () => 5,
      }
      const track: Shape = {
        width: 100,
        height: 10,
      }
      const validator = new PointValidator(
        values,
        track,
        new NearPointCalculator()
      )

      const data = [
        { in: -10, out: 0 },
        { in: 40, out: 50 },
        { in: 80, out: 100 },
        { in: 150, out: 100 },
      ]

      data.forEach((piece) =>
        expect(validator.validate(piece.in)).to.equal(piece.out)
      )
    })
  })
})
