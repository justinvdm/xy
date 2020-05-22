const { timeFormat } = require('d3-time-format')
const { scaleOrdinal } = require('d3-scale')
const { schemeCategory10 } = require('d3-scale-chromatic')
const parseColor = require('parse-color')
const { screen: createScreen } = require('blessed')
const { line: createLine } = require('blessed-contrib')
const { flow, toNumber } = require('lodash')
const { toString, omitBy, isNull, castArray } = require('lodash')

const ftime = {
  start: timeFormat('%y-%m-%d'),
  milliseconds: timeFormat('.%L'),
  seconds: timeFormat(':%S'),
  minutes: timeFormat('%H:%M '),
  hours: timeFormat('%I %p'),
  fallback: timeFormat('%y-%m-%d')
}

function create(opts) {
  const screen = createScreen()

  const line = createLine(
    omitBy(
      {
        showLegend: opts.showLegend,
        minY: opts.min,
        maxY: opts.max,
        style: { text: 8 }
      },
      isNull
    )
  )

  const colors = flow([createColors(opts), parseColorRgb])

  screen.append(line)

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

  return {
    line,
    screen,
    colors,
    timeFormatter: opts.timeFormat
      ? timeFormat(opts.timeFormat)
      : defaultTimeFormatter
  }
}

function createColors(opts) {
  const colors = isNull(opts.color)
    ? scaleOrdinal(schemeCategory10)
    : scaleOrdinal().range(castArray(opts.color))

  return colors.domain(castArray(opts.set))
}

function update(ui, state, opts) {
  ui.line.setData(parse(ui, state, opts))
  ui.screen.render()
}

function parse(ui, state, opts) {
  return state.sets.map(({ values, key }) => ({
    x: parseXValues(
      ui,
      values.map(d => d.x),
      opts
    ),
    y: parseYValues(
      ui,
      values.map(d => d.y),
      opts
    ),
    style: { line: ui.colors(key) }
  }))
}

function parseXValues(ui, values, opts) {
  return opts.time ? parseTimeValues(ui, values, opts) : values.map(toString)
}

function parseYValues(ui, values) {
  return values.map(toNumber)
}

function parseTimeValues(ui, values) {
  return values.map(t => new Date(t)).map(ui.timeFormatter)
}

function defaultTimeFormatter(d, i, values) {
  const v = timeDiff(d, i, values)
  if (v < 1) return ftime.start(d)
  else if (v <= 1000) return ftime.milliseconds(d)
  else if (v <= 1000 * 60) return ftime.seconds(d)
  else if (v <= 1000 * 60 * 60) return ftime.minutes(d)
  else if (v <= 1000 * 60 * 60 * 24) return ftime.hours(d)
  else return ftime.fallback(d)
}

function timeDiff(d, i, values) {
  return i > 0 ? +d - +values[i - 1] : 0
}

function parseColorRgb(s) {
  return parseColor(s).rgb
}

exports.create = create
exports.update = update
exports.parse = parse
