# Kelebek Sistemi - Dağıtım Adımları

## ✅ Hazırlanan Yapılandırma

### Dosyalar
- ✅ `electron-main.js` - Electron ana işlem (pencere yönetimi)
- ✅ `electron-preload.js` - Preload scripti (güvenlik)
- ✅ `package.json` - Build konfigürasyonu ve npm scripts
- ✅ `.env.local` - Üretim ortamı değişkenleri
- ✅ `vite.config.js` - Production yapı

### npm Scripts

```bash
# Geliştirme (Electron + Vite dev server)
npm run electron-dev

# Production build (NSIS Installer + Portable)
npm run electron-build

# Sadece Portable exe
npm run electron-build-portable
```

## 📦 Electron Builder Config

Otomatik olarak oluşturulacak dosyalar (`dist` klasörü):
- `Kelebek-Sistemi-Setup-2.4.0.exe` - NSIS Installer (kurulabilir)
- `Kelebek-Sistemi-2.4.0.exe` - Portable executable (doğrudan çalışır)

## 🚀 Dağıtım Süreci

### Tek Bilgisayarda (Bu Mac)
1. ✅ Electron ve electron-builder kuruldu
2. ✅ Build konfigürasyonu hazırlandı
3. ✅ Vite production build hazırlandı
4. ⏳ **SON ADIM: Windows'ta build yapmak (bu adım Windows'ta yapılmalı)**

### Windows'ta Build Alma

**Seçenek 1: Developer'ın Windows'ta build alması**
```bash
npm run electron-build
```
Dosyalar `dist` klasöründe oluşturulur.

**Seçenek 2: GitHub Actions ile otomatik build (ileri seviye)**
- GitHub'a push et
- Actions otomatik Windows build yapıyor

**Seçenek 3: AppVeyor/CircleCI (ileri seviye)**
- Bulutta Windows VM'de build alıyor

## 📤 Distribüsyon

Oluşturulan `.exe` dosyalarını:
- ☁️ Google Drive / OneDrive'a yükleme
- 💾 USB stick'e kopyalama
- 📧 Email'de gönderme
- 🌐 Web sitesine koyma

## 🎯 Kurulum Talimatları

Dosya `SETUP_GUIDE.md` içinde hazırlanmıştır. Bu dosyayı `.exe` ile birlikte dağıtın.

---

## MacOS'ta Çalışan Geliştirici İçin

Mac'de Windows exe yapılamaz, bu yüzden:
1. **Yöntem 1**: Windows bilgisayara gönder, orada `npm run electron-build` çalıştır
2. **Yöntem 2**: GitHub Actions kullan (otomatik)
3. **Yöntem 3**: Parallels/VMware ile Windows VM kur

---

**ÖNEMLİ**: Sonraki versiyon build'inde package.json'daki version numarasını artırın:
```json
"version": "2.4.1"  // 2.4.0'dan artır
```
