import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react'

interface Bowl {
  id: string
  image: string
}

type Direction = 1 | -1

interface Frame {
  index: number
  previousIndex: number | null
  direction: Direction
}

interface Swipe {
  x: number
  y: number
  id: number
  surface: HTMLElement
  horizontal: boolean
  preview: boolean
  offset: number
  paint?: number
}

export const MENU_TRANSITION_MS = 900

const openingFrame: Frame = { index: 0, previousIndex: null, direction: 1 }
const fallbacks = new Set<string>()
const decoded = new Map<string, Promise<HTMLImageElement>>()

export function bowlSource(bowl: Bowl) {
  return fallbacks.has(bowl.id) ? bowl.image : `${import.meta.env.BASE_URL}assets/bowls/${bowl.id}.webp`
}

function prepareBowl(bowl: Bowl) {
  const cached = decoded.get(bowl.id)
  if (cached) {
    decoded.delete(bowl.id)
    decoded.set(bowl.id, cached)
    return cached
  }

  const load = async () => {
    const image = new Image()
    image.decoding = 'async'
    image.src = bowlSource(bowl)
    try {
      await image.decode()
    } catch {
      image.src = bowl.image
      await image.decode()
      fallbacks.add(bowl.id)
    }
    return image
  }

  const result = load()
  decoded.set(bowl.id, result)
  // Retain decoded neighbours for the next gesture without pinning the entire menu.
  if (decoded.size > 6) {
    const oldest = decoded.keys().next().value
    if (oldest !== undefined) decoded.delete(oldest)
  }
  void result.catch(() => {
    if (decoded.get(bowl.id) === result) decoded.delete(bowl.id)
  })
  return result
}

function wrap(index: number, length: number) {
  return ((index % length) + length) % length
}

function handlesOwnInput(target: EventTarget | null) {
  return target instanceof Element &&
    target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), dialog, [role="dialog"]') !== null
}

