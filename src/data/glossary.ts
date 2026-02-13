export interface GlossaryItem {
  term: string;
  reading: string;
  description: string;
  category: '基本' | '馬券' | '競馬場' | 'レース' | '血統' | 'その他';
}

export const glossaryData: GlossaryItem[] = [
  // 基本
  { term: 'オッズ', reading: 'おっず', category: '基本', description: '馬券が的中した際の払戻倍率。投票数に応じて変動し、人気のある馬ほどオッズは低くなります。' },
  { term: '回収率', reading: 'かいしゅうりつ', category: '基本', description: '投資金額に対する払戻金額の割合。100%以上であれば利益が出ていることを示します。計算式: 払戻金額 ÷ 投資金額 × 100' },
  { term: '控除率', reading: 'こうじょりつ', category: '基本', description: 'JRAが馬券の売上から差し引く割合。馬券種によって異なり、単勝・複勝は20%、3連単は27.5%です。' },
  { term: '本命', reading: 'ほんめい', category: '基本', description: 'そのレースで最も勝つ可能性が高いと予想される馬。1番人気の馬を指すことが多いです。' },
  { term: '対抗', reading: 'たいこう', category: '基本', description: '本命に次いで有力と予想される馬。予想紙では○印で表記されます。' },
  { term: '穴馬', reading: 'あなうま', category: '基本', description: '人気が低いが好走の可能性がある馬。オッズが高く、的中すると高配当が期待できます。' },
  { term: '万馬券', reading: 'まんばけん', category: '基本', description: '100円あたりの配当が10,000円以上になる馬券のこと。高配当の代名詞として使われます。' },
  { term: '払戻金', reading: 'はらいもどしきん', category: '基本', description: '馬券が的中した際に受け取れる金額。購入金額にオッズを掛けて計算されます。' },

  // 馬券
  { term: '単勝', reading: 'たんしょう', category: '馬券', description: '1着になる馬を当てる馬券。最もシンプルで初心者にもおすすめの馬券種です。' },
  { term: '複勝', reading: 'ふくしょう', category: '馬券', description: '3着以内に入る馬を当てる馬券。単勝より的中しやすい一方、配当は低めになりやすい傾向があります。出走頭数が7頭以下の場合は2着以内が的中条件で、4頭以下のレースでは複勝は発売されません。' },
  { term: '枠連', reading: 'わくれん', category: '馬券', description: '1着・2着の枠番号の組み合わせを当てる馬券（順不同）。同枠に複数の馬がいる場合、的中の幅が広がります。' },
  { term: '馬連', reading: 'うまれん', category: '馬券', description: '1着・2着の馬番号の組み合わせを当てる馬券（順不同）。枠連より難しいが配当は高くなります。' },
  { term: 'ワイド', reading: 'わいど', category: '馬券', description: '3着以内に入る2頭の組み合わせを当てる馬券（順不同）。馬連より的中しやすいが配当はやや低めです。' },
  { term: '馬単', reading: 'うまたん', category: '馬券', description: '1着・2着を着順通りに当てる馬券。馬連の2倍の組み合わせがあり、配当も高くなります。' },
  { term: '3連複', reading: 'さんれんぷく', category: '馬券', description: '1着・2着・3着の3頭の組み合わせを当てる馬券（順不同）。的中難易度が高い分、高配当が期待できます。' },
  { term: '3連単', reading: 'さんれんたん', category: '馬券', description: '1着・2着・3着を着順通りに当てる馬券。最も的中が難しく、最も高配当が期待できる馬券種です。' },
  { term: 'BOX', reading: 'ぼっくす', category: '馬券', description: '選択した馬番の全ての組み合わせを購入する買い方。軸馬を決めずに広く購入したい場合に使います。点数は組み合わせの数だけ増えます。' },
  { term: 'ながし', reading: 'ながし', category: '馬券', description: '軸馬を1頭以上決め、相手馬との組み合わせを購入する買い方。軸が来る前提で点数を絞れます。' },
  { term: 'フォーメーション', reading: 'ふぉーめーしょん', category: '馬券', description: '各着順の候補馬を個別に選択して組み合わせを購入する買い方。最も柔軟な購入方法です。' },
  { term: '返還馬', reading: 'へんかんば', category: '馬券', description: '出走取消・競走除外になった馬。その馬を含む馬券は返還（払い戻し）されます。' },

  // 競馬場
  { term: '東京競馬場', reading: 'とうきょうけいばじょう', category: '競馬場', description: '府中市にあるJRAの競馬場。左回り・芝2400mの日本ダービーなど数多くのGIレースが開催されます。' },
  { term: '中山競馬場', reading: 'なかやまけいばじょう', category: '競馬場', description: '船橋市にあるJRAの競馬場。右回り・急坂が特徴。有馬記念や皐月賞の開催地です。' },

  // レース
  { term: 'GI', reading: 'じーわん', category: 'レース', description: '最高格付けの重賞レース。日本ダービー、有馬記念、天皇賞などがこれに該当します。' },
  { term: 'ハンデ戦', reading: 'はんですん', category: 'レース', description: '各馬の能力差を斤量（重り）で調整するレース。実力差が縮まるため波乱が起きやすいです。' },
  { term: '斤量', reading: 'きんりょう', category: 'レース', description: '騎手と馬具の合計重量。レースの条件によって決められ、負担重量とも呼ばれます。' },

  // 血統
  { term: 'サイアー', reading: 'さいあー', category: '血統', description: '種牡馬のこと。父馬の血統は仔馬の能力に大きく影響します。' },
  { term: 'ダム', reading: 'だむ', category: '血統', description: '繁殖牝馬（母馬）のこと。母系の血統も競走能力に影響を与えます。' },

  // その他
  { term: '即PAT', reading: 'そくぱっと', category: 'その他', description: 'JRAのインターネット投票サービス。登録した金融機関口座から、即PATの購入限度額へ資金移動（入金指示／振替）を行ったうえで、パソコンやスマートフォンから投票（馬券購入）できます。' },
  { term: 'パドック', reading: 'ぱどっく', category: 'その他', description: 'レース前に出走馬を周回させて観客に見せる場所。馬の調子や気配を確認するのに重要です。' },
  { term: '調教', reading: 'ちょうきょう', category: 'その他', description: 'レースに向けた馬のトレーニング。調教の内容やタイムは予想の重要な材料になります。' },
];
