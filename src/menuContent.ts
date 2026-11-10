import sourceMenu from '../data/flavours.json'
import translatedFlavours from '../data/flavours.tr.json'

export type Language = 'en' | 'tr'

export interface Flavour {
  id: string
  name: string
  description: string
  price: string | number | null
  image: string
}

export const languagePreferenceKey = 'simetto-gelato.language'

export function initialLanguage(): Language {
  try {
    return localStorage.getItem(languagePreferenceKey) === 'tr' ? 'tr' : 'en'
  } catch {
    return 'en'
  }
}

// Both languages follow the shop board, starting with Pistachio.
const first = sourceMenu.findIndex(flavour => flavour.id === 'pistachio')
const englishFlavours: Flavour[] = [...sourceMenu.slice(first), ...sourceMenu.slice(0, first)].map(flavour => ({
  ...flavour,
  image: import.meta.env.BASE_URL + flavour.image.replace(/^\//, ''),
}))
const turkishNames: Record<string, Pick<Flavour, 'name' | 'description'>> = translatedFlavours

export const menus = {
  en: {
    flavours: englishFlavours,
    title: 'Simetto Gelato · The Flavour Menu',
    description: 'Explore the sixteen flavours of Simetto Gelato, one bowl at a time.',
    mainLabel: 'Simetto Gelato flavour menu',
    languageLabel: 'Menu language',
    shopLinks: 'Shop and menu',
    instagram: 'Simetto Gelato on Instagram (opens in a new tab)',
    maps: 'Simetto Gelato on Google Maps (opens in a new tab)',
    mapsTitle: 'Google Maps',
    menuLabel: 'Gelato menu',
    indexTitle: 'Flavour index',
    openIndex: 'Open flavour index',
    closeIndex: 'Close flavour index',
    choose: 'Choose a flavour',
    selected: 'Selected flavour',
    show: (name: string) => `Show ${name}`,
    position: (n: number, total: number) => `Flavour ${n} of ${total}`,
    bowl: (name: string) => `${name} gelato bowl`,
    bowlAlt: (name: string) => `An overhead view of ${name.toLowerCase()} gelato in a white bowl`,
  },
  tr: {
    flavours: englishFlavours.map(flavour => ({ ...flavour, ...turkishNames[flavour.id] })),
    title: 'Simetto Gelato · Dondurma Menüsü',
    description: 'Simetto Gelato’nun on altı dondurma çeşidini keşfedin.',
    mainLabel: 'Simetto Gelato dondurma menüsü',
    languageLabel: 'Menü dili',
    shopLinks: 'Mağaza ve menü',
    instagram: 'Instagram’da Simetto Gelato (yeni sekmede açılır)',
    maps: 'Google Haritalar’da Simetto Gelato (yeni sekmede açılır)',
    mapsTitle: 'Google Haritalar',
    menuLabel: 'Dondurma menüsü',
    indexTitle: 'Dondurma çeşitleri',
    openIndex: 'Çeşit listesini aç',
    closeIndex: 'Çeşit listesini kapat',
    choose: 'Dondurma çeşidi seç',
    selected: 'Seçili çeşit',
    show: (name: string) => `Çeşidi göster: ${name}`,
    position: (n: number, total: number) => `${total} çeşitten ${n}. çeşit`,
    bowl: (name: string) => `Dondurma kâsesi: ${name}`,
    bowlAlt: (name: string) => `Beyaz kâsede dondurma, üstten görünüm: ${name}`,
  },
}

export type Menu = (typeof menus)[Language]
