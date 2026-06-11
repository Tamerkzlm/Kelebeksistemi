# Kelebek Sistemi — Tasarım Dokümanı

> **Sürüm:** 2.4  
> **Yapımcı:** Tamer Közleme  
> **Son güncelleme:** Haziran 2026

---

## 1. Amaç

Kelebek Sistemi, Türkiye'deki okullarda yapılan sınavlarda öğrencilerin **salonlara otomatik yerleştirilmesini** sağlayan yerel (offline) bir masaüstü uygulamasıdır.

Temel hedefler:

- e-Okul Excel listelerinden öğrenci aktarımı
- Sınav salonlarının tanımlanması (satır/sütun kapasitesi)
- **Kelebek kuralına** uygun oturma planı üretimi (aynı sınıf düzeyindeki öğrenciler yan yana ve çapraz komşu olmasın)
- Salon listesi (imza sirküsü) ve şube listesi yazdırma/PDF çıktısı

---

## 2. Mimari Genel Bakış

```
┌─────────────────────────────────────────────────────────┐
│                    Electron Shell                        │
│  electron-main.mjs  →  BrowserWindow  →  React UI       │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                      KelebekApp                          │
│  5 adımlı sihirbaz (Step1 → Step5)                       │
└───────┬───────────────────────────────┬─────────────────┘
        │                               │
┌───────▼────────┐              ┌───────▼────────┐
│  localStorage  │              │   algorithm.js  │
│   (store.js)   │              │  (kelebek algo) │
└────────────────┘              └────────────────┘
        │
┌───────▼────────┐
│  printBuilder  │  →  window.open() + window.print()
│  (HTML çıktı)  │
└────────────────┘
```

Uygulama **istemci taraflı (client-side)** çalışır. Sunucu, veritabanı veya internet bağlantısı zorunlu değildir (çekirdek akış için).

---

## 3. Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| UI | React 18, JSX |
| Stil | Tailwind CSS, Radix UI, Lucide ikonlar |
| Build | Vite 6 |
| Masaüstü | Electron 42 + electron-builder |
| Veri | `localStorage` |
| Excel | `xlsx` (SheetJS) |
| Algoritma | Saf JavaScript (`src/lib/algorithm.js`) |

---

## 4. Kullanıcı Akışı (5 Adım)

| Adım | Bileşen | Açıklama |
|------|---------|----------|
| 1 | `Step1ExamInfo` | Okul adı, ders, tarih, saat, sınav türü |
| 2 | `Step2Students` | Öğrenci listesi: Excel import, manuel ekleme, muaf işaretleme |
| 3 | `Step3Rooms` | Salon tanımlama: ad, satır sayısı, sütun (bank) sayısı |
| 4 | `Step4Options` | Sınava girecek sınıf düzeylerini seçme (9/10/11/12) |
| 5 | `Step5Plan` | Oturma planı görüntüleme, düzenleme, yazdırma |

Ana orkestrasyon `src/pages/KelebekApp.jsx` içindedir. Her adım bağımsız bir React bileşenidir; state üst bileşende tutulur ve `store.js` ile `localStorage`'a senkronize edilir.

---

## 5. Veri Modelleri

### 5.1 Sınav Bilgisi (`examInfo`)

```js
{
  okulAdi: string,      // "Hz. Ayşe Kız AİHL"
  sinavDersi: string,   // "Tarih"
  sinavTarihi: string,   // "09.06.2024"
  sinavSaati: string,    // "6. Ders"
  sinavTuru: string      // "Yazılı Sınav"
}
```

### 5.2 Öğrenci (`student`)

```js
{
  no: string,           // Okul numarası
  adSoyad: string,      // "Hatice Yılmaz"
  sinif: string,        // "9A" (şube)
  grade: string,        // "9" | "10" | "11" | "12"
  isExempt: boolean     // Muaf mı?
}
```

### 5.3 Salon (`room`)

```js
{
  id: string,
  name: string,         // "9C"
  rows: number,         // Sıra sayısı (ör. 5)
  cols: number          // Bank/sütun sayısı (ör. 3)
}
```

**Kapasite formülü:** `rows × cols × 2` (her bankta 2 koltuk: sol + sağ)

### 5.4 Oturma Planı (`plan`)

