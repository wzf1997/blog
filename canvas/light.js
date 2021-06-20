class Vector3 {
  constructor(x, y, z) {
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0
  }

  dot(vec) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z)
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  multiplyScalar(scalar) {
    this.x *= scalar
    this.y *= scalar
    this.z *= scalar
    return this
  }
  sub(v) {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z

    return this
  }

  normalize() {
    return this.multiplyScalar(1 / this.length())
  }
  negate() {
    this.x = -this.x
    this.y = -this.y
    this.z = -this.z
    return this
  }
}
