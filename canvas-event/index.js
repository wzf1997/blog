export const move = 'mousemove'
export const click = 'mousedown'

import { Point2d } from '../canvas-bezierLine/index.js'
import { Seg2d } from '../js/seg2d.js'

// 新建一个画布类
export class Canvas {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.allShapes = []
    this.canvas.addEventListener(move, this.handleEvent(move))
    this.canvas.addEventListener(click, this.handleEvent(click))
  }

  handleEvent = (name) => (event) => {
    event = this.getNewEvent(event)
    this.allShapes.forEach((shape) => {
      // 获取当前事件的所有监听者
      const listerns = shape.listenerMap.get(name)
      if (
        listerns &&
        shape.isPointInClosedRegion(event) &&
        !event.isStopBubble
      ) {
        listerns.forEach((listener) => listener(event))
      }
    })
  }

  getNewEvent(event) {
    const point = new Point2d(event.offsetX, event.offsetY)
    return {
      point,
      isStopBubble: false,
      ...event,
    }
  }

  add(shape) {
    shape.draw(this.ctx)
    this.allShapes.push(shape)
  }
}

// 图形的基类
export class Shape {
  constructor() {
    this.listenerMap = new Map()
  }
  on(eventName, listener) {
    if (this.listenerMap.has(eventName)) {
      this.listenerMap.get(eventName).push(listener)
    } else {
      this.listenerMap.set(eventName, [listener])
    }
  }

  getMouse(evet) {
    return new Point2d(evet.offsetX, evet.offsetY)
  }
}

export class Circle extends Shape {
  constructor(props) {
    super()
    this.props = props
  }

  draw(ctx) {
    const { center, radius, fillColor = 'black' } = this.props
    const { x, y } = center
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = fillColor
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }

  // 判断鼠标的点是否在图形内部
  isPointInClosedRegion(mouse) {
    const { center, radius } = this.props
    return mouse.point.distance(center) <= radius * radius
  }
}

export class Rect extends Shape {
  constructor(props) {
    super()
    this.props = props
  }
  draw(ctx) {
    const { leftTop, width, height, fillColor = 'black' } = this.props
    const { x, y } = leftTop
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = fillColor
    ctx.fillRect(x, y, width, height)
    ctx.closePath()
    ctx.restore()
  }

  // 判断鼠标的点是否在图形内部
  isPointInClosedRegion(mouse) {
    const { x, y } = mouse.point
    const { leftTop, width, height } = this.props
    const { x: minX, y: minY } = leftTop
    const maxX = minX + width
    const maxY = minY + height
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      return true
    }
    return false
  }
}

export class Polygon extends Shape {
  constructor(props) {
    super()
    this.props = props
  }
  draw(ctx) {
    const { points, fillColor = 'black' } = this.props
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = fillColor
    points.forEach((point, index) => {
      const { x, y } = point
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }

  getDispersed() {
    return this.props.points
  }

  isPointInClosedRegion(event) {
    const allSegs = Seg2d.getSegments(this.getDispersed(), true)
    // 选取任意一条射线
    const start = event.point
    const xAxias = new Point2d(1, 0).multiplyScalar(800)
    const end = start.clone().add(xAxias)
    const anyRaySeg = new Seg2d(start, end)
    let total = 0
    allSegs.forEach((item) => {
      const intersetSegs = Seg2d.lineLineIntersect(item, anyRaySeg)
      total += intersetSegs.length
    })
    // 奇数在内部
    if (total % 2 === 1) {
      return true
    }
    return false
  }
}
