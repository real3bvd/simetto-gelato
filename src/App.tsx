import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties, RefObject } from 'react'
import sourceMenu from '../data/flavours.json'
import { bowlSource, MENU_TRANSITION_MS, useFlavourMenu } from './useFlavourMenu'

interface Flavour {
  id: string
  name: string
  description: string
  price: string | number | null
  image: string
}

// Open on Pistachio and continue around the original handwritten menu.
const first = sourceMenu.findIndex(flavour => flavour.id === 'pistachio')
const flavours: Flavour[] = [...sourceMenu.slice(first), ...sourceMenu.slice(0, first)].map(flavour => ({
  ...flavour,
  image: import.meta.env.BASE_URL + flavour.image.replace(/^\//, ''),
}))
const number = (index: number) => String(index + 1).padStart(2, '0')
const count = flavours.length
const colours: Record<string, string> = {
  'clotted-cream': '#c8c6b3', chocolate: '#c3b3a4', 'honey-almond': '#cec4a8',
  pistachio: '#b2cccc', 'italian-caramel': '#d3bea6', 'lotus-biscuit': '#d0b9a9',
  mastic: '#bdd0c5', 'tahini-walnut': '#c9c3af', lemon: '#d2d0af',
  strawberry: '#dec2bd', mojito: '#b9cec1', cherry: '#d3b9bc',
  blackberry: '#c6bdcf', fig: '#cfc2c5', melon: '#c5cdb4', sorrel: '#b5c8b8',
}

function Thumbnail({ flavour }: { flavour: Flavour }) {
  return <img src={`${import.meta.env.BASE_URL}assets/thumbs/${flavour.id}.webp`} width="128" height="128" alt="" draggable="false"
    onError={event => {
      if (event.currentTarget.getAttribute('src') !== flavour.image) event.currentTarget.src = flavour.image
    }} />
}

function Selector({ index, select }: { index: number; select: (index: number) => void }) {
  const rail = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const strip = rail.current
    const button = strip?.querySelector<HTMLButtonElement>('[aria-current="true"]')
    if (!strip || !button) return
    if (strip.contains(document.activeElement)) button.focus({ preventScroll: true })
    // Bring the chosen flavour and its neighbours into view without moving the page.
    const reveal = (behavior: ScrollBehavior) => {
      const left = button.offsetLeft - strip.scrollLeft
      const edge = Math.min(button.offsetWidth, strip.clientWidth / 4)
      if (left < edge || left + button.offsetWidth > strip.clientWidth - edge) {
        strip.scrollTo({ left: button.offsetLeft - (strip.clientWidth - button.offsetWidth) / 2, behavior })
      }
    }
    reveal(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth')
    const onResize = () => reveal('instant')
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [index])

  return <nav ref={rail} className="selector" aria-label="Choose a flavour">
    {flavours.map((flavour, i) => <button key={flavour.id} className="thumb" type="button"
      tabIndex={i === index ? 0 : -1} aria-label={`Show ${flavour.name}`}
      aria-current={i === index ? 'true' : undefined} onClick={() => select(i)}>
      <Thumbnail flavour={flavour} />
      <span>{flavour.name}</span>
    </button>)}
  </nav>
}

function Counter({ index }: { index: number }) {
  return <span className="counter" aria-label={`Flavour ${index + 1} of ${count}`}>
    <strong>{number(index)}</strong><span aria-hidden="true"> / </span>{count}
  </span>
}

function FlavourIndex({ dialog, index, select }: {
  dialog: RefObject<HTMLDialogElement | null>; index: number; select: (i: number) => void
}) {
  return <dialog id="flavour-index" ref={dialog} className="index-sheet" aria-labelledby="index-title"
    onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
    <div className="index-paper">
      <header className="sheet-heading">
        <h2 id="index-title">Flavour index</h2>
        <button className="close-index" onClick={() => dialog.current?.close()} aria-label="Close flavour index" autoFocus>×</button>
      </header>
      <ol className="index-list">
        {flavours.map((flavour, i) => <li key={flavour.id}>
          <button aria-current={i === index ? 'true' : undefined} onClick={() => {
            select(i)
            dialog.current?.close()
          }}>
            <span className="index-number">{number(i)}</span>
            <Thumbnail flavour={flavour} />
            <span className="index-name">{flavour.name}</span>
            {i === index && <span className="current-dot" aria-label="Current flavour" />}
          </button>
        </li>)}
      </ol>
    </div>
  </dialog>
}

export function App() {
  const { index, previousIndex, direction, select, surfaceProps } = useFlavourMenu(flavours)
  const dialog = useRef<HTMLDialogElement>(null)
  const current = flavours[index]
  const frames = previousIndex === null ? [index] : [previousIndex, index]
  const style = { '--direction': direction, '--duration': `${MENU_TRANSITION_MS}ms` } as CSSProperties
  const layerState = (i: number) => i !== index ? 'outgoing' : previousIndex === null ? 'settled' : 'incoming'

  return <>
    <main className="menu" aria-label="Simetto Gelato flavour menu" style={style} {...surfaceProps}>
      <header className="masthead">
        <button className="brand-logo" type="button" aria-label="Simetto Gelato, open flavour index" title="Open flavour index"
          aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
          <img src={`${import.meta.env.BASE_URL}assets/simetto-logo.png`} width="504" height="370" alt="" draggable="false"/>
        </button>
        <nav className="shop-links" aria-label="Shop and menu">
          <a href="https://www.instagram.com/simetto_gelato?utm_source=ig_web_button_share_sheet&vrfl=ZDNlZDc0MzIxNw=="
            target="_blank" rel="noopener noreferrer" aria-label="Simetto Gelato on Instagram (opens in a new tab)" title="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5"/>
              <circle cx="12" cy="12" r="4.15"/>
              <circle cx="17.5" cy="6.6" r="1.05" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="https://maps.app.goo.gl/nPuzAu9Ph8iGiARQ7"
            target="_blank" rel="noopener noreferrer" aria-label="Simetto Gelato on Google Maps (opens in a new tab)" title="Google Maps">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19.3 9.6c0 5.1-7.3 11.9-7.3 11.9S4.7 14.7 4.7 9.6a7.3 7.3 0 0 1 14.6 0Z"/>
              <circle cx="12" cy="9.6" r="2.6"/>
            </svg>
          </a>
          <button type="button" aria-label="Open flavour index" title="Flavour index"
            aria-haspopup="dialog" aria-controls="flavour-index" onClick={() => dialog.current?.showModal()}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 5.5h18M3 12h18M3 18.5h18"/>
            </svg>
          </button>
        </nav>
      </header>

      <section className="visual" aria-label={`${current.name} gelato bowl`}>
        {frames.map(i => <div key={flavours[i].id} className={`scene ${layerState(i)}`}
          aria-hidden={i !== index} style={{ backgroundColor: colours[flavours[i].id] }}>
          <div className="plate-stage">
            <div className="drag-surface">
              <img className="bowl" src={bowlSource(flavours[i])} width="1254" height="1254"
                alt={`An overhead view of ${flavours[i].name.toLowerCase()} gelato in a white bowl`}
                draggable="false" onError={event => {
                  if (event.currentTarget.getAttribute('src') !== flavours[i].image) event.currentTarget.src = flavours[i].image
                }} />
            </div>
          </div>
        </div>)}
      </section>

      <section className="details" aria-label="Selected flavour">
        <div className="tasting-note">
          <div className="menu-label"><span>Gelato menu</span><Counter index={index}/></div>
          <div className="copy-stack">
            {flavours.map((flavour, i) => <article
              className={`flavour-copy ${(i === index || i === previousIndex) ? layerState(i) : 'standby'}`}
              key={flavour.id} aria-hidden={i !== index} inert={i !== index}>
              <h1>{flavour.name}</h1>
              <p>{flavour.description}</p>
              {flavour.price != null && flavour.price !== '' && <p className="price">{flavour.price}</p>}
            </article>)}
          </div>
        </div>
      </section>
      <Selector index={index} select={select}/>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{current.name}, flavour {index + 1} of {count}</span>
    </main>
    <FlavourIndex dialog={dialog} index={index} select={select}/>
  </>
}
