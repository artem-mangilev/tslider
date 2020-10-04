import Point from './Point'
import Shape from './Shape'

type PositionedShape = Shape & { position: Point }

export default PositionedShape
