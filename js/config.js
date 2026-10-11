/**
 * 招待状の中身はここだけ編集すればOK。
 * 日本語(ja) と 英語(en) をそれぞれ書く。
 */
window.WEDDING = {
  // 合言葉の SHA-256 ハッシュ。tools/hash.html で作成して貼り付ける。
  passphraseHash: "fdb7f1de885450d5ca1c3ab44a05475db09081eef07ac33cafaf2bcdad8755cb",

  couple: {
    groom: { ja: "山田 太郎", en: "Taro Yamada", short: "Taro" },
    bride: { ja: "佐藤 花子", en: "Hanako Sato", short: "Hanako" },
    initials: "T & H"
  },

  // 日時はすべて日本時間(+09:00)で書く
  weddingDate: "2027-04-10T11:00:00+09:00",
  rsvpDeadline: "2026-12-15T23:59:59+09:00",

  schedule: [
    { key: "desk",      time: "10:30" },
    { key: "ceremony",  time: "11:00" },
    { key: "reception", time: "12:00" }
  ],

  venue: {
    name:    { ja: "ホテル〇〇（仮）", en: "Hotel XXXX (TBD)" },
    address: { ja: "〒100-0005 東京都千代田区丸の内1丁目", en: "1 Marunouchi, Chiyoda-ku, Tokyo 100-0005" },
    access:  { ja: "JR東京駅 丸の内北口より徒歩5分", en: "5 min walk from JR Tokyo Station (Marunouchi North Exit)" },
    mapQuery: "東京駅" // Googleマップで検索する語句（会場名や住所）
  },

  dressCode: { ja: "平服でお越しください", en: "Smart casual" },

  notes: {
    ja: "お車でお越しの方は事前にお知らせください。",
    en: "Please let us know in advance if you plan to come by car."
  },

  photos: {
    hero: "assets/img/hero.svg",
    gallery: [
      "assets/img/gallery-1.svg",
      "assets/img/gallery-2.svg",
      "assets/img/gallery-3.svg",
      "assets/img/gallery-4.svg",
      "assets/img/gallery-5.svg",
      "assets/img/gallery-6.svg"
    ]
  },

  // どちらか一方を設定。両方空なら「近日公開」を表示。
  video: {
    youtubeId: "",   // 例: "dQw4w9WgXcQ"（限定公開推奨）
    mp4: "",         // 例: "assets/video/movie.mp4"
    poster: ""       // mp4 の表紙画像（任意）
  },

  // 出欠フォームの送信先（Google Apps Script のウェブアプリURL）。
  // 空のままだと「デモモード」（送信せずに完了画面だけ出す）。
  rsvpEndpoint: ""
};
