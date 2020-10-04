export interface CollisionDetector {
  doCollide(entityA: unknown, entityB: unknown): boolean;
}
