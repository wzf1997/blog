const opentype = require('opentype.js')
const sharp = require('sharp')

let id = 1
async function getFont(
  text = '我爱你',
  size = 20,
  color = 'black',
  stroke = 'black',
  strokeWidth = 1
) {
  const font = await opentype.loadSync('../font/Alibaba-PuHuiTi-Bold.ttf')
  const path = font.getPath(text, 0, 30, size)
  path.fill = color
  path.strokeWidth = strokeWidth
  path.stroke = stroke
  const svg = '<svg>' + path.toSVG(2) + '</svg>'
  sharp(`${__dirname}/test.png`)
    .resize(1303, 734)
    .composite([
      {
        input: Buffer.from(svg),
        // blend: 'dest-in',
      },
    ])
    .png()
    .toFile(`${__dirname}/test${++id}.png`)
    .catch((err) => {
      console.log(err)
    })
}
getFont('数据可视化', 40, 'blue', 'red')
