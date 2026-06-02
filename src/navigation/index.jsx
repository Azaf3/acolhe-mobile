// src/navigation/index.jsx

import React, { useState, useMemo } from 'react'
import { Feather } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator,
  FlatList, Modal, Pressable, Image,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useAuth } from '../context/AuthContext'
import { colors, spacing, radius, fontSize, fontWeight, shadow, fontFamily } from '../theme'
import { PSYCHOLOGISTS_SEED, AUDIENCE_OPTIONS, PROFESSION_OPTIONS, buildProfessionalFromUser } from '../data/psychologists'
import AsyncStorage from '@react-native-async-storage/async-storage'

// ─── BottomTabBar ─────────────────────────────────────────────────────────────

const TAB_ICONS = {
  'Início':      { name: 'home' },
  'Buscar':      { name: 'search' },
  'Minha ficha': { name: 'clipboard' },
  'Cadastro':    { name: 'user-plus' },
  'Perfil':      { name: 'user' },
  'Entrar':      { name: 'log-in' },
}

function BottomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[btb.container, { paddingBottom: insets.bottom || 8 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = options.tabBarLabel ?? options.title ?? route.name
        const isFocused = state.index === index
        const iconName = TAB_ICONS[label]?.name || 'circle'

        function onPress() {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name)
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={btb.tab}
            activeOpacity={0.7}
          >
            <View style={[btb.iconWrap, isFocused && btb.iconWrapActive]}>
              <Feather name={iconName} size={22} color={isFocused ? colors.primary : colors.textLight} />
            </View>
            <Text style={[btb.label, isFocused && btb.labelActive]}>{label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const btb = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, shadowColor: '#1F2D1F', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 14 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, minHeight: 48 },
  iconWrap: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  iconWrapActive: { backgroundColor: colors.primaryLight },
  label: { fontSize: 11, fontFamily: fontFamily.medium, color: colors.textLight, marginTop: 3 },
  labelActive: { color: colors.primary, fontFamily: fontFamily.bold },
})

// ─── Placeholders ────────────────────────────────────────────────────────────

function Placeholder({ name }) {
  return (
    <View style={ph.container}>
      <Text style={ph.text}>{name}</Text>
      <Text style={ph.sub}>Tela em construção</Text>
    </View>
  )
}
const ph = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  text: { fontSize: 22, fontFamily: fontFamily.bold, color: '#2e7d32' },
  sub: { fontSize: 14, color: '#7a937a', marginTop: 6 },
})

// ═══════════════════════════════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

const CHIPS = [
  { label: 'Psicólogos' },
  { label: 'Psicanalistas' },
  { label: 'Psiquiatras' },
  { label: 'Ansiedade' },
  { label: 'Depressão' },
  { label: 'Trauma' },
]

const SPECIALTIES = [
  { label: 'Ansiedade',        icon: 'activity' },
  { label: 'Depressão',        icon: 'heart' },
  { label: 'Relacionamentos',  icon: 'users' },
  { label: 'Autoconhecimento', icon: 'star' },
  { label: 'Trauma',           icon: 'shield' },
  { label: 'Família',          icon: 'home' },
  { label: 'Dependência',      icon: 'link' },
  { label: 'Luto',             icon: 'feather' },
]

const PROFILES = [
  { id: 'baixa-renda', title: 'Atendimento social', subtitle: 'A partir de R$ 20/sessão', description: 'Consultas com valor reduzido para ampliar o acesso ao cuidado.', color: '#e8f5e9', accent: '#2e7d32' },
  { id: 'renda-media', title: 'Plano essencial', subtitle: 'De R$ 35 a R$ 50/sessão', description: 'Sessões acessíveis com profissionais verificados.', color: '#e3f2fd', accent: '#1565c0' },
  { id: 'empresa', title: 'Benefício corporativo', subtitle: 'Até R$ 50 por colaborador', description: 'Empresas parceiras subsidiam consultas de saúde mental.', color: '#fce4ec', accent: '#ad1457' },
]

// ─── Mesh Gradient Hero ──────────────────────────────────────────────────────

