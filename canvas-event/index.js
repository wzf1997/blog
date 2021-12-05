export const move = 'mousemove'
export const click = 'mousedown'
export const keydown = 'keydown'
export const Z = 'KeyZ'
export const Y = 'KeyY'

import { Point2d } from '../canvas-bezierLine/index.js'
import { Seg2d } from '../js/seg2d.js'
import { Box2 } from '../js/boundingBox.js'

// 新建一个画布类
export class Canvas {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.allShapes = []
    this.undoStack = []
    
    this.redoStack = []
    this.shapePropsDiffMap = new Map()
    // this.canvas.addEventListener(move, this.handleEvent(move))
    this.canvas.addEventListener(click, this.handleEvent(click))
    this.canvas.addEventListener(keydown, (e) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        if (e.code === Z) {
          this.undo()
        } else if (e.code === Y) {
          this.redo()
        }
      }
    })
  }

  handleEvent = (name) => (event) => {
    event = this.getNewEvent(event)
    this.allShapes.forEach((shape) => {
      // 获取当前事件的所有监听者
      const listerns = shape.listenerMap.get(name)
      console.log(event.isStopBubble ,'查看数据---')
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

  addUnDoStack() {
    const dataUrl = this.canvas.toDataURL()
    const img = new Image()
    img.src = dataUrl
    this.undoStack.push(img)
  }

  add(shape) {
    shape.draw(this.ctx)
    this.addUnDoStack()
    this.allShapes.push(shape)
    // this.shapePropsMap.set(shape, JSON.parse(JSON.stringify(shape.props)))
  }

  reDraw2() {
    this.clearCanvas()
    this.allShapes.forEach((shape) => {
      shape.draw(this.ctx)
    })
  }

  reDraw() {
    this.shapePropsDiffMap.forEach((props, shape) => {
      shape.props = { ...shape.props, ...props }
      const curBox = shape.getBounding()
      const otherShapes = this.allShapes.filter(
        (other) => other !== shape && other.getBounding().intersectsBox(curBox)
      )
      // 如果存在相交 进行包围盒合并
      if (otherShapes.length > 0) {
        otherShapes.forEach((otherShape) => {
          curBox.union(otherShape.getBounding())
        })
      }
      //清除裁剪区域
      this.ctx.clearRect(curBox.min.x, curBox.min.y, curBox.max.x, curBox.max.y)

      // 确定裁剪范围
      this.ctx.save()
      this.ctx.beginPath()
      // 裁剪区域
      curBox.getFourPoints().forEach((point, index) => {
        const { x, y } = point
        if (index === 0) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
      })
      this.ctx.clip()

      //重画每一个图形
      ;[...otherShapes, shape].forEach((shape) => {
        shape.draw(this.ctx)
      })

      this.ctx.closePath()
      this.ctx.restore()
    })
  }

  batchAdd = (shapes) => {
    shapes.forEach((shape) => shape.draw(this.ctx))
    const dataUrl = this.canvas.toDataURL()
    const img = new Image()
    img.src = dataUrl
    this.undoStack.push(img)
    this.allShapes.push(...shapes)
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  undo() {
    this.clearCanvas()
    const img = this.undoStack.pop()
    if (!img) {
      return
    }
    this.ctx.drawImage(img, 0, 0)
    this.redoStack.push(img)
  }

  redo() {
    this.clearCanvas()
    const img = this.redoStack.pop()
    if (!img) {
      return
    }
    this.ctx.drawImage(img, 0, 0)
    this.undoStack.push(img)
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

  clip(ctx) {
    const { center, radius, fillColor } = this.props
    const { x, y } = center
    ctx.clearRect(x - radius, y - radius, 2 * radius, 2 * radius)
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.clip()
    ctx.fillStyle = fillColor
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }

  getBounding() {
    const { center, radius } = this.props
    const { x, y } = center
    const min = new Point2d(x - radius, y - radius)
    const max = new Point2d(x + radius, y + radius)
    return new Box2(min, max)
  }

  // 判断鼠标的点是否在图形内部
  isPointInClosedRegion(mouse) {
    const { center, radius } = this.props
    return mouse.point.distance(center) <= radius * radius
  }

  change(props, canvas) {
    // 设置不同
    canvas.shapePropsDiffMap.set(this, props)
    canvas.reDraw()
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

  getBounding() {
    const { leftTop, width, height } = this.props
    const min = leftTop
    const { x, y } = leftTop
    const max = new Point2d(x + width, y + height)
    return new Box2(min, max)
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

  getBounding() {
    return new Box2().setFromPoints(this.getDispersed())
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
