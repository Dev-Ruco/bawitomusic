import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowDown, ArrowUpRight, CalendarDays, Check, ChevronDown,
  ChevronRight, Clapperboard, Headphones, Layers3, Mail,
  MapPin, Menu, MessageCircle, Mic2, MonitorPlay, Phone, Radio,
  Send, ShieldCheck, Sparkles, SunMedium, Volume2, X, Zap,
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
  picture: string
  label: string
}

const services: Service[] = [
  {
    id: 'eventos', title: 'Eventos corporativos', label: 'Produção integral',
    description: 'Conferências, fóruns, seminários, cerimónias e eventos empresariais, do conceito à execução.',
    icon: Sparkles, picture: photos.conference,
  },
  {
    id: 'led', title: 'Telas LED e projecção', label: 'Soluções audiovisuais',
    description: 'Soluções visuais de alto impacto para apresentações, cenários e comunicação de marca.',
    icon: MonitorPlay, picture: photos.screens,
  },
  {
    id: 'som', title: 'Sonorização profissional', label: 'Áudio',
    description: 'Sistemas de som dimensionados para a dimensão, a acústica e as exigências de cada evento.',
    icon: Volume2, picture: photos.sound,
  },
  {
    id: 'luz', title: 'Iluminação cenográfica', label: 'Ambientes',
    description: 'Concepção de ambientes, luz cénica e efeitos que valorizam o palco e a identidade visual.',
    icon: SunMedium, picture: photos.lights,
  },
  {
    id: 'palcos', title: 'Palcos e estruturas', label: 'Montagem técnica',
    description: 'Palcos, estruturas modulares e soluções de suporte adequadas a diferentes formatos.',
    icon: Layers3, picture: photos.stages,
  },
  {
    id: 'streaming', title: 'Transmissão em directo', label: 'Live streaming',
    description: 'Captação, realização e transmissão profissional para audiências presenciais e remotas.',
    icon: Radio, picture: photos.streaming,
  },
  {
    id: 'energia', title: 'Geradores e energia', label: 'Continuidade',
    description: 'Soluções de alimentação eléctrica e apoio operacional para eventos e acções no terreno.',
    icon: Zap, picture: photos.energy,
  },
  {
    id: 'producao', title: 'Produção e coordenação', label: 'Gestão de projecto',
    description: 'Planeamento, logística, montagem, acompanhamento e coordenação técnica de ponta a ponta.',
    icon: Clapperboard, picture: photos.production,
  },
]

const gallery = [
  { title: 'Conferências e seminários', kind: 'corporativos', type: 'EVENTOS CORPORATIVOS', src: photos.conference },
  { title: 'Espectáculos ao vivo', kind: 'espectaculos', type: 'ENTRETENIMENTO', src: photos.concerts },
  { title: 'Galas e cerimónias', kind: 'corporativos', type: 'EVENTOS ESPECIAIS', src: photos.gala },
  { title: 'Activações de marca', kind: 'activacoes', type: 'EXPERIÊNCIAS DE MARCA', src: photos.activation },
  { title: 'Produção audiovisual', kind: 'corporativos', type: 'SOM, LUZ E VÍDEO', src: photos.event },
  { title: 'Palcos e festivais', kind: 'espectaculos', type: 'PRODUÇÃO DE ESPECTÁCULOS', src: photos.stages },
]

type GalleryFilter = 'todos' | 'corporativos' | 'espectaculos' | 'activacoes'

const filters: Array<{ id: GalleryFilter; text: string }> = [
  { id: 'todos', text: 'Todos os formatos' },
  { id: 'corporativos', text: 'Corporativos' },
  { id: 'espectaculos', text: 'Espectáculos' },
  { id: 'activacoes', text: 'Activações' },
]

const eventTypes = ['Conferência / Seminário', 'Evento corporativo', 'Lançamento de produto', 'Gala / Cerimónia', 'Concerto / Festival', 'Casamento / Evento social', 'Campanha / Activação', 'Outro']

