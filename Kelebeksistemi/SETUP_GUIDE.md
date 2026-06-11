# 🦋 Kelebek Sistemi - Dağıtım Rehberi

## Windows için Kurulum

### 1. Installer ile Kurulum (Önerilen - En Basit)

**Adımlar:**
1. `Kelebek-Sistemi-Setup-2.4.0.exe` dosyasını indirin
2. Dosyaya çift tıklayın
3. Kurulum sihirbazını takip edin
4. "Kelebek Sistemi" programını Başlat Menüsü veya Masaüstü'nden açın

✅ **Bu seçenekte:**
- Hiçbir şey kurmanıza gerek yok
- Tüm dosyalar otomatik yerleştirilir
- Masaüstü kısayolu oluşturulur
- Internet gerektirmez

---

### 2. Portable Sürüm (İnternet Gerekmez, Kurulum Gerekmez)

1. `Kelebek-Sistemi-2.4.0.exe` dosyasını indirin
2. İstediğiniz klasöre açın (örn: `C:\Programlar` veya USB)
3. Dosyaya çift tıklayarak doğrudan çalıştırın
4. Klasörü taşıyabilir, kopyalayabilir veya silebilirsiniz

✅ **Bu seçenekte:**
- Kurulum yok - doğrudan çalışır
- USB stick'te taşıyabilirsiniz
- Herhangi bir yere kopyalayabilirsiniz

---

### 3. Kaynak Kodundan Çalıştırma (Geliştiriciler İçin)

**Gerekli:** 
- Node.js (https://nodejs.org) - LTS sürümü indirin

**Adımlar:**
```bash
# 1. Proje klasörüne girin
cd "Kelebek Sistemi-alpha"

# 2. Bağımlılıkları yükleyin
npm install

# 3. Development modunda çalıştırın
npm run electron-dev
```

---

### 4. Yeni Installer Oluşturma

**Gerekli:**
- Node.js
- Git (opsiyonel)

**Adımlar:**
```bash
# Proje klasörüne girin
cd "Kelebek Sistemi-alpha"

# Installer'ı oluşturun
npm run electron-build
```

Oluşturulan dosyalar `dist` klasöründe bulunur:
- `Kelebek-Sistemi-Setup-2.4.0.exe` → Installer
- `Kelebek-Sistemi-2.4.0.exe` → Portable

---

## 🐛 Sorun Giderme

### Program açılmıyor
- Windows Defender/Antivirus'in engellediği kontrol edin
- Administrator olarak çalıştırmayı deneyin
- Başlat Menüsü → Etkinlik Yöneticisi'nde uygulamanın çalışıp çalışmadığını kontrol edin

### Ekran boş gözüküyor
- Sayfayı yenileyin (F5)
- Tarayıcı konsolunu açın (F12)
- Hata mesajı kopyalayıp iletişime geçin

### Windows Defender uyarısı
- "Daha fazla bilgi" → "Yine de çalıştır" tıklayın
- Bu ilk kurulumda normal davranıştır

---

## 📊 Sistem Gereksinimleri

- **OS:** Windows 7 ve üzeri (64-bit önerilir)
- **RAM:** Minimum 512 MB
- **Disk:** 200 MB boş alan
- **Internet:** Yalnızca ilk kurulumda (daha sonra internet gerekmez)

---

## 📝 Önemli Notlar

✅ **Program internet gerektirmez** - Tüm veriler yerel olarak saklanır
✅ **Tüm veriler bilgisayarınızda** - Herhangi bir dış sunucuya gönderilmez
✅ **Tek tıkla kurulum** - Yazılım bilgisi gerekmez
✅ **Masaüstü kısayolu** - Programı kolayca açabilirsiniz

---

## 📞 Destek

Sorun yaşarsanız:
1. Tüm program penceresini kapatın
2. Programı yeniden başlatın
3. Hata mesajını not edin ve iletişime geçin

**İletişim:** 
- Instagram: @tamerkzlm

---

**Kelebek Sistemi v2.4** | Sınav Oturma Düzeni Yöneticisi
Yapımcı: Tamer Közleme
