import { Point2d } from './point2d.js'
export class Box2 {
  constructor(min, max) {
    this.min = min || new Point2d(-Infinity, -Infinity)
    this.max = max || new Point2d(Infinity, Infinity)
  }

  setFromPoints(points) {
    this.makeEmpty()

    for (let i = 0, il = points.length; i < il; i++) {
      this.expandByPoint(points[i])
    }

    return this
  }

  containsBox(box) {
    return (
      this.min.x <= box.min.x &&
      box.max.x <= this.max.x &&
      this.min.y <= box.min.y &&
      box.max.y <= this.max.y
    )
  }

  expandByPoint(point) {
    this.min.min(point)
    this.max.max(point)
    return this
  }

  intersectsBox(box) {
    return box.max.x < this.min.x ||
      box.min.x > this.max.x ||
      box.max.y < this.min.y ||
      box.min.y > this.max.y
      ? false
      : true
  }

  getFourPoints() {
    const rightTop = new Point2d(this.max.x, this.min.y)
    const leftBottom = new Point2d(this.min.x, this.max.y)
    return [this.min, rightTop, this.max, leftBottom]
  }

  union(box) {
    this.min.min(box.min)
    this.max.max(box.max)

    return this
  }

  makeEmpty() {
    this.min.x = this.min.y = +Infinity
    this.max.x = this.max.y = -Infinity

    return this
  }
}