```js
{
  assignments: [
    {
      room: Room,
      grid: Student[][],   // [satır][koltuk] — cols*2 genişliğinde dizi
      violations: [{ row, col }]  // Kural ihlali olan banklar
    }
  ],
  violations: number,      // Toplam ihlal sayısı
  timestamp: string,
  activeGrades: string[]
}
```

### 5.5 localStorage Anahtarları

| Anahtar | İçerik |
|---------|--------|
| `kelebek_exam_info` | Sınav bilgileri |
| `kelebek_students` | Öğrenci listesi |
| `kelebek_rooms` | Salon listesi |
| `kelebek_plan` | Son üretilen plan |
| `kelebek_active_grades` | Aktif sınıf düzeyleri |

---

## 6. Kelebek Algoritması

Dosya: `src/lib/algorithm.js`

Algoritma iki aşamadan oluşur:

### Aşama 1 — Tabakalı Oransal Dağıtım (`layeredDistribution`)

1. Öğrenciler sınıf düzeyine göre gruplandırılır (9, 10, 11, 12).
2. Her grup Fisher-Yates ile karıştırılır.
3. Salon kapasitelerine göre hedef öğrenci sayısı hesaplanır.
4. Her salona, sınıf düzeyi oranları korunarak öğrenci atanır.
5. Yuvarlama artıkları en büyük kapasiteli salonlara dağıtılır.

**Amaç:** Salonlar arasında dengeli dağılım; hiçbir salon aşırı dolu/boş kalmaz.

### Aşama 2 — Kova Oturma (`bucketSeating`)

Salon içinde koltuklar satır satır, bank bank doldurulur.

**Kısıtlar (öncelik sırasıyla):**

1. **Bank kuralı:** Aynı banktaki sol ve sağ koltukta aynı sınıf düzeyi olmasın.
2. **Çapraz komşu kuralı:** Üst sıradaki çapraz komşu koltuklarda aynı sınıf düzeyi olmasın.

Koltuk etiketleme: `getSeatLabel(col, row, seatInBank)` → `A1`, `B1`, `C1`...

```
Satır 1:  [A1][B1] | [C1][D1] | [E1][F1]
Satır 2:  [A2][B2] | [C2][D2] | [E2][F2]
          ── Bank ──   ── Bank ──   ── Bank ──
```

Kural ihlali zorunlu durumlarda (yeterli sınıf düzeyi yoksa) toleranslı mod devreye girer; ihlaller `violations` dizisine kaydedilir ve UI'da uyarı olarak gösterilir.

---

## 7. Excel Import

Dosya: `src/lib/parser.js`

- e-Okul XLS/XLSX formatı heuristik olarak parse edilir.
- Başlık satırı otomatik tespit edilir (`no`, `ad`, `soyad`, `sınıf` anahtar kelimeleri).
- Sınıf adı normalize edilir: `"9/A"` → `"9A"`.
- Sınıf düzeyi sınıf adının başındaki rakamdan çıkarılır.

---

## 8. Yazdırma / PDF Çıktısı

Dosya: `src/steps/Step5Plan/printBuilder.js`

Gerçek PDF kütüphanesi kullanılmaz. HTML string üretilir ve `window.open()` + `window.print()` ile tarayıcı yazdırma penceresi açılır (kullanıcı "PDF olarak kaydet" seçebilir).

### 8.1 Salon Listesi (`buildRoomListHTML`)

Salon başına bir sayfa:

- Sınav bilgisi başlığı
- Öğrenci tablosu (Koltuk, Ad Soyad, Sınıf, **İmza** sütunu)
- **Sınıf düzeyi özeti** (9. Sınıf: X, 10. Sınıf: Y… + şube dağılımı)
- Görsel oturma planı krokisi (TAHTA / CAM etiketli)
- Sınıf düzeyi renk kodları

### 8.2 Şube Listesi (`buildClassListHTML`)

Şube başına bir sayfa:

- No, Ad Soyad, Salon, Koltuk bilgileri
- Öğrencilere sınav öncesi dağıtılacak liste

---

## 9. UI Tasarım Kararları

