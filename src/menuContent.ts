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
export const shopLinks = {
  instagram: 'https://www.instagram.com/simetto_gelato?utm_source=ig_web_button_share_sheet&vrfl=ZDNlZDc0MzIxNw==',
  maps: 'https://maps.app.goo.gl/nPuzAu9Ph8iGiARQ7',
}

export const flavourColours: Record<string, string> = {
  'clotted-cream': '#c8c6b3', chocolate: '#c3b3a4', 'honey-almond': '#cec4a8',
  pistachio: '#b2cccc', 'italian-caramel': '#d3bea6', 'lotus-biscuit': '#d0b9a9',
  mastic: '#bdd0c5', 'tahini-walnut': '#c9c3af', lemon: '#d2d0af',
  strawberry: '#dec2bd', mojito: '#b9cec1', cherry: '#d3b9bc',
  blackberry: '#c6bdcf', fig: '#cfc2c5', melon: '#c5cdb4', sorrel: '#b5c8b8',
}

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
    headlineFirst: 'The Art of',
    headlineLast: 'Gelato.',
    landingSubtitle: '16 flavours. One delicious experience.',
    aboutTitle: 'About Simetto',
    aboutIntro: 'A little pause. A lasting taste.',
    aboutParagraphs: [
      'At Simetto, gelato is an invitation to take a little time for yourself. The first spoonful, the pause between conversations, the familiar flavour you come back to: small things can make an ordinary day feel a little sweeter.',
      'Explore sixteen flavours, from the mellow, nutty character of Pistachio and the richness of Chocolate to bright Lemon and playful Strawberry. Stay with a favourite or discover a different side of the menu. There is pleasure in both the comfort of something familiar and the surprise of a new taste.',
      'Enjoy it on a gentle walk, share a moment with someone, or make a quiet stop just for you. However you choose your flavour, we hope Simetto becomes part of the moments you look forward to.',
    ],
    aboutPhotoAlt: 'The Simetto Gelato storefront at night, with illuminated signs and a warmly lit gelato counter',
    featuredTitle: 'Featured flavours',
    exploreAll: 'Explore All Flavours',
    backHome: 'Simetto Gelato home',
    footerNavigation: 'Footer navigation',
    footerDiscover: 'Discover',
    footerFindUs: 'Find Us',
    aboutLink: 'About Simetto',
    allFlavours: 'Our Flavours',
    directions: 'Get Directions',
    switchToLanguage: 'Switch to English',
    shopLinks: 'Shop and menu',
    instagram: 'Simetto Gelato on Instagram (opens in a new tab)',
    maps: 'Simetto Gelato on Google Maps (opens in a new tab)',
    mapsTitle: 'Google Maps',
    menuLabel: 'Gelato menu',
    navigation: 'Site navigation',
    openNavigation: 'Open navigation',
    menuPage: 'Menu',
    aboutPage: 'About',
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
    headlineFirst: 'Dondurma',
    headlineLast: 'Sanatı.',
    landingSubtitle: '16 çeşit. Tek bir lezzet deneyimi.',
    aboutTitle: 'Simetto Hakkında',
    aboutIntro: 'Küçük bir mola. Aklınızda kalan bir tat.',
    aboutParagraphs: [
      'Simetto’da dondurma, kendinize biraz zaman ayırmanız için bir davet. İlk kaşık, sohbet arasında verilen kısa bir mola, tekrar tekrar seçtiğiniz o tanıdık lezzet… Küçük anlar, sıradan bir günü biraz daha tatlı kılabilir.',
      'Antep Fıstığı’nın yumuşak ve fıstıksı tadından Çikolata’nın yoğunluğuna, Limon’un canlılığından Çilek’in neşeli tadına uzanan on altı çeşidi keşfedin. İster favorinizle devam edin, ister menünün başka bir lezzetine şans verin. Tanıdık bir tadın verdiği keyif de yeni bir lezzetin sürprizi de ayrı güzel.',
      'Kısa bir yürüyüşe eşlik etsin, sevdiğiniz biriyle paylaştığınız bir ana karışsın ya da yalnızca size ait sakin bir mola olsun. Hangi lezzeti seçerseniz seçin, Simetto’nun heyecanla beklediğiniz küçük anların bir parçası olmasını diliyoruz.',
    ],
    aboutPhotoAlt: 'Gece ışıklandırılmış tabelaları ve sıcak ışıklı dondurma tezgâhıyla Simetto Gelato mağazası',
    featuredTitle: 'Öne çıkan lezzetler',
    exploreAll: 'Tüm Çeşitleri Keşfet',
    backHome: 'Simetto Gelato ana sayfa',
    footerNavigation: 'Alt menü',
    footerDiscover: 'Keşfet',
    footerFindUs: 'Bize Ulaşın',
    aboutLink: 'Hakkımızda',
    allFlavours: 'Tüm Çeşitler',
    directions: 'Yol Tarifi Al',
    switchToLanguage: 'Türkçeye geç',
    shopLinks: 'Mağaza ve menü',
    instagram: 'Instagram’da Simetto Gelato (yeni sekmede açılır)',
    maps: 'Google Haritalar’da Simetto Gelato (yeni sekmede açılır)',
    mapsTitle: 'Google Haritalar',
    menuLabel: 'Dondurma menüsü',
    navigation: 'Site menüsü',
    openNavigation: 'Site menüsünü aç',
    menuPage: 'Menü',
    aboutPage: 'Hakkımızda',
    choose: 'Dondurma çeşidi seç',
    selected: 'Seçili çeşit',
    show: (name: string) => `Çeşidi göster: ${name}`,
    position: (n: number, total: number) => `${total} çeşitten ${n}. çeşit`,
    bowl: (name: string) => `Dondurma kâsesi: ${name}`,
    bowlAlt: (name: string) => `Beyaz kâsede dondurma, üstten görünüm: ${name}`,
  },
}

export type Menu = (typeof menus)[Language]