function MeshGradient({ height = 320 }) {
  return (
    <View style={[StyleSheet.absoluteFillObject, { height, overflow: 'hidden' }]}>
      {/* Fundo base */}
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: '#F0F9F0' }} />
      {/* Bolha 1 — centro */}
      <View style={{ position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: '#C8E6C9', opacity: 0.5, top: -60, left: '10%' }} />
      {/* Bolha 2 — topo esquerda */}
      <View style={{ position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: '#A5D6A7', opacity: 0.35, top: -80, left: -60 }} />
      {/* Bolha 3 — direita baixo */}
      <View style={{ position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: '#B9F6CA', opacity: 0.3, bottom: -60, right: -40 }} />
      {/* Bolha 4 — topo direita */}
      <View style={{ position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: '#DCEDC8', opacity: 0.4, top: -40, right: -20 }} />
      {/* Onda suave de fundo */}
      <View style={{ position: 'absolute', width: 500, height: 200, borderRadius: 100, backgroundColor: '#E8F5E9', opacity: 0.6, bottom: 20, left: -80, transform: [{ rotate: '-8deg' }] }} />
    </View>
  )
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('')
  const { isAuthenticated, user } = useAuth()
  const insets = useSafeAreaInsets()

  function goToSearch(params) {
    navigation.navigate('SearchTab', { screen: 'Search', params })
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F6FBF6' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={[hs.hero, { paddingTop: insets.top + 16 }]}>
          <MeshGradient height={300} />

          {/* Layout: esquerda (logo+texto) | direita (ilustração) */}
          <View style={hs.heroInner}>

            {/* Coluna esquerda */}
            <View style={hs.heroLeft}>
              <Image source={require('../../assets/logo.png')} style={hs.heroLogo} resizeMode="contain" />
              {isAuthenticated && <Text style={hs.greeting}>Olá, {user?.name?.split(' ')[0]}</Text>}
              <Text style={hs.heroTitle}>Encontre seu{'\n'}profissional</Text>
              <Text style={hs.heroSub}>Psicólogos, psicanalistas e psiquiatras a partir de <Text style={{ fontFamily: fontFamily.bold, color: colors.primary }}>R$ 50/sessão</Text></Text>
            </View>

            {/* Coluna direita — ilustração */}
            <View style={hs.heroRight}>
              {isAuthenticated && (
                <View style={hs.notifBtn}>
                  <Feather name='bell' size={18} color={colors.primary} />
                  <View style={hs.notifBadge}><Text style={hs.notifBadgeText}>3</Text></View>
                </View>
              )}
              <Image
                source={require('../../assets/illustration.png')}
                style={hs.heroIllustration}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Busca e chips fora do hero */}
        <View style={hs.searchSection}>
          <View style={hs.searchRow}>
            <View style={hs.searchBox}>
              <Feather name='search' size={16} color={colors.textLight} style={{ marginRight: 8 }} />
              <TextInput style={hs.searchInput} placeholder="Nome, especialidade ou abordagem" placeholderTextColor={colors.textLight} value={search} onChangeText={setSearch} onSubmitEditing={() => goToSearch({ q: search })} returnKeyType="search" />
            </View>
            <TouchableOpacity style={hs.searchBtn} onPress={() => goToSearch({ q: search })} activeOpacity={0.8}>
              <Text style={hs.searchBtnText}>Buscar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
            {CHIPS.map(chip => (
              <TouchableOpacity key={chip.label} style={hs.chip} onPress={() => goToSearch({ q: chip.label })} activeOpacity={0.7}>
                <Text style={hs.chipText}>{chip.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={hs.section}>
          <Text style={hs.sectionTitle}>Especialidades</Text>
          <View style={hs.specialtyGrid}>
            {SPECIALTIES.map(sp => (
              <TouchableOpacity key={sp.label} style={hs.specialtyCard} onPress={() => goToSearch({ especialidade: sp.label })} activeOpacity={0.7}>
                <Feather name={sp.icon} size={22} color={colors.primary} style={{ marginBottom: 4 }} />
                <Text style={hs.specialtyLabel} numberOfLines={2}>{sp.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={hs.section}>
          <Text style={hs.sectionTitle}>Modalidades de atendimento</Text>
          {PROFILES.map(p => (
            <TouchableOpacity key={p.id} style={[hs.profileCard, { backgroundColor: p.color }]} onPress={() => goToSearch({ perfil: p.id })} activeOpacity={0.8}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Text style={{ fontSize: 28 }}>{p.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[hs.profileTitle, { color: p.accent }]}>{p.title}</Text>
                  <Text style={[hs.profileSubtitle, { color: p.accent }]}>{p.subtitle}</Text>
                </View>
                <Text style={{ fontSize: 28, color: p.accent, fontFamily: fontFamily.bold }}>›</Text>
              </View>
              <Text style={hs.profileDesc}>{p.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!isAuthenticated && (
          <View style={hs.ctaBox}>
            <Text style={hs.ctaTitle}>Pronto para começar?</Text>
            <Text style={hs.ctaSub}>Crie sua conta e agende sua primeira sessão.</Text>
            <TouchableOpacity style={hs.ctaBtn} onPress={() => navigation.navigate('FichaTab')} activeOpacity={0.8}>
              <Text style={hs.ctaBtnText}>Criar conta gratuita</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const hs = StyleSheet.create({
  hero: { overflow: 'hidden', paddingHorizontal: 20, paddingBottom: 24, backgroundColor: colors.primaryLight, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  heroInner: { flexDirection: 'row', alignItems: 'center' },
  heroLeft: { flex: 1, paddingRight: 8, zIndex: 10 },
  heroRight: { width: 180, alignItems: 'flex-end', zIndex: 10 },
  heroLogo: { width: '100%', height: 90, marginBottom: 10 },
  heroLogoSmall: { width: 290, height: 68 },
  heroIllustration: { width: 200, height: 240, marginRight: -10, marginBottom: -24 },
  heroIllustrationBg: { position: 'absolute', right: -20, top: 0, width: '82%', height: '100%', zIndex: 1 },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, backgroundColor: 'rgba(240,249,240,0.45)' },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, zIndex: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  notifBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', marginBottom: 8, alignSelf: 'flex-end' },
  notifBadge: { position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { fontSize: 9, color: '#fff', fontFamily: fontFamily.bold },
  heroContent: { zIndex: 10, width: '60%' },
  greeting: { fontSize: 13, color: colors.primaryMid, fontFamily: fontFamily.semibold, marginBottom: 4 },
  heroTitle: { fontSize: 34, fontFamily: fontFamily.bold, color: colors.primaryDark, lineHeight: 42, marginBottom: 10 },
  heroSub: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  searchSection: { backgroundColor: '#F6FBF6', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 20, paddingHorizontal: 14, shadowColor: '#1F2D1F', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  searchInput: { flex: 1, height: 48, fontSize: 14, color: colors.text },
  searchBtn: { backgroundColor: colors.primary, borderRadius: 20, paddingHorizontal: 18, height: 48, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  searchBtnText: { color: '#fff', fontFamily: fontFamily.bold, fontSize: 13, letterSpacing: 0.3 },
  chip: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: colors.border },
  chipText: { fontSize: 13, color: colors.primary, fontFamily: fontFamily.semibold },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 16, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 14, letterSpacing: 0.2 },
  specialtyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  specialtyCard: { width: '23%', aspectRatio: 0.9, backgroundColor: colors.bg, borderRadius: 18, alignItems: 'center', justifyContent: 'center', padding: 8, borderWidth: 1, borderColor: colors.border, shadowColor: '#1F2D1F', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  specialtyLabel: { fontSize: 9, color: colors.textSecondary, fontFamily: fontFamily.semibold, textAlign: 'center', marginTop: 4, flexWrap: 'wrap' },
  profileCard: { borderRadius: 20, padding: 18, marginBottom: 12, shadowColor: '#1F2D1F', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  profileTitle: { fontSize: 15, fontFamily: fontFamily.bold },
  profileSubtitle: { fontSize: 13, fontFamily: fontFamily.semibold, opacity: 0.85 },
  profileDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginTop: 2 },
  ctaBox: { margin: 20, backgroundColor: colors.primaryDark, borderRadius: 24, padding: 28, alignItems: 'center', shadowColor: colors.primaryDark, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 },
  ctaTitle: { fontSize: 19, fontFamily: fontFamily.bold, color: '#fff', marginBottom: 8, letterSpacing: 0.2 },
  ctaSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  ctaBtn: { backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 28, paddingVertical: 13 },
  ctaBtnText: { color: colors.primaryDark, fontFamily: fontFamily.bold, fontSize: 14, letterSpacing: 0.3 },
})

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

const SPECIALTIES_FILTER = ['Ansiedade','Depressão','Relacionamentos','Autoconhecimento','Trauma e TEPT','Família','Dependência Química','Luto']
const APPROACHES = ['Cognitivo-Comportamental (TCC)','Psicanálise','Humanista','EMDR','Gestalt']

function StarRating({ value }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Feather name='star' size={12} color='#f59e0b' />
      <Text style={{ fontSize: 12, color: colors.textSecondary, fontFamily: fontFamily.semibold }}>{value}</Text>
    </View>
  )
}

function PsyCard({ psy, onPress }) {
  return (
    <TouchableOpacity style={ss.card} onPress={onPress} activeOpacity={0.85}>
      <View style={ss.cardTop}>
        <View style={ss.avatarCircle}>
          <Text style={ss.avatarText}>{psy.name.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={ss.cardName}>{psy.name}</Text>
          <Text style={ss.cardProfession}>{psy.profession}</Text>
          <Text style={ss.cardCrp}>{psy.crp}</Text>
        </View>
        <View style={ss.priceBox}>
          <Text style={ss.priceValue}>R$ {psy.price}</Text>
          <Text style={ss.priceSub}>/sessão</Text>
        </View>
      </View>

      <View style={ss.tagsRow}>
        <View style={ss.tagSpecialty}><Text style={ss.tagSpecialtyText}>{psy.specialty}</Text></View>
        <View style={ss.tagApproach}><Text style={ss.tagApproachText}>{psy.approach}</Text></View>
        {psy.online && <View style={ss.tagOnline}><Text style={ss.tagOnlineText}>Online</Text></View>}
        {psy.presential && <View style={ss.tagPresential}><Text style={ss.tagPresentialText}>Presencial</Text></View>}
      </View>

      <View style={ss.cardBottom}>
        <StarRating value={psy.rating} />
        <Text style={ss.reviewsText}>({psy.reviews} avaliações)</Text>
        <View style={{ flex: 1 }} />
        <Text style={ss.cardCta}>Ver perfil →</Text>
      </View>
    </TouchableOpacity>
  )
}

function FilterSheet({ visible, onClose, filters, onChange, onClear }) {
  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <Pressable style={fs.overlay} onPress={onClose} />
      <View style={fs.sheet}>
        <View style={fs.handle} />
        <View style={fs.sheetHeader}>
          <Text style={fs.sheetTitle}>Filtros</Text>
          <TouchableOpacity onPress={onClear}>
            <Text style={fs.clearBtn}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profissão */}
          <Text style={fs.filterLabel}>Profissão</Text>
          <View style={fs.optionsRow}>
            {PROFESSION_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[fs.optionChip, filters.profession === opt && fs.optionChipActive]}
                onPress={() => onChange('profession', filters.profession === opt ? '' : opt)}
              >
                <Text style={[fs.optionText, filters.profession === opt && fs.optionTextActive]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Especialidade */}
          <Text style={fs.filterLabel}>Especialidade</Text>
          <View style={fs.optionsRow}>
            {SPECIALTIES_FILTER.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[fs.optionChip, filters.specialty === opt && fs.optionChipActive]}
                onPress={() => onChange('specialty', filters.specialty === opt ? '' : opt)}
              >
                <Text style={[fs.optionText, filters.specialty === opt && fs.optionTextActive]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Modalidade */}
          <Text style={fs.filterLabel}>Modalidade</Text>
          <View style={fs.optionsRow}>
            {['online', 'presencial'].map(opt => (
              <TouchableOpacity
                key={opt}
                style={[fs.optionChip, filters.modality === opt && fs.optionChipActive]}
                onPress={() => onChange('modality', filters.modality === opt ? '' : opt)}
              >
                <Text style={[fs.optionText, filters.modality === opt && fs.optionTextActive]}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Público */}
          <Text style={fs.filterLabel}>Público</Text>
          <View style={fs.optionsRow}>
            {AUDIENCE_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[fs.optionChip, filters.audience === opt && fs.optionChipActive]}
                onPress={() => onChange('audience', filters.audience === opt ? '' : opt)}
              >
                <Text style={[fs.optionText, filters.audience === opt && fs.optionTextActive]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity style={fs.applyBtn} onPress={onClose}>
          <Text style={fs.applyBtnText}>Aplicar filtros</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const fs = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  handle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontFamily: fontFamily.bold, color: colors.text },
  clearBtn: { fontSize: 14, color: colors.danger, fontFamily: fontFamily.semibold },
  filterLabel: { fontSize: 13, fontFamily: fontFamily.semibold, color: colors.textSecondary, marginBottom: 8, marginTop: 16 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.bg },
  optionChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  optionText: { fontSize: 13, color: colors.textSecondary, fontFamily: fontFamily.medium },
  optionTextActive: { color: colors.primary, fontFamily: fontFamily.semibold },
  applyBtn: { marginTop: 24, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  applyBtnText: { color: '#fff', fontFamily: fontFamily.bold, fontSize: 15 },
})

function SearchScreen({ navigation, route }) {
  const insets = useSafeAreaInsets()
  const initialParams = route?.params?.params || {}

  const [query, setQuery] = useState(initialParams.q || '')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    profession: initialParams.profissao || '',
    specialty: initialParams.especialidade || '',
    audience: initialParams.perfil || '',
    modality: '',
    approach: '',
  })

  const [registeredPros, setRegisteredPros] = React.useState([])

  React.useEffect(() => {
    async function loadPros() {
      try {
        const raw = await AsyncStorage.getItem('@acolhe:accounts')
        const accounts = raw ? JSON.parse(raw) : []
        const pros = accounts
          .filter(a => a.role === 'profissional')
          .map(buildProfessionalFromUser)
        setRegisteredPros(pros)
      } catch (e) {}
    }
    loadPros()
  }, [])

  const allProfessionals = React.useMemo(
    () => [...PSYCHOLOGISTS_SEED, ...registeredPros],
    [registeredPros]
  )

  const activeCount = Object.values(filters).filter(Boolean).length

  const results = useMemo(() => {
    return allProfessionals.filter(p => {
      const q = query.toLowerCase()
      const matchQuery = !query ||
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.profession.toLowerCase().includes(q) ||
        p.approach.toLowerCase().includes(q)
      const matchProfession = !filters.profession || p.profession === filters.profession
      const matchSpecialty = !filters.specialty || p.specialty === filters.specialty
      const matchAudience = !filters.audience || p.audience === filters.audience
      const matchModality = !filters.modality || (filters.modality === 'online' ? p.online : p.presential)
      return matchQuery && matchProfession && matchSpecialty && matchAudience && matchModality
    })
  }, [query, filters, allProfessionals])

  function changeFilter(key, value) {
    setFilters(f => ({ ...f, [key]: value }))
  }

  function clearFilters() {
    setFilters({ profession: '', specialty: '', audience: '', modality: '', approach: '' })
    setQuery('')
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={[ss.searchHeader, { paddingTop: insets.top + 12 }]}>
        <View style={ss.searchInputWrap}>
          <Feather name='search' size={15} color={colors.textLight} style={{ marginRight: 8 }} />
          <TextInput
            style={ss.searchInput}
            placeholder="Nome, especialidade..."
            placeholderTextColor={colors.textLight}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name='x' size={16} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={[ss.filterBtn, activeCount > 0 && ss.filterBtnActive]} onPress={() => setFiltersOpen(true)}>
          <Feather name='sliders' size={16} color={colors.textSecondary} />
          {activeCount > 0 && <View style={ss.filterBadge}><Text style={ss.filterBadgeText}>{activeCount}</Text></View>}
        </TouchableOpacity>
      </View>

      {/* Contagem */}
      <View style={ss.resultsMeta}>
        <Text style={ss.resultsCount}>{results.length} profissional{results.length !== 1 ? 'is' : ''} encontrado{results.length !== 1 ? 's' : ''}</Text>
        {activeCount > 0 && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={ss.clearLink}>Limpar filtros</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista */}
      {results.length === 0 ? (
        <View style={ss.empty}>
          <Feather name='search' size={48} color={colors.border} style={{ marginBottom: 12 }} />
          <Text style={ss.emptyTitle}>Nenhum profissional encontrado</Text>
          <Text style={ss.emptySub}>Tente ajustar os filtros ou a busca.</Text>
          <TouchableOpacity style={ss.emptyBtn} onPress={clearFilters}>
            <Text style={ss.emptyBtnText}>Limpar filtros</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <PsyCard psy={item} onPress={() => navigation.navigate('Psychologist', { id: item.id })} />
          )}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterSheet
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={changeFilter}
        onClear={clearFilters}
      />
    </View>
  )
}

const ss = StyleSheet.create({
  searchHeader: { backgroundColor: colors.bg, paddingHorizontal: 16, paddingBottom: 14, flexDirection: 'row', gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgLight, borderRadius: 16, paddingHorizontal: 14, height: 48, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  filterBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.bgLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  filterBtnActive: { backgroundColor: colors.primaryLight, borderColor: colors.primaryBorder },
  filterBadge: { position: 'absolute', top: -4, right: -4, width: 17, height: 17, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  filterBadgeText: { fontSize: 10, color: '#fff', fontFamily: fontFamily.bold },
  resultsMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  resultsCount: { fontSize: 13, color: colors.textSecondary, fontFamily: fontFamily.semibold },
  clearLink: { fontSize: 13, color: colors.primary, fontFamily: fontFamily.bold },
  card: { backgroundColor: colors.bg, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, shadowColor: '#1F2D1F', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  cardTop: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  avatarCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontFamily: fontFamily.bold, color: colors.primary },
  cardName: { fontSize: 15, fontFamily: fontFamily.bold, color: colors.text },
  cardProfession: { fontSize: 13, color: colors.textSecondary, marginTop: 1 },
  cardCrp: { fontSize: 11, color: colors.textLight, marginTop: 2 },
  priceBox: { alignItems: 'flex-end' },
  priceValue: { fontSize: 17, fontFamily: fontFamily.bold, color: colors.primary },
  priceSub: { fontSize: 11, color: colors.textLight },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tagSpecialty: { backgroundColor: colors.primaryLight, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  tagSpecialtyText: { fontSize: 11, color: colors.primaryDark, fontFamily: fontFamily.bold },
  tagApproach: { backgroundColor: '#EEF2FF', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  tagApproachText: { fontSize: 11, color: '#3730A3', fontFamily: fontFamily.bold },
  tagOnline: { backgroundColor: '#F5F0FF', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  tagOnlineText: { fontSize: 11, color: '#6D28D9', fontFamily: fontFamily.bold },
  tagPresential: { backgroundColor: '#FFF7ED', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  tagPresentialText: { fontSize: 11, color: '#C2410C', fontFamily: fontFamily.bold },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  reviewsText: { fontSize: 12, color: colors.textLight },
  cardCta: { fontSize: 13, color: colors.primary, fontFamily: fontFamily.bold },
  newBadge: { backgroundColor: '#FFF3CD', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  newBadgeText: { fontSize: 10, color: '#856404', fontFamily: fontFamily.bold },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: 17, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 6, marginTop: 12 },
  emptySub: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 20 },
  emptyBtn: { backgroundColor: colors.primaryLight, borderRadius: 16, paddingHorizontal: 24, paddingVertical: 12 },
  emptyBtnText: { color: colors.primary, fontFamily: fontFamily.bold, fontSize: 14 },
})

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function LoginScreen({ navigation }) {
  const { login } = useAuth()
  const insets = useSafeAreaInsets()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate() {
    const errs = {}
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'E-mail inválido'
    if (!form.password || form.password.length < 6) errs.password = 'Mínimo 6 caracteres'
    return errs
  }

  async function handleLogin() {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try { await login(form) } catch (e) { } finally { setLoading(false) }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View style={[ls.container, { paddingTop: insets.top + 32 }]}>
        {/* Logo */}
        <View style={ls.logoWrap}>
          <Image source={require('../../assets/logo.png')} style={ls.logoImg} resizeMode="contain" />
        </View>

        {forgotMode ? (
          <>
            <Text style={ls.title}>Recuperar senha</Text>
            <Text style={ls.subtitle}>Informe seu e-mail e enviaremos as instruções.</Text>
            {forgotSent ? (
              <View style={ls.successBox}>
                <Text style={ls.successText}>Instruções enviadas para {forgotEmail}</Text>
              </View>
            ) : (
              <>
                <View style={ls.fieldWrap}>
                  <Text style={ls.fieldLabel}>E-mail</Text>
                  <TextInput style={ls.input} placeholder="seu@email.com" placeholderTextColor={colors.textLight} value={forgotEmail} onChangeText={setForgotEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>
                <TouchableOpacity style={ls.btn} onPress={() => { if (/\S+@\S+\.\S+/.test(forgotEmail)) setForgotSent(true) }} activeOpacity={0.85}>
                  <Text style={ls.btnText}>Enviar instruções</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity onPress={() => { setForgotMode(false); setForgotSent(false); setForgotEmail('') }}>
              <Text style={ls.linkText}>← Voltar para login</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={ls.title}>Entrar na sua conta</Text>
            <Text style={ls.subtitle}>Acesse sua conta para continuar.</Text>

            <View style={ls.fieldWrap}>
              <Text style={ls.fieldLabel}>E-mail</Text>
              <TextInput
                style={[ls.input, errors.email && ls.inputError]}
                placeholder="seu@email.com"
                placeholderTextColor={colors.textLight}
                value={form.email}
                onChangeText={v => { setForm(f => ({ ...f, email: v })); setErrors(e => ({ ...e, email: null })) }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={ls.fieldError}>{errors.email}</Text>}
            </View>

            <View style={ls.fieldWrap}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={ls.fieldLabel}>Senha</Text>
                <TouchableOpacity onPress={() => setForgotMode(true)}>
                  <Text style={ls.forgotLink}>Esqueci minha senha</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={[ls.input, errors.password && ls.inputError]}
                placeholder="••••••••"
                placeholderTextColor={colors.textLight}
                value={form.password}
                onChangeText={v => { setForm(f => ({ ...f, password: v })); setErrors(e => ({ ...e, password: null })) }}
                secureTextEntry
              />
              {errors.password && <Text style={ls.fieldError}>{errors.password}</Text>}
            </View>

            <TouchableOpacity style={ls.btn} onPress={handleLogin} activeOpacity={0.85} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={ls.btnText}>Entrar</Text>
              }
            </TouchableOpacity>

            <View style={ls.footerRow}>
              <Text style={ls.footerText}>Não tem conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('FichaTab')}>
                <Text style={ls.footerLink}>Criar conta gratuita</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  )
}

const ls = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28, paddingBottom: 32 },
  logoWrap: { alignItems: 'center', marginBottom: 28},
  logoImg: { width: 190, height: 90,  opacity: 0.96},
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  logoText: { fontSize: 22, fontFamily: fontFamily.bold, color: '#fff' },
  logoLabel: { fontSize: 20, fontFamily: fontFamily.bold, color: colors.primaryDark },
  title: { fontSize: 24, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 28 },
  fieldWrap: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontFamily: fontFamily.semibold, color: colors.text, marginBottom: 6 },
  input: { height: 48, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, fontSize: 15, color: colors.text, backgroundColor: colors.bgLight },
  inputError: { borderColor: colors.danger },
  fieldError: { fontSize: 12, color: colors.danger, marginTop: 4 },
  forgotLink: { fontSize: 13, color: colors.primary, fontFamily: fontFamily.semibold },
  btn: { height: 50, backgroundColor: colors.primary, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontFamily: fontFamily.bold },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: colors.textSecondary },
  footerLink: { fontSize: 14, color: colors.primary, fontFamily: fontFamily.semibold },
  linkText: { fontSize: 14, color: colors.primary, fontFamily: fontFamily.semibold, textAlign: 'center', marginTop: 16 },
  successBox: { backgroundColor: colors.primaryLight, borderRadius: 12, padding: 14, marginBottom: 20 },
  successText: { fontSize: 14, color: colors.primary, fontFamily: fontFamily.semibold },
})

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTER SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function RegisterScreen({ navigation }) {
  const { register, login } = useAuth()
  const insets = useSafeAreaInsets()
  const [step, setStep] = useState(1) // 1 = dados, 2 = tipo de conta
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'paciente' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validateStep1() {
    const errs = {}
    if (!form.name || form.name.trim().length < 2) errs.name = 'Nome muito curto'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'E-mail inválido'
    if (!form.password || form.password.length < 6) errs.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirm) errs.confirm = 'Senhas não conferem'
    return errs
  }

  function handleNext() {
    const errs = validateStep1()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStep(2)
  }

  async function handleRegister() {
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role })
      await login({ email: form.email, password: form.password })
    } catch (e) { } finally { setLoading(false) }
  }

  const ROLES = [
    { id: 'paciente', label: 'Paciente', desc: 'Busco apoio psicológico', icon: 'user' },
    { id: 'profissional', label: 'Profissional', desc: 'Sou psicólogo(a) ou psiquiatra', icon: 'briefcase' },
  ]

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View style={[rs.container, { paddingTop: insets.top + 24 }]}>
        {/* Header */}
        <View style={rs.headerRow}>
          {step === 2 && (
            <TouchableOpacity onPress={() => setStep(1)} style={rs.backBtn}>
              <Text style={rs.backBtnText}>←</Text>
            </TouchableOpacity>
          )}
          <Image source={require('../../assets/logo.png')} style={{ width: 80, height: 50 }} resizeMode="contain" />
        </View>

        {/* Steps indicator */}
        <View style={rs.stepsRow}>
          <View style={[rs.stepDot, step >= 1 && rs.stepDotActive]} />
          <View style={rs.stepLine} />
          <View style={[rs.stepDot, step >= 2 && rs.stepDotActive]} />
        </View>

        {step === 1 ? (
          <>
            <Text style={rs.title}>Criar conta</Text>
            <Text style={rs.subtitle}>Preencha seus dados para começar.</Text>

            {[
              { key: 'name', label: 'Nome completo', placeholder: 'Seu nome', type: 'default' },
              { key: 'email', label: 'E-mail', placeholder: 'seu@email.com', type: 'email-address' },
              { key: 'password', label: 'Senha', placeholder: '••••••••', secure: true },
              { key: 'confirm', label: 'Confirmar senha', placeholder: '••••••••', secure: true },
            ].map(field => (
              <View key={field.key} style={rs.fieldWrap}>
                <Text style={rs.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={[rs.input, errors[field.key] && rs.inputError]}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.textLight}
                  value={form[field.key]}
                  onChangeText={v => { setForm(f => ({ ...f, [field.key]: v })); setErrors(e => ({ ...e, [field.key]: null })) }}
                  keyboardType={field.type || 'default'}
                  autoCapitalize={field.key === 'name' ? 'words' : 'none'}
                  secureTextEntry={field.secure}
                />
                {errors[field.key] && <Text style={rs.fieldError}>{errors[field.key]}</Text>}
              </View>
            ))}

            <TouchableOpacity style={rs.btn} onPress={handleNext} activeOpacity={0.85}>
              <Text style={rs.btnText}>Continuar →</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={rs.title}>Qual é o seu perfil?</Text>
            <Text style={rs.subtitle}>Escolha como vai usar o Acolhe+.</Text>

            <View style={rs.rolesWrap}>
              {ROLES.map(role => (
                <TouchableOpacity
                  key={role.id}
                  style={[rs.roleCard, form.role === role.id && rs.roleCardActive]}
                  onPress={() => setForm(f => ({ ...f, role: role.id }))}
                  activeOpacity={0.8}
                >
                  <Feather name={role.icon} size={36} color={form.role === role.id ? colors.primary : colors.textSecondary} style={{ marginBottom: 8 }} />
                  <Text style={[rs.roleLabel, form.role === role.id && rs.roleLabelActive]}>{role.label}</Text>
                  <Text style={rs.roleDesc}>{role.desc}</Text>
                  {form.role === role.id && <View style={rs.roleCheck}><Feather name='check' size={12} color='#fff' /></View>}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={rs.btn} onPress={handleRegister} activeOpacity={0.85} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={rs.btnText}>Criar minha conta</Text>
              }
            </TouchableOpacity>
          </>
        )}

        <View style={rs.footerRow}>
          <Text style={rs.footerText}>Já tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')}>
            <Text style={rs.footerLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const rs = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.bgLight, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, color: colors.primary },
  logoCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 14, fontFamily: fontFamily.bold, color: '#fff' },
  stepsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
  stepDotActive: { backgroundColor: colors.primary },
  stepLine: { flex: 1, height: 2, backgroundColor: colors.border, marginHorizontal: 6 },
  title: { fontSize: 24, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 24 },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontFamily: fontFamily.semibold, color: colors.text, marginBottom: 6 },
  input: { height: 48, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, fontSize: 15, color: colors.text, backgroundColor: colors.bgLight },
  inputError: { borderColor: colors.danger },
  fieldError: { fontSize: 12, color: colors.danger, marginTop: 4 },
  btn: { height: 50, backgroundColor: colors.primary, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontFamily: fontFamily.bold },
  rolesWrap: { gap: 12, marginBottom: 24 },
  roleCard: { borderWidth: 1.5, borderColor: colors.border, borderRadius: 16, padding: 18, alignItems: 'center', backgroundColor: colors.bgLight },
  roleCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  roleIcon: { fontSize: 36, marginBottom: 8 },
  roleLabel: { fontSize: 17, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 4 },
  roleLabelActive: { color: colors.primary },
  roleDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  roleCheck: { position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: colors.textSecondary },
  footerLink: { fontSize: 14, color: colors.primary, fontFamily: fontFamily.semibold },
})

// ═══════════════════════════════════════════════════════════════════════════════
// PSYCHOLOGIST SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function PsychologistScreen({ route, navigation }) {
  const { id } = route.params
  const { user, isAuthenticated, updateUser } = useAuth()
  const [psy, setPsy] = React.useState(null)

  React.useEffect(() => {
    async function loadPsy() {
      try {
        const raw = await AsyncStorage.getItem('@acolhe:accounts')
        const accounts = raw ? JSON.parse(raw) : []
        const regPros = accounts
          .filter(a => a.role === 'profissional')
          .map(buildProfessionalFromUser)
        const all = [...PSYCHOLOGISTS_SEED, ...regPros]
        setPsy(all.find(p => String(p.id) === String(id)) || null)
      } catch (e) {
        setPsy(PSYCHOLOGISTS_SEED.find(p => String(p.id) === String(id)) || null)
      }
    }
    loadPsy()
  }, [id])

  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookingDone, setBookingDone] = useState(false)

  if (!psy) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>Profissional não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontFamily: fontFamily.semibold }}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

  function getNextDates() {
    const days = []
    const today = new Date()
    for (let i = 1; i <= 10; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' })
      days.push({
        label: `${dayName} ${d.getDate()}/${d.getMonth() + 1}`,
        value: d.toLocaleDateString('pt-BR'),
      })
    }
    return days
  }

  function handleBooking() {
    if (!isAuthenticated) { navigation.navigate('FichaTab'); return }
    setBookingOpen(true)
  }

  async function confirmBooking() {
    if (!selectedDay || !selectedTime) return
    const newSession = {
      id: Date.now(),
      professional: psy.name,
      specialty: psy.specialty,
      date: selectedDay,
      time: selectedTime,
      status: 'Agendada',
      notes: `Sessão de ${psy.specialty.toLowerCase()} — ${psy.approach}`,
    }

    // Salva na ficha do paciente
    updateUser({ sessions: [...(user?.sessions || []), newSession] })

    // Salva na conta do profissional (se for cadastrado no app)
    if (psy.isNew) {
      try {
        const raw = await AsyncStorage.getItem('@acolhe:accounts')
        const accounts = raw ? JSON.parse(raw) : []
        const idx = accounts.findIndex(a => a.email === psy.id.replace('user_', ''))
        if (idx >= 0) {
          const appointment = {
            id: Date.now(),
            patient: user.name,
            specialty: psy.specialty,
            date: selectedDay,
            time: selectedTime,
            status: 'Agendada',
            modality: 'Online',
          }
          accounts[idx].appointments = [...(accounts[idx].appointments || []), appointment]
          await AsyncStorage.setItem('@acolhe:accounts', JSON.stringify(accounts))
        }
      } catch (e) {
        console.error('Erro ao salvar agendamento no profissional:', e)
      }
    }

    setBookingDone(true)
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Hero do profissional */}
        <View style={ps.hero}>
          <View style={ps.avatarLarge}>
            <Text style={ps.avatarText}>{psy.name.charAt(0)}</Text>
          </View>
          <Text style={ps.name}>{psy.name}</Text>
          <Text style={ps.profession}>{psy.profession} • {psy.crp}</Text>
          <View style={ps.tagsRow}>
            <View style={ps.tagGreen}><Text style={ps.tagGreenText}>{psy.specialty}</Text></View>
            <View style={ps.tagBlue}><Text style={ps.tagBlueText}>{psy.approach}</Text></View>
            {psy.online && <View style={ps.tagPurple}><Text style={ps.tagPurpleText}>Online</Text></View>}
            {psy.presential && <View style={ps.tagOrange}><Text style={ps.tagOrangeText}>Presencial</Text></View>}
          </View>
          <View style={ps.ratingRow}>
            <Feather name='star' size={14} color='#f59e0b' />
            <Text style={ps.ratingText}>{psy.rating}</Text>
            <Text style={ps.reviewsText}>({psy.reviews} avaliações)</Text>
          </View>
        </View>

        {/* Seções */}
        <View style={ps.section}>
          <Text style={ps.sectionTitle}>Sobre mim</Text>
          <Text style={ps.sectionText}>{psy.bio}</Text>
        </View>

        <View style={ps.section}>
          <Text style={ps.sectionTitle}>Formação</Text>
          <View style={ps.listItem}><Text style={ps.bullet}>•</Text><Text style={ps.listText}>{psy.formation}</Text></View>
          <View style={ps.listItem}><Text style={ps.bullet}>•</Text><Text style={ps.listText}>{psy.specialization}</Text></View>
        </View>

        <View style={ps.section}>
          <Text style={ps.sectionTitle}>Áreas de atuação</Text>
          <View style={ps.areasWrap}>
            {psy.areas.map(area => (
              <View key={area} style={ps.areaChip}><Text style={ps.areaChipText}>{area}</Text></View>
            ))}
          </View>
        </View>

        <View style={ps.section}>
          <Text style={ps.sectionTitle}>Disponibilidade</Text>
          {psy.schedule.map(s => (
            <View key={s} style={ps.scheduleRow}>
              <Feather name='calendar' size={14} color={colors.textSecondary} />
              <Text style={ps.scheduleText}>{s}</Text>
            </View>
          ))}
        </View>

        <View style={ps.section}>
          <Text style={ps.sectionTitle}>Depoimentos</Text>
          {psy.testimonials.map((t, i) => (
            <View key={i} style={ps.testimonialCard}>
              <View style={{ flexDirection: 'row', gap: 2 }}>{[0,1,2,3,4].map(i => <Feather key={i} name='star' size={12} color='#f59e0b' />)}</View>
              <Text style={ps.testimonialText}>{t.text}</Text>
              <Text style={ps.testimonialAuthor}>— {t.author}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Botão fixo de agendamento */}
      <View style={ps.bookingBar}>
        <View>
          <Text style={ps.priceValue}>R$ {psy.price}<Text style={ps.priceSub}>/sessão</Text></Text>
          <Text style={ps.audienceText}>{psy.careModel}</Text>
        </View>
        <TouchableOpacity style={ps.bookingBtn} onPress={handleBooking} activeOpacity={0.85}>
          <Text style={ps.bookingBtnText}>Agendar sessão</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de agendamento */}
      <Modal visible={bookingOpen} animationType="slide" transparent presentationStyle="overFullScreen">
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={() => { setBookingOpen(false); setBookingDone(false); setSelectedDay(''); setSelectedTime('') }} />
        <View style={ps.modalSheet}>
          <View style={ps.modalHandle} />
          {bookingDone ? (
            <View style={{ alignItems: 'center', padding: 24 }}>
              <View style={ps.successCircle}><Feather name='check' size={32} color={colors.primary} /></View>
              <Text style={ps.successTitle}>Sessão agendada!</Text>
              <Text style={ps.successSub}>Sua sessão com <Text style={{ fontFamily: fontFamily.bold }}>{psy.name}</Text> foi marcada para <Text style={{ fontFamily: fontFamily.bold }}>{selectedDay}</Text> às <Text style={{ fontFamily: fontFamily.bold }}>{selectedTime}</Text>.</Text>
              <TouchableOpacity style={ps.successBtn} onPress={() => { setBookingOpen(false); setBookingDone(false); navigation.navigate('FichaTab') }}>
                <Text style={ps.successBtnText}>Ver minha ficha</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setBookingOpen(false); setBookingDone(false); setSelectedDay(''); setSelectedTime('') }} style={{ marginTop: 12 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={ps.modalTitle}>Agendar com {psy.name}</Text>
              <Text style={ps.modalSub}>{psy.specialty} • {psy.approach} • R$ {psy.price}/sessão</Text>

              <Text style={ps.stepLabel}>Escolha o dia</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                {getNextDates().map(d => (
                  <TouchableOpacity
                    key={d.value}
                    style={[ps.dateChip, selectedDay === d.value && ps.dateChipActive]}
                    onPress={() => setSelectedDay(d.value)}
                  >
                    <Text style={[ps.dateChipText, selectedDay === d.value && ps.dateChipTextActive]}>{d.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[ps.stepLabel, { marginTop: 20 }]}>Escolha o horário</Text>
              <View style={ps.timeGrid}>
                {TIME_SLOTS.map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[ps.timeChip, selectedTime === t && ps.timeChipActive]}
                    onPress={() => setSelectedTime(t)}
                  >
                    <Text style={[ps.timeChipText, selectedTime === t && ps.timeChipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[ps.confirmBtn, (!selectedDay || !selectedTime) && ps.confirmBtnDisabled]}
                onPress={confirmBooking}
                disabled={!selectedDay || !selectedTime}
              >
                <Text style={ps.confirmBtnText}>Confirmar agendamento</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  )
}

const ps = StyleSheet.create({
  hero: { backgroundColor: colors.primaryLight, alignItems: 'center', padding: 28, paddingTop: 36 },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontFamily: fontFamily.bold, color: '#fff' },
  name: { fontSize: 22, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 4 },
  profession: { fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 10 },
  tagGreen: { backgroundColor: '#e8f5e9', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagGreenText: { fontSize: 11, color: '#2e7d32', fontFamily: fontFamily.semibold },
  tagBlue: { backgroundColor: '#e3f2fd', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagBlueText: { fontSize: 11, color: '#1565c0', fontFamily: fontFamily.semibold },
  tagPurple: { backgroundColor: '#f3e5f5', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagPurpleText: { fontSize: 11, color: '#6a1b9a', fontFamily: fontFamily.semibold },
  tagOrange: { backgroundColor: '#fff3e0', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagOrangeText: { fontSize: 11, color: '#e65100', fontFamily: fontFamily.semibold },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontFamily: fontFamily.bold, color: colors.text },
  reviewsText: { fontSize: 13, color: colors.textSecondary },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  sectionTitle: { fontSize: 16, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 10 },
  sectionText: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  listItem: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  bullet: { color: colors.primary, fontFamily: fontFamily.bold, fontSize: 16 },
  listText: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  areasWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  areaChip: { backgroundColor: colors.bgSubtle, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  areaChipText: { fontSize: 13, color: colors.textSecondary, fontFamily: fontFamily.medium },
  scheduleRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6 },
  scheduleText: { fontSize: 14, color: colors.textSecondary },
  testimonialCard: { backgroundColor: colors.bgLight, borderRadius: 12, padding: 14, marginBottom: 10 },
  testimonialText: { fontSize: 14, color: colors.text, lineHeight: 20, marginTop: 4, marginBottom: 6 },
  testimonialAuthor: { fontSize: 12, color: colors.textLight, fontFamily: fontFamily.medium },
  bookingBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 10 },
  priceValue: { fontSize: 20, fontFamily: fontFamily.bold, color: colors.primary },
  priceSub: { fontSize: 13, fontFamily: fontFamily.regular, color: colors.textSecondary },
  audienceText: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  bookingBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 13 },
  bookingBtnText: { color: '#fff', fontFamily: fontFamily.bold, fontSize: 15 },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '75%' },
  modalHandle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 4 },
  modalSub: { fontSize: 13, color: colors.textSecondary, marginBottom: 20 },
  stepLabel: { fontSize: 14, fontFamily: fontFamily.semibold, color: colors.text, marginBottom: 10 },
  dateChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.bg },
  dateChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  dateChipText: { fontSize: 13, color: colors.textSecondary, fontFamily: fontFamily.medium },
  dateChipTextActive: { color: colors.primary, fontFamily: fontFamily.bold },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeChip: { width: '22%', paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.bg, alignItems: 'center' },
  timeChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  timeChipText: { fontSize: 14, color: colors.textSecondary, fontFamily: fontFamily.medium },
  timeChipTextActive: { color: colors.primary, fontFamily: fontFamily.bold },
  confirmBtn: { marginTop: 24, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  confirmBtnDisabled: { backgroundColor: colors.border },
  confirmBtnText: { color: '#fff', fontFamily: fontFamily.bold, fontSize: 15 },
  successCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontSize: 22, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 8 },
  successSub: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  successBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 13 },
  successBtnText: { color: '#fff', fontFamily: fontFamily.bold, fontSize: 15 },
})

// ═══════════════════════════════════════════════════════════════════════════════
// STACKS & NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const defaultScreenOptions = {
  headerStyle: { backgroundColor: colors.bg },
  headerTintColor: colors.primary,
  headerTitleStyle: { fontFamily: fontFamily.semibold, color: colors.text },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Psychologist" component={PsychologistScreen} options={{ title: 'Profissional' }} />
    </Stack.Navigator>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TELECONSULTA MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function TeleconsultaModal({ visible, session, onClose, isProfessional }) {
  const [inCall, setInCall] = useState(false)
  const [muted, setMuted] = useState(false)
  const [camOff, setCamOff] = useState(false)
  const [timer, setTimer] = useState(0)

  React.useEffect(() => {
    let interval
    if (inCall) {
      interval = setInterval(() => setTimer(t => t + 1), 1000)
    } else {
      setTimer(0)
    }
    return () => clearInterval(interval)
  }, [inCall])

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  function handleClose() {
    setInCall(false)
    setMuted(false)
    setCamOff(false)
    onClose()
  }

  if (!session) return null

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
        {!inCall ? (
          // Sala de espera
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            <View style={tc.waitCircle}>
              <Feather name='video' size={40} color='#fff' />
            </View>
            <Text style={tc.waitTitle}>Teleconsulta</Text>
            <Text style={tc.waitWith}>com {session.professional}</Text>
            <Text style={tc.waitDate}>{session.date}{session.time ? ` às ${session.time}` : ''}</Text>

            <View style={tc.infoBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Feather name='lock' size={14} color='rgba(255,255,255,0.7)' /><Text style={tc.infoRow}>Conexão criptografada</Text></View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Feather name='shield' size={14} color='rgba(255,255,255,0.7)' /><Text style={tc.infoRow}>Conforme LGPD</Text></View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Feather name='mic' size={14} color='rgba(255,255,255,0.7)' /><Text style={tc.infoRow}>Verifique microfone e câmera</Text></View>
            </View>

            <TouchableOpacity style={tc.enterBtn} onPress={() => setInCall(true)} activeOpacity={0.85}>
              <Text style={tc.enterBtnText}>Entrar na consulta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClose} style={{ marginTop: 16 }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Tela de chamada
          <View style={{ flex: 1 }}>
            {/* Vídeo remoto (simulado) */}
            <View style={tc.remoteVideo}>
              <View style={tc.remoteAvatar}>
                <Text style={{ fontSize: 48, fontFamily: fontFamily.bold, color: '#fff' }}>
                  {session.professional?.charAt(0) || '?'}
                </Text>
              </View>
              <Text style={tc.remoteName}>{session.professional}</Text>
              <Text style={tc.callTimer}>{formatTime(timer)}</Text>
            </View>

            {/* Vídeo local (PiP) */}
            <View style={tc.localVideo}>
              {camOff
                ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Feather name='user' size={20} color='#fff' /></View>
                : <View style={{ flex: 1, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Você</Text></View>
              }
            </View>

            {/* Controles */}
            <View style={tc.controls}>
              <TouchableOpacity style={[tc.controlBtn, muted && tc.controlBtnActive]} onPress={() => setMuted(m => !m)}>
                <Feather name={muted ? 'mic-off' : 'mic'} size={22} color='#fff' />
              </TouchableOpacity>
              <TouchableOpacity style={tc.hangupBtn} onPress={handleClose}>
                <Feather name='phone-off' size={24} color='#fff' />
              </TouchableOpacity>
              <TouchableOpacity style={[tc.controlBtn, camOff && tc.controlBtnActive]} onPress={() => setCamOff(c => !c)}>
                <Feather name={camOff ? 'video-off' : 'video'} size={22} color='#fff' />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  )
}

const tc = StyleSheet.create({
  waitCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  waitTitle: { fontSize: 26, fontFamily: fontFamily.bold, color: '#fff', marginBottom: 4 },
  waitWith: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  waitDate: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 28 },
  infoBox: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16, gap: 8, marginBottom: 32, width: '100%' },
  infoRow: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  enterBtn: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40 },
  enterBtnText: { color: '#fff', fontFamily: fontFamily.bold, fontSize: 16 },
  remoteVideo: { flex: 1, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  remoteAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primaryDark, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  remoteName: { fontSize: 18, fontFamily: fontFamily.bold, color: '#fff', marginBottom: 6 },
  callTimer: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
  localVideo: { position: 'absolute', top: 16, right: 16, width: 90, height: 120, borderRadius: 12, backgroundColor: '#1f2937', overflow: 'hidden', borderWidth: 2, borderColor: '#fff' },
  controls: { position: 'absolute', bottom: 48, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20 },
  controlBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  controlBtnActive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  controlIcon: { fontSize: 22 },
  hangupBtn: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
})

// ═══════════════════════════════════════════════════════════════════════════════
// FICHA SCREEN (paciente) + DASHBOARD PROFISSIONAL
// ═══════════════════════════════════════════════════════════════════════════════

function FichaScreen({ navigation }) {
  const { user } = useAuth()

  // Redireciona para dashboard se for profissional
  if (user?.role === 'profissional') {
    return <ProfissionalDashboard navigation={navigation} />
  }

  const insets = useSafeAreaInsets()
  const sessions = user?.sessions || []

  const upcoming = sessions.filter(s => s.status === 'Agendada')
  const past = sessions.filter(s => s.status !== 'Agendada')
  const [teleconsultaSession, setTeleconsultaSession] = useState(null)

  const STATUS_COLOR = {
    'Agendada':  { bg: '#e8f5e9', text: '#2e7d32' },
    'Realizada': { bg: '#e3f2fd', text: '#1565c0' },
    'Cancelada': { bg: '#fce4ec', text: '#ad1457' },
  }

  function SessionCard({ session }) {
    const style = STATUS_COLOR[session.status] || STATUS_COLOR['Realizada']
    const isOnline = session.notes?.toLowerCase().includes('online') || true
    return (
      <View style={fi.sessionCard}>
        <View style={fi.sessionTop}>
          <View style={{ flex: 1 }}>
            <Text style={fi.sessionProf}>{session.professional}</Text>
            <Text style={fi.sessionSpec}>{session.specialty}</Text>
          </View>
          <View style={[fi.statusBadge, { backgroundColor: style.bg }]}>
            <Text style={[fi.statusText, { color: style.text }]}>{session.status}</Text>
          </View>
        </View>
        <View style={fi.sessionMeta}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Feather name='calendar' size={13} color={colors.textSecondary} /><Text style={fi.sessionMetaText}>{session.date}{session.time ? ` às ${session.time}` : ''}</Text></View>
        </View>
        {session.notes && <Text style={fi.sessionNotes}>{session.notes}</Text>}
        {session.status === 'Agendada' && (
          <TouchableOpacity
            style={fi.teleBtn}
            onPress={() => setTeleconsultaSession(session)}
            activeOpacity={0.85}
          >
            <Feather name='video' size={16} color='#fff' />
            <Text style={fi.teleBtnText}>Entrar na teleconsulta</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Cabeçalho do usuário */}
      <View style={[fi.header, { paddingTop: insets.top + 16 }]}>
        <View style={fi.avatarCircle}>
          <Text style={fi.avatarText}>{user?.name?.charAt(0) || '?'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={fi.userName}>{user?.name || 'Usuário'}</Text>
          <Text style={fi.userEmail}>{user?.email}</Text>
          <View style={fi.roleBadge}>
            <Text style={fi.roleText}>{user?.role === 'profissional' ? 'Profissional' : 'Paciente'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')} style={fi.editBtn}>
          <Text style={fi.editBtnText}>Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Resumo */}
      <View style={fi.statsRow}>
        <View style={fi.statBox}>
          <Text style={fi.statValue}>{sessions.length}</Text>
          <Text style={fi.statLabel}>Total</Text>
        </View>
        <View style={fi.statDivider} />
        <View style={fi.statBox}>
          <Text style={fi.statValue}>{upcoming.length}</Text>
          <Text style={fi.statLabel}>Agendadas</Text>
        </View>
        <View style={fi.statDivider} />
        <View style={fi.statBox}>
          <Text style={fi.statValue}>{past.length}</Text>
          <Text style={fi.statLabel}>Realizadas</Text>
        </View>
      </View>

      {/* Próximas sessões */}
      {upcoming.length > 0 && (
        <View style={fi.section}>
          <Text style={fi.sectionTitle}>Próximas sessões</Text>
          {upcoming.map(s => <SessionCard key={s.id} session={s} />)}
        </View>
      )}

      {/* Histórico */}
      <View style={fi.section}>
        <Text style={fi.sectionTitle}>Histórico</Text>
        {past.length === 0 && upcoming.length === 0 ? (
          <View style={fi.emptyState}>
            <Feather name='clipboard' size={48} color={colors.border} style={{ marginBottom: 12 }} />
            <Text style={fi.emptyTitle}>Nenhuma sessão ainda</Text>
            <Text style={fi.emptySub}>Agende sua primeira consulta.</Text>
            <TouchableOpacity style={fi.emptyBtn} onPress={() => navigation.navigate('SearchTab')}>
              <Text style={fi.emptyBtnText}>Buscar profissional</Text>
            </TouchableOpacity>
          </View>
        ) : past.length === 0 ? (
          <Text style={fi.emptyHint}>Nenhuma sessão realizada ainda.</Text>
        ) : (
          past.map(s => <SessionCard key={s.id} session={s} />)
        )}
      </View>

      {/* Ação rápida */}
      <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity style={fi.quickBtn} onPress={() => navigation.navigate('SearchTab')} activeOpacity={0.85}>
          <Text style={fi.quickBtnText}>+ Agendar nova sessão</Text>
        </TouchableOpacity>
      </View>

      <TeleconsultaModal
        visible={!!teleconsultaSession}
        session={teleconsultaSession}
        onClose={() => setTeleconsultaSession(null)}
      />
    </ScrollView>
  )
}

const fi = StyleSheet.create({
  header: { backgroundColor: colors.primaryLight, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20, paddingBottom: 24 },
  avatarCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontFamily: fontFamily.bold, color: '#fff' },
  userName: { fontSize: 17, fontFamily: fontFamily.bold, color: colors.text },
  userEmail: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  roleBadge: { marginTop: 6, backgroundColor: colors.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  roleText: { fontSize: 12, color: colors.primary, fontFamily: fontFamily.semibold },
  editBtn: { borderWidth: 1.5, borderColor: colors.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  editBtnText: { color: colors.primary, fontSize: 13, fontFamily: fontFamily.semibold },
  statsRow: { flexDirection: 'row', backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontFamily: fontFamily.bold, color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  section: { padding: 20 },
  sectionTitle: { fontSize: 16, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 12 },
  sessionCard: { backgroundColor: colors.bg, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  sessionTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  sessionProf: { fontSize: 15, fontFamily: fontFamily.bold, color: colors.text },
  sessionSpec: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 12, fontFamily: fontFamily.semibold },
  sessionMeta: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  sessionMetaText: { fontSize: 13, color: colors.textSecondary },
  sessionNotes: { fontSize: 13, color: colors.textLight, fontStyle: 'italic', marginTop: 4 },
  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 6 },
  emptySub: { fontSize: 14, color: colors.textSecondary, marginBottom: 20 },
  emptyBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10 },
  emptyBtnText: { color: '#fff', fontFamily: fontFamily.semibold, fontSize: 14 },
  emptyHint: { fontSize: 14, color: colors.textLight, textAlign: 'center', paddingVertical: 16 },
  quickBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  quickBtnText: { color: '#fff', fontFamily: fontFamily.bold, fontSize: 15 },
  teleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, backgroundColor: '#0f172a', borderRadius: 10, paddingVertical: 10 },
  teleBtnIcon: { fontSize: 16 },
  teleBtnText: { color: '#fff', fontFamily: fontFamily.bold, fontSize: 14 },
})

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD DO PROFISSIONAL
// ═══════════════════════════════════════════════════════════════════════════════

function ProfissionalDashboard({ navigation }) {
  const { user } = useAuth()
  const insets = useSafeAreaInsets()
  const [teleconsultaSession, setTeleconsultaSession] = useState(null)

  const sessions = user?.appointments || []

  const upcoming = sessions.filter(s => s.status === 'Agendada')
  const past     = sessions.filter(s => s.status !== 'Agendada')

  const STATUS_COLOR = {
    'Agendada':  { bg: '#e8f5e9', text: '#2e7d32' },
    'Realizada': { bg: '#e3f2fd', text: '#1565c0' },
  }

  function PatientCard({ session }) {
    const style = STATUS_COLOR[session.status] || STATUS_COLOR['Realizada']
    return (
      <View style={pd.card}>
        <View style={pd.cardTop}>
          <View style={pd.patientAvatar}>
            <Text style={pd.patientAvatarText}>{session.patient.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={pd.patientName}>{session.patient}</Text>
            <Text style={pd.patientSpec}>{session.specialty}</Text>
          </View>
          <View style={[pd.statusBadge, { backgroundColor: style.bg }]}>
            <Text style={[pd.statusText, { color: style.text }]}>{session.status}</Text>
          </View>
        </View>
        <View style={pd.cardMeta}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Feather name='calendar' size={13} color={colors.textSecondary} /><Text style={pd.metaText}>{session.date} às {session.time}</Text></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Feather name={session.modality === 'Online' ? 'monitor' : 'map-pin'} size={13} color={colors.textSecondary} /><Text style={pd.metaText}>{session.modality}</Text></View>
        </View>
        {session.status === 'Agendada' && session.modality === 'Online' && (
          <TouchableOpacity
            style={pd.teleBtn}
            onPress={() => setTeleconsultaSession({ ...session, professional: session.patient })}
            activeOpacity={0.85}
          >
            <Feather name='video' size={15} color='#fff' />
            <Text style={pd.teleBtnText}>Iniciar teleconsulta</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={[pd.header, { paddingTop: insets.top + 16 }]}>
        <View style={pd.avatarCircle}>
          <Text style={pd.avatarText}>{user?.name?.charAt(0) || '?'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={pd.greeting}>Olá, {user?.name?.split(' ')[0]}</Text>
          <Text style={pd.role}>Profissional</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')} style={pd.editBtn}>
          <Text style={pd.editBtnText}>Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={pd.statsRow}>
        <View style={pd.statBox}><Text style={pd.statValue}>{sessions.length}</Text><Text style={pd.statLabel}>Total</Text></View>
        <View style={pd.statDivider} />
        <View style={pd.statBox}><Text style={pd.statValue}>{upcoming.length}</Text><Text style={pd.statLabel}>Hoje</Text></View>
        <View style={pd.statDivider} />
        <View style={pd.statBox}><Text style={pd.statValue}>{past.length}</Text><Text style={pd.statLabel}>Realizadas</Text></View>
      </View>

      <View style={pd.section}>
        <Text style={pd.sectionTitle}>Próximas consultas</Text>
        {upcoming.length === 0
          ? <Text style={pd.emptyHint}>Nenhuma consulta agendada.</Text>
          : upcoming.map(s => <PatientCard key={s.id} session={s} />)
        }
      </View>

      <View style={pd.section}>
        <Text style={pd.sectionTitle}>Histórico</Text>
        {past.map(s => <PatientCard key={s.id} session={s} />)}
      </View>

      <TeleconsultaModal
        visible={!!teleconsultaSession}
        session={teleconsultaSession}
        onClose={() => setTeleconsultaSession(null)}
        isProfessional
      />
    </ScrollView>
  )
}

const pd = StyleSheet.create({
  header: { backgroundColor: colors.primaryLight, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20, paddingBottom: 24 },
  avatarCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontFamily: fontFamily.bold, color: '#fff' },
  greeting: { fontSize: 17, fontFamily: fontFamily.bold, color: colors.text },
  role: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  editBtn: { borderWidth: 1.5, borderColor: colors.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  editBtnText: { color: colors.primary, fontSize: 13, fontFamily: fontFamily.semibold },
  statsRow: { flexDirection: 'row', backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontFamily: fontFamily.bold, color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  section: { padding: 20 },
  sectionTitle: { fontSize: 16, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 12 },
  card: { backgroundColor: colors.bg, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  patientAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  patientAvatarText: { fontSize: 16, fontFamily: fontFamily.bold, color: colors.primary },
  patientName: { fontSize: 15, fontFamily: fontFamily.bold, color: colors.text },
  patientSpec: { fontSize: 13, color: colors.textSecondary },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 12, fontFamily: fontFamily.semibold },
  cardMeta: { flexDirection: 'row', gap: 16, marginBottom: 4 },
  metaText: { fontSize: 13, color: colors.textSecondary },
  teleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, backgroundColor: '#0f172a', borderRadius: 10, paddingVertical: 10 },
  teleBtnText: { color: '#fff', fontFamily: fontFamily.bold, fontSize: 14 },
  emptyHint: { fontSize: 14, color: colors.textLight, textAlign: 'center', paddingVertical: 16 },
})

function ProfileScreen({ navigation }) {
  const { user, updateUser, logout } = useAuth()
  const insets = useSafeAreaInsets()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', address: user?.address || '' })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    updateUser(form)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleLogout() {
    logout()
  }

  const MENU_ITEMS = [
    { icon: 'bell', label: 'Notificações', onPress: () => {} },
    { icon: 'lock', label: 'Privacidade e segurança', onPress: () => {} },
    { icon: 'file-text', label: 'Termos de uso', onPress: () => {} },
    { icon: 'help-circle', label: 'Ajuda e suporte', onPress: () => {} },
  ]

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={[pf.header, { paddingTop: insets.top + 16 }]}>
        <View style={pf.avatarCircle}>
          <Text style={pf.avatarText}>{user?.name?.charAt(0) || '?'}</Text>
        </View>
        <Text style={pf.userName}>{user?.name}</Text>
        <Text style={pf.userEmail}>{user?.email}</Text>
        <TouchableOpacity style={pf.editToggle} onPress={() => setEditing(e => !e)}>
          <Text style={pf.editToggleText}>{editing ? 'Cancelar' : 'Editar perfil'}</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback de salvo */}
      {saved && (
        <View style={pf.savedBanner}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Feather name='check-circle' size={16} color={colors.primary} /><Text style={pf.savedText}>Perfil atualizado com sucesso</Text></View>
        </View>
      )}

      {/* Formulário de edição */}
      {editing && (
        <View style={pf.section}>
          <Text style={pf.sectionTitle}>Editar informações</Text>
          {[
            { key: 'name', label: 'Nome completo', placeholder: 'Seu nome', capitalize: 'words' },
            { key: 'email', label: 'E-mail', placeholder: 'seu@email.com', keyboard: 'email-address' },
            { key: 'address', label: 'Endereço', placeholder: 'Sua cidade / bairro' },
          ].map(field => (
            <View key={field.key} style={pf.fieldWrap}>
              <Text style={pf.fieldLabel}>{field.label}</Text>
              <TextInput
                style={pf.input}
                placeholder={field.placeholder}
                placeholderTextColor={colors.textLight}
                value={form[field.key]}
                onChangeText={v => setForm(f => ({ ...f, [field.key]: v }))}
                keyboardType={field.keyboard || 'default'}
                autoCapitalize={field.capitalize || 'none'}
              />
            </View>
          ))}
          <TouchableOpacity style={pf.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={pf.saveBtnText}>Salvar alterações</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Informações atuais */}
      {!editing && (
        <View style={pf.section}>
          <Text style={pf.sectionTitle}>Informações</Text>
          {[
            { label: 'Nome', value: user?.name },
            { label: 'E-mail', value: user?.email },
            { label: 'Perfil', value: user?.role === 'profissional' ? 'Profissional' : 'Paciente' },
            { label: 'Endereço', value: user?.address || '—' },
          ].map(item => (
            <View key={item.label} style={pf.infoRow}>
              <Text style={pf.infoLabel}>{item.label}</Text>
              <Text style={pf.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Menu de ações */}
      <View style={pf.section}>
        <Text style={pf.sectionTitle}>Configurações</Text>
        {MENU_ITEMS.map(item => (
          <TouchableOpacity key={item.label} style={pf.menuRow} onPress={item.onPress} activeOpacity={0.7}>
            <Feather name={item.icon} size={18} color={colors.textSecondary} />
            <Text style={pf.menuLabel}>{item.label}</Text>
            <Text style={pf.menuChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sair */}
      <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity style={pf.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={pf.logoutBtnText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const pf = StyleSheet.create({
  header: { backgroundColor: colors.primaryLight, alignItems: 'center', padding: 24, paddingBottom: 28 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontFamily: fontFamily.bold, color: '#fff' },
  userName: { fontSize: 20, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 4 },
  userEmail: { fontSize: 14, color: colors.textSecondary, marginBottom: 14 },
  editToggle: { borderWidth: 1.5, borderColor: colors.primary, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 7 },
  editToggleText: { color: colors.primary, fontSize: 14, fontFamily: fontFamily.semibold },
  savedBanner: { backgroundColor: colors.primaryLight, padding: 12, alignItems: 'center' },
  savedText: { color: colors.primary, fontFamily: fontFamily.semibold, fontSize: 14 },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  sectionTitle: { fontSize: 15, fontFamily: fontFamily.bold, color: colors.text, marginBottom: 14 },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontFamily: fontFamily.semibold, color: colors.text, marginBottom: 6 },
  input: { height: 48, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, fontSize: 15, color: colors.text, backgroundColor: colors.bgLight },
  saveBtn: { height: 50, backgroundColor: colors.primary, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  saveBtnText: { color: '#fff', fontSize: 15, fontFamily: fontFamily.bold },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { fontSize: 14, color: colors.textSecondary, fontFamily: fontFamily.medium },
  infoValue: { fontSize: 14, color: colors.text, fontFamily: fontFamily.semibold, maxWidth: '60%', textAlign: 'right' },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12 },
  menuIcon: { fontSize: 20, width: 28 },
  menuLabel: { flex: 1, fontSize: 15, color: colors.text, fontFamily: fontFamily.medium },
  menuChevron: { fontSize: 20, color: colors.textLight },
  logoutBtn: { borderWidth: 1.5, borderColor: colors.danger, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  logoutBtnText: { color: colors.danger, fontFamily: fontFamily.bold, fontSize: 15 },
})

// ─── Stacks ───────────────────────────────────────────────────────────────────

function FichaStack({ isAuthenticated }) {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      {isAuthenticated
        ? <Stack.Screen name="Ficha" component={FichaScreen} options={{ title: 'Minha ficha' }} />
        : <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      }
    </Stack.Navigator>
  )
}

function ProfileStack({ isAuthenticated }) {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      {isAuthenticated
        ? <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Meu perfil' }} />
        : <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      }
    </Stack.Navigator>
  )
}

function TabNavigator() {
  const { isAuthenticated } = useAuth()
  return (
    <Tab.Navigator tabBar={props => <BottomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="SearchTab" component={SearchStack} options={{ tabBarLabel: 'Buscar' }} />
      <Tab.Screen name="FichaTab" options={{ tabBarLabel: isAuthenticated ? 'Minha ficha' : 'Cadastro' }}>
        {() => <FichaStack isAuthenticated={isAuthenticated} />}
      </Tab.Screen>
      <Tab.Screen name="ProfileTab" options={{ tabBarLabel: isAuthenticated ? 'Perfil' : 'Entrar' }}>
        {() => <ProfileStack isAuthenticated={isAuthenticated} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

export function RootNavigator() {
  const { loading } = useAuth()
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  )
}