export function useFlavourMenu(flavours: readonly Bowl[]) {
  const [frame, setFrame] = useState(openingFrame)
  const current = useRef(openingFrame)
  const desiredIndex = useRef(0)
  const revision = useRef(0)
  const ready = useRef<{ index: number; direction: Direction } | null>(null)
  const busyUntil = useRef(0)
  const settleTimer = useRef<number | undefined>(undefined)
  const preparationFrame = useRef<number | undefined>(undefined)

  // Keep both halves on one committed frame. During a transition only the latest
  // destination survives, so queued taps never replay after browsing has stopped.
  const settle = useCallback(function settle() {
    window.clearTimeout(settleTimer.current)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const remaining = reduced ? 0 : busyUntil.current - performance.now()
    if (remaining > 0) {
      settleTimer.current = window.setTimeout(settle, Math.ceil(remaining))
      return
    }

    const last = current.current
    const upcoming = ready.current
    ready.current = null
    if (upcoming && upcoming.index !== last.index) {
      const nextFrame: Frame = {
        ...upcoming,
        previousIndex: reduced ? null : last.index,
      }
      current.current = nextFrame
      setFrame(nextFrame)
      busyUntil.current = performance.now() + (reduced ? 0 : MENU_TRANSITION_MS)
      if (!reduced) settleTimer.current = window.setTimeout(settle, MENU_TRANSITION_MS)
    } else if (last.previousIndex !== null) {
      current.current = { ...last, previousIndex: null }
      setFrame(current.current)
    }
  }, [])

  const go = useCallback((index: number, direction: Direction) => {
    if (!flavours[index] || index === desiredIndex.current) return
    desiredIndex.current = index
    const ticket = ++revision.current
    ready.current = null
    if (preparationFrame.current !== undefined) cancelAnimationFrame(preparationFrame.current)
    if (index === current.current.index) return
    preparationFrame.current = requestAnimationFrame(() => {
      void prepareBowl(flavours[index]).then(() => {
        if (ticket !== revision.current) return
        ready.current = { index, direction }
        settle()
      }).catch(() => {
        if (ticket === revision.current) desiredIndex.current = current.current.index
      })
    })
  }, [flavours, settle])

  const select = useCallback((index: number) => {
    const forward = wrap(index - current.current.index, flavours.length)
    go(index, forward <= flavours.length / 2 ? 1 : -1)
  }, [flavours.length, go])

  const step = useCallback((direction: Direction) => {
    go(wrap(desiredIndex.current + direction, flavours.length), direction)
  }, [flavours.length, go])

  const next = useCallback(() => step(1), [step])
  const prev = useCallback(() => step(-1), [step])

  useEffect(() => {
    let active = true
    const bowl = flavours[frame.index]
    if (bowl) {
      void prepareBowl(bowl).then(() => {
        if (!active) return
        for (const direction of [-1, 1]) {
          const neighbour = flavours[wrap(frame.index + direction, flavours.length)]
          void prepareBowl(neighbour).catch(() => {})
        }
      }).catch(() => {})
    }
    return () => { active = false }
  }, [flavours, frame.index])

  useEffect(() => () => {
    ++revision.current
    if (preparationFrame.current !== undefined) cancelAnimationFrame(preparationFrame.current)
    window.clearTimeout(settleTimer.current)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || handlesOwnInput(event.target)) return
      const scrollable = document.documentElement.scrollHeight > window.innerHeight + 2
      if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && scrollable) return
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown': next(); break
        case 'ArrowLeft':
        case 'ArrowUp': prev(); break
        case 'Home': select(0); break
        case 'End': select(flavours.length - 1); break
        default: return
      }
      event.preventDefault()
    }

    let lastWheel = -Infinity
    let distance = 0
    let consumed = false
    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey || handlesOwnInput(event.target)) return
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      if ((horizontal || event.shiftKey) && event.target instanceof Element && event.target.closest('.selector')) return
      if (!horizontal && document.documentElement.scrollHeight > window.innerHeight + 2) return
      const now = performance.now()
      if (now - lastWheel > 180) {
        distance = 0
        consumed = false
      }
      lastWheel = now
      if (consumed) return
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1
      distance += (horizontal ? event.deltaX : event.deltaY) * unit
      if (Math.abs(distance) < 36) return
      consumed = true
      step(distance > 0 ? 1 : -1)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
    }
  }, [flavours.length, next, prev, select, step])

  const touch = useRef<Swipe | null>(null)
  const suppressClickUntil = useRef(0)

  const resetTouch = useCallback(() => {
    const swipe = touch.current
    if (!swipe) return
    if (swipe.paint !== undefined) cancelAnimationFrame(swipe.paint)
    if (swipe.horizontal && swipe.preview) {
      swipe.surface.removeAttribute('data-dragging')
      swipe.surface.style.removeProperty('--drag-x')
    }
    touch.current = null
  }, [])
  useEffect(() => resetTouch, [resetTouch])

  const onTouchStart = (event: ReactTouchEvent<HTMLElement>) => {
    resetTouch()
    suppressClickUntil.current = 0
    if (event.touches.length !== 1 || (window.visualViewport?.scale ?? 1) > 1.01) return
    if (handlesOwnInput(event.target) || (event.target instanceof Element &&
      event.target.closest('a, button, [role="button"], .selector'))) return

    const point = event.touches[0]
    touch.current = {
      x: point.clientX, y: point.clientY, id: point.identifier, surface: event.currentTarget,
      horizontal: false, preview: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      offset: 0,
    }
  }

  const onTouchMove = (event: ReactTouchEvent<HTMLElement>) => {
    const swipe = touch.current
    if (!swipe) return
    const point = event.touches[0]
    if (event.touches.length !== 1 || point.identifier !== swipe.id || (window.visualViewport?.scale ?? 1) > 1.01) {
      resetTouch()
      return
    }
    const dx = point.clientX - swipe.x
    const dy = point.clientY - swipe.y
    if (!swipe.horizontal) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
        resetTouch()
        return
      }
      if (Math.abs(dx) < 8 || Math.abs(dx) < 1.4 * Math.abs(dy)) return
      swipe.horizontal = true
    }
    if (!swipe.preview) return

    swipe.offset = 40 * Math.tanh(dx / 140)
    if (swipe.paint === undefined) {
      swipe.paint = requestAnimationFrame(() => {
        swipe.paint = undefined
        swipe.surface.setAttribute('data-dragging', '')
        swipe.surface.style.setProperty('--drag-x', `${swipe.offset.toFixed(2)}px`)
      })
    }
  }

  const onTouchEnd = (event: ReactTouchEvent) => {
    const start = touch.current
    resetTouch()
    const end = event.changedTouches[0]
    if (!start || !end || end.identifier !== start.id || event.touches.length || (window.visualViewport?.scale ?? 1) > 1.01) return
    const dx = end.clientX - start.x
    const dy = end.clientY - start.y
    if (Math.abs(dx) < 42 || Math.abs(dx) < 1.4 * Math.abs(dy)) return
    suppressClickUntil.current = performance.now() + 280
    step(dx < 0 ? 1 : -1)
  }
  const onClickCapture = (event: ReactMouseEvent) => {
    if (event.detail > 0 && performance.now() < suppressClickUntil.current) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  return {
    ...frame, select,
    surfaceProps: {
      onTouchStart, onTouchMove, onTouchEnd, onClickCapture, onTouchCancel: resetTouch,
    },
  }
}
