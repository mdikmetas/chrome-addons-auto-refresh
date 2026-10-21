# ⟳ Otomatik Sayfa Yenileyici

Chrome'da açık sekmeyi, belirlediğiniz sürede otomatik olarak yenileyen basit ve hafif bir eklenti (Manifest V3).

## Özellikler

- Saniye veya dakika cinsinden süre belirleme
- Hızlı seçim tuşları (10 sn, 30 sn, 1 dk, 5 dk, 15 dk)
- Sonsuza kadar yenileme (∞) veya belirli sayıda yenilemeden sonra otomatik durma
- Başlat, Duraklat/Devam ve Durdur butonları
- Bir sonraki yenilemeye kalan süreyi gösteren canlı geri sayım
- Yenileme sayacı
- Rastgele aralık (her seferinde farklı süre)
- Sert yenileme (önbelleği atlama)
- Yazı yazılırken yenilemeyi erteleme (form verisi kaybolmasın diye)
- Sekme başına ayrı ayar
- Kısayol: `Alt+Shift+R` (aç/kapat)
- Rozet: `ON` (aktif), `II` (duraklatıldı)

## Kurulum

Eklenti henüz Chrome Web Mağazası'nda değildir, geliştirici modu ile yüklenir:

1. Bu depoyu indirin (**Code → Download ZIP**) ve bir klasöre çıkarın, ya da klonlayın:
   ```bash
   git clone https://github.com/KULLANICI_ADINIZ/otomatik-yenile.git
   ```
2. Chrome'da `chrome://extensions` adresini açın.
3. Sağ üstten **Geliştirici modu**'nu açın.
4. **Paketlenmemiş öğe yükle**'ye tıklayın ve proje klasörünü seçin.
5. İsterseniz eklenti simgesini araç çubuğuna sabitleyin.

> Eklentiyi kurmadan önce açık olan sekmelerde bir kez manuel yenileme yapmanız gerekir.

## Kullanım

1. Yenilemek istediğiniz sekmede eklenti simgesine tıklayın.
2. Süreyi girin (veya hızlı seçim tuşlarından birini kullanın).
3. Varsayılan olarak durdurana kadar sonsuza kadar yeniler. Belirli sayıda yenilemeden sonra durmasını istiyorsanız **∞** kutusunun işaretini kaldırıp tekrar sayısını girin.
4. İsteğe bağlı seçenekleri işaretleyin (rastgele aralık, sert yenileme, yazı yazarken yenileme).
5. **Başlat**'a basın.

Duraklatmak için **Duraklat**, tamamen kapatmak için **Durdur**'u kullanın.

## Proje yapısı

```
otomatik-yenile/
├── manifest.json     # Eklenti tanımı (Manifest V3)
├── background.js     # Service worker: yenileme komutu, rozet, kısayol
├── content.js        # Sayfa içi zamanlayıcı
├── popup.html        # Arayüz
├── popup.js          # Arayüz mantığı
└── icons/            # Eklenti simgeleri
```

## İzinler ve gizlilik

| İzin | Neden gerekli |
|------|---------------|
| `storage` | Sekme başına süre ayarlarını ve son kullanılan ayarları yerel olarak saklamak |
| `<all_urls>` (content script) | Zamanlayıcıyı tüm sitelerde çalıştırmak |

Eklenti hiçbir veri toplamaz, hiçbir sunucuya veri göndermez. Tüm ayarlar yalnızca tarayıcınızda yerel olarak tutulur.

## Bilinen sınırlamalar

- `chrome://` sayfalarında ve Chrome Web Mağazası'nda çalışmaz (Chrome bu sayfalara eklenti kodu eklenmesine izin vermez).
- Süre, sayfa her yenilendiğinde baştan sayılır.
- Kurulumdan önce açılmış sekmelerde bir kez manuel yenileme gerekir.

## Katkıda bulunma

Hata bildirimleri ve önerileri **Issues** bölümünden iletebilirsiniz. Pull request'ler memnuniyetle karşılanır.

## Lisans

[MIT](LICENSE)
