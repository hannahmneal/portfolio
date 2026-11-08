import '@testing-library/jest-dom'

/**
 * This environment exposes `window.localStorage` as a plain object with no
 * methods, so every call in `AppThemeProvider` throws and is swallowed by its
 * try/catch: stored preferences neither load nor save, and the app silently
 * starts in light mode. Swap in a real in-memory Storage so the persistence
 * paths (`hneal-theme`, `hneal-accent`, `hneal-project`) are exercised.
 */
class MemoryStorage {
  #items = new Map()

  get length() {
    return this.#items.size
  }

  key(index) {
    return [...this.#items.keys()][index] ?? null
  }

  getItem(key) {
    const name = String(key)
    return this.#items.has(name) ? this.#items.get(name) : null
  }

  setItem(key, value) {
    this.#items.set(String(key), String(value))
  }

  removeItem(key) {
    this.#items.delete(String(key))
  }

  clear() {
    this.#items.clear()
  }
}

for (const name of ['localStorage', 'sessionStorage']) {
  Object.defineProperty(window, name, {
    value: new MemoryStorage(),
    configurable: true,
    writable: true,
  })
}
