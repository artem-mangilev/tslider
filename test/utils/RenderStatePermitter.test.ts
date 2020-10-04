import { expect } from 'chai'
import RenderStatePermitter from '../../src/utils/RenderPermitter'

describe(RenderStatePermitter.name, () => {
  describe('shouldRender', () => {
    it('should allow to render if there no state (initial call)', () => {
      const permitter = new RenderStatePermitter()

      expect(permitter.shouldRerender('initial state')).to.be.true
    })

    it('should not allow to render if the same state provided (string)', () => {
      const permitter = new RenderStatePermitter()

      permitter.shouldRerender('hello world')

      expect(permitter.shouldRerender('hello world')).to.be.false
    })

    it('should not allow to render if the same state provided (compound object)', () => {
      const permitter = new RenderStatePermitter()

      permitter.shouldRerender({
        hello: 'world',
        foo: [
          {
            baz: 0,
          },
          {
            bar: 1,
          },
        ],
      })

      const shouldNotRender = permitter.shouldRerender({
        hello: 'world',
        foo: [
          {
            baz: 0,
          },
          {
            bar: 1,
          },
        ],
      })

      expect(shouldNotRender).to.be.false
    })

    it('should allow to render if new state differs from previous', () => {
      const permitter = new RenderStatePermitter()

      permitter.shouldRerender({
        hello: 'world',
        foo: [
          {
            baz: 0,
          },
          {
            bar: 1,
          },
        ],
      })

      const shouldRender = permitter.shouldRerender({
        hello: 'I AM CHANGED, I BECAME A DIFFERENT STRING',
        foo: [
          {
            baz: 0,
          },
          {
            bar: 1,
          },
        ],
      })

      expect(shouldRender).to.be.true
    })
  })
})
