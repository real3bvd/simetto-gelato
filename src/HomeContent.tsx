import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import type { Menu } from './menuContent'
import { shopLinks } from './menuContent'
import { bowlSource } from './useFlavourMenu'
import './home.css'

const featuredIds = ['pistachio', 'strawberry', 'chocolate', 'lemon']

export function HomeContent({ menu }: { menu: Menu }) {
  const content = useRef<HTMLDivElement>(null)
  const featured = menu.flavours.filter(flavour => featuredIds.includes(flavour.id))

  useLayoutEffect(() => {
    const root = content.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-visible', 'true')
          observer.unobserve(entry.target)
        }
      }
    }, { threshold: .12 })
    for (const element of root.querySelectorAll('.reveal')) {
      element.setAttribute('data-visible', 'false')
      observer.observe(element)
    }
    return () => observer.disconnect()
  }, [])

  return <div ref={content} className="home-content">
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="about-copy reveal">
        <h2 id="about-title">{menu.aboutTitle}</h2>
        <p>{menu.aboutText}</p>
      </div>
    </section>
    <section id="featured-flavours" className="featured-section" aria-labelledby="featured-title">
      <div className="background-curves" aria-hidden="true"/>
      <h2 id="featured-title" className="reveal">{menu.featuredTitle}</h2>
      <div className="featured-grid">
        {featured.map((flavour, index) => <article className="feature-item reveal" key={flavour.id}
          style={{ '--reveal-delay': `${index * 65}ms` } as CSSProperties}>
          <img src={bowlSource(flavour)} width="1254" height="1254" alt={menu.bowlAlt(flavour.name)}
            loading="lazy" decoding="async" draggable="false" onError={event => {
              if (event.currentTarget.getAttribute('src') !== flavour.image) event.currentTarget.src = flavour.image
            }}/>
          <h3>{flavour.name}</h3>
        </article>)}
      </div>
      <a className="discover explore-all reveal" href="#flavour-menu">{menu.exploreAll}</a>
    </section>
  </div>
}

export function SiteFooter({ menu }: { menu: Menu }) {
  return <footer className="site-footer">
    <div className="footer-content">
      <div className="footer-brand">
        <a href="#top" aria-label={menu.backHome}>
          <img src={import.meta.env.BASE_URL + 'assets/simetto-logo.png'} width="504" height="370" alt="Simetto Gelato"/>
        </a>
        <p>{menu.headlineFirst} {menu.headlineLast}</p>
      </div>
      <nav className="footer-links" aria-label={menu.footerNavigation}>
        <a href="#about">{menu.aboutLink}</a>
        <a href="#flavour-menu">{menu.allFlavours}</a>
      </nav>
      <div className="footer-links">
        <a href={shopLinks.maps} target="_blank" rel="noopener noreferrer">{menu.directions}</a>
        <a href={shopLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label={menu.instagram}>Instagram</a>
      </div>
    </div>
    <p className="copyright">© 2026 Simetto Gelato.</p>
  </footer>
}
