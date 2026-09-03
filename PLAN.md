# Portfolyo Yeniden Tasarım — Uygulama Planı

> Bu doküman Claude Code için yazılmıştır. Proje: **sametkaradag.com** (Next.js + Tailwind CSS v4, tek sayfa).
> Hedef: tek sayfa üzerinde **7 farklı tasarım teması**, **sol sticky navbar**, **üstte tema şeridi**, **TR/EN iki dil**, CV'den beslenen içerik katmanı.

---

## 0. Bu planın kuralları

1. **Tahmin etme, sor.** `[SOR]` etiketli her madde, kod yazmadan önce Samet'e sorulacak açık karardır. Planda yer almayan bir ihtiyaç çıkarsa da uygulamadan önce sor.
2. **Faz sırası bağlayıcıdır.** Faz 0 tamamlanıp raporlanmadan Faz 1'e geçme.
3. **Kararlar kesindir.** Bölüm 2'deki tablo tartışmaya kapalıdır; teknik olarak imkânsız bir şey çıkarsa uygulamayı durdur, sebebini ve seçenekleri anlat, cevabı bekle.
4. **Her fazın sonunda** `npm run build` ve `npm run lint` çalıştır; ikisi de temiz geçmeden fazı kapatma.
5. Yorum ve commit mesajları İngilizce; Samet'e verilen açıklamalar Türkçe.

---

## 1. Girdi dosyaları (Samet tarafından sağlanacak)

| Yol | İçerik | Durum |
|---|---|---|
| `src/themes/_source/<slug>/design.dc.html` | Claude Design canvas kaynağı — `<x-dc>`, `<sc-for>`, `{{ }}` bağlamaları, sonda `DCLogic` sınıfı. Yapıyı buradan oku | ✅ Faz 1'de yerleştirildi |
| `src/themes/_source/<slug>/design.standalone.html` | Aynı tasarım, runtime gömülü — tarayıcıda açılır | ✅ |
| `public/cv/samet-karadag.pdf` | CV (İngilizce, güncel) | ✅ |
| `src/data/portfolio-context.json` | Tüm içerik, TR + EN. Chatbot da bunu okur | ✅ Faz 1'de genişletildi |

> Tasarımların tüm stilleri **inline** yazılmış; ayrı CSS ve token yok. Her temanın token seti `theme.css` içinde sıfırdan çıkarılacak.

---

## 2. Kesinleşmiş kararlar

