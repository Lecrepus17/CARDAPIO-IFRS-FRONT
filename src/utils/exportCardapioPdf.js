const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 48
const LINE_HEIGHT = 16
const MAX_CHARS = 88

const WIN_1252 = {
  0x20ac: 0x80,
  0x201a: 0x82,
  0x0192: 0x83,
  0x201e: 0x84,
  0x2026: 0x85,
  0x2020: 0x86,
  0x2021: 0x87,
  0x02c6: 0x88,
  0x2030: 0x89,
  0x0160: 0x8a,
  0x2039: 0x8b,
  0x0152: 0x8c,
  0x017d: 0x8e,
  0x2018: 0x91,
  0x2019: 0x92,
  0x201c: 0x93,
  0x201d: 0x94,
  0x2022: 0x95,
  0x2013: 0x96,
  0x2014: 0x97,
  0x02dc: 0x98,
  0x2122: 0x99,
  0x0161: 0x9a,
  0x203a: 0x9b,
  0x0153: 0x9c,
  0x017e: 0x9e,
  0x0178: 0x9f,
}

function toBytes(text) {
  return Array.from(text, (char) => char.charCodeAt(0))
}

function encodeWin1252(text) {
  const bytes = []

  for (const char of String(text ?? '')) {
    const code = char.codePointAt(0)

    if (code === 0x28 || code === 0x29 || code === 0x5c) {
      bytes.push(0x5c, code)
    } else if (code >= 0x20 && code <= 0x7e) {
      bytes.push(code)
    } else if (code >= 0xa0 && code <= 0xff) {
      bytes.push(code)
    } else if (WIN_1252[code]) {
      bytes.push(WIN_1252[code])
    } else {
      bytes.push(0x3f)
    }
  }

  return bytes
}

function addTextCommand(bytes, text, x, y, size) {
  bytes.push(...toBytes(`/F1 ${size} Tf 1 0 0 1 ${x} ${y} Tm (`))
  bytes.push(...encodeWin1252(text))
  bytes.push(...toBytes(') Tj\n'))
}

function wrapLine(line) {
  if (!line) return ['']

  const indent = line.match(/^\s*/)[0]
  const words = line.trim().split(/\s+/)
  const wrapped = []
  let current = indent

  words.forEach((word) => {
    const next = current.trim() ? `${current} ${word}` : `${indent}${word}`

    if (next.length <= MAX_CHARS) {
      current = next
      return
    }

    if (current.trim()) wrapped.push(current)
    current = `${indent}${word}`
  })

  if (current.trim()) wrapped.push(current)
  return wrapped
}

function paginate(lines) {
  const maxLines = Math.floor((PAGE_HEIGHT - MARGIN * 2 - 50) / LINE_HEIGHT)
  const wrappedLines = lines.flatMap(wrapLine)
  const pages = []

  for (let index = 0; index < wrappedLines.length; index += maxLines) {
    pages.push(wrappedLines.slice(index, index + maxLines))
  }

  return pages.length ? pages : [[]]
}

function createContent(title, lines, pageNumber) {
  const bytes = toBytes('BT\n')
  let y = PAGE_HEIGHT - MARGIN

  addTextCommand(bytes, pageNumber === 1 ? title : `${title} - Continuação`, MARGIN, y, 18)
  y -= 30

  lines.forEach((line) => {
    if (line) addTextCommand(bytes, line, MARGIN, y, 12)
    y -= LINE_HEIGHT
  })

  bytes.push(...toBytes('ET'))
  return bytes
}

function buildPdf(title, lines) {
  const pages = paginate(lines)
  const objects = []
  const pageObjectIds = pages.map((_, index) => 3 + index * 2)
  const contentObjectIds = pages.map((_, index) => 4 + index * 2)
  const fontObjectId = 3 + pages.length * 2

  objects[1] = toBytes('<< /Type /Catalog /Pages 2 0 R >>')
  objects[2] = toBytes(`<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`)

  pages.forEach((pageLines, index) => {
    const pageId = pageObjectIds[index]
    const contentId = contentObjectIds[index]
    const content = createContent(title, pageLines, index + 1)

    objects[pageId] = toBytes(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentId} 0 R >>`)
    objects[contentId] = [
      ...toBytes(`<< /Length ${content.length} >>\nstream\n`),
      ...content,
      ...toBytes('\nendstream'),
    ]
  })

  objects[fontObjectId] = toBytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')

  const pdf = toBytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')
  const offsets = []

  objects.forEach((object, id) => {
    if (!object) return

    offsets[id] = pdf.length
    pdf.push(...toBytes(`${id} 0 obj\n`), ...object, ...toBytes('\nendobj\n'))
  })

  const xrefStart = pdf.length
  pdf.push(...toBytes(`xref\n0 ${objects.length}\n0000000000 65535 f \n`))

  for (let id = 1; id < objects.length; id += 1) {
    pdf.push(...toBytes(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`))
  }

  pdf.push(...toBytes(`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`))

  return new Uint8Array(pdf)
}

export function exportCardapioPdf({ title, fileName, lines }) {
  const pdf = buildPdf(title, lines)
  const blob = new Blob([pdf], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()

  setTimeout(() => URL.revokeObjectURL(url), 0)
}
