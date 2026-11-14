import { useLayoutEffect, useRef } from 'react'
import type { Menu } from './menuContent'
import '@fontsource/playfair-display/400-italic.css'
import './landing.css'

const assetDirectory = import.meta.env.BASE_URL + 'assets/'

function Cup({ flavour }: { flavour: 'pistachio' | 'strawberry' }) {
  const file = assetDirectory + 'landing/' + flavour + '-cup'
  return <div className={`landing-cup ${flavour}`} aria-hidden="true">
    <div className="cup-travel">
      <picture>
        <source type="image/webp" srcSet={`${file}-480.webp 480w, ${file}-960.webp 960w`}
          sizes="(max-width: 700px) 70vw, (max-width: 1100px) 40vw, 580px"/>
        <img src={file + '.png'} alt="" width={flavour === 'pistachio' ? 1284 : 1266}
          height={flavour === 'pistachio' ? 1225 : 1242} decoding="async" draggable="false"/>
      </picture>
    </div>
  </div>
}

export function Landing({ menu, onNavVisibility }: { menu: Menu; onNavVisibility: (visible: boolean) => void }) {
  const hero = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = hero.current
    if (!section) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let height = section.offsetHeight
    let lastProgress = -1
    let visible = false
    let frame = 0

    function paint() {
      frame = 0
      const scroll = Math.max(0, window.scrollY)
      const showNavigation = scroll > 24
      if (showNavigation !== visible) {
        visible = showNavigation
        onNavVisibility(visible)
      }
      const progress = motion.matches ? 0 : Math.min(1, scroll / Math.max(1, height))
      if (progress !== lastProgress) {
        section!.style.setProperty('--cup-progress', progress.toFixed(4))
        lastProgress = progress
      }
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const observer = new ResizeObserver(() => {
      height = section.offsetHeight
      schedule()
    })
    observer.observe(section)
    paint()
    window.addEventListener('scroll', schedule, { passive: true })
    motion.addEventListener('change', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      motion.removeEventListener('change', schedule)
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [onNavVisibility])

  return <section id="top" ref={hero} className="landing" aria-labelledby="landing-title">
    <Cup flavour="pistachio"/>
    <Cup flavour="strawberry"/>
    <div className="landing-copy">
      <div className="landing-signature">
        <img src={assetDirectory + 'simetto-logo.png'} width="504" height="370" alt="Simetto Gelato"/>
      </div>
      <h1 id="landing-title"><span>{menu.headlineFirst}</span>{' '}<span>{menu.headlineLast}</span></h1>
      <p>{menu.landingSubtitle}</p>
    </div>
  </section>
}
