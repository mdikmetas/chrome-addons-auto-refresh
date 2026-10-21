# GitHub'a Yükleme Rehberi

İki yol var: **web arayüzü** (kolay) veya **Git komut satırı** (önerilir).

## Yöntem 1: Web arayüzü (Git gerekmez)

1. https://github.com adresinde giriş yapın.
2. Sağ üstteki **+** → **New repository**'ye tıklayın.
3. **Repository name:** `otomatik-yenile` yazın.
4. **Description:** "Chrome için otomatik sayfa yenileme eklentisi" gibi kısa bir açıklama ekleyin.
5. **Public** seçin. **README / .gitignore / license eklemeyin** (projede zaten var).
6. **Create repository**'ye tıklayın.
7. Açılan sayfada **uploading an existing file** bağlantısına tıklayın.
8. Proje klasörünün **içindeki** dosyaları (klasörün kendisini değil) sürükleyip bırakın.
   `icons` klasörü de dahil olmalı. `.gitignore` gizli dosya olduğundan görünmüyorsa gizli dosyaları göstermeyi açın.
9. **Commit changes**'e tıklayın.

## Yöntem 2: Git komut satırı

### Ön hazırlık (bir kez)
```bash
git config --global user.name "Adınız Soyadınız"
git config --global user.email "mail@ornek.com"
```

### GitHub'da boş depo oluşturun
Yukarıdaki 2-6. adımları izleyin (README, .gitignore ve lisans eklemeyin).

### Yerelden yükleyin
Proje klasöründe şunları çalıştırın:

```bash
git init
git add .
git commit -m "İlk sürüm: Otomatik Sayfa Yenileyici v2.0"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/otomatik-yenile.git
git push -u origin main
```

Şifre sorarsa GitHub şifresi çalışmaz; **Personal Access Token** kullanın:
GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → `repo` yetkisiyle oluşturun ve şifre yerine yapıştırın.

### Sonraki güncellemeler
```bash
git add .
git commit -m "Yaptığınız değişikliğin kısa açıklaması"
git push
```

## Yüklemeden önce kontrol listesi

- [ ] `LICENSE` dosyasındaki `ADINIZ SOYADINIZ` yerine kendi adınızı yazdınız
- [ ] `README.md` içindeki `KULLANICI_ADINIZ` yerine GitHub kullanıcı adınızı yazdınız
- [ ] Eklentiyi Chrome'da son kez denediniz

## Yayın (Release) oluşturma (isteğe bağlı)

Kullanıcıların hazır zip indirebilmesi için:

1. Depo sayfasında sağdaki **Releases** → **Create a new release**.
2. **Tag:** `v2.0`, **Title:** `v2.0` yazın.
3. Proje dosyalarını zip'leyip **Attach binaries** alanına sürükleyin.
4. **Publish release**'e tıklayın.

## Depo ayarları için öneriler

- **About** bölümüne açıklama ve konu etiketleri ekleyin: `chrome-extension`, `auto-refresh`, `manifest-v3`, `javascript`
- Mümkünse popup'ın bir ekran görüntüsünü `screenshots/` klasörüne koyup README'ye ekleyin:
  ```markdown
  ![Popup](screenshots/popup.png)
  ```