- **Renk kodları:** Her sınıf düzeyi farklı renk (9=mavi, 10=yeşil, 11=turuncu, 12=mor).
- **Kapasite çubuğu:** `CapacityBar` bileşeni üstte sabit; öğrenci/kapasite oranını anlık gösterir.
- **Adım göstergesi:** `StepIndicator` ile 5 adımlı sihirbaz navigasyonu.
- **Manuel düzenleme:** Step 5'te sürükle-bırak ile öğrenci koltuk değişimi (`handleSwap`).
- **Font:** Sistem fontları (offline uyumluluk); Google Fonts CDN kullanılmaz.

---

## 10. Electron Masaüstü Katmanı

| Dosya | Rol |
|-------|-----|
| `electron-main.mjs` | Ana süreç: pencere oluşturma, menü, dev/prod URL yükleme |
| `electron-preload.cjs` | Preload script (contextBridge ile güvenli API) |
| `package.json` → `build` | electron-builder: Windows NSIS + portable `.exe` |

**Geliştirme:** `npm run electron-dev` → Vite (5173) + Electron  
**Production:** `npm run electron-build` → `dist/` içinde `.exe`

> **Not:** Cursor/VS Code gibi Electron tabanlı IDE'lerden çalıştırırken `ELECTRON_RUN_AS_NODE` ortam değişkeni sorun çıkarabilir. Script bu değişkeni devre dışı bırakır.

---

## 11. Çevrimdışı (Offline) Tasarım

| Bileşen | Durum |
|---------|-------|
| Sınav bilgisi, öğrenci, salon, plan | ✅ Tamamen yerel (`localStorage`) |
| Oturma algoritması | ✅ İstemci tarafı |
| Excel import | ✅ Yerel `xlsx` parse |
| Yazdırma/PDF | ✅ Tarayıcı yazdırma API |
| Fontlar | ✅ Sistem fontları |
| Auth / Base44 API | ❌ Kaldırıldı (offline uyumluluk) |
| Görüntüden öğrenci çıkarma (AI) | ⚠️ İnternet gerektirir (opsiyonel) |

---

## 12. Dosya Yapısı

```
Kelebek Sistemi-alpha/
├── design.md                  ← Bu dosya
├── SETUP_GUIDE.md             ← Kurulum rehberi
├── DISTRIBUTION_README.md     ← Dağıtım rehberi
├── electron-main.mjs          ← Electron ana süreç
├── electron-preload.cjs       ← Preload script
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx                ← React giriş noktası
    ├── main.jsx
    ├── index.css
    ├── pages/
    │   └── KelebekApp.jsx     ← Ana uygulama orkestratörü
    ├── steps/
    │   ├── Step1ExamInfo.jsx
    │   ├── Step2Students.jsx
    │   ├── Step3Rooms.jsx
    │   ├── Step4Options.jsx
    │   └── Step5Plan/
    │       ├── index.jsx      ← Plan görüntüleme + yazdırma
    │       ├── printBuilder.js ← HTML yazdırma üretici
    │       └── RoomGrid.jsx   ← Oturma planı grid UI
    ├── components/
    │   ├── CapacityBar.jsx
    │   └── StepIndicator.jsx
    └── lib/
        ├── algorithm.js       ← Kelebek algoritması
        ├── store.js           ← localStorage yardımcısı
        ├── parser.js          ← e-Okul Excel parser
        └── defaultStudents.js ← Varsayılan demo öğrenciler
```

---

## 13. Bilinen Sınırlamalar

- Windows `.exe` build'i yalnızca Windows ortamında alınabilir (Mac'te cross-compile desteklenmez).
- Algoritma %100 kural ihlali garantisi vermez; yetersiz sınıf düzeyi çeşitliliğinde ihlaller oluşabilir.
- Görüntüden öğrenci çıkarma (OCR/LLM) internet ve harici API gerektirir.
- `PrintRoomView.jsx` eski/kullanılmayan bileşen; aktif yazdırma `printBuilder.js` üzerinden yapılır.

---

## 14. Gelecek Geliştirme Fikirleri

- [ ] Mac/Linux installer desteği
- [ ] Plan dışa aktarma (JSON/Excel)
- [ ] Çoklu sınav oturumu yönetimi
- [ ] Gözetmen atama modülü
- [ ] jspdf ile doğrudan PDF üretimi (tarayıcı bağımsız)