| Konu | Karar |
|---|---|
| Tema sayısı | 7 |
| Temalar | `minimal` (varsayılan), `space` (mevcut 3D tasarım), `editorial`, `blueprint`, `brutalism`, `maximalism`, `y2k` |
| Tasarım eşlemesi | `maximalism` = Terminal tasarımı · `y2k` = Retro tasarımı · `brutalism` = Brutalist · `minimal` = numarasız Portfolio dosyası |
| Tema kapsamı | Her tema **kendi düzenini** getirir (sadece renk/font değil) |
| Tema mimarisi | **Tema başına ayrı bileşen seti**, ortak içerik katmanından beslenir |
| Kabuk (shell) | **Sabit**: üst tema şeridi + sol navbar her temada aynı konumda; sadece stilleri değişir |
| Varsayılan tema | **`minimal`** — ilk yükleme en hafif tema ile olsun diye. Rastgelelik yok |
| Tema URL'de | **Evet.** `/tr` = varsayılan · `/tr/y2k` = y2k. 14 sayfa statik üretilir, flash yok, tema linki paylaşılabilir |
| Tema hafızası | `localStorage` yalnızca *hatırlar*: çıplak `/tr`'ye gelen ziyaretçi, boyamadan önce çalışan blocking script ile son seçtiği temaya yönlendirilir |
| Bölümler | Hero → About → Skills → Experience → Projects → Contact |
| Algorithms bölümü | **Tamamen kaldırılacak** (bölüm + navbar linki + ilgili kod/asset) |
| Sol navbar | Sticky, sol tarafta; scroll-spy ile aktif bölüm vurgulanır |
| Aktif vurgu biçimi | **Her tema kendi vurgusunu tanımlar** (biri font büyütür, biri kutu çizer, biri parlatır) |
| Mobil — sol navbar | **Gizli** |
| Mobil — tema şeridi | **Altta sabit şerit** |
| Dil | İki dilli TR/EN, **URL bazlı** (`/tr`, `/en`) + **next-intl**. Varsayılan dil **TR**; `/` → `/tr` |
| İçerik kaynağı | `portfolio-context.json` genişletildi; kaynak = CV + tasarımların TR/EN `COPY` blokları. Chatbot aynı dosyayı okumaya devam eder |
| CV | Tek İngilizce PDF: `public/cv/samet-karadag.pdf` (kökteki güncel dosya). İki dilde de aynı dosya iner |
| CV → içerik | Claude Code PDF'i okur, TR + EN alanlarını doldurur, Samet kontrol eder |
| Animasyon | **Minimum** — smooth scroll + aktif bölüm vurgusu; başka animasyon yok |
| Chatbot | **Kalır, animasyonu kaldırıldı** (sade ikon/panel). 3D robot launcher kaldırıldı. Prompt'a yalnızca aktif dilin içeriği girer, o dilde cevaplar |
| Contact | Mevcut hali korunur (mailto + LinkedIn/GitHub + CV linki), sadece stillenir. **Tasarımlardaki iletişim formu kullanılmayacak** |
| "Hire Me" | **Kaldırıldı** — Contact ile aynı işlev |
| Canonical alan adı | `https://sametkaradag.com` |
| `space` teması | 3D hero sahnesi + ses butonu **kalır** (yalnız bu temaya özel, `next/dynamic`). GSAP scroll ve framer-motion mikro-animasyonları çıkar |
| Tasarım vs plan | **PLAN > tasarımlar.** Renk/boyut/font tasarımda değiştirilebilir; sol sidebar, üst tema şeridi ve bölüm sıralaması 7 temada da aynı |
| Doğrulama | `npm run build` + `npm run lint`; görsel kontrolü Samet tarayıcıda yapar |
| Git | Tek feature branch: `feat/multi-theme-portfolio` |
| Çalışma sırası | Altyapı → pilot tema → kalan temalar |

---

## 3. Bilgi mimarisi

Tek sayfa, yukarıdan aşağıya sabit sıra:

| # | Bölüm | `id` | Navbar etiketi (TR / EN) |
|---|---|---|---|
| 1 | Hero | `#hero` | — (navbarda görünmez) |
| 2 | About | `#about` | Hakkımda / About |
| 3 | Skills | `#skills` | Yetenekler / Skills |
| 4 | Experience | `#experience` | Deneyim / Experience |
| 5 | Projects | `#projects` | Projeler / Projects |
| 6 | Contact | `#contact` | İletişim / Contact |

**"Hire Me" kaldırıldı** — Contact bölümüyle aynı işlevi görüyordu.

---

## 4. Dosya yapısı (Faz 1'de kuruldu)

```
app/
  layout.tsx                       # pass-through kök layout
  not-found.tsx                    # kendi <html>'ini render eder
  [locale]/[[...theme]]/
    layout.tsx                     # <html lang data-theme> + kabuk + metadata
    page.tsx                       # bölümleri render eder
  globals.css                      # Tailwind v4 girişi + ORTAK TOKEN SÖZLEŞMESİ
  api/chat/route.ts                # edge, dile göre düzleştirilmiş içerik

proxy.ts                           # next-intl locale yönlendirmesi (Next 16: middleware yerine proxy)

src/
  i18n/{routing,request}.ts
  messages/{tr,en}.json            # SADECE arayüz metinleri
  lib/
    types.ts                       # ThemeDefinition, SectionProps, PortfolioContent
    content.ts                     # tip güvenli erişim + flattenForLocale()
    useScrollSpy.ts                # IntersectionObserver, rootMargin -45%
    useTheme.ts                    # localStorage hatırlama
    themeScript.ts                 # blocking <head> scripti (sunucu tarafı, client değil)
  components/shell/
    ThemeBar.tsx  SideNav.tsx  LocaleSwitch.tsx  ChatWidget.tsx
  themes/
    registry.ts                    # slug'lar, sıra, varsayılan, lazy loader'lar
    _source/<slug>/                # ham tasarımlar (referans, build'e girmez)
    <slug>/                        # theme.css, index.ts, sections/*, shell/NavItem.tsx
  data/portfolio-context.json      # tüm içerik, TR + EN
public/cv/samet-karadag.pdf
```

