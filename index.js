const CallType = require('@malijs/call-types')
const values = require('lodash.values')

const TYPE_VALUES = values(CallType)

module.exports = function testCondition (ctx, options) {
  let opts = options
  if (typeof options === 'function') {
    opts = { custom: options }
  } else if (typeof options === 'string') {
    if (TYPE_VALUES.indexOf(options) >= 0) {
      opts = { type: options }
    } else {
      opts = { name: options }
    }
  } else if (options instanceof RegExp) {
    opts = { name: options }
  }

  const callName = ctx.name
  const cn = callName.toLowerCase()
  const callType = ctx.type

  let condition = false
  if (opts.custom) {
    condition = condition || opts.custom(ctx)
  }

  const names = !opts.name || Array.isArray(opts.name)
    ? opts.name : [opts.name]

  if (names) {
    condition = condition || names.some(n => {
      if (typeof n === 'string') {
        return n.toLowerCase() === cn
      } else if (n instanceof RegExp) {
        return n.exec(callName) ? true : false // eslint-disable-line no-unneeded-ternary
      }
    })
  }

  const types = !opts.type || Array.isArray(opts.type)
    ? opts.type : [opts.type]

  if (types) {
    condition = condition || types.some(t => typeof t === 'string' && t === callType)
  }

  return condition
}
