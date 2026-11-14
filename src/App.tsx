import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { flavourColours, initialLanguage, languagePreferenceKey, menus, shopLinks } from './menuContent'
import type { Flavour, Language, Menu } from './menuContent'
import { bowlSource, MENU_TRANSITION_MS, useFlavourMenu } from './useFlavourMenu'
import { Landing } from './Landing'
import { HomeContent, SiteFooter } from './HomeContent'

const number = (index: number) => String(index + 1).padStart(2, '0')

function Thumbnail({ flavour }: { flavour: Flavour }) {
  return <img src={`${import.meta.env.BASE_URL}assets/thumbs/${flavour.id}.webp`} width="128" height="128" alt="" draggable="false"
    onError={event => {
      if (event.currentTarget.getAttribute('src') !== flavour.image) event.currentTarget.src = flavour.image
    }} />
}

function Selector({ menu, index, select }: { menu: Menu; index: number; select: (index: number) => void }) {
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
  }, [index, menu])

  return <nav ref={rail} className="selector" aria-label={menu.choose}>
    {menu.flavours.map((flavour, i) => <button key={flavour.id} className="thumb" type="button"
      tabIndex={i === index ? 0 : -1} aria-label={menu.show(flavour.name)}
      aria-current={i === index ? 'true' : undefined} onClick={() => select(i)}>
      <Thumbnail flavour={flavour} />
      <span>{flavour.name}</span>
    </button>)}
  </nav>
}

function Counter({ index, menu }: { index: number; menu: Menu }) {
  return <span className="counter" aria-label={menu.position(index + 1, menu.flavours.length)}>
    <strong>{number(index)}</strong><span aria-hidden="true"> / </span>{menu.flavours.length}
  </span>
}

export function App() {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const nextLanguage = language === 'en' ? 'tr' : 'en'
  const menu = menus[language]
  const flavours = menu.flavours
  const { index, previousIndex, direction, select, menuRef, surfaceProps } = useFlavourMenu(menus.en.flavours)
  const [navVisible, setNavVisible] = useState(false)
  const [fullMenu, setFullMenu] = useState(() => window.location.hash === '#flavour-menu')
  const dialog = useRef<HTMLDialogElement>(null)
  useLayoutEffect(() => {
    const onHashChange = () => setFullMenu(window.location.hash === '#flavour-menu')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  useLayoutEffect(() => {
    const id = window.location.hash.slice(1) || 'top'
    const destination = document.getElementById(id)
    destination?.scrollIntoView({ behavior: 'instant', block: 'start' })
    if (fullMenu) destination?.focus({ preventScroll: true })
    setNavVisible(window.scrollY > 24)
  }, [fullMenu])
  useLayoutEffect(() => {
    document.documentElement.lang = language
    document.title = menu.title
    document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = menu.description
  }, [language, menu])
  function changeLanguage() {
    setLanguage(nextLanguage)
    try {
      localStorage.setItem(languagePreferenceKey, nextLanguage)
    } catch {
      // The switch also works when the browser blocks preference storage.
    }
  }
  const current = flavours[index]
  const frames = previousIndex === null ? [index] : [previousIndex, index]
  const style = { '--direction': direction, '--duration': `${MENU_TRANSITION_MS}ms` } as CSSProperties
  const layerState = (i: number) => i !== index ? 'outgoing' : previousIndex === null ? 'settled' : 'incoming'

  return <>
    <div className="site-background" aria-hidden="true">
      <div className="background-curves"/>
    </div>
    <header className="masthead" data-visible={fullMenu || navVisible} inert={!fullMenu && !navVisible}>
      <a className="brand-logo" href="#top" aria-label={menu.backHome} title={menu.backHome}>
        <img src={`${import.meta.env.BASE_URL}assets/simetto-logo.png`} width="504" height="370" alt="" draggable="false"/>
      </a>
      <div className="header-tools">
        <button type="button" className="language-button" lang={nextLanguage}
          aria-label={`${nextLanguage.toUpperCase()} · ${menus[nextLanguage].switchToLanguage}`}
          title={menus[nextLanguage].switchToLanguage} onClick={changeLanguage}>
          {nextLanguage.toUpperCase()}
        </button>
        <nav className="shop-links" aria-label={menu.shopLinks}>
          <a href={shopLinks.instagram}
            target="_blank" rel="noopener noreferrer" aria-label={menu.instagram} title="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5"/>
              <circle cx="12" cy="12" r="4.15"/>
              <circle cx="17.5" cy="6.6" r="1.05" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href={shopLinks.maps}
            target="_blank" rel="noopener noreferrer" aria-label={menu.maps} title={menu.mapsTitle}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19.3 9.6c0 5.1-7.3 11.9-7.3 11.9S4.7 14.7 4.7 9.6a7.3 7.3 0 0 1 14.6 0Z"/>
              <circle cx="12" cy="9.6" r="2.6"/>
            </svg>
          </a>
          <button type="button" aria-label={menu.openNavigation} title={menu.openNavigation}
            aria-haspopup="dialog" aria-controls="site-navigation" onClick={() => dialog.current?.showModal()}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 5.5h18M3 12h18M3 18.5h18"/>
            </svg>
          </button>
        </nav>
      </div>
    </header>
    <main>
      {fullMenu ?
      <section id="flavour-menu" className="menu" aria-label={menu.mainLabel} tabIndex={-1}
        ref={menuRef} style={style} {...surfaceProps}>
        <section className="visual" aria-label={menu.bowl(current.name)}>
          {frames.map(i => <div key={flavours[i].id} className={`scene ${layerState(i)}`}
            aria-hidden={i !== index} style={{ backgroundColor: flavourColours[flavours[i].id] }}>
            <div className="plate-stage">
              <div className="drag-surface">
                <img className="bowl" src={bowlSource(flavours[i])} width="1254" height="1254"
                  alt={menu.bowlAlt(flavours[i].name)}
                  draggable="false" onError={event => {
                    if (event.currentTarget.getAttribute('src') !== flavours[i].image) event.currentTarget.src = flavours[i].image
                  }} />
              </div>
            </div>
          </div>)}
        </section>

        <section className="details" aria-label={menu.selected}>
          <div className="tasting-note">
            <div className="menu-label"><span>{menu.menuLabel}</span><Counter index={index} menu={menu}/></div>
            <div className="copy-stack">
              {flavours.map((flavour, i) => <article
                className={`flavour-copy ${(i === index || i === previousIndex) ? layerState(i) : 'standby'}`}
                key={flavour.id} aria-hidden={i !== index} inert={i !== index}>
                <h2>{flavour.name}</h2>
                <p>{flavour.description}</p>
                {flavour.price != null && flavour.price !== '' && <p className="price">{flavour.price}</p>}
              </article>)}
            </div>
          </div>
        </section>
        <Selector menu={menu} index={index} select={select}/>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{current.name}, {menu.position(index + 1, flavours.length)}</span>
      </section>
      : <>
        <Landing menu={menu} onNavVisibility={setNavVisible}/>
        <HomeContent menu={menu}/>
      </>}
    </main>
    <SiteFooter menu={menu}/>
    <dialog id="site-navigation" ref={dialog} className="site-navigation" aria-label={menu.navigation}
      onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close() }}>
      <nav className="site-menu-links">
        <a href="#flavour-menu" autoFocus onClick={() => dialog.current?.close()}>{menu.menuPage}</a>
        <a href="#about" onClick={() => dialog.current?.close()}>{menu.aboutPage}</a>
      </nav>
    </dialog>
  </>
}
