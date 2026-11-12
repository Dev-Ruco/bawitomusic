import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowDown, ArrowUpRight, CalendarDays, Check, ChevronDown, Compass, Target,
  ChevronLeft, ChevronRight, Clapperboard, Headphones, Mail,
  MapPin, Megaphone, Menu, MessageCircle, MonitorPlay, Phone, Radio,
  Send, ShieldCheck, Sparkles, X,
  type LucideIcon,
} from 'lucide-react'

const PHONE = '258843000002'
const PHONE_DISPLAY = '+258 84 300 0002'
const EMAIL = 'comercial@bawitomusic.co.mz'
const ADDRESS = 'Av. Paulo Samuel Kamkhomba, n.º 1441, 1.º Andar, Malhangalene, Maputo, Moçambique'

const image = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=72`

// Responsive photos: mobile devices do not download desktop-sized images.
const imageAt = (url: string, width: number) => url.replace(/([?&])w=\d+/, `$1w=${width}`)
const imageSet = (url: string) => [400, 680, 960, 1280].map(width => `${imageAt(url, width)} ${width}w`).join(', ')

const photos = {
  // Geradas a partir da imagem original da Bawito carregada em public/images/hero.
  hero: '/images/hero/hero-bawito-desktop.webp',
  heroTablet: '/images/hero/hero-bawito-tablet.webp',
  heroMobile: '/images/hero/hero-bawito-mobile.webp',
  about: image('photo-1540575467063-178a50c2df87', 1100),
  conference: image('photo-1475721027785-f74eccf877e2', 850),
  screens: image('photo-1505373877841-8d25f7d46678', 850),
  sound: image('photo-1493225457124-a3eb161ffa5f', 850),
  lights: image('photo-1492684223066-81342ee5ff30', 850),
  stages: image('photo-1540039155733-5bb30b53aa14', 850),
  streaming: image('photo-1593697821252-0c9137d9fc45', 850),
  energy: image('photo-1487958449943-2429e8be8625', 850),
  production: image('photo-1511578314322-379afb476865', 850),
  process: image('photo-1511578314322-379afb476865', 1100),
  gala: image('photo-1511795409834-ef04bbd61622', 850),
  concerts: image('photo-1459749411175-04bf5292ceea', 850),
  activation: image('photo-1559223607-a43c990c692c', 850),
  event: image('photo-1505236858219-8359eb29e329', 850),
}

type Service = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  illustration: string
  label: string
  featured?: boolean
}

const services: Service[] = [
  { id: 'comunicacao', title: 'Comunicação e marketing', label: 'Comunicação estratégica', description: 'Campanhas, conteúdos e estratégias que aproximam as marcas dos seus públicos.', icon: Megaphone, illustration: '/illustrations/servicos/comunicacao.svg', featured: true },
  { id: 'estrategia', title: 'Estratégia e activação de marcas', label: 'Experiências de marca', description: 'Concepção de lançamentos, acções promocionais e experiências de marca.', icon: Target, illustration: '/illustrations/servicos/estrategia.svg', featured: true },
  { id: 'eventos', title: 'Eventos corporativos', label: 'Organização de eventos', description: 'Conferências, fóruns, seminários e cerimónias, do planeamento à realização.', icon: Sparkles, illustration: '/illustrations/servicos/eventos.svg' },
  { id: 'producao', title: 'Produção e coordenação', label: 'Gestão de projecto', description: 'Planeamento, logística, equipas e acompanhamento de cada etapa do evento.', icon: Clapperboard, illustration: '/illustrations/servicos/coordenacao.svg' },
  { id: 'streaming', title: 'Transmissão em directo', label: 'Live streaming', description: 'Captação multicâmara e transmissão de eventos para públicos presenciais e remotos.', icon: Radio, illustration: '/illustrations/servicos/streaming.svg' },
  { id: 'audiovisual', title: 'Produção audiovisual', label: 'Conteúdos e imagem', description: 'Captação, realização e suporte audiovisual para apresentações, conferências e campanhas.', icon: MonitorPlay, illustration: '/illustrations/servicos/led.svg' },
]

type RentalItem = {
  id: string
  title: string
  tag: string
  description: string
  image: string
  srcSet?: string
  alt: string
}

const rentals: RentalItem[] = [
  {
    id: 'tendas', title: 'Tendas para eventos', tag: 'Estruturas',
    description: 'Tendas para eventos empresariais, institucionais e sociais.',
    image: '/images/aluguer/tendas-820.webp',
    srcSet: '/images/aluguer/tendas-480.webp 480w, /images/aluguer/tendas-820.webp 820w',
    alt: 'Tenda branca montada para um evento ao ar livre, em imagem ilustrativa.'
  },
  {
    id: 'geradores', title: 'Geradores industriais', tag: 'Energia',
    description: 'Energia de apoio para eventos e montagens técnicas.',
    image: '/images/aluguer/geradores-820.webp',
    srcSet: '/images/aluguer/geradores-480.webp 480w, /images/aluguer/geradores-820.webp 820w',
    alt: 'Geradores industriais brancos de grande dimensão num cenário de evento, em imagem ilustrativa.'
  },
  {
    id: 'ac', title: 'Ar condicionado vertical', tag: 'Climatização',
    description: 'Climatização móvel para tendas, salões e conferências.',
    image: '/images/aluguer/ar-condicionado-vertical.webp',
    alt: 'Unidades de ar condicionado verticais no interior de uma sala de conferência, em imagem ilustrativa.'
  },
  {
    id: 'palcos', title: 'Palcos e estruturas', tag: 'Montagem',
    description: 'Palcos, coberturas e estruturas para diferentes eventos.',
    image: '/images/aluguer/palcos-820.webp',
    srcSet: '/images/aluguer/palcos-480.webp 480w, /images/aluguer/palcos-820.webp 820w',
    alt: 'Palco exterior coberto com estrutura metálica, som e iluminação, em imagem ilustrativa.'
  },
  {
    id: 'ecras', title: 'Ecrãs LED e Monitores', tag: 'Audiovisuais',
    description: 'Ecrãs e monitores para conferências, apresentações e eventos.',
    image: '/images/aluguer/ecras-820.webp',
    srcSet: '/images/aluguer/ecras-480.webp 480w, /images/aluguer/ecras-820.webp 820w',
    alt: 'Ecrãs e monitores instalados numa sala de conferências, em imagem ilustrativa.'
  },
  {
    id: 'sanitarios', title: 'Sanitários Móveis para Eventos', tag: 'Apoio logístico',
    description: 'Cabines sanitárias portáteis e módulos móveis para eventos.',
    image: '/images/aluguer/sanitarios-820.webp',
    srcSet: '/images/aluguer/sanitarios-480.webp 480w, /images/aluguer/sanitarios-820.webp 820w',
    alt: 'Cabines sanitárias portáteis azuis e módulos sanitários móveis brancos, em imagem ilustrativa.'
  }
]

type GalleryFilter = 'todos' | 'conferencias' | 'producao' | 'espectaculos'

type GalleryProject = {
  id: string
  title: string
  type: string
  kind: Exclude<GalleryFilter, 'todos'>
  src: string
  alt: string
}

const projectImage = (id: string, width: 400 | 800 | 1200) => `/images/projectos/optimizadas/${id}-${width}.webp`
const projectImageSet = (id: string) => [400, 800, 1200].map(width => `${projectImage(id, width as 400 | 800 | 1200)} ${width}w`).join(', ')

const gallery: GalleryProject[] = [
  { id: 'conferencias-institucionais', title: 'Conferências institucionais', type: 'CONFERÊNCIAS', kind: 'conferencias', src: projectImage('conferencias-institucionais', 800), alt: 'Conferência institucional sob cobertura branca e azul, com orador, público e dois ecrãs LED.' },
  { id: 'eventos-empresariais', title: 'Encontros empresariais', type: 'CONFERÊNCIAS', kind: 'conferencias', src: projectImage('eventos-empresariais', 800), alt: 'Grande conferência em Maputo, com plateia, palco, ecrãs e equipas de filmagem.' },
  { id: 'bastidores-tecnicos', title: 'Bastidores da produção', type: 'PRODUÇÃO TÉCNICA', kind: 'producao', src: projectImage('bastidores-tecnicos', 800), alt: 'Equipa técnica a operar realização de vídeo e som numa celebração sob tenda iluminada.' },
  { id: 'reunioes-direccao', title: 'Reuniões de direcção', type: 'CONFERÊNCIAS', kind: 'conferencias', src: projectImage('reunioes-direccao', 800), alt: 'Reunião institucional com mesas em U, participantes e ecrãs laterais sob tenda branca.' },
  { id: 'cerimonias-publicas', title: 'Cerimónias institucionais', type: 'PRODUÇÃO E MONTAGEM', kind: 'producao', src: projectImage('cerimonias-publicas', 800), alt: 'Cerimónia ao ar livre com palco coberto, ecrãs e filas de cadeiras brancas.' },
  { id: 'tendas-e-estruturas', title: 'Montagem de tendas', type: 'PRODUÇÃO E MONTAGEM', kind: 'producao', src: projectImage('tendas-e-estruturas', 800), alt: 'Grande tenda para eventos com cobertura branca e laranja e cadeiras organizadas.' },
  { id: 'espectaculos-ao-vivo', title: 'Espectáculos ao vivo', type: 'PALCOS E ESPECTÁCULOS', kind: 'espectaculos', src: projectImage('espectaculos-ao-vivo', 800), alt: 'Banda a actuar em palco modular com iluminação colorida, som e grande ecrã LED.' },
  { id: 'grandes-palcos', title: 'Grandes palcos', type: 'PALCOS E ESPECTÁCULOS', kind: 'espectaculos', src: projectImage('grandes-palcos', 800), alt: 'Grande palco exterior nocturno com estrutura metálica, ecrã e público.' },
]

const filters: Array<{ id: GalleryFilter; text: string }> = [
  { id: 'todos', text: 'Todos os projectos' },
  { id: 'conferencias', text: 'Conferências' },
  { id: 'producao', text: 'Produção e montagem' },
  { id: 'espectaculos', text: 'Espectáculos' },
]

const eventTypes = ['Aluguer de equipamentos', 'Conferência / Seminário', 'Evento corporativo', 'Lançamento de produto', 'Gala / Cerimónia', 'Concerto / Festival', 'Casamento / Evento social', 'Campanha / Activação', 'Outro']

function WaveMark({ light = false }: { light?: boolean }) {
  return <a href="#inicio" className={`brand ${light ? 'brand-light' : 'brand-image'}`} aria-label="Bawito Music & Serviços — voltar ao início">
    {light ? (
      <>
        <span className="brand-symbol" aria-hidden="true"><i /><i /><i /><i /><i /></span>
        <span className="brand-words"><strong>BAWITO</strong><small>MUSIC <span>&</span> SERVIÇOS</small></span>
      </>
    ) : (
      <img className="brand-logo" src="/images/marca/logo-bawito-header.webp" alt="Bawito Music & Serviços" width={360} height={140} decoding="async" />
    )}
  </a>
}

function SectionEyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return <div className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span className="eyebrow-rule" />{children}</div>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [scrolled, setScrolled] = useState(false)
  const [filter, setFilter] = useState<GalleryFilter>('todos')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [activeImage, setActiveImage] = useState<(typeof gallery)[number] | null>(null)
  const [formNotice, setFormNotice] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', event: '', date: '', city: '', message: '' })
  const modalCloseRef = useRef<HTMLButtonElement | null>(null)
  const lastFocusedElement = useRef<HTMLElement | null>(null)
  const menuToggleRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Content is visible by default; reveal animations are progressive enhancement.
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.07, rootMargin: '0px 0px -8px 0px' })
    const targets = document.querySelectorAll('.reveal:not(.is-visible)')
    targets.forEach(target => observer.observe(target))
    document.documentElement.classList.add('enhanced-motion')
    return () => observer.disconnect()
  }, [filter])

  useEffect(() => {
    const ids = ['inicio', 'sobre', 'servicos', 'aluguer', 'solucoes', 'artistas', 'contactos']
    if (!('IntersectionObserver' in window)) return
    const spy = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
      if (visible.length) setActiveSection(visible[0].target.id)
    }, { rootMargin: '-22% 0px -63% 0px', threshold: 0 })
    ids.forEach(id => { const node = document.getElementById(id); if (node) spy.observe(node) })
    return () => spy.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    if (window.matchMedia('(max-width: 1050px)').matches) document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuToggleRef.current?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 1051px)')
    const onResize = () => { if (desktop.matches) setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!activeImage) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lastFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    modalCloseRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveImage(null)
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        const items = filter === 'todos' ? gallery : gallery.filter(item => item.kind === filter)
        setActiveImage(current => {
          const index = items.findIndex(item => item.id === current?.id)
          return items[(index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length] ?? current
        })
      }
      if (event.key === 'Tab') {
        const controls = Array.from(document.querySelectorAll<HTMLButtonElement>('.portfolio-lightbox button'))
        if (!controls.length) return
        const first = controls[0], last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey); lastFocusedElement.current?.focus() }
  }, [Boolean(activeImage), filter])

  const toggleService = (name: string) => setSelectedServices((current) =>
    current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
  )

  const setField = (field: keyof typeof form, value: string) => {
    setForm((old) => ({ ...old, [field]: value }))
    setFormNotice('')
  }

  const submitQuote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.city.trim() || !form.event || form.message.trim().length < 10) {
      setFormNotice('Por favor, verifique os campos obrigatórios antes de continuar.')
      return
    }
    const lines = [
      'Olá, Bawito Music & Serviços! Gostaria de solicitar um orçamento.',
      '',
      `Nome: ${form.name.trim()}`,
      `Contacto: ${form.phone.trim()}`,
      ...(form.email.trim() ? [`E-mail: ${form.email.trim()}`] : []),
      `Tipo de evento: ${form.event}`,
      ...(form.date ? [`Data prevista: ${form.date}`] : []),
      `Local: ${form.city.trim()}`,
      ...(selectedServices.length ? [`Serviços pretendidos: ${selectedServices.join(', ')}`] : []),
      `Descrição: ${form.message.trim()}`,
    ]
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(lines.join('\n'))}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setFormNotice('O seu pedido foi preparado. Confirme o envio na conversa do WhatsApp que foi aberta.')
  }

  const goTo = () => setMenuOpen(false)
  const visibleGallery = filter === 'todos' ? gallery : gallery.filter((item) => item.kind === filter)
  const navigateGallery = (step: number) => setActiveImage(current => {
    if (!current || !visibleGallery.length) return current
    const index = visibleGallery.findIndex(item => item.id === current.id)
    return visibleGallery[(index + step + visibleGallery.length) % visibleGallery.length]
  })

  return <>
    <a className="skip-link" href="#principal">Saltar para o conteúdo</a>
    <header className={`site-header header-light ${scrolled ? 'header-scrolled' : ''} ${menuOpen ? 'menu-active' : ''}`}>
      <div className="header-inner container">
        <WaveMark />
        <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Navegação principal" id="main-navigation">
          <a href="#inicio" aria-current={activeSection === 'inicio' ? 'location' : undefined} onClick={goTo}>Início</a>
          <a href="#sobre" aria-current={activeSection === 'sobre' ? 'location' : undefined} onClick={goTo}>A Bawito</a>
          <a href="#servicos" aria-current={activeSection === 'servicos' ? 'location' : undefined} onClick={goTo}>Serviços</a>
          <a href="#aluguer" aria-current={activeSection === 'aluguer' ? 'location' : undefined} onClick={goTo}>Aluguer</a>
          <a href="#solucoes" aria-current={activeSection === 'solucoes' ? 'location' : undefined} onClick={goTo}>Eventos</a>
          <a href="#artistas" aria-current={activeSection === 'artistas' ? 'location' : undefined} onClick={goTo}>Artistas</a>
          <a href="#contactos" className="nav-mobile-cta" aria-current={activeSection === 'contactos' ? 'location' : undefined} onClick={goTo}>Solicitar orçamento <ArrowUpRight size={17} aria-hidden="true" /></a>
        </nav>
        <a className="btn btn-header" href="#contactos">Solicitar orçamento <ArrowUpRight size={18} aria-hidden="true" /></a>
        <button ref={menuToggleRef} className="menu-button" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}>
          {menuOpen ? <X size={25} aria-hidden="true" /> : <Menu size={25} aria-hidden="true" />}
        </button>
      </div>
    </header>
    <button type="button" aria-label="Fechar navegação" aria-hidden={!menuOpen} tabIndex={menuOpen ? 0 : -1} className={`menu-backdrop ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(false)} />

    <main id="principal">
      <section className="hero hero-clean" id="inicio" aria-labelledby="hero-title">
        <picture className="hero-photo" aria-hidden="true">
          <source media="(max-width: 620px)" srcSet={photos.heroMobile} />
          <source media="(max-width: 1100px)" srcSet={photos.heroTablet} />
          <img src={photos.hero} alt="" width={1600} height={900} loading="eager" decoding="async" />
        </picture>
        <div className="hero-grid container">
          <div className="hero-main">
            <h1 id="hero-title">Produção técnica<br /><span>para eventos corporativos.</span></h1>
            <p>Soluções integradas de som, iluminação, telas LED, transmissão em directo e coordenação técnica para conferências, eventos empresariais e institucionais.</p>
            <div className="hero-buttons">
              <a href="#contactos" className="btn btn-primary">Solicitar orçamento <ArrowUpRight size={18} aria-hidden="true" /></a>
              <a href="#servicos" className="btn btn-ghost">Conhecer serviços <ArrowDown size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </section>

      <div className="service-ribbon" aria-label="Áreas de actuação"><div className="ribbon-content">
        {['EVENTOS CORPORATIVOS', 'TELAS LED', 'SOM PROFISSIONAL', 'ILUMINAÇÃO', 'PALCOS', 'LIVE STREAMING', 'PRODUÇÃO TÉCNICA', 'EVENTOS CORPORATIVOS', 'TELAS LED', 'SOM PROFISSIONAL'].map((item, index) =>
          <span key={`${item}-${index}`}><span className="ribbon-star">✳</span>{item}</span>,
        )}
      </div></div>

      <section id="sobre" className="about section-pad" aria-labelledby="about-title">
        <div className="container">
          <div className="about-grid">
            <div className="about-visual reveal">
              <picture className="about-picture">
                <source media="(max-width: 680px)" srcSet="/images/equipa/about-bawito-mobile.webp" />
                <img src="/images/equipa/about-bawito-desktop.webp" width={1100} height={760}
                  alt="Composição ilustrativa de um centro de produção audiovisual, com mesas de controlo, câmaras e palco."
                  loading="lazy" decoding="async" />
              </picture>
              <div className="about-tenure" aria-label="Mais de dez anos no mercado"><strong>10<span>+</span></strong><span>anos de actividade<br />no mercado</span></div>
            </div>
            <div className="about-copy reveal">
              <SectionEyebrow>UMA AGÊNCIA, SOLUÇÕES INTEGRADAS</SectionEyebrow>
              <h2 id="about-title">Estratégia, comunicação e <em>produção de eventos.</em></h2>
              <p className="lead">Com mais de 10 anos de actividade, a Bawito Music & Serviços é uma agência moçambicana de comunicação e produção de eventos.</p>
              <p>Desenvolvemos projectos de comunicação e marketing, planeamos conferências e eventos institucionais e asseguramos a respectiva produção técnica. Da concepção à execução, articulamos estratégia, criatividade, logística, som, iluminação, telas LED e transmissão em directo para oferecer soluções integradas a cada cliente.</p>
            </div>
          </div>
          <div className="about-values" aria-label="Missão e objectivo da Bawito">
            <article className="about-value reveal">
              <span className="about-value-icon" aria-hidden="true"><Compass size={24} strokeWidth={1.8} /></span>
              <div><h3>A nossa missão</h3><p>Valorizar marcas e instituições através de comunicação eficaz, experiências bem concebidas e execução técnica rigorosa.</p></div>
            </article>
            <article className="about-value reveal">
              <span className="about-value-icon" aria-hidden="true"><Target size={24} strokeWidth={1.8} /></span>
              <div><h3>O nosso objectivo</h3><p>Reunir estratégia, marketing e produção numa resposta coordenada, adaptada às necessidades e aos resultados pretendidos por cada cliente.</p></div>
            </article>
          </div>
        </div>
      </section>

      <section id="servicos" className="services section-pad" aria-labelledby="services-title">
        <div className="container">
          <div className="section-heading reveal">
            <div><SectionEyebrow>SOLUÇÕES INTEGRADAS</SectionEyebrow>
              <h2 id="services-title">Comunicação, estratégia e <em>produção de eventos.</em></h2></div>
            <p>Da ideia à concretização, reunimos criatividade, planeamento e capacidade técnica numa resposta integrada.</p>
          </div>
          <div className="service-grid service-grid-six">
            {services.map((service, index) => {
              const Icon = service.icon
              return <a key={service.id}
                className={`service-card reveal ${service.featured ? 'service-card-featured' : ''}`}
                href="#contactos"
                aria-label={`Solicitar serviço de ${service.title}`}
                onClick={() => setSelectedServices(current => current.includes(service.title) ? current : [...current, service.title])}>
                <div className="service-illustration">
                  <img src={service.illustration} width={480} height={260} alt="" loading="lazy" decoding="async" />
                  <span className="service-count" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <span className="service-illustration-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.8} /></span>
                </div>
                <div className="service-card-body">
                  <span className="service-label">{service.label}</span><h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span className="service-card-link">Solicitar serviço <ArrowUpRight size={18} aria-hidden="true" /></span>
                </div>
              </a>
            })}
          </div>
        </div>
      </section>

      <section id="aluguer" className="rentals section-pad" aria-labelledby="rentals-title">
        <div className="container">
          <div className="section-heading reveal">
            <div><SectionEyebrow>EQUIPAMENTOS E ESTRUTURAS</SectionEyebrow>
              <h2 id="rentals-title">Equipamentos para <em>aluguer.</em></h2></div>
            <p>Tendas, geradores, climatização, palcos, ecrãs e sanitários móveis. Condições e disponibilidade mediante orçamento.</p>
          </div>
          <div className="rental-grid">
            {rentals.map((item) => (
              <a key={item.id} className="rental-card reveal" href="#contactos"
                aria-label={`Pedir proposta de aluguer: ${item.title}`}
                onClick={() => setSelectedServices(current => current.includes('Aluguer — ' + item.title) ? current : [...current, 'Aluguer — ' + item.title])}>
                <div className="rental-media">
                  <img src={item.image}
                    srcSet={item.srcSet}
                    sizes="(max-width: 620px) 46vw, (max-width: 1100px) 46vw, 31vw"
                    alt={item.alt} width={820} height={560} loading="lazy" decoding="async" />
                  <span className="rental-category">{item.tag}</span>
                </div>
                <div className="rental-body">
                  <h3>{item.title}</h3><p>{item.description}</p>
                  <span className="rental-action">Pedir aluguer <ArrowUpRight size={18} aria-hidden="true" /></span>
                </div>
              </a>
            ))}
          </div>
          <p className="rental-disclaimer">Imagens ilustrativas. Características e disponibilidade confirmadas no orçamento.</p>
        </div>
      </section>

      <section className="approach section-pad" aria-labelledby="approach-title">
        <div className="container approach-inner">
          <div className="approach-copy reveal">
            <SectionEyebrow light>O NOSSO MÉTODO</SectionEyebrow>
            <h2 id="approach-title">Um grande evento não acontece por acaso. <em>É construído.</em></h2>
            <p>Coordenamos pessoas, equipamentos e operações para transformar um briefing numa experiência que funciona.</p>
            <div className="steps">
              {[
                ['01', 'Escutamos a sua ideia', 'Conhecemos o objectivo, o público e as necessidades do evento.'],
                ['02', 'Desenhamos a solução', 'Definimos os recursos, a logística e o plano técnico.'],
                ['03', 'Preparamos cada detalhe', 'Articulamos equipas, montagem e ensaios.'],
                ['04', 'Executamos com rigor', 'Acompanhamos a operação até ao encerramento.'],
              ].map(([number, title, desc]) => <div className="step" key={number}><span className="step-num">{number}</span><div><strong>{title}</strong><p>{desc}</p></div><ChevronRight size={21} /></div>)}
            </div>
          </div>
          <div className="approach-photo reveal"><img src={photos.process} srcSet={imageSet(photos.process)} sizes="(max-width: 900px) 100vw, 46vw" width={1100} height={800} alt="Equipa em ambiente profissional de produção de eventos, fotografia ilustrativa" loading="lazy" decoding="async" /><div className="approach-card"><span className="approach-card-icon"><Check size={25} /></span><span><strong>Do início ao fim.</strong><small>O seu projecto acompanhado em todas as etapas.</small></span></div></div>
        </div>
      </section>

      <section id="solucoes" className="gallery-section section-pad" aria-labelledby="gallery-title">
        <div className="container">
          <div className="section-heading section-heading-tight reveal">
            <div>
              <SectionEyebrow>PROJECTOS & REALIZAÇÕES</SectionEyebrow>
              <h2 id="gallery-title">Cada evento tem<br />a sua <em>dimensão.</em></h2>
            </div>
            <p>Uma selecção de trabalhos em conferências, eventos institucionais e espectáculos. Conheça os ambientes, os bastidores e as soluções técnicas.</p>
          </div>
          <div className="gallery-toolbar reveal">
            <div className="gallery-filters" role="group" aria-label="Filtrar projectos">
              {filters.map(({ id, text }) => <button type="button" key={id} className={filter === id ? 'active' : ''} aria-pressed={filter === id} onClick={() => setFilter(id)}>{text}</button>)}
            </div>
            <span className="gallery-count" aria-live="polite">{String(visibleGallery.length).padStart(2, '0')} {visibleGallery.length === 1 ? 'PROJECTO' : 'PROJECTOS'}</span>
          </div>
          <div className={`gallery-grid portfolio-grid ${filter !== 'todos' ? 'is-filtered' : ''}`} aria-label="Fotografias de projectos da Bawito">
            {visibleGallery.map((item, index) => <button type="button" key={item.id}
              className="gallery-item reveal" onClick={() => setActiveImage(item)}
              aria-label={`Ampliar fotografia: ${item.title}`}>
              <img src={item.src} srcSet={projectImageSet(item.id)}
                sizes={filter !== 'todos' ? '(max-width: 620px) 46vw, (max-width: 900px) 50vw, 33vw' : index === 0 ? '(max-width: 620px) 92vw, (max-width: 900px) 92vw, 60vw' : '(max-width: 620px) 46vw, (max-width: 900px) 46vw, 43vw'}
                width={1200} height={800} alt={item.alt} loading="lazy" decoding="async" />
              <span className="gallery-shade" aria-hidden="true" />
              <span className="gallery-info">
                <small>{item.type}</small>
                <strong>{item.title}</strong>
              </span>
              <span className="gallery-open" aria-hidden="true"><ArrowUpRight size={21} /></span>
            </button>)}
          </div>
          <p className="portfolio-footnote">Uma amostra visual das nossas produções e das soluções aplicadas em diferentes formatos de eventos.</p>
        </div>
      </section>

      <section id="artistas" className="artist-section" aria-labelledby="artist-title">
        <div className="container artist-inner">
          <figure className="artist-visual reveal">
            <picture>
              <source media="(max-width: 620px)" srcSet="/images/artistas/mr-bow-liloca-mobile.webp" type="image/webp" />
              <img src="/images/artistas/mr-bow-liloca-desktop.webp"
                width={1200} height={675}
                alt="Mr Bow e Liloca, artistas representados pela Bawito Music & Serviços"
                loading="lazy" decoding="async"
                sizes="(max-width: 620px) 92vw, (max-width: 960px) 85vw, 50vw" />
            </picture>
            <figcaption className="artist-photo-caption">
              <span>MR BOW</span>
              <span className="artist-caption-divider" aria-hidden="true" />
              <span>LILOCA</span>
            </figcaption>
          </figure>
          <div className="artist-content reveal">
            <SectionEyebrow light>ENTRETENIMENTO & TALENTO</SectionEyebrow>
            <h2 id="artist-title">Mais do que eventos.<br /><em>Criamos ligação.</em></h2>
            <p>A música faz parte da nossa identidade. A Bawito integra gestão artística e soluções de entretenimento para eventos, campanhas e experiências que aproximam marcas e públicos.</p>
            <div className="artist-buttons">
              <a href="https://mrbow.co.mz" target="_blank" rel="noopener noreferrer" aria-label="Conhecer o artista Mr Bow no seu website oficial">Conhecer Mr Bow <ArrowUpRight size={19} aria-hidden="true" /></a>
              <a href="https://liloca.co.mz" target="_blank" rel="noopener noreferrer" aria-label="Conhecer a artista Liloca no seu website oficial">Conhecer Liloca <ArrowUpRight size={19} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section section-pad" aria-labelledby="why-title"><div className="container">
        <div className="why-header reveal"><SectionEyebrow>PORQUÊ A BAWITO?</SectionEyebrow><h2 id="why-title">Mais do que equipamentos.<br /><em>Compromisso com o resultado.</em></h2></div>
        <div className="why-grid">
          {[
            { icon: ShieldCheck, title: 'Rigor em cada etapa', text: 'Planeamento, controlo técnico e acompanhamento das operações.' },
            { icon: MonitorPlay, title: 'Soluções integradas', text: 'Áudio, vídeo, iluminação, estruturas e logística numa abordagem coordenada.' },
            { icon: Headphones, title: 'Equipa dedicada', text: 'Profissionais que compreendem as exigências de cada projecto.' },
            { icon: MapPin, title: 'Actuação nacional', text: 'Soluções pensadas para projectos em Maputo e noutras regiões de Moçambique.' },
          ].map(({ icon: Icon, title, text }, index) => <div className="why-card reveal" key={title}><span className="why-index">0{index + 1}</span><Icon size={32} strokeWidth={1.4} /><h3>{title}</h3><p>{text}</p></div>)}
        </div>
      </div></section>

      <section className="quote-banner"><div className="container quote-banner-inner reveal"><div><span>O SEU PRÓXIMO EVENTO COMEÇA AQUI</span><h2>Tem uma ideia?<br /><em>Nós damos-lhe forma.</em></h2></div><a href="#contactos" className="btn btn-white">Vamos conversar <ArrowUpRight size={20} /></a></div></section>

      <section id="contactos" className="contact-section section-pad" aria-labelledby="contact-title"><div className="container contact-grid">
        <div className="contact-copy reveal"><SectionEyebrow>VAMOS CONVERSAR</SectionEyebrow><h2 id="contact-title">Conte-nos o que<br />tem <em>em mente.</em></h2><p>Seja uma conferência, um grande espectáculo ou uma activação de marca, estamos disponíveis para conhecer o seu projecto e preparar uma solução à medida.</p>
          <div className="contact-details">
            <a href={`tel:+${PHONE}`}><span className="contact-icon"><Phone size={21} /></span><span><small>LIGUE-NOS</small><strong>{PHONE_DISPLAY}</strong></span><ArrowUpRight size={17} /></a>
            <a href={`mailto:${EMAIL}`}><span className="contact-icon"><Mail size={21} /></span><span><small>ESCREVA-NOS</small><strong>{EMAIL}</strong></span><ArrowUpRight size={17} /></a>
            <div><span className="contact-icon"><MapPin size={21} /></span><span><small>VISITE-NOS</small><strong>{ADDRESS}</strong></span></div>
          </div>
          <div className="contact-note"><MessageCircle size={21} /> Os pedidos são encaminhados directamente para a nossa equipa comercial pelo WhatsApp.</div>
        </div>
        <form className="quote-form reveal" onSubmit={submitQuote}>
          <div className="form-top"><div><span className="form-top-kicker">PEDIDO DE ORÇAMENTO</span><h3>Vamos dar vida ao seu evento.</h3></div><span className="form-top-icon"><Send size={25} /></span></div>
          <div className="form-columns">
            <label>Nome completo <span>*</span><input autoComplete="name" placeholder="O seu nome" type="text" required value={form.name} onChange={e => setField('name', e.target.value)} /></label>
            <label>Contacto telefónico <span>*</span><input autoComplete="tel" inputMode="tel" minLength={9} placeholder="+258 8X XXX XXXX" type="tel" required value={form.phone} onChange={e => setField('phone', e.target.value)} /></label>
            <label>E-mail (opcional)<input autoComplete="email" placeholder="oseuemail@exemplo.com" type="email" value={form.email} onChange={e => setField('email', e.target.value)} /></label>
            <label>Tipo de evento <span>*</span><span className="select-wrap"><select required value={form.event} onChange={e => setField('event', e.target.value)}><option value="" disabled>Seleccione uma opção</option>{eventTypes.map(x => <option key={x}>{x}</option>)}</select><ChevronDown size={16} /></span></label>
            <label>Data prevista <span className="optional">(opcional)</span><span className="date-wrap"><input type="date" value={form.date} onChange={e => setField('date', e.target.value)} /><CalendarDays size={17} /></span></label>
            <label>Local do evento <span>*</span><input placeholder="Cidade ou província" required value={form.city} onChange={e => setField('city', e.target.value)} /></label>
          </div>
          <fieldset className="form-services"><legend>De que serviços precisa? <span className="optional">(opcional)</span></legend><div className="service-options">{services.map(x => <label key={x.id} className={selectedServices.includes(x.title) ? 'chip selected' : 'chip'}><input type="checkbox" checked={selectedServices.includes(x.title)} onChange={() => toggleService(x.title)} /><span className="chip-check">{selectedServices.includes(x.title) ? <Check size={13} /> : '+'}</span>{x.title}</label>)}</div></fieldset>
          <details className="rental-chooser">
            <summary>Equipamentos para aluguer <span>{selectedServices.filter(x => x.startsWith('Aluguer — ')).length ? `(${selectedServices.filter(x => x.startsWith('Aluguer — ')).length} seleccionados)` : '(opcional)'}</span></summary>
            <fieldset className="form-services"><legend>Seleccione os equipamentos pretendidos</legend><div className="service-options">
              {rentals.map(item => {
                const name = 'Aluguer — ' + item.title
                return <label key={item.id} className={selectedServices.includes(name) ? 'chip selected' : 'chip'}>
                  <input type="checkbox" checked={selectedServices.includes(name)} onChange={() => toggleService(name)} />
                  <span className="chip-check">{selectedServices.includes(name) ? <Check size={13} /> : '+'}</span>{item.title}
                </label>
              })}
            </div></fieldset>
          </details>
          {selectedServices.some(x => x.startsWith('Aluguer — ')) && <p className="rental-choice-note" role="status">Pedido de aluguer: {selectedServices.filter(x => x.startsWith('Aluguer — ')).map(x => x.replace('Aluguer — ', '')).join(', ')}.</p>}
          <label className="message-label">Fale-nos do seu projecto <span>*</span><textarea rows={4} required minLength={10} placeholder="Descreva o evento, o número aproximado de participantes e as necessidades principais..." value={form.message} onChange={e => setField('message', e.target.value)} /></label>
          <button className="btn form-submit" type="submit">Enviar pedido pelo WhatsApp <ArrowUpRight size={20} /></button>
          {formNotice && <p className="form-feedback" role="status">{formNotice}</p>}
          <p className="form-privacy">Ao continuar, será aberta uma conversa de WhatsApp com os dados que preencheu. O envio só fica concluído quando confirmar a mensagem.</p>
        </form>
      </div></section>
    </main>

    <footer className="footer"><div className="container"><div className="footer-main"><div className="footer-brand"><WaveMark light /><p>Soluções integradas para eventos, espectáculos e experiências memoráveis.</p></div><div className="footer-col"><h4>EXPLORE</h4><a href="#sobre">A Bawito</a><a href="#servicos">Serviços</a><a href="#aluguer">Aluguer</a><a href="#solucoes">Formatos de eventos</a><a href="#artistas">Artistas</a></div><div className="footer-col"><h4>SERVIÇOS</h4><a href="#servicos">Produção corporativa</a><a href="#servicos">Som e iluminação</a><a href="#servicos">LED e vídeo</a><a href="#servicos">Palcos e estruturas</a></div><div className="footer-col"><h4>CONTACTOS</h4><a href={`tel:+${PHONE}`}>{PHONE_DISPLAY}</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a><span>Malhangalene, Maputo<br />Moçambique</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Bawito Music & Serviços. Todos os direitos reservados.</span><a href="#inicio">Voltar ao topo <ArrowUpRight size={15} /></a></div></div></footer>

    <a className={`whatsapp-float ${activeSection === 'inicio' ? 'is-hidden-over-hero' : ''}`} href={`https://wa.me/${PHONE}?text=${encodeURIComponent('Olá, Bawito Music & Serviços! Gostaria de obter informações sobre os vossos serviços.')}`} target="_blank" rel="noopener noreferrer" aria-label="Contactar a Bawito pelo WhatsApp"><MessageCircle size={27} /><span>Vamos conversar</span></a>

    {activeImage && <div className="lightbox portfolio-lightbox" role="dialog" aria-modal="true" aria-labelledby="portfolio-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveImage(null) }}>
      <button ref={modalCloseRef} type="button" className="lightbox-close" onClick={() => setActiveImage(null)} aria-label="Fechar fotografia"><X size={25} /></button>
      <div className="lightbox-content">
        <img src={projectImage(activeImage.id, 1200)} alt={activeImage.alt} width={1200} height={800} decoding="async" />
        <div className="portfolio-lightbox-caption">
          <div><span>{activeImage.type} · PORTFÓLIO BAWITO</span><h3 id="portfolio-modal-title">{activeImage.title}</h3></div>
          <div className="portfolio-lightbox-navigation">
            <span className="portfolio-lightbox-counter">{String(visibleGallery.findIndex(item => item.id === activeImage.id) + 1).padStart(2, '0')} / {String(visibleGallery.length).padStart(2, '0')}</span>
            <button type="button" aria-label="Fotografia anterior" onClick={() => navigateGallery(-1)}><ChevronLeft size={23} /></button>
            <button type="button" aria-label="Fotografia seguinte" onClick={() => navigateGallery(1)}><ChevronRight size={23} /></button>
          </div>
        </div>
      </div>
    </div>}
  </>
}

export default App