> Kök seviyede değil, **her şey `src/` altında** (Faz 0 sonrası karar). `_source/` yalnızca `.html` içerdiği için derlemeye girmez.

---

## 5. Sözleşmeler (önce bunları yaz)

`lib/types.ts`:

```ts
export type Locale = 'tr' | 'en';

export type ThemeSlug =
  | 'space' | 'minimal' | 'brutalism' | 'maximalism'
  | 'y2k' | 'editorial' | 'blueprint';

export type SectionId =
  'hero' | 'about' | 'skills' | 'experience' | 'projects' | 'contact';

/** Her bölüm bileşeni SADECE bunu alır. Tema, veriyi değiştiremez; yalnızca sunar. */
export interface SectionProps {
  content: PortfolioContent;
  locale: Locale;
}

export interface NavItemProps {
  id: SectionId;
  label: string;
  isActive: boolean;
  onSelect: (id: SectionId) => void;
}

export interface ThemeDefinition {
  slug: ThemeSlug;
  label: Record<Locale, string>;
  /** themes/<slug>/theme.css içinde [data-theme="<slug>"] altında tanımlı */
  sections: Record<SectionId, React.ComponentType<SectionProps>>;
  shell: {
    /** Aktif bölüm vurgusu temaya aittir: büyüme, kutu, çizgi, parlama... */
    NavItem: React.ComponentType<NavItemProps>;
    ThemeBarItem?: React.ComponentType<{ slug: ThemeSlug; isActive: boolean }>;
  };
}
```

`themes/registry.ts`:

```ts
export const THEME_ORDER: ThemeSlug[] = [
  'space', 'minimal', 'brutalism', 'maximalism', 'y2k', 'editorial', 'blueprint',
];
export const DEFAULT_THEME: ThemeSlug = 'space';
export const THEMES: Record<ThemeSlug, () => Promise<ThemeDefinition>>; // dynamic import
```

**Kurallar:**
- Bölüm bileşenleri içerik üretmez, `portfolio-context.json`'dan gelen veriyi sunar. Metin sabit kodlanmaz.
- Kabuk bileşenleri (`ThemeBar`, `SideNav`, `ChatWidget`) **tema klasörlerinde tekrarlanmaz**; sadece stilleri `[data-theme="..."]` altından gelir, aktif-nav vurgusu ise temanın `NavItem` bileşeniyle sağlanır.
- Her tema `next/dynamic` ile lazy yüklenir; ziyaretçi yalnızca aktif temanın bileşenlerini indirir.

---

## 6. İçerik katmanı

Tüm içerik `portfolio-context.json` içinde, her metin alanı `{ "tr": "...", "en": "..." }` biçiminde.