function WaveMark({ light = false }: { light?: boolean }) {
  return <a href="#inicio" className={`brand brand-image ${light ? 'brand-light' : ''}`} aria-label="Bawito Music & Serviços — voltar ao início">
    <img className="brand-logo" src="/images/marca/logo-bawito-header.webp" alt="Bawito Music & Serviços" width={360} height={140} decoding="async" />
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
    const ids = ['inicio', 'sobre', 'servicos', 'solucoes', 'artistas', 'contactos']
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
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setActiveImage(null) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey); lastFocusedElement.current?.focus() }
  }, [activeImage])

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

  return <>
    <a className="skip-link" href="#principal">Saltar para o conteúdo</a>
    <header className={`site-header header-light ${scrolled ? 'header-scrolled' : ''} ${menuOpen ? 'menu-active' : ''}`}>
      <div className="header-inner container">
        <WaveMark />
        <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Navegação principal" id="main-navigation">
          <a href="#inicio" aria-current={activeSection === 'inicio' ? 'location' : undefined} onClick={goTo}>Início</a>
          <a href="#sobre" aria-current={activeSection === 'sobre' ? 'location' : undefined} onClick={goTo}>A Bawito</a>
          <a href="#servicos" aria-current={activeSection === 'servicos' ? 'location' : undefined} onClick={goTo}>Serviços</a>
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

      <section id="sobre" className="about section-pad">
        <div className="container about-grid">
          <div className="about-visual reveal">
            <img src={photos.about} srcSet={imageSet(photos.about)} sizes="(max-width: 900px) 100vw, 45vw" width={1100} height={900} alt="Conferência e produção de eventos, fotografia ilustrativa" loading="lazy" decoding="async" />
            <div className="about-visual-bottom"><span>BAWITO</span><span>EVENT PRODUCTION · MOZAMBIQUE</span></div>
            <div className="about-experience"><span className="about-experience-label">ACTIVIDADE DESDE</span><strong>2014</strong><span>Experiência que conta.</span></div>
          </div>
          <div className="about-copy reveal">
            <SectionEyebrow>QUEM SOMOS</SectionEyebrow>
            <h2>O parceiro por detrás de <em>cada grande momento.</em></h2>
            <p className="lead">Produzir um evento é muito mais do que montar um palco. É fazer com que tudo funcione, com rigor, criatividade e confiança.</p>
            <p>A Bawito Music & Serviços é uma empresa moçambicana que integra produção técnica, soluções audiovisuais, logística e entretenimento. Trabalhamos para que cada projecto tenha a estrutura, a equipa e a atenção que merece.</p>
            <div className="about-perks">
              <div><ShieldCheck size={21} /><span>Planeamento e coordenação</span></div>
              <div><Headphones size={21} /><span>Equipas técnicas especializadas</span></div>
              <div><Zap size={21} /><span>Soluções à medida do evento</span></div>
            </div>
            <a href="#contactos" className="text-link">Vamos criar algo juntos <ArrowUpRight size={20} /></a>
          </div>
        </div>
      </section>

      <section id="servicos" className="services section-pad" aria-labelledby="services-title">
        <div className="container">
          <div className="section-heading reveal">
            <div><SectionEyebrow>O QUE FAZEMOS</SectionEyebrow><h2 id="services-title">Tudo o que o seu<br />evento <em>precisa.</em></h2></div>
            <p>Uma solução integrada, diferentes especialidades e uma só equipa focada no sucesso do seu projecto.</p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => {
              const Icon = service.icon
              return <a key={service.id} className="service-card reveal" href="#contactos" onClick={() => setSelectedServices((current) => current.includes(service.title) ? current : [...current, service.title])}>
                <div className="service-image"><img src={service.picture} srcSet={imageSet(service.picture)} sizes="(max-width: 620px) 100vw, (max-width: 1160px) 50vw, 25vw" width={850} height={530} alt={`Imagem ilustrativa de ${service.title.toLowerCase()}`} loading="lazy" decoding="async" /><span className="service-count">{String(index + 1).padStart(2, '0')}</span><span className="service-image-icon"><Icon size={22} strokeWidth={1.8} /></span></div>
                <div className="service-card-body"><span className="service-label">{service.label}</span><h3>{service.title}</h3><p>{service.description}</p><span className="service-card-link">Solicitar solução <ArrowUpRight size={18} /></span></div>
              </a>
            })}
          </div>
          <div className="services-foot reveal"><span>Não encontrou o que procura? Desenvolvemos soluções adaptadas ao seu projecto.</span><a href="#contactos">Fale com a nossa equipa <ArrowUpRight size={18} /></a></div>
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
            <div><SectionEyebrow>FORMATOS & EXPERIÊNCIAS</SectionEyebrow><h2 id="gallery-title">Cada evento tem<br />a sua <em>dimensão.</em></h2></div>
            <p>Dos encontros corporativos aos grandes palcos, adaptamos a produção à dimensão e à identidade de cada ocasião.</p>
          </div>
          <div className="gallery-toolbar reveal"><div className="gallery-filters" role="group" aria-label="Filtrar formatos de eventos">
            {filters.map(({ id, text }) => <button type="button" key={id} className={filter === id ? 'active' : ''} aria-pressed={filter === id} onClick={() => setFilter(id)}>{text}</button>)}
          </div><span className="gallery-count">{String(visibleGallery.length).padStart(2, '0')} FORMATOS</span></div>
          <div className="gallery-grid">
            {visibleGallery.map((item) => <button type="button" onClick={() => setActiveImage(item)} className="gallery-item reveal" key={item.title} aria-label={`Ver imagem ilustrativa de ${item.title}`}>
              <img src={item.src} srcSet={imageSet(item.src)} sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw" width={850} height={600} alt={`Imagem ilustrativa: ${item.title}`} loading="lazy" decoding="async" /><span className="gallery-shade" /><span className="gallery-info"><small>{item.type}</small><strong>{item.title}</strong></span><span className="gallery-open"><ArrowUpRight size={22} /></span>
            </button>)}
          </div>
          <p className="gallery-disclaimer">Imagens ilustrativas dos formatos de eventos. A galeria de projectos reais será actualizada com o portefólio fotográfico da Bawito.</p>
        </div>
      </section>

      <section id="artistas" className="artist-section" aria-labelledby="artist-title">
        <div className="container artist-inner">
          <div className="artist-graphic" aria-hidden="true"><div className="artist-ring ring-1" /><div className="artist-ring ring-2" /><div className="artist-ring ring-3" /><Mic2 size={88} strokeWidth={0.75} /></div>
          <div className="artist-content reveal"><SectionEyebrow light>ENTRETENIMENTO & TALENTO</SectionEyebrow><h2 id="artist-title">Mais do que eventos.<br /><em>Criamos ligação.</em></h2><p>A música faz parte da nossa identidade. A Bawito integra gestão artística e soluções de entretenimento para eventos, campanhas e experiências que aproximam marcas e públicos.</p><div className="artist-buttons"><a href="https://mrbow.co.mz" target="_blank" rel="noopener noreferrer">Mr Bow <ArrowUpRight size={19} /></a><a href="https://liloca.co.mz" target="_blank" rel="noopener noreferrer">Liloca <ArrowUpRight size={19} /></a></div></div>
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
          <label className="message-label">Fale-nos do seu projecto <span>*</span><textarea rows={4} required minLength={10} placeholder="Descreva o evento, o número aproximado de participantes e as necessidades principais..." value={form.message} onChange={e => setField('message', e.target.value)} /></label>
          <button className="btn form-submit" type="submit">Enviar pedido pelo WhatsApp <ArrowUpRight size={20} /></button>
          {formNotice && <p className="form-feedback" role="status">{formNotice}</p>}
          <p className="form-privacy">Ao continuar, será aberta uma conversa de WhatsApp com os dados que preencheu. O envio só fica concluído quando confirmar a mensagem.</p>
        </form>
      </div></section>
    </main>

    <footer className="footer"><div className="container"><div className="footer-main"><div className="footer-brand"><WaveMark light /><p>Soluções integradas para eventos, espectáculos e experiências memoráveis.</p></div><div className="footer-col"><h4>EXPLORE</h4><a href="#sobre">A Bawito</a><a href="#servicos">Serviços</a><a href="#solucoes">Formatos de eventos</a><a href="#artistas">Artistas</a></div><div className="footer-col"><h4>SERVIÇOS</h4><a href="#servicos">Produção corporativa</a><a href="#servicos">Som e iluminação</a><a href="#servicos">LED e vídeo</a><a href="#servicos">Palcos e estruturas</a></div><div className="footer-col"><h4>CONTACTOS</h4><a href={`tel:+${PHONE}`}>{PHONE_DISPLAY}</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a><span>Malhangalene, Maputo<br />Moçambique</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Bawito Music & Serviços. Todos os direitos reservados.</span><a href="#inicio">Voltar ao topo <ArrowUpRight size={15} /></a></div></div></footer>

    <a className={`whatsapp-float ${activeSection === 'inicio' ? 'is-hidden-over-hero' : ''}`} href={`https://wa.me/${PHONE}?text=${encodeURIComponent('Olá, Bawito Music & Serviços! Gostaria de obter informações sobre os vossos serviços.')}`} target="_blank" rel="noopener noreferrer" aria-label="Contactar a Bawito pelo WhatsApp"><MessageCircle size={27} /><span>Vamos conversar</span></a>

    {activeImage && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Imagem: ${activeImage.title}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveImage(null) }}><button ref={modalCloseRef} type="button" className="lightbox-close" onClick={() => setActiveImage(null)} aria-label="Fechar imagem"><X size={25} /></button><div className="lightbox-content"><img src={imageAt(activeImage.src, 1280)} alt={`Imagem ilustrativa: ${activeImage.title}`} width={1280} height={850} /><div><span>{activeImage.type} · IMAGEM ILUSTRATIVA</span><h3>{activeImage.title}</h3></div></div></div>}
  </>
}

export default App
