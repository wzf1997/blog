// 这个方程就是二次贝赛尔曲线方
function twoBezizer(p0, p1, p2, t) {
  const k = 1 - t
  return k * k * p0 + 2 * (1 - t) * t * p1 + t * t * p2
}

function drawWithDiscrete(ctx, start, control, end) {
  console.log(ctx)
  for (let t = 0; t <= 1; t += 0.01) {
    const x = twoBezizer(start[0], control[0], end[0], t)
    const y = twoBezizer(start[1], control[1], end[1], t)
    ctx.lineTo(x, y)
  }
}
