import { expect } from 'chai'
import ShapeOrientationManager from '../../src/utils/OrientationManager'

describe(ShapeOrientationManager.name, () => {
  describe('getWidth', () => {
    it('should get width', () => {
      const horizontal = new ShapeOrientationManager('horizontal')
      const hwidth = horizontal.getWidth({ width: 5, height: 10 })
      expect(hwidth).to.equal(5)

      const vertical = new ShapeOrientationManager('vertical')
      const vwidth = vertical.getWidth({ width: 5, height: 10 })
      expect(vwidth).to.equal(10)
    })
  })

  describe('getHeight', () => {
    it('should get height', () => {
      const horizontal = new ShapeOrientationManager('horizontal')
      const hheight = horizontal.getHeight({ width: 5, height: 10 })
      expect(hheight).to.equal(10)

      const vertical = new ShapeOrientationManager('vertical')
      const vheight = vertical.getHeight({ width: 5, height: 10 })
      expect(vheight).to.equal(5)
    })
  })

  describe('setWidth', () => {
    it('should set width', () => {
      const horizontal = new ShapeOrientationManager('horizontal')
      const hshape = { width: 0, height: 10 }
      horizontal.setWidth(hshape, 20)
      expect(hshape.width).to.equal(20)

      const vertical = new ShapeOrientationManager('vertical')
      const vshape = { width: 0, height: 10 }
      vertical.setWidth(vshape, 20)
      expect(vshape.height).to.equal(20)
    })
  })

  describe('getX', () => {
    it('shuold get x', () => {
      const horizontal = new ShapeOrientationManager('horizontal')
      const hx = horizontal.getX({ x: 5, y: 10 })
      expect(hx).to.equal(5)

      const vertical = new ShapeOrientationManager('vertical')
      const vx = vertical.getX({ x: 5, y: 10 })
      expect(vx).to.equal(10)
    })
  })

  describe('getY', () => {
    it('shuold get y', () => {
      const horizontal = new ShapeOrientationManager('horizontal')
      const hy = horizontal.getY({ x: 5, y: 10 })
      expect(hy).to.equal(10)

      const vertical = new ShapeOrientationManager('vertical')
      const vy = vertical.getY({ x: 5, y: 10 })
      expect(vy).to.equal(5)
    })
  })

  describe('getPoint', () => {
    it('should get point', () => {
      const horizontal = new ShapeOrientationManager('horizontal')
      const hpoint = horizontal.getPoint({ x: 5, y: 10 })
      expect(hpoint).to.eql({ x: 5, y: 10 })

      const vertical = new ShapeOrientationManager('vertical')
      const vpoint = vertical.getPoint({ x: 5, y: 10 })
      expect(vpoint).to.eql({ x: 10, y: 5 })
    })
  })

  describe('encodePoint', () => {
    it('should encode point', () => {
      const horizontal = new ShapeOrientationManager('horizontal')
      const hpoint = horizontal.encodePoint(
        { x: 10, y: 10 },
        { width: 20, height: 20 }
      )
      expect(hpoint).to.eql({ x: 10, y: 10 })

      const vertical = new ShapeOrientationManager('vertical')
      const vpoint = vertical.encodePoint(
        { x: 10, y: 3 },
        { width: 20, height: 20 }
      )
      expect(vpoint).to.eql({ x: 17, y: 10 })
    })
  })

  describe('decodePoint', () => {
    it('should decode point', () => {
      const horizontal = new ShapeOrientationManager('horizontal')
      const hpoint = horizontal.decodePoint(
        { x: 10, y: 10 },
        { width: 20, height: 20 }
      )
      expect(hpoint).to.eql({ x: 10, y: 10 })

      const vertical = new ShapeOrientationManager('vertical')
      const vpoint = vertical.decodePoint(
        { x: 17, y: 10 },
        { width: 20, height: 20 }
      )
      expect(vpoint).to.eql({ x: 10, y: 3 })
    })
  })

  describe('isHorizontal', () => {
    it('shuld say if orientation is horizontal or not', () => {
      const horizontal = new ShapeOrientationManager('horizontal')
      expect(horizontal.isHorizontal()).to.be.true

      const vertical = new ShapeOrientationManager('vertical')
      expect(vertical.isHorizontal()).to.be.false
    })
  })

  describe('isVertical', () => {
    it('shuld say if orientation is vertical or not', () => {
      const horizontal = new ShapeOrientationManager('horizontal')
      expect(horizontal.isVertical()).to.be.false

      const vertical = new ShapeOrientationManager('vertical')
      expect(vertical.isVertical()).to.be.true
    })
  })
})
