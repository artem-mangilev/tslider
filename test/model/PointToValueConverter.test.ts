import { expect } from 'chai'
import 'mocha'
import PointToValueConverter from '../../src/model/PointToValueConverter'
import { ValuesStoreGetters } from '../../src/model/ValuesStore'
import Shape from '../../src/utils/Shape'

describe(PointToValueConverter.name, () => {
  describe('convert', () => {
    it('should convert point to value', () => {
      const values: ValuesStoreGetters = {
        getMax: () => 20,
        getMin: () => 10,
        getStep: () => 2,
      }
      const shape: Shape = { width: 100, height: 10 }
      const converter = new PointToValueConverter(values, shape)

      const data = [
        { in: 0, out: 10 },
        { in: 50, out: 15 },
        { in: 100, out: 20 },
      ]

      data.forEach((piece) =>
        expect(converter.convert(piece.in)).to.equal(piece.out)
      )
    })
  })
})
