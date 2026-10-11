# Wedding Invitation（Web招待状）

スマホ向けのWeb招待状。HTML / CSS / JavaScript だけで動く静的サイトなので、Azure Static Web Apps・Netlify・GitHub Pages・Cloudflare Pages のどれにもそのまま置ける。

表示の流れ：**合言葉入力 → 封筒をタップして開封 → 本文**（同じブラウザで開き直した場合、そのセッション中は合言葉と封筒を省略）

## フォルダ構成

| パス | 内容 |
|---|---|
| `index.html` | ページ本体 |
| `css/style.css` | 全テーマ共通のレイアウト。これ単体が Pastel テーマの見た目 |
| `themes/*.css` | テーマごとの上書きスタイル（例：`themes/chic.css`） |
| `js/theme.js` | テーマの一覧と既定テーマ |
| `js/config.js` | **名前・日時・会場・写真・動画・合言葉など、中身は全部ここ** |
| `js/i18n.js` | 画面の固定文言（日本語 / 英語） |
| `js/main.js` | 動き（合言葉、封筒、言語切替、フォーム送信など） |
| `js/sha256.js` | 合言葉の照合用 |
| `assets/img/` | 写真（今は仮の画像） |
| `gas/Code.gs` | 出欠の受け口（Google Apps Script）。**公開不要** |
| `tools/hash.html` | 合言葉のハッシュ作成ツール。**公開不要** |
| `staticwebapp.config.json` | Azure Static Web Apps 用の設定（noindex ヘッダーなど） |
| `_headers` | Netlify / Cloudflare Pages 用の設定（noindex ヘッダー） |
| `robots.txt` | 検索エンジンを拒否 |

## 手元で確認する

```bash
npx http-server -p 8080 -c-1
```

http://localhost:8080 を開く。合言葉は `js/config.js` の `passphraseHash` に設定したもの。
スマホ実機で見るときは、同じWi-Fiにつないで `http://<PCのIPアドレス>:8080` を開く。

## テーマ（見た目）を切り替える・試す

中身（`js/config.js`）は全テーマで共通。見た目だけを差し替える。

| テーマ | URL | 内容 |
|---|---|---|
| `chic`（既定） | `?theme=chic` | チャコール × アイボリー × シャンパンゴールド |
| `pastel` | `?theme=pastel` | 和洋モダン × パステル（初版の見た目） |

- URL の末尾に `?theme=pastel` を付けると、そのテーマで表示される。選んだテーマはそのブラウザに記憶される
- `config.js` の `themePicker: true` の間は、画面左下にテーマ切替が出る（ドラフト確認用。本番では `false`）
- 既定のテーマは `js/theme.js` の `DEFAULT_THEME` で変える

### 新しいテーマを試す手順

1. 作業用ブランチを切る：`git switch -c feature/theme-<名前>`
2. `themes/chic.css` をコピーして `themes/<名前>.css` を作り、先頭の `:root[data-theme="chic"]` と各行の `[data-theme="chic"]` を新しい名前に置換して編集
3. `js/theme.js` の `THEMES` に1行足す
4. 確認できたら `main` にマージして push（全テーマが同じURLで見比べられる）

### 元に戻す

- 見た目だけ戻す：`?theme=pastel` を使う、または `DEFAULT_THEME` を `"pastel"` にする
- テーマの仕組みを入れる前のコードに完全に戻す：初版にはタグ `v0.1-pastel` が付いている
  （中身の確認は `git switch --detach v0.1-pastel`、元に戻るときは `git switch main`）

## 中身を差し替える

### 名前・日時・会場
`js/config.js` を編集する。日時は日本時間（`+09:00`）で書く。

### 写真
1. `assets/img/` に写真を置く（JPG か WebP、長い辺を1600px程度に縮小。1枚300KB以下が目安）
2. `js/config.js` の `photos.hero`（トップ画像。縦長4:5がきれいに収まる）と `photos.gallery` を書き換える

### 動画
- **YouTube（おすすめ）**：限定公開でアップロードし、URL の `v=` のあとの部分を `video.youtubeId` に入れる
- **サイト内に置く場合**：`assets/video/movie.mp4` に置いて `video.mp4` に指定する（容量が大きいと通信量も表示時間も増えるので、720p・30秒程度・10MB以下が目安）

### 合言葉を変える
1. `tools/hash.html` をブラウザで開き、新しい合言葉を入力してハッシュを作る
2. `js/config.js` の `passphraseHash` と `gas/Code.gs` の `PASSPHRASE_HASH` に同じ値を貼る

全角/半角・大文字/小文字・前後の空白は区別しないので、`Sakura` や `ｓａｋｕｒａ` でも通る。

## 出欠フォームの接続（Google スプレッドシートに保存）

`rsvpEndpoint` が空の間は **デモモード**（送信せず完了画面だけ出す）。

1. Google ドライブで新しいスプレッドシートを作る
2. メニューの「拡張機能 → Apps Script」を開き、`gas/Code.gs` の中身を貼り付けて保存
3. 「デプロイ → 新しいデプロイ → 種類：ウェブアプリ」
   - 次のユーザーとして実行：**自分**
   - アクセスできるユーザー：**全員**
4. 表示されたウェブアプリURL（`https://script.google.com/macros/s/.../exec`）を `js/config.js` の `rsvpEndpoint` に貼る
5. サイトから試しに送信し、スプレッドシートに「RSVP」シートができて1行増えることを確認する

`Code.gs` を後から直した場合は、「デプロイを管理 → 編集 → バージョン：新バージョン」で更新する（URLは変わらない）。

受付終了（2026/12/15 23:59）を過ぎると、フォームが自動で「受付終了」の表示に切り替わり、Apps Script 側でも送信を拒否する。

## 公開する

公開するのは次のファイルだけで良い（`tools/` と `gas/` は不要）：
`index.html`, `css/`, `js/`, `assets/`, `robots.txt`, `staticwebapp.config.json`, `_headers`

- **Azure Static Web Apps（Free プラン）**：GitHub にリポジトリを作って連携。App location は `/`、ビルドなし。独自ドメインも無料で設定できる
- **Netlify / Cloudflare Pages**：フォルダをドラッグ＆ドロップするか GitHub と連携
- **GitHub Pages**：リポジトリの Settings → Pages で有効化（リポジトリを公開にする必要があるので、ソースコードも公開される点に注意）

公開後、`index.html` の `og:image` に PNG / JPG（1200×630）の絶対URLを入れると、LINE などでリンクのプレビュー画像が出る。

## 合言葉の仕組みと限界

合言葉は、**うっかり開いた人や検索エンジンを通さないための鍵**として働く。
静的サイトなので、技術的な知識がある人がソースを直接読めば、日時や会場は見えてしまう。ただし出欠の送信は Apps Script 側でも合言葉を確認しているので、合言葉を知らない人は送信できない。

もっと厳しく守りたい場合の選択肢（Phase 2 以降）：
- 本文を合言葉で暗号化して置き、正しい合言葉でだけ復号する
- Cloudflare Access などで、サーバー側でアクセスを制限する
