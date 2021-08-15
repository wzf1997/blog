import { Point2d } from './point2d.js'
export class Seg2d {
  constructor(start, end) {
    this.endPoints = [start, end]
    this._asVector = undefined
  }

  get start() {
    return this.endPoints[0]
  }
  get end() {
    return this.endPoints[1]
  }
  reverse() {
    return new Seg2d(this.end.clone(), this.start.clone())
  }
  clone() {
    return new Seg2d(this.start.clone(), this.end.clone())
  }

  get asVector() {
    return (
      this._asVector ||
      (this._asVector = new Point2d(
        this.endPoints[1].x - this.endPoints[0].x,
        this.endPoints[1].y - this.endPoints[0].y
      ))
    )
  }
  //一堆点 获得闭合一堆线段
  static getSegments(points, closed = false) {
    const list = []
    for (let i = 1; i < points.length; i++) {
      list.push(new Seg2d(points[i - 1], points[i]))
    }
    if (closed && !points[0].equal(points[points.length - 1])) {
      list.push(new Seg2d(points[points.length - 1], points[0]))
    }
    return list
  }

  //   static lineLineIntersect(line1, line2, tolerance = 0.001) {
  //     const interInfo = []
  //     const crossValue =
  //       line1.asVector.x * line2.asVector.y - line1.asVector.y * line2.asVector.x
  //     const isParallel = Math.abs(crossValue) < tolerance
  //     if (isParallel) {
  //       return interInfo
  //     }
  //     const x1 = line1.start.x
  //     const x2 = line1.end.x
  //     const y1 = line1.start.y
  //     const y2 = line1.end.y
  //     const x3 = line2.start.x
  //     const x4 = line2.end.x
  //     const y3 = line2.start.y
  //     const y4 = line2.end.y
  //     const det = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
  //     const invDet = 1 / det
  //     const _tmp1 = x1 * y2 - y1 * x2,
  //       _tmp2 = x3 * y4 - y3 * x4
  //     const _x = _tmp1 * (x3 - x4) - (x1 - x2) * _tmp2
  //     const _y = _tmp1 * (y3 - y4) - (y1 - y2) * _tmp2
  //     interInfo.push(new Point2d(_x * invDet, _y * invDet))
  //     return interInfo
  //   }

  static lineLineIntersect(line1, line2) {
    const a = line1.start
    const b = line1.end
    const c = line2.start
    const d = line2.end
    const interInfo = []
    //线段ab的法线N1
    const nx1 = b.y - a.y,
      ny1 = a.x - b.x

    //线段cd的法线N2
    const nx2 = d.y - c.y,
      ny2 = c.x - d.x

    //两条法线做叉乘, 如果结果为0, 说明线段ab和线段cd平行或共线,不相交
    const denominator = nx1 * ny2 - ny1 * nx2
    if (denominator == 0) {
      return interInfo
    }

    //在法线N2上的投影
    const distC_N2 = nx2 * c.x + ny2 * c.y
    const distA_N2 = nx2 * a.x + ny2 * a.y - distC_N2
    const distB_N2 = nx2 * b.x + ny2 * b.y - distC_N2

    // 点a投影和点b投影在点c投影同侧 (对点在线段上的情况,本例当作不相交处理);
    if (distA_N2 * distB_N2 >= 0) {
      return interInfo
    }

    //
    //判断点c点d 和线段ab的关系, 原理同上
    //
    //在法线N1上的投影
    const distA_N1 = nx1 * a.x + ny1 * a.y
    const distC_N1 = nx1 * c.x + ny1 * c.y - distA_N1
    const distD_N1 = nx1 * d.x + ny1 * d.y - distA_N1
    if (distC_N1 * distD_N1 >= 0) {
      return interInfo
    }

    //计算交点坐标
    const fraction = distA_N2 / denominator
    const dx = fraction * ny1,
      dy = -fraction * nx1

    interInfo.push(new Point2d(a.x + dx, a.y + dy))
    return interInfo
  }
}
