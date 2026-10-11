/** 画面の固定文言（日本語 / 英語）。{deadline} などは main.js で差し込む。 */
window.I18N = {
  ja: {
    "gate.lead": "招待状をご覧いただくには<br>合言葉を入力してください",
    "gate.placeholder": "合言葉",
    "gate.button": "ひらく",
    "gate.error": "合言葉が違います",
    "gate.hint": "合言葉はご招待のご連絡に記載しております",

    "envelope.hint": "タップして開封",

    "message.sub": "ご挨拶",
    "message.body":
      "謹啓<br>" +
      "皆様におかれましては<br>ますますご清祥のこととお慶び申し上げます<br><br>" +
      "このたび 私たちは結婚式を挙げることとなりました<br>" +
      "つきましては 日頃お世話になっております皆様に<br>" +
      "感謝の気持ちを込めて<br>ささやかな小宴を催したく存じます<br><br>" +
      "ご多用中 誠に恐縮ではございますが<br>" +
      "ぜひご出席いただきたく ご案内申し上げます<br>" +
      "<span class=\"right\">謹白</span>",

    "countdown.sub": "結婚式まで",
    "countdown.days": "日",
    "countdown.hours": "時間",
    "countdown.minutes": "分",
    "countdown.seconds": "秒",
    "countdown.done": "本日 お待ちしております",

    "gallery.sub": "ギャラリー",
    "gallery.hint": "← スワイプ →",

    "movie.sub": "ムービー",
    "movie.soon": "ムービーは近日公開予定です",
    "movie.play": "ムービーを再生",

    "info.sub": "ご案内",
    "info.date": "日時",
    "info.venue": "会場",
    "info.access": "アクセス",
    "info.dress": "服装",
    "info.openMap": "Googleマップで開く",
    "schedule.desk": "受付",
    "schedule.ceremony": "挙式",
    "schedule.reception": "披露宴",

    "rsvp.sub": "ご出欠",
    "rsvp.lead": "お手数ではございますが<br>下記フォームより <b>{deadline}</b> までに<br>ご返信くださいますようお願い申し上げます",
    "rsvp.attendance": "ご出欠",
    "rsvp.attend": "ご出席",
    "rsvp.decline": "ご欠席",
    "rsvp.side": "ゲスト区分",
    "rsvp.sideGroom": "新郎側",
    "rsvp.sideBride": "新婦側",
    "rsvp.name": "お名前",
    "rsvp.kana": "ふりがな",
    "rsvp.email": "メールアドレス",
    "rsvp.required": "必須",
    "rsvp.companions": "お連れ様の人数",
    "rsvp.companionNames": "お連れ様のお名前",
    "rsvp.allergies": "アレルギー・苦手な食べ物",
    "rsvp.allergiesPh": "例）えび、かに",
    "rsvp.message": "メッセージ",
    "rsvp.submit": "送信する",
    "rsvp.sending": "送信中…",
    "rsvp.success": "ご回答ありがとうございました<br>当日お会いできることを楽しみにしております",
    "rsvp.closed": "ご回答の受付は終了いたしました<br>ご不明な点は新郎新婦まで直接ご連絡ください",
    "rsvp.errRequired": "未入力の項目があります",
    "rsvp.errEmail": "メールアドレスの形式をご確認ください",
    "rsvp.errSend": "送信に失敗しました。時間をおいて再度お試しください"
  },

  en: {
    "gate.lead": "Please enter the passphrase<br>to view the invitation",
    "gate.placeholder": "Passphrase",
    "gate.button": "Open",
    "gate.error": "Incorrect passphrase",
    "gate.hint": "You can find it in the message we sent you",

    "envelope.hint": "Tap to open",

    "message.sub": "A note from us",
    "message.body":
      "We are delighted to invite you<br>to celebrate our wedding.<br><br>" +
      "You have been a part of our story,<br>and it would mean the world to us<br>" +
      "to have you with us as we begin<br>this new chapter together.<br><br>" +
      "We would be honored by your presence.",

    "countdown.sub": "Until our big day",
    "countdown.days": "Days",
    "countdown.hours": "Hours",
    "countdown.minutes": "Min",
    "countdown.seconds": "Sec",
    "countdown.done": "Today is the day!",

    "gallery.sub": "Photos",
    "gallery.hint": "← Swipe →",

    "movie.sub": "Our movie",
    "movie.soon": "Our movie is coming soon",
    "movie.play": "Play movie",

    "info.sub": "The details",
    "info.date": "Date",
    "info.venue": "Venue",
    "info.access": "Access",
    "info.dress": "Dress code",
    "info.openMap": "Open in Google Maps",
    "schedule.desk": "Reception desk opens",
    "schedule.ceremony": "Ceremony",
    "schedule.reception": "Reception",

    "rsvp.sub": "Kindly reply",
    "rsvp.lead": "Please let us know if you can join us<br>by <b>{deadline}</b>.",
    "rsvp.attendance": "Attendance",
    "rsvp.attend": "Attend",
    "rsvp.decline": "Decline",
    "rsvp.side": "Guest of",
    "rsvp.sideGroom": "Groom",
    "rsvp.sideBride": "Bride",
    "rsvp.name": "Full name",
    "rsvp.kana": "Reading",
    "rsvp.email": "Email",
    "rsvp.required": "Required",
    "rsvp.companions": "Number of companions",
    "rsvp.companionNames": "Companion name(s)",
    "rsvp.allergies": "Allergies / dietary needs",
    "rsvp.allergiesPh": "e.g. shellfish, vegetarian",
    "rsvp.message": "Message for us",
    "rsvp.submit": "Send",
    "rsvp.sending": "Sending…",
    "rsvp.success": "Thank you for your reply!<br>We can't wait to celebrate with you.",
    "rsvp.closed": "RSVP is now closed.<br>Please contact us directly if you have any questions.",
    "rsvp.errRequired": "Please fill in all required fields",
    "rsvp.errEmail": "Please check your email address",
    "rsvp.errSend": "Something went wrong. Please try again later."
  }
};
