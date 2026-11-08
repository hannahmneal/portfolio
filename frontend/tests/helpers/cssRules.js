import { expect } from 'vitest'

/**
 * Reads the CSS that emotion/MUI actually emitted for an element, so tests can
 * assert on styles jsdom will not compute for us:
 *
 *   - `:hover` and `:active`, which jsdom never matches (there is no pointer).
 *   - `box-shadow`, `filter` and `text-underline-offset`, which jsdom's
 *     `getComputedStyle` returns empty or unreliably.
 *
 * How it works: `styled()` and `sx` each inject a `<style>` tag holding one
 * class per element. We find every rule that targets the element's class,
 * decide which of them apply in the requested state, and let the last
 * non-empty declaration win.
 *
 * `:disabled` and `[aria-pressed="true"]` are NOT simulated. They are read from
 * the real DOM via `element.matches()`, so a button rendered with `disabled` or
 * `pressed` resolves those rules on its own, in the `rest` state.
 */

// Longest first: ':focus-visible' has to be stripped before ':focus'.
const POINTER_PSEUDOS = [':focus-visible', ':focus', ':active', ':hover']

const STATES = {
  rest: [],
  hover: [':hover'],
  active: [':active'],
  focus: [':focus-visible', ':focus'],
}

function* styleRules() {
  for (const sheet of document.styleSheets) {
    let rules
    try {
      rules = sheet.cssRules
    } catch {
      continue // a sheet we are not allowed to read
    }
    for (const rule of rules) {
      // Skips @media/@keyframes wrappers, which have no selectorText.
      if (rule.selectorText) yield rule
    }
  }
}

/**
 * Does `selectorText` target `el` in the given state? A rule may list several
 * selectors (`&:active, &[aria-pressed="true"]` emits one rule with both), so
 * any one of them matching is enough.
 */
function ruleTargets(el, selectorText, simulated) {
  return selectorText.split(',').some((part) => {
    let selector = part.trim()

    // A rule needing a pointer state we are not simulating cannot apply.
    for (const pseudo of POINTER_PSEUDOS) {
      if (simulated.includes(pseudo)) continue
      if (selector.includes(pseudo)) return false
    }

    // Strip the states we are simulating and let jsdom match the rest for real,
    // so `:not(:disabled)`, `:disabled` and `[aria-pressed="true"]` stay honest.
    for (const pseudo of simulated) selector = selector.split(pseudo).join('')

    try {
      return el.matches(selector)
    } catch {
      return false
    }
  })
}

/**
 * The winning value of one CSS property, or '' when nothing sets it.
 *
 * Last non-empty declaration wins, which matches the cascade here because the
 * competing rules all have equal specificity and emotion emits `styled()`
 * before `sx`. Reading each rule through `getPropertyValue` means jsdom expands
 * shorthands for us, so both `border` and `border-color` resolve correctly.
 */
export function resolveProperty(el, property, state = 'rest') {
  const simulated = STATES[state]
  if (!simulated) {
    throw new Error(`Unknown state "${state}". Expected one of: ${Object.keys(STATES).join(', ')}`)
  }

  let value = ''
  for (const rule of styleRules()) {
    if (!ruleTargets(el, rule.selectorText, simulated)) continue
    const next = rule.style.getPropertyValue(property)
    if (next !== '') value = next
  }
  return value
}

function toHex(r, g, b) {
  return `#${[r, g, b].map((n) => Number(n).toString(16).padStart(2, '0')).join('')}`
}

/**
 * Puts authored values and jsdom's serialisation into one shape, so tests can
 * be written with the design tokens as they appear in `styles.js`:
 * jsdom reports `border: 1px solid #1A1A1A` as `1px solid rgb(26, 26, 26)`,
 * and drops the space after commas inside `box-shadow`.
 */
export function normalizeCssValue(value) {
  return String(value)
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/,\s+/g, ',')
    .replace(/\brgb\((\d+),(\d+),(\d+)\)/gi, (_match, r, g, b) => toHex(r, g, b))
    .replace(/#[0-9a-f]{3,8}\b/gi, (hex) => hex.toLowerCase())
}

/** The normalized values of `properties` for `el` in `state`. */
export function styleOf(el, properties, state = 'rest') {
  const resolved = {}
  for (const property of properties) {
    resolved[property] = normalizeCssValue(resolveProperty(el, property, state))
  }
  return resolved
}

/**
 * Asserts every property in `expected` at once, so a failure prints a diff of
 * the whole state rather than stopping at the first property.
 * An expected value of '' means "no rule sets this".
 */
export function expectStyles(el, state, expected) {
  const properties = Object.keys(expected)
  const normalizedExpected = {}
  for (const property of properties) {
    normalizedExpected[property] = normalizeCssValue(expected[property])
  }
  expect(styleOf(el, properties, state)).toEqual(normalizedExpected)
}
