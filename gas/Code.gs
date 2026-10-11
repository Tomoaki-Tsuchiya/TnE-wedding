/**
 * 出欠フォームの受け口（Google Apps Script）
 * 回答を Google スプレッドシートの「RSVP」シートに1行ずつ追記する。
 * 設置手順は README.md の「出欠フォームの接続」を参照。
 */

// js/config.js の passphraseHash と同じ値を入れる（合言葉を知らない人からの送信を拒否）
const PASSPHRASE_HASH = 'fdb7f1de885450d5ca1c3ab44a05475db09081eef07ac33cafaf2bcdad8755cb';
const DEADLINE = new Date('2026-12-15T23:59:59+09:00');
const SHEET_NAME = 'RSVP';

const HEADERS = ['受付日時', '出欠', '区分', 'お名前', 'ふりがな', 'メール', 'お連れ様人数', 'お連れ様のお名前', 'アレルギー', 'メッセージ', '言語'];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.website) return json({ ok: true }); // スパムボット（人には見えない欄に入力がある）
    if (PASSPHRASE_HASH && sha256(String(data.key || '')) !== PASSPHRASE_HASH) return json({ ok: false, error: 'unauthorized' });
    if (new Date() > DEADLINE) return json({ ok: false, error: 'closed' });
    if (!data.name || !data.email || !data.attendance) return json({ ok: false, error: 'invalid' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet().appendRow([
        new Date(),
        data.attendance === 'attend' ? '出席' : '欠席',
        data.side === 'groom' ? '新郎側' : data.side === 'bride' ? '新婦側' : '',
        clean(data.name),
        clean(data.kana),
        clean(data.email),
        Number(data.companions) || 0,
        clean(data.companionNames),
        clean(data.allergies),
        clean(data.message),
        data.lang === 'en' ? 'EN' : 'JA'
      ]);
    } finally {
      lock.releaseLock();
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function sheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

// 文字数を制限し、先頭が = + - @ の値は数式として解釈されないようにする
function clean(v) {
  const s = String(v || '').slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function sha256(s) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8);
  return bytes.map(b => ((b + 256) % 256).toString(16).padStart(2, '0')).join('');
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