Önerilen şema (Faz 0'da mevcut dosya okunduktan sonra kesinleşir):

```jsonc
{
  "meta": {
    "name": "Samet Karadağ",
    "role": { "tr": "...", "en": "..." },
    "email": "...", "location": { "tr": "...", "en": "..." },
    "links": { "github": "...", "linkedin": "..." },
    "cv": { "tr": "/cv/samet-karadag-tr.pdf", "en": "/cv/samet-karadag-en.pdf" }
  },
  "hero":       { "headline": {}, "subline": {}, "ctas": [] },
  "about":      { "paragraphs": { "tr": [], "en": [] } },
  "skills":     [ { "group": {}, "items": [] } ],
  "experience": [ { "company": "", "role": {}, "start": "", "end": "",
                    "bullets": { "tr": [], "en": [] }, "stack": [] } ],
  "projects":   [ { "name": "", "summary": {}, "stack": [],
                    "links": {}, "metrics": [] } ],
  "contact":    { "headline": {}, "note": {} }
}
```

**Çözüldü (Faz 1):** `src/lib/content.ts` içindeki `flattenForLocale(locale)` iki dilli alanları tek dile indiriyor; `/api/chat` yalnızca ziyaretçinin dilini prompt'a koyuyor. Chatbot'un şemaya tek sıkı bağı olan `personal.email` alanı `meta.email` olarak güncellendi.

**Çözüldü:** Tek İngilizce PDF (`public/cv/samet-karadag.pdf`), iki dilde de aynı dosya iner.

**CV → JSON akışı:** Claude Code PDF'i okur → deneyim, eğitim, yetenek, proje verilerini çıkarır → TR ve EN alanlarını doldurur → **ham çıkarımı Samet'e gösterir ve onay alır** → JSON'a yazar. Doğrulanmamış hiçbir veri siteye girmez.

---

## 7. i18n (next-intl, URL bazlı)

- `proxy.ts`: next-intl middleware, `locales: ['tr','en']`, `defaultLocale: 'tr'`, `localePrefix: 'always'`.
- Rotalar: `/tr`, `/en`. Kök `/` → varsayılan dile yönlendirilir.
- `messages/tr.json` + `messages/en.json`: **yalnızca arayüz metinleri** (nav etiketleri, "CV indir", aria-label'lar). İçerik metinleri JSON'dan gelir — iki kaynağı karıştırma.
- `generateMetadata` ile dile göre `title`/`description`; `alternates.languages` ile `hreflang` (tr, en, x-default).
- `sitemap.ts` her iki dili de içerir. `lang` niteliği `<html lang="tr|en">` doğru set edilir.
- Dil değişince: aynı bölümde kalınır (hash korunur), tema seçimi korunur.

---

## 8. Navigasyon davranışı

**Sol navbar (`SideNav`)**
- `position: sticky`, viewport yüksekliğinde, dikey liste.
- Tıklama → ilgili bölüme yumuşak kaydırma (`scrollIntoView({ behavior: 'smooth', block: 'start' })`), `prefers-reduced-motion: reduce` ise anlık atlama.
- Scroll-spy: `IntersectionObserver`, `rootMargin: '-45% 0px -45% 0px'` — viewport ortasına en yakın bölüm aktif sayılır. Sayfa sonunda son bölüm aktif kalır.
- Aktif öğe görünümü **temanın `NavItem` bileşenine** aittir (biri fontu büyütür, biri kutuya alır, biri renk değiştirir). Boyut değişen temalarda navbar genişliği sabit kalmalı — layout kaymayacak (genişliği en büyük aktif hale göre rezerve et).
- Erişilebilirlik: `<nav aria-label>`, aktif öğede `aria-current="true"`, klavye ile gezinilebilir, görünür focus halkası.
- URL hash'i scroll sırasında **güncellenmez** (geri tuşu geçmişi kirlenmesin); yalnızca tıklamada güncellenir.

**Mobil (< `md`)**
- Sol navbar tamamen gizlenir (`display: none`), DOM'dan da çıkarılabilir.
- Tema şeridi ekranın **altına** sabitlenir, yatay kaydırılabilir, güvenli alan (`env(safe-area-inset-bottom)`) hesaba katılır.

---

## 9. Tema motoru

- `<html data-theme="space" lang="tr">` sunucuda varsayılanla render edilir.
- `app/layout.tsx` `<head>`'ine **blocking inline script**: `localStorage.theme` geçerli bir slug ise `data-theme`'i ilk boyamadan önce yazar → renk/arka plan flash'ı olmaz.
- İstemcide `ThemeProvider` seçili temayı okur; varsayılandan farklıysa o temanın bileşen setini `next/dynamic` ile yükleyip render eder.
- **Çözüldü:** Tema URL'nin parçası. 7 tema × 2 dil = 14 sayfa statik üretiliyor, `data-theme` sunucudan geliyor, flash yok. Çıplak `/tr`'de blocking script son seçilen temaya yönlendiriyor.
- Tema değişince **scroll pozisyonu korunur** (aynı bölümde kalınır).
- Tema şeridi: 7 tema adı yatay dizilir, aktif olan işaretlenir. Tema URL'de olduğu için öğeler `<button>` değil **`<Link>`** ve aktif olan `aria-current="true"` taşır (`aria-pressed` yalnızca butonlar içindir).
- CSS: her tema `themes/<slug>/theme.css` içinde `[data-theme="<slug>"] { --… }` altında kendi token'larını tanımlar. Ortak token isimleri `globals.css`'te belgelenir; her tema **aynı token setini** doldurmak zorundadır (eksik token = build uyarısı).

---

## 10. Chatbot

- Kalır, **animasyonu tamamen kaldırılır**: sade bir launcher ikonu + panel.
- API rotası, prompt akışı ve `portfolio-context.json` bağlantısı **değişmez** (şema değişimi Faz 0'da doğrulanır).
- Panel ve launcher, kabuk bileşeni olarak tek yerde durur; görünümü `[data-theme]` altından stillenir.
- Mobilde panel **alttaki tema şeridinin üstünde kart** olarak duruyor (tam ekran değil) — tema şeridi sohbet açıkken de erişilebilir kalsın diye. Değiştirmek kolay: `globals.css` içindeki `.chat-panel` mobil kuralı.

---

## 11. Kaldırılacaklar

- `Algorithms` bölümü: bileşen(ler)i, navbar linki, varsa route/asset/veri dosyaları, kullanılmayan bağımlılıklar.
- Chatbot animasyon kodu ve varsa animasyon kütüphanesi bağımlılığı (başka yerde kullanılmıyorsa `package.json`'dan da çıkar).
- Faz 4'te `depcheck` benzeri bir kontrolle artık kullanılmayan paketleri raporla.

---

## 12. Yol haritası

### ✅ Faz 0 — Keşif — TAMAMLANDI (2026-09-01)

Çıktı: Samet'e sunulacak kısa bir rapor.

1. Repo yapısı, Next.js sürümü ve router tipi (App/Pages), Tailwind v4 kurulumu.
2. Mevcut bölüm bileşenleri ve dosya yolları.
3. `portfolio-context.json` mevcut şeması + chatbot'un onu okuma biçimi.
4. Chatbot implementasyonu: API rotası, animasyon kodunun yeri.
5. `Algorithms` bölümünün tüm bağımlılıkları.
6. Mevcut i18n var mı, yok mu.
7. `/themes` klasöründeki tasarımların gerçek yapısı (Samet ekledikten sonra).

**Sonuç:** Rapor sunuldu, tüm `[SOR]` maddeleri cevaplandı, kararlar bölüm 2'ye işlendi.

### ✅ Faz 1 — Altyapı — TAMAMLANDI (2026-09-01)

1. Branch: `feat/multi-theme-portfolio`.
2. `lib/types.ts` sözleşmeleri + `themes/registry.ts` iskeleti.
3. next-intl kurulumu, `app/[locale]/` yapısına geçiş, `middleware.ts`, `messages/*.json`.
4. `portfolio-context.json` yeni şemaya genişletilir; CV'den çıkarılan veriler **onaylandıktan sonra** yazılır; chatbot uyumu doğrulanır.
5. Kabuk: `ThemeBar`, `SideNav` (scroll-spy dahil), `LocaleSwitch`, animasyonsuz `ChatWidget`.
6. Tema motoru: `ThemeProvider`, blocking script, `localStorage`, dynamic import.
7. `Algorithms` bölümü kaldırılır.

**Kabul kriterleri — durum:** `/tr`, `/en`, `/tr/<tema>` çalışıyor (14 statik sayfa) · sol navbar scroll-spy ile işaretliyor · tema şeridi 7 temayı listeliyor (hiçbiri henüz dolu değil, mevcut bölümler geçici olarak render ediliyor) · mobilde navbar gizli, tema şeridi altta · `build` + `lint` **temiz** (13 eski lint hatası da giderildi).

**Faz 1'de ayrıca:** `Algorithms` kaldırıldı · `Navbar`, 3D robot chatbot (`RobotChatbot`/`RobotMiniScene`/`Robot`) ve `ScrollToTop` silindi · `Experience` bölümü CV'den yazıldı · CV `public/cv/` altına taşındı · canonical + `hreflang` + OG kuruldu.

### ✅ Faz 2 — Pilot tema: `minimal` — TAMAMLANDI (2026-09-03)

Pilot tema `space` yerine **`minimal`** oldu: varsayılan tema o, ve sol sidebar'ı zaten olan tek tasarım o. `space` Faz 3'e alındı.

1. `src/themes/minimal/` kuruldu: `theme.css` (tam token seti), `sections/*` (6 bölüm), `shell/NavItem.tsx`, `index.ts`.
2. Tüm metin ve veri `portfolio-context.json`'dan geliyor; bölümlerde tek satır sabit metin yok.
3. `registry.ts` → `THEME_LOADERS.minimal` + `loadTheme()`. Sayfa `SECTION_IDS` üzerinden render ediyor, yani bir tema bölüm atlayamaz veya sırasını değiştiremez.
4. Kabuk temanın `NavItem`'ını prop olarak alıyor; aktif vurgu temaya ait. Sidebar'a kimlik bloğu (ad / rol / konum) ve müsaitlik satırı eklendi.
5. Henüz yazılmamış temalar (`/tr/y2k` vb.) varsayılan temanın bileşenleriyle ve **onun token'larıyla** render ediliyor; tema şeridinde "henüz hazır değil" olarak işaretleniyorlar.

**Kabul kriterleri — durum:** İki dilde de altı bölüm doğru sırada ve JSON'dan besleniyor · scroll-spy çalışıyor · `build` + `lint` temiz. **Görsel doğrulama Samet'te.**

### Faz 3 — Kalan 6 tema

Her tema için aynı döngü (sırayla, teker teker):

1. `themes/_source/<slug>/` içindeki HTML/CSS okunur.
2. Bileşenlere bölünür: `sections/{Hero,About,Skills,Experience,Projects,Contact}.tsx`.
3. Tüm metin/veri JSON'dan bağlanır — tasarımdaki örnek metinler kalmayacak.
4. `theme.css` token'ları + `NavItem` aktif vurgusu yazılır.
5. `registry.ts`'e kaydedilir.
6. İki dilde ve mobilde kontrol edilir; `build` + `lint`.

Durum: ✅ `blueprint` · ✅ `editorial` · ✅ `brutalism` · ✅ `y2k` · ✅ `maximalism` · ⏭ **`space`** (kalan tek tema).

`space` en sona bırakıldı: mevcut 3D siteyi yeni sözleşmeye taşımak (bölümleri `SectionProps`'a uydurmak, 3D hero'yu ve ses düğmesini korurken GSAP/framer-motion'ı çıkarmak) diğerlerinden farklı bir iş. Mevcut bileşenler o güne kadar `src/components/sections/` altında duruyor — **artık hiçbir yerden çağrılmıyorlar**, yalnızca `space` için referans.

**Her temada geçerli kurallar:** kabuk yapısı değişmez; ortak token setinin tamamı doldurulur; animasyon minimumda kalır; metin/arka plan kontrastı okunabilir olmalı — `y2k`, `brutalism`, `maximalism` temalarında bu risk yüksek, kontrastı düşük kalan yerleri Samet'e bildir.

### Faz 4 — Temizlik ve teslim

1. Kullanılmayan kod, asset ve bağımlılıkların temizliği.
2. Metadata, `hreflang`, `sitemap`, `robots` kontrolü.
3. CV indirme bağlantıları iki dilde doğru dosyayı gösteriyor mu.
4. `npm run build` + `npm run lint` son kez.
5. Samet için kontrol listesi: 7 tema × 2 dil × (masaüstü + mobil) — tarayıcıda gözden geçirilecek kombinasyonlar.

---

## 13. Genel kabul kriterleri

- Tek sayfa, bölüm sırası: Hero → About → Skills → Experience → Projects → Contact.
- 7 tema seçilebiliyor; seçim `localStorage`'da kalıcı; varsayılan `space`.
- Tema değişince kabuk yerinde kalıyor, scroll pozisyonu korunuyor.
- Sol navbar: sticky, scroll-spy doğru çalışıyor, aktif vurgu temaya özgü, layout kaymıyor, klavyeyle gezilebiliyor.
- Mobilde: sol navbar gizli, tema şeridi altta sabit.
- `/tr` ve `/en` ayrı URL'lerde; içerik ve metadata dile göre doğru.
- Tüm içerik `portfolio-context.json`'dan geliyor; hiçbir bölümde sabit kodlanmış metin yok.
- Chatbot çalışıyor, animasyonsuz, her temada stillenmiş.
- `Algorithms` bölümünden hiçbir iz kalmamış.
- `prefers-reduced-motion` destekleniyor; smooth scroll dışında animasyon yok.
- `npm run build` ve `npm run lint` temiz.

---

## 14. Açık sorular — CEVAPLANDI (2026-09-01)

| # | Soru | Cevap |
|---|---|---|
| 1 | `/themes` isimlendirme sözleşmesi | `src/themes/_source/<slug>/design.dc.html` + `design.standalone.html`. Eşleme: Terminal→`maximalism`, Retro→`y2k`, Brutalist→`brutalism`, numarasız Portfolio→`minimal` |
| 2 | "Hire Me" kalacak mı | **Hayır**, kaldırıldı — Contact ile aynı işlev |
| 3 | Şema değişikliği chatbot'u bozar mı | Hayır. `flattenForLocale()` yazıldı; prompt'a yalnızca aktif dil giriyor |
| 4 | CV tek PDF mi | **Tek İngilizce PDF**, iki dilde de aynı dosya |
| 5 | Varsayılan dil | **TR** |
| 6 | Tema URL'de mi | **Evet** |
| 7 | Chatbot mobilde | Tema şeridinin üstünde **kart** |
| 8 | Tema başına asset mi | Konu dışı kaldı: 6 tasarımın hiçbiri görsel asset kullanmıyor (inline SVG + tipografi). 3D/ses varlıkları yalnızca `space` temasına ait ve R2'den geliyor |
| 9 | Deploy | Vercel. Production domain'ler: `sametkaradag.com`, `www.sametkaradag.com`, `portfolio-nine-black-h49mev772x.vercel.app`. **Canonical: `https://sametkaradag.com`** |
| 10 | WCAG AA | Faz 3'te her tema için kontrast kontrol edilecek; AA altında kalan yerler **Samet'e bildirilecek**, tasarım sessizce değiştirilmeyecek |

### Faz 2 öncesi cevaplanacak

1. **Pilot tema hangisi olsun?** PLAN başta `space` diyordu; ama varsayılan tema artık `minimal` ve sol sidebar'ı hazır olan tek tasarım da o. **Önerim: Faz 2 = `minimal`**, `space` Faz 3'e kayar — böylece `/tr` fazın sonunda gerçek içerikle açılır.
2. **İçerik onayı** (bölüm 6'daki akış): `portfolio-context.json` dolduruldu, Samet'in doğrulaması bekleniyor — özellikle Nax Software metni (CV'de yok, Claude Code yazdı) ve `dekodemyapi.com` URL yazımı.

---

## 15. Claude Code'a verilecek ilk komut

```
Bu repoda PLAN.md dosyasını oku ve Faz 0'ı uygula.

Kod yazma. Sadece keşif yap ve PLAN.md bölüm 12'deki Faz 0 listesindeki
7 maddeyi raporla. Raporun sonunda, PLAN.md bölüm 14'teki açık sorulardan
hangilerinin cevabına ihtiyacın olduğunu maddeler halinde sor.

Kural: hiçbir şeyi varsayma. Emin olmadığın her noktada sor.
```
