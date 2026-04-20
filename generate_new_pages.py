#!/usr/bin/env python3
"""Generate 15 new BG and 15 new DE product pages."""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

# ── shared product data ─────────────────────────────────────────────────────

PRODUCTS = [
  {
    "slug": "wheat",
    "category": "grains",
    "en_name": "Wheat",
    "bg_name": "Пшеница",
    "de_name": "Weizen",
    "bg_tagline": "Продоволствена и фуражна пшеница от България — висок протеин, проследим произход, BG зърнени доставки за мелници и фуражни заводи.",
    "de_tagline": "Brot- und Futterweizen aus Bulgarien — hoher Proteingehalt, rückverfolgbare Herkunft, bulgarische Getreidelieferungen für Mühlen und Futtermittelbetriebe.",
    "bg_certs": ["Не-ГМО", "ISO 22000", "Български произход"],
    "de_certs": ["Nicht-GVO", "ISO 22000", "Bulgarische Herkunft"],
    "moq": "1 × 40ft контейнер",
    "moq_de": "1 × 40ft-Container",
    "packaging_bg": [("Опция", "25 кг РР чували"), ("Опция", "50 кг РР чували"), ("Опция", "1 000 кг Биг Бег")],
    "packaging_de": [("Option", "25 kg PP-Säcke"), ("Option", "50 kg PP-Säcke"), ("Option", "1.000 kg Big Bags")],
    "bg_h2": "Българска продоволствена и фуражна пшеница",
    "de_h2": "Bulgarischer Brot- und Futterweizen",
    "bg_body": "<p>България е сред водещите износители на пшеница в ЕС. Stufiyan Agro доставя пшеница директно от фермери в Черноморския и Дунавския регион — почистена, изсушена и готова за директна употреба в мелници, фуражни заводи или за реекспорт.</p><p>Предлагаме продоволствена пшеница (Gruppe A/B) и фуражна пшеница съгласно изискванията на клиента.</p>",
    "de_body": "<p>Bulgarien gehört zu den führenden Weizenexporteuren der EU. Stufiyan Agro liefert Weizen direkt von Erzeugern aus der Schwarzmeer- und Donauregion — gereinigt, getrocknet und bereit für den Einsatz in Mühlen, Futtermittelbetrieben oder den Weiterexport.</p><p>Wir liefern Brotweizen (Gruppe A/B) sowie Futterweizen nach Kundenanforderung.</p>",
    "spec_bg": [("Влажност", "макс 13%"), ("Протеин", "мин 11%"), ("Натурална маса", "мин 75 кг/хл"), ("Мокра клейковина", "мин 23%"), ("Число на падане", "мин 220 с"), ("Примеси", "макс 2%"), ("Чужди примеси", "макс 0.5%")],
    "spec_de": [("Feuchtigkeit", "max 13%"), ("Protein", "min 11%"), ("Hektolitergewicht", "min 75 kg/hl"), ("Nassgluten", "min 23%"), ("Fallzahl", "min 220 s"), ("Beimengungen", "max 2%"), ("Fremdbesatz", "max 0,5%")],
    "bg_cta_title": "Търсите пшеница от България?",
    "de_cta_title": "Suchen Sie Weizen aus Bulgarien?",
    "bg_crosslink": None,
    "de_crosslink": None,
    "related_en": ["barley", "corn", "oats"],
  },
  {
    "slug": "barley",
    "category": "grains",
    "en_name": "Barley",
    "bg_name": "Ечемик",
    "de_name": "Gerste",
    "bg_tagline": "Фуражен и пивоварен ечемик от България — проверен протеин, добра покълнаемост, директни доставки от производителя.",
    "de_tagline": "Futter- und Braugerste aus Bulgarien — geprüfter Proteingehalt, gute Keimfähigkeit, Direktlieferung vom Erzeuger.",
    "bg_certs": ["Не-ГМО", "ISO 22000", "Български произход"],
    "de_certs": ["Nicht-GVO", "ISO 22000", "Bulgarische Herkunft"],
    "moq": "1 × 40ft контейнер",
    "moq_de": "1 × 40ft-Container",
    "packaging_bg": [("Опция", "25 кг РР чували"), ("Опция", "50 кг РР чували"), ("Опция", "1 000 кг Биг Бег")],
    "packaging_de": [("Option", "25 kg PP-Säcke"), ("Option", "50 kg PP-Säcke"), ("Option", "1.000 kg Big Bags")],
    "bg_h2": "Български фуражен и пивоварен ечемик",
    "de_h2": "Bulgarische Futter- und Braugerste",
    "bg_body": "<p>Stufiyan Agro доставя ечемик от проверени български производители в Черноморския и Дунавския регион. Предлагаме фуражен ечемик за животновъдство и пивоварен ечемик с висока покълнаемост — почистен, изсушен и готов за изпращане.</p>",
    "de_body": "<p>Stufiyan Agro liefert Gerste von geprüften bulgarischen Erzeugern aus der Schwarzmeer- und Donauregion. Wir bieten Futtergerste für die Tierhaltung und Braugerste mit hoher Keimfähigkeit — gereinigt, getrocknet und versandbereit.</p>",
    "spec_bg": [("Влажност", "макс 13%"), ("Протеин", "9–12%"), ("Натурална маса", "мин 62 кг/хл"), ("Покълнаемост", "мин 95%"), ("Чужди примеси", "макс 0.5%"), ("Примеси", "макс 2%")],
    "spec_de": [("Feuchtigkeit", "max 13%"), ("Protein", "9–12%"), ("Hektolitergewicht", "min 62 kg/hl"), ("Keimfähigkeit", "min 95%"), ("Fremdbesatz", "max 0,5%"), ("Beimengungen", "max 2%")],
    "bg_cta_title": "Търсите ечемик от България?",
    "de_cta_title": "Suchen Sie Gerste aus Bulgarien?",
    "bg_crosslink": None,
    "de_crosslink": None,
    "related_en": ["wheat", "corn", "oats"],
  },
  {
    "slug": "oats",
    "category": "grains",
    "en_name": "Oats",
    "bg_name": "Овес",
    "de_name": "Hafer",
    "bg_tagline": "Суров овес от България — висока чистота, за производство на овесени ядки, фуражни смески и хранителна промишленост.",
    "de_tagline": "Rohhafer aus Bulgarien — hohe Reinheit, für die Produktion von Haferflocken, Mischfuttermittel und die Lebensmittelindustrie.",
    "bg_certs": ["Без ГМО", "ISO 22000", "Български произход"],
    "de_certs": ["Nicht-GVO", "ISO 22000", "Bulgarische Herkunft"],
    "moq": "1 × 40ft контейнер",
    "moq_de": "1 × 40ft-Container",
    "packaging_bg": [("Опция", "25 кг РР чували"), ("Опция", "50 кг РР чували"), ("Опция", "1 000 кг Биг Бег")],
    "packaging_de": [("Option", "25 kg PP-Säcke"), ("Option", "50 kg PP-Säcke"), ("Option", "1.000 kg Big Bags")],
    "bg_h2": "Български суров овес",
    "de_h2": "Bulgarischer Rohhafer",
    "bg_body": "<p>Stufiyan Agro доставя суров овес от български производители. Подходящ за производство на овесени ядки, фуражни смески и директна употреба в хранителната промишленост. За преработен продукт вижте нашите <a href=\"/bg/oat-flakes\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Овесени ядки</a>.</p>",
    "de_body": "<p>Stufiyan Agro liefert Rohhafer von bulgarischen Erzeugern. Geeignet für die Produktion von Haferflocken, Mischfuttermittel und den direkten Einsatz in der Lebensmittelindustrie. Für das Verarbeitungsprodukt siehe unsere <a href=\"/de/oat-flakes\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Haferflocken</a>.</p>",
    "spec_bg": [("Влажност", "макс 13%"), ("Протеин", "10–15%"), ("Чистота", "мин 98%"), ("Специфично тегло", "мин 50 кг/хл"), ("Олющени зърна", "макс 5%"), ("Чужди примеси", "макс 0.5%")],
    "spec_de": [("Feuchtigkeit", "max 13%"), ("Protein", "10–15%"), ("Reinheit", "min 98%"), ("Schüttgewicht", "min 50 kg/hl"), ("Entspelzte Körner", "max 5%"), ("Fremdbesatz", "max 0,5%")],
    "bg_cta_title": "Търсите овес от България?",
    "de_cta_title": "Suchen Sie Hafer aus Bulgarien?",
    "bg_crosslink": ('<a href="/bg/oat-flakes" class="btn btn--outline-light">Овесени ядки →</a>', '/bg/oat-flakes'),
    "de_crosslink": ('<a href="/de/oat-flakes" class="btn btn--outline-light">Haferflocken →</a>', '/de/oat-flakes'),
    "related_en": ["wheat", "barley", "oat-flakes"],
  },
  {
    "slug": "corn",
    "category": "grains",
    "en_name": "Corn",
    "bg_name": "Царевица",
    "de_name": "Mais",
    "bg_tagline": "Не-ГМО царевица от България — фуражна и хранителна, директно от производителя, MOQ 1×40ft контейнер.",
    "de_tagline": "Nicht-GVO-Mais aus Bulgarien — Futter- und Lebensmittelqualität, direkt vom Erzeuger, MOQ 1×40ft-Container.",
    "bg_certs": ["Не-ГМО", "ISO 22000", "Български произход"],
    "de_certs": ["Nicht-GVO", "ISO 22000", "Bulgarische Herkunft"],
    "moq": "1 × 40ft контейнер",
    "moq_de": "1 × 40ft-Container",
    "packaging_bg": [("Опция", "25 кг РР чували"), ("Опция", "50 кг РР чували"), ("Опция", "1 000 кг Биг Бег")],
    "packaging_de": [("Option", "25 kg PP-Säcke"), ("Option", "50 kg PP-Säcke"), ("Option", "1.000 kg Big Bags")],
    "bg_h2": "Не-ГМО царевица от България",
    "de_h2": "Nicht-GVO-Mais aus Bulgarien",
    "bg_body": "<p>Stufiyan Agro доставя не-ГМО царевица директно от проверени производители в България. Предлагаме фуражна и хранителна царевица, почистена и изсушена до максимална влажност 14%, готова за директна употреба или за реекспорт.</p>",
    "de_body": "<p>Stufiyan Agro liefert Nicht-GVO-Mais direkt von geprüften Erzeugern in Bulgarien. Wir bieten Futter- und Lebensmittelmais, gereinigt und getrocknet auf max. 14% Feuchtigkeit, bereit für den Direkteinsatz oder den Weiterexport.</p>",
    "spec_bg": [("Влажност", "макс 14%"), ("Протеин", "8–9%"), ("Натурална маса", "мин 70 кг/хл"), ("Чужди примеси", "макс 1%"), ("Счупени зърна", "макс 3%"), ("Примеси", "макс 2%"), ("ГМО статус", "Не-ГМО")],
    "spec_de": [("Feuchtigkeit", "max 14%"), ("Protein", "8–9%"), ("Hektolitergewicht", "min 70 kg/hl"), ("Fremdbesatz", "max 1%"), ("Bruchkorn", "max 3%"), ("Beimengungen", "max 2%"), ("GVO-Status", "Nicht-GVO")],
    "bg_cta_title": "Търсите царевица от България?",
    "de_cta_title": "Suchen Sie Mais aus Bulgarien?",
    "bg_crosslink": None,
    "de_crosslink": None,
    "related_en": ["wheat", "barley", "sorghum"],
  },
  {
    "slug": "lentils",
    "category": "pulses",
    "en_name": "Lentils",
    "bg_name": "Леща",
    "de_name": "Linsen",
    "bg_tagline": "Цяла леща от България — висок протеин, мин 99% чистота, B2B доставки за хранителна промишленост.",
    "de_tagline": "Ganze Linsen aus Bulgarien — hoher Proteingehalt, min. 99% Reinheit, B2B-Lieferungen für die Lebensmittelindustrie.",
    "bg_certs": ["Без ГМО", "ISO 22000", "Български произход"],
    "de_certs": ["Nicht-GVO", "ISO 22000", "Bulgarische Herkunft"],
    "moq": "1 × 20ft контейнер",
    "moq_de": "1 × 20ft-Container",
    "packaging_bg": [("Опция", "25 кг РР чували"), ("Опция", "50 кг РР чували"), ("Опция", "1 000 кг Биг Бег")],
    "packaging_de": [("Option", "25 kg PP-Säcke"), ("Option", "50 kg PP-Säcke"), ("Option", "1.000 kg Big Bags")],
    "bg_h2": "Цяла леща от България",
    "de_h2": "Ganze Linsen aus Bulgarien",
    "bg_body": "<p>Stufiyan Agro доставя цяла леща с висок протеин (22–26%) директно от български производители. Почистена, изсушена и калибрирана по размер 4–6 мм, подходяща за хранителна промишленост, консервни заводи и директна продажба. За обелена леща вижте нашата <a href=\"/bg/boned-lentils\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Обелена леща</a>.</p>",
    "de_body": "<p>Stufiyan Agro liefert ganze Linsen mit hohem Proteingehalt (22–26%) direkt von bulgarischen Erzeugern. Gereinigt, getrocknet und nach Größe 4–6 mm kalibriert, geeignet für die Lebensmittelindustrie, Konservenbetriebe und den Direktverkauf. Für enthülste Linsen siehe unsere <a href=\"/de/boned-lentils\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Enthülsten Linsen</a>.</p>",
    "spec_bg": [("Влажност", "макс 13%"), ("Чистота", "мин 99%"), ("Протеин", "22–26%"), ("Примеси", "макс 0.5%"), ("Размер", "4–6 мм"), ("Повредени зърна", "макс 1%")],
    "spec_de": [("Feuchtigkeit", "max 13%"), ("Reinheit", "min 99%"), ("Protein", "22–26%"), ("Beimengungen", "max 0,5%"), ("Größe", "4–6 mm"), ("Beschädigte Körner", "max 1%")],
    "bg_cta_title": "Търсите леща от България?",
    "de_cta_title": "Suchen Sie Linsen aus Bulgarien?",
    "bg_crosslink": ('<a href="/bg/boned-lentils" class="btn btn--outline-light">Обелена леща →</a>', '/bg/boned-lentils'),
    "de_crosslink": ('<a href="/de/boned-lentils" class="btn btn--outline-light">Enthülste Linsen →</a>', '/de/boned-lentils'),
    "related_en": ["peas", "chickpeas", "boned-lentils"],
  },
  {
    "slug": "peas",
    "category": "pulses",
    "en_name": "Peas",
    "bg_name": "Грах",
    "de_name": "Erbsen",
    "bg_tagline": "Жълт грах от България — висок протеин, мин 99% чистота, B2B доставки за хранителна промишленост.",
    "de_tagline": "Gelbe Erbsen aus Bulgarien — hoher Proteingehalt, min. 99% Reinheit, B2B-Lieferungen für die Lebensmittelindustrie.",
    "bg_certs": ["Без ГМО", "ISO 22000", "Български произход"],
    "de_certs": ["Nicht-GVO", "ISO 22000", "Bulgarische Herkunft"],
    "moq": "1 × 20ft контейнер",
    "moq_de": "1 × 20ft-Container",
    "packaging_bg": [("Опция", "25 кг РР чували"), ("Опция", "50 кг РР чували"), ("Опция", "1 000 кг Биг Бег")],
    "packaging_de": [("Option", "25 kg PP-Säcke"), ("Option", "50 kg PP-Säcke"), ("Option", "1.000 kg Big Bags")],
    "bg_h2": "Жълт грах от България",
    "de_h2": "Gelbe Erbsen aus Bulgarien",
    "bg_body": "<p>Stufiyan Agro доставя цял жълт грах с висок протеин (20–25%) директно от български производители. Почистен, изсушен и готов за хранителна промишленост или фуражни смески. За белен грах вижте нашия <a href=\"/bg/split-peas\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Белен грах</a>.</p>",
    "de_body": "<p>Stufiyan Agro liefert ganze gelbe Erbsen mit hohem Proteingehalt (20–25%) direkt von bulgarischen Erzeugern. Gereinigt, getrocknet und für die Lebensmittelindustrie oder Mischfuttermittel bereit. Für Spalterbsen siehe unsere <a href=\"/de/split-peas\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Spalterbsen</a>.</p>",
    "spec_bg": [("Влажност", "макс 13%"), ("Чистота", "мин 99%"), ("Протеин", "20–25%"), ("Примеси", "макс 0.5%"), ("Разполовени зърна", "макс 2%"), ("Повредени зърна", "макс 1%")],
    "spec_de": [("Feuchtigkeit", "max 13%"), ("Reinheit", "min 99%"), ("Protein", "20–25%"), ("Beimengungen", "max 0,5%"), ("Spalterbsen", "max 2%"), ("Beschädigte Körner", "max 1%")],
    "bg_cta_title": "Търсите грах от България?",
    "de_cta_title": "Suchen Sie Erbsen aus Bulgarien?",
    "bg_crosslink": ('<a href="/bg/split-peas" class="btn btn--outline-light">Белен грах →</a>', '/bg/split-peas'),
    "de_crosslink": ('<a href="/de/split-peas" class="btn btn--outline-light">Spalterbsen →</a>', '/de/split-peas'),
    "related_en": ["lentils", "chickpeas", "split-peas"],
  },
  {
    "slug": "beans",
    "category": "pulses",
    "en_name": "Beans",
    "bg_name": "Боб",
    "de_name": "Bohnen",
    "bg_tagline": "Бял и цветен боб от България — висок протеин, мин 99% чистота, B2B доставки за хранителна промишленост.",
    "de_tagline": "Weiße und bunte Bohnen aus Bulgarien — hoher Proteingehalt, min. 99% Reinheit, B2B-Lieferungen für die Lebensmittelindustrie.",
    "bg_certs": ["Без ГМО", "ISO 22000", "Български произход"],
    "de_certs": ["Nicht-GVO", "ISO 22000", "Bulgarische Herkunft"],
    "moq": "1 × 20ft контейнер",
    "moq_de": "1 × 20ft-Container",
    "packaging_bg": [("Опция", "25 кг РР чували"), ("Опция", "50 кг РР чували"), ("Опция", "1 000 кг Биг Бег")],
    "packaging_de": [("Option", "25 kg PP-Säcke"), ("Option", "50 kg PP-Säcke"), ("Option", "1.000 kg Big Bags")],
    "bg_h2": "Български боб — бял и цветен",
    "de_h2": "Bulgarische Bohnen — weiß und bunt",
    "bg_body": "<p>Stufiyan Agro доставя бял и цветен боб с висок протеин (20–24%) директно от български производители. Почистен, изсушен и калибриран, подходящ за консервни заводи, хранителна промишленост и директна продажба на насипно.</p>",
    "de_body": "<p>Stufiyan Agro liefert weiße und bunte Bohnen mit hohem Proteingehalt (20–24%) direkt von bulgarischen Erzeugern. Gereinigt, getrocknet und kalibriert, geeignet für Konservenbetriebe, die Lebensmittelindustrie und den Direktverkauf in loser Schüttung.</p>",
    "spec_bg": [("Влажност", "макс 13%"), ("Чистота", "мин 99%"), ("Протеин", "20–24%"), ("Чужди примеси", "макс 0.5%"), ("Обезцветени", "макс 1%"), ("Повредени", "макс 1%")],
    "spec_de": [("Feuchtigkeit", "max 13%"), ("Reinheit", "min 99%"), ("Protein", "20–24%"), ("Fremdbesatz", "max 0,5%"), ("Verfärbt", "max 1%"), ("Beschädigt", "max 1%")],
    "bg_cta_title": "Търсите боб от България?",
    "de_cta_title": "Suchen Sie Bohnen aus Bulgarien?",
    "bg_crosslink": None,
    "de_crosslink": None,
    "related_en": ["lentils", "peas", "chickpeas"],
  },
  {
    "slug": "chickpeas",
    "category": "pulses",
    "en_name": "Chickpeas",
    "bg_name": "Нахут",
    "de_name": "Kichererbsen",
    "bg_tagline": "Нахут от България — висок протеин, фракции 7–9 мм и 9+ мм, B2B доставки за хранителна промишленост.",
    "de_tagline": "Kichererbsen aus Bulgarien — hoher Proteingehalt, Fraktionen 7–9 mm und 9+ mm, B2B-Lieferungen für die Lebensmittelindustrie.",
    "bg_certs": ["Без ГМО", "ISO 22000", "Български произход"],
    "de_certs": ["Nicht-GVO", "ISO 22000", "Bulgarische Herkunft"],
    "moq": "1 × 20ft контейнер",
    "moq_de": "1 × 20ft-Container",
    "packaging_bg": [("Опция", "25 кг РР чували"), ("Опция", "50 кг РР чували"), ("Опция", "1 000 кг Биг Бег")],
    "packaging_de": [("Option", "25 kg PP-Säcke"), ("Option", "50 kg PP-Säcke"), ("Option", "1.000 kg Big Bags")],
    "bg_h2": "Нахут от България",
    "de_h2": "Kichererbsen aus Bulgarien",
    "bg_body": "<p>Stufiyan Agro доставя нахут с висок протеин (18–22%) директно от български производители. Предлагаме фракции 7–9 мм и 9+ мм, почистени, изсушени и калибрирани, подходящи за хумус, хранителна промишленост и консервни заводи.</p>",
    "de_body": "<p>Stufiyan Agro liefert Kichererbsen mit hohem Proteingehalt (18–22%) direkt von bulgarischen Erzeugern. Wir bieten Fraktionen 7–9 mm und 9+ mm, gereinigt, getrocknet und kalibriert, geeignet für Hummus, die Lebensmittelindustrie und Konservenbetriebe.</p>",
    "spec_bg": [("Влажност", "макс 12%"), ("Чистота", "мин 99%"), ("Протеин", "18–22%"), ("Размер", "7–9 мм / 9+ мм"), ("Чужди примеси", "макс 0.5%"), ("Повредени", "макс 1%")],
    "spec_de": [("Feuchtigkeit", "max 12%"), ("Reinheit", "min 99%"), ("Protein", "18–22%"), ("Größensortierung", "7–9 mm / 9+ mm"), ("Fremdbesatz", "max 0,5%"), ("Beschädigt", "max 1%")],
    "bg_cta_title": "Търсите нахут от България?",
    "de_cta_title": "Suchen Sie Kichererbsen aus Bulgarien?",
    "bg_crosslink": None,
    "de_crosslink": None,
    "related_en": ["lentils", "peas", "beans"],
  },
  {
    "slug": "mustard",
    "category": "oil-seeds",
    "en_name": "Mustard Seeds",
    "bg_name": "Синапено семе",
    "de_name": "Senfsamen",
    "bg_tagline": "Синапено семе от България — високо съдържание на масло и летливо масло, MOQ 1×20ft контейнер.",
    "de_tagline": "Senfsamen aus Bulgarien — hoher Öl- und ätherischer Ölgehalt, MOQ 1×20ft-Container.",
    "bg_certs": ["Не-ГМО", "ISO 22000", "Български произход"],
    "de_certs": ["Nicht-GVO", "ISO 22000", "Bulgarische Herkunft"],
    "moq": "1 × 20ft контейнер",
    "moq_de": "1 × 20ft-Container",
    "packaging_bg": [("Опция", "25 кг РР чували"), ("Опция", "50 кг РР чували"), ("Опция", "1 000 кг Биг Бег")],
    "packaging_de": [("Option", "25 kg PP-Säcke"), ("Option", "50 kg PP-Säcke"), ("Option", "1.000 kg Big Bags")],
    "bg_h2": "Синапено семе от България",
    "de_h2": "Senfsamen aus Bulgarien",
    "bg_body": "<p>Stufiyan Agro доставя синапено семе с високо съдържание на масло (28–35%) и летливо масло (мин 0.5%) директно от български производители. Почистено, изсушено и готово за производство на синапено масло, подправки или храни за животни.</p>",
    "de_body": "<p>Stufiyan Agro liefert Senfsamen mit hohem Öl- (28–35%) und ätherischem Ölgehalt (min. 0,5%) direkt von bulgarischen Erzeugern. Gereinigt, getrocknet und bereit für die Produktion von Senföl, Gewürzen oder Tierfutter.</p>",
    "spec_bg": [("Влажност", "макс 10%"), ("Чистота", "мин 99%"), ("Съдържание на масло", "28–35%"), ("Летливо масло", "мин 0.5%"), ("Чужди примеси", "макс 0.5%"), ("Примеси", "макс 1%")],
    "spec_de": [("Feuchtigkeit", "max 10%"), ("Reinheit", "min 99%"), ("Ölgehalt", "28–35%"), ("Ätherisches Öl", "min 0,5%"), ("Fremdbesatz", "max 0,5%"), ("Beimengungen", "max 1%")],
    "bg_cta_title": "Търсите синапено семе от България?",
    "de_cta_title": "Suchen Sie Senfsamen aus Bulgarien?",
    "bg_crosslink": None,
    "de_crosslink": None,
    "related_en": ["coriander-seeds", "sunflower-seeds", "flaxseed-brown"],
  },
  {
    "slug": "sorghum",
    "category": "oil-seeds",
    "en_name": "Sorghum",
    "bg_name": "Сорго",
    "de_name": "Sorghum",
    "bg_tagline": "Сорго от България — без глутен, богато на протеин, за фуражна и хранителна промишленост, MOQ 1×40ft контейнер.",
    "de_tagline": "Sorghum aus Bulgarien — glutenfrei, proteinreich, für Futtermittel- und Lebensmittelindustrie, MOQ 1×40ft-Container.",
    "bg_certs": ["Без глутен", "Не-ГМО", "Български произход"],
    "de_certs": ["Glutenfrei", "Nicht-GVO", "Bulgarische Herkunft"],
    "moq": "1 × 40ft контейнер",
    "moq_de": "1 × 40ft-Container",
    "packaging_bg": [("Опция", "25 кг РР чували"), ("Опция", "50 кг РР чували"), ("Опция", "1 000 кг Биг Бег")],
    "packaging_de": [("Option", "25 kg PP-Säcke"), ("Option", "50 kg PP-Säcke"), ("Option", "1.000 kg Big Bags")],
    "bg_h2": "Сорго от България",
    "de_h2": "Sorghum aus Bulgarien",
    "bg_body": "<p>Stufiyan Agro доставя сорго — естествено без глутен зърно с протеин 8–12%, подходящо за фуражни смески, безглутенови хранителни продукти и биогориво. Доставяме директно от проверени производители в България.</p>",
    "de_body": "<p>Stufiyan Agro liefert Sorghum — von Natur aus glutenfreies Getreide mit 8–12% Protein, geeignet für Mischfuttermittel, glutenfreie Lebensmittelprodukte und Biokraftstoff. Direktlieferung von geprüften Erzeugern in Bulgarien.</p>",
    "spec_bg": [("Влажност", "макс 13%"), ("Чистота", "мин 97%"), ("Протеин", "8–12%"), ("Натурална маса", "мин 70 кг/хл"), ("Чужди примеси", "макс 0.5%"), ("Примеси", "макс 2%"), ("Глутен статус", "Естествено без глутен")],
    "spec_de": [("Feuchtigkeit", "max 13%"), ("Reinheit", "min 97%"), ("Protein", "8–12%"), ("Hektolitergewicht", "min 70 kg/hl"), ("Fremdbesatz", "max 0,5%"), ("Beimengungen", "max 2%"), ("Glutenstatus", "Von Natur aus glutenfrei")],
    "bg_cta_title": "Търсите сорго от България?",
    "de_cta_title": "Suchen Sie Sorghum aus Bulgarien?",
    "bg_crosslink": None,
    "de_crosslink": None,
    "related_en": ["corn", "wheat", "sunflower-seeds"],
  },
  {
    "slug": "sunflower-kernels",
    "category": "oil-seeds",
    "en_name": "Sunflower Kernels",
    "bg_name": "Слънчогледови ядки",
    "de_name": "Sonnenblumenkerne",
    "bg_tagline": "Обелени слънчогледови ядки от България — сортове Бейкъри, Кондитерски, Чипс. Халал, Кошер, ISO 22000, FSSC 22000.",
    "de_tagline": "Geschälte Sonnenblumenkerne aus Bulgarien — Sorten Bäckerei, Konfekt, Chips. Halal, Koscher, ISO 22000, FSSC 22000.",
    "bg_certs": ["Халал", "Кошер", "ISO 22000", "FSSC 22000"],
    "de_certs": ["Halal", "Koscher", "ISO 22000", "FSSC 22000"],
    "moq": "1 × 40ft контейнер",
    "moq_de": "1 × 40ft-Container",
    "packaging_bg": [("Опция", "25 кг PP чували"), ("Опция", "50 кг PP чували"), ("Опция", "1 000 кг Биг Бег")],
    "packaging_de": [("Option", "25 kg PP-Säcke"), ("Option", "50 kg PP-Säcke"), ("Option", "1.000 kg Big Bags")],
    "bg_h2": "Обелени слънчогледови ядки от България",
    "de_h2": "Geschälte Sonnenblumenkerne aus Bulgarien",
    "bg_body": "<p>Stufiyan Agro произвежда и доставя обелени слънчогледови ядки в три основни сорта — Бейкъри, Кондитерски и Чипс, с чистота 99.90–99.98% и съдържание на масло 42–52%. Всички сортове са сертифицирани по ISO 22000 и FSSC 22000, с налични Халал и Кошер сертификати.</p><p>За цели слънчогледови семена (с черупка) вижте нашите <a href=\"/bg/sunflower-seeds\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Слънчогледови семена</a>.</p>",
    "de_body": "<p>Stufiyan Agro produziert und liefert geschälte Sonnenblumenkerne in drei Hauptsorten — Bäckerei, Konfekt und Chips — mit einer Reinheit von 99,90–99,98% und einem Ölgehalt von 42–52%. Alle Sorten sind nach ISO 22000 und FSSC 22000 zertifiziert, Halal- und Koscherunterlagen auf Anfrage verfügbar.</p><p>Für ganze Sonnenblumensamen (mit Schale) siehe unsere <a href=\"/de/sunflower-seeds\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Sonnenblumensamen</a>.</p>",
    "spec_bg": [("Сортове", "Бейкъри / Кондитерски / Чипс"), ("Влажност", "макс 7–8%"), ("Чистота", "99.90–99.98%"), ("Съдържание на масло", "42–52%"), ("Размер", "500–700 бр/унция")],
    "spec_de": [("Sorten", "Bäckerei / Konfekt / Chips"), ("Feuchtigkeit", "max 7–8%"), ("Reinheit", "99,90–99,98%"), ("Ölgehalt", "42–52%"), ("Größe", "500–700 Stk/oz")],
    "bg_cta_title": "Търсите слънчогледови ядки?",
    "de_cta_title": "Suchen Sie Sonnenblumenkerne?",
    "bg_crosslink": ('<a href="/bg/sunflower-seeds" class="btn btn--outline-light">Слънчогледови семена →</a>', '/bg/sunflower-seeds'),
    "de_crosslink": ('<a href="/de/sunflower-seeds" class="btn btn--outline-light">Sonnenblumensamen →</a>', '/de/sunflower-seeds'),
    "related_en": ["sunflower-seeds", "hulled-sunflower-kernels", "sunflower-oil-linoleic"],
  },
  {
    "slug": "sunflower-seeds",
    "category": "oil-seeds",
    "en_name": "Sunflower Seeds",
    "bg_name": "Слънчогледови семена",
    "de_name": "Sonnenblumensamen",
    "bg_tagline": "Цели слънчогледови семена от България — маслено съдържание 42–50%, влажност макс 8%, готови за пресоване на масло.",
    "de_tagline": "Ganze Sonnenblumensamen aus Bulgarien — Ölgehalt 42–50%, Feuchtigkeit max 8%, bereit für die Ölpressung.",
    "bg_certs": ["Не-ГМО", "ISO 22000", "Български произход"],
    "de_certs": ["Nicht-GVO", "ISO 22000", "Bulgarische Herkunft"],
    "moq": "1 × 40ft контейнер",
    "moq_de": "1 × 40ft-Container",
    "packaging_bg": [("Опция", "25 кг РР чували"), ("Опция", "50 кг РР чували"), ("Опция", "1 000 кг Биг Бег")],
    "packaging_de": [("Option", "25 kg PP-Säcke"), ("Option", "50 kg PP-Säcke"), ("Option", "1.000 kg Big Bags")],
    "bg_h2": "Български маслодайни слънчогледови семена",
    "de_h2": "Bulgarische Ölsaat-Sonnenblumensamen",
    "bg_body": "<p>България е сред водещите производители на слънчоглед в Европа. Stufiyan Agro доставя цели маслодайни слънчогледови семена директно от български ферми в Черноморския и Дунавския регион — почистени и изсушени с маслено съдържание 42–50% и влажност до макс 8%.</p><p>За обелени слънчогледови ядки вижте нашите <a href=\"/bg/sunflower-kernels\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Слънчогледови ядки</a>.</p>",
    "de_body": "<p>Bulgarien gehört zu den führenden Sonnenblumenproduzenten Europas. Stufiyan Agro liefert ganze Ölsaat-Sonnenblumensamen direkt von bulgarischen Betrieben in der Schwarzmeer- und Donauregion — gereinigt und getrocknet mit einem Ölgehalt von 42–50% und maximal 8% Feuchtigkeit.</p><p>Für geschälte Sonnenblumenkerne siehe unsere <a href=\"/de/sunflower-kernels\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Sonnenblumenkerne</a>.</p>",
    "spec_bg": [("Влажност", "макс 8%"), ("Чистота", "мин 99%"), ("Съдържание на масло", "42–50%"), ("Натурална маса", "мин 38 кг/хл"), ("Чужди примеси", "макс 0.5%"), ("ГМО статус", "Не-ГМО")],
    "spec_de": [("Feuchtigkeit", "max 8%"), ("Reinheit", "min 99%"), ("Ölgehalt", "42–50%"), ("Hektolitergewicht", "min 38 kg/hl"), ("Fremdbesatz", "max 0,5%"), ("GVO-Status", "Nicht-GVO")],
    "bg_cta_title": "Търсите слънчогледови семена от България?",
    "de_cta_title": "Suchen Sie Sonnenblumensamen aus Bulgarien?",
    "bg_crosslink": ('<a href="/bg/sunflower-kernels" class="btn btn--outline-light">Слънчогледови ядки →</a>', '/bg/sunflower-kernels'),
    "de_crosslink": ('<a href="/de/sunflower-kernels" class="btn btn--outline-light">Sonnenblumenkerne →</a>', '/de/sunflower-kernels'),
    "related_en": ["sunflower-kernels", "sunflower-oil-linoleic", "sunflower-oil-oleic"],
  },
  {
    "slug": "oat-flakes",
    "category": "retail",
    "en_name": "Oat Flakes",
    "bg_name": "Овесени ядки",
    "de_name": "Haferflocken",
    "bg_tagline": "Овесени ядки от България — фини и едри, за дребно и насипно, MOQ 500 кг.",
    "de_tagline": "Haferflocken aus Bulgarien — fein und grob, für Einzelhandel und Großgebinde, MOQ 500 kg.",
    "bg_certs": ["Без глутен", "ISO 22000", "Български произход"],
    "de_certs": ["Glutenfrei", "ISO 22000", "Bulgarische Herkunft"],
    "moq": "500 кг",
    "moq_de": "500 kg",
    "packaging_bg": [("Опция", "500 г дребно търговия"), ("Опция", "1 кг дребно търговия"), ("Опция", "25 кг насипно")],
    "packaging_de": [("Option", "500 g Einzelhandel"), ("Option", "1 kg Einzelhandel"), ("Option", "25 kg Großgebinde")],
    "bg_h2": "Овесени ядки от България",
    "de_h2": "Haferflocken aus Bulgarien",
    "bg_body": "<p>Stufiyan Agro произвежда фини и едри овесени ядки от суров овес с произход България. Предлагаме опаковки за дребна търговия (500 г, 1 кг) и насипно (25 кг), подходящи за супермаркети, частни марки и хранителна промишленост. За суров овес вижте нашия <a href=\"/bg/oats\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Овес</a>.</p>",
    "de_body": "<p>Stufiyan Agro produziert feine und grobe Haferflocken aus bulgarischem Rohhafer. Wir bieten Einzelhandelsverpackungen (500 g, 1 kg) und Großgebinde (25 kg), geeignet für Supermärkte, Eigenmarken und die Lebensmittelindustrie. Für Rohhafer siehe unseren <a href=\"/de/oats\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Hafer</a>.</p>",
    "spec_bg": [("Влажност", "макс 13%"), ("Протеин", "мин 10%"), ("Дебелина — Фини", "0.5–0.6 мм"), ("Дебелина — Едри", "0.7–0.9 мм"), ("Чистота", "мин 99.5%"), ("Мазнини", "5–8%")],
    "spec_de": [("Feuchtigkeit", "max 13%"), ("Protein", "min 10%"), ("Dicke — Fein", "0,5–0,6 mm"), ("Dicke — Grob", "0,7–0,9 mm"), ("Reinheit", "min 99,5%"), ("Fett", "5–8%")],
    "bg_cta_title": "Търсите овесени ядки от България?",
    "de_cta_title": "Suchen Sie Haferflocken aus Bulgarien?",
    "bg_crosslink": ('<a href="/bg/oats" class="btn btn--outline-light">Суров овес →</a>', '/bg/oats'),
    "de_crosslink": ('<a href="/de/oats" class="btn btn--outline-light">Rohhafer →</a>', '/de/oats'),
    "related_en": ["oats", "boned-lentils", "split-peas"],
  },
  {
    "slug": "boned-lentils",
    "category": "retail",
    "en_name": "Dehulled Lentils",
    "bg_name": "Обелена леща",
    "de_name": "Enthülste Linsen",
    "bg_tagline": "Обелена леща от България — червена и зелена, за дребно и насипно, MOQ 500 кг.",
    "de_tagline": "Enthülste Linsen aus Bulgarien — rot und grün, für Einzelhandel und Großgebinde, MOQ 500 kg.",
    "bg_certs": ["Без ГМО", "ISO 22000", "Български произход"],
    "de_certs": ["Nicht-GVO", "ISO 22000", "Bulgarische Herkunft"],
    "moq": "500 кг",
    "moq_de": "500 kg",
    "packaging_bg": [("Опция", "500 г дребно търговия"), ("Опция", "1 кг дребно търговия"), ("Опция", "25 кг насипно")],
    "packaging_de": [("Option", "500 g Einzelhandel"), ("Option", "1 kg Einzelhandel"), ("Option", "25 kg Großgebinde")],
    "bg_h2": "Обелена леща от България",
    "de_h2": "Enthülste Linsen aus Bulgarien",
    "bg_body": "<p>Stufiyan Agro произвежда обелена леща — червена и зелена — от цяла леща с произход България. Предлагаме опаковки за дребна търговия (500 г, 1 кг) и насипно (25 кг). За цяла леща (необелена) вижте нашата <a href=\"/bg/lentils\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Леща</a>.</p>",
    "de_body": "<p>Stufiyan Agro produziert enthülste Linsen — rot und grün — aus ganzen Linsen bulgarischer Herkunft. Wir bieten Einzelhandelsverpackungen (500 g, 1 kg) und Großgebinde (25 kg). Für ganze Linsen (ungeschält) siehe unsere <a href=\"/de/lentils\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Linsen</a>.</p>",
    "spec_bg": [("Влажност", "макс 13%"), ("Чистота", "мин 99.5%"), ("Протеин", "24–28%"), ("Черупково съдържание", "макс 0.5%"), ("Чужди примеси", "макс 0.2%"), ("Цвят", "Червена / Зелена")],
    "spec_de": [("Feuchtigkeit", "max 13%"), ("Reinheit", "min 99,5%"), ("Protein", "24–28%"), ("Hülsengehalt", "max 0,5%"), ("Fremdbesatz", "max 0,2%"), ("Farbe", "Rot / Grün")],
    "bg_cta_title": "Търсите обелена леща от България?",
    "de_cta_title": "Suchen Sie enthülste Linsen aus Bulgarien?",
    "bg_crosslink": ('<a href="/bg/lentils" class="btn btn--outline-light">Цяла леща →</a>', '/bg/lentils'),
    "de_crosslink": ('<a href="/de/lentils" class="btn btn--outline-light">Ganze Linsen →</a>', '/de/lentils'),
    "related_en": ["lentils", "split-peas", "oat-flakes"],
  },
  {
    "slug": "split-peas",
    "category": "retail",
    "en_name": "Split Peas",
    "bg_name": "Белен грах",
    "de_name": "Spalterbsen",
    "bg_tagline": "Белен жълт грах от България — за дребно и насипно, MOQ 500 кг.",
    "de_tagline": "Geschälte gelbe Spalterbsen aus Bulgarien — für Einzelhandel und Großgebinde, MOQ 500 kg.",
    "bg_certs": ["Без ГМО", "ISO 22000", "Български произход"],
    "de_certs": ["Nicht-GVO", "ISO 22000", "Bulgarische Herkunft"],
    "moq": "500 кг",
    "moq_de": "500 kg",
    "packaging_bg": [("Опция", "500 г дребно търговия"), ("Опция", "1 кг дребно търговия"), ("Опция", "25 кг насипно")],
    "packaging_de": [("Option", "500 g Einzelhandel"), ("Option", "1 kg Einzelhandel"), ("Option", "25 kg Großgebinde")],
    "bg_h2": "Белен жълт грах от България",
    "de_h2": "Geschälte gelbe Spalterbsen aus Bulgarien",
    "bg_body": "<p>Stufiyan Agro произвежда белен (половинки) жълт грах от цял грах с произход България. Предлагаме опаковки за дребна търговия (500 г, 1 кг) и насипно (25 кг), подходящи за супермаркети и частни марки. За цял грах (необелен) вижте нашия <a href=\"/bg/peas\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Грах</a>.</p>",
    "de_body": "<p>Stufiyan Agro produziert geschälte (halbierte) gelbe Spalterbsen aus ganzen Erbsen bulgarischer Herkunft. Wir bieten Einzelhandelsverpackungen (500 g, 1 kg) und Großgebinde (25 kg), geeignet für Supermärkte und Eigenmarken. Für ganze Erbsen (ungeschält) siehe unsere <a href=\"/de/peas\" style=\"color:inherit;text-decoration:underline;font-weight:500;\">Erbsen</a>.</p>",
    "spec_bg": [("Влажност", "макс 13%"), ("Чистота", "мин 99.5%"), ("Протеин", "22–26%"), ("Цели зърна", "макс 2%"), ("Чужди примеси", "макс 0.3%"), ("Цвят", "Равномерно жълт")],
    "spec_de": [("Feuchtigkeit", "max 13%"), ("Reinheit", "min 99,5%"), ("Protein", "22–26%"), ("Ganze Erbsen", "max 2%"), ("Fremdbesatz", "max 0,3%"), ("Farbe", "Gleichmäßig gelb")],
    "bg_cta_title": "Търсите белен грах от България?",
    "de_cta_title": "Suchen Sie Spalterbsen aus Bulgarien?",
    "bg_crosslink": ('<a href="/bg/peas" class="btn btn--outline-light">Цял грах →</a>', '/bg/peas'),
    "de_crosslink": ('<a href="/de/peas" class="btn btn--outline-light">Ganze Erbsen →</a>', '/de/peas'),
    "related_en": ["peas", "boned-lentils", "oat-flakes"],
  },
]

# ── category mappings ────────────────────────────────────────────────────────

CAT_BG = {
  "oil-seeds": {"hero": "Семена &amp; Ядки", "bread": "Маслодайни семена", "url": "oil-seeds"},
  "grains":    {"hero": "Зърнени култури",  "bread": "Зърнени култури",    "url": "grains"},
  "pulses":    {"hero": "Бобови растения",  "bread": "Бобови растения",    "url": "pulses"},
  "retail":    {"hero": "Дребна търговия",  "bread": "Дребна търговия",    "url": "retail"},
}

CAT_DE = {
  "oil-seeds": {"hero": "Samen &amp; Kerne", "bread": "Ölsaaten",      "url": "oil-seeds"},
  "grains":    {"hero": "Getreide",          "bread": "Getreide",      "url": "grains"},
  "pulses":    {"hero": "Hülsenfrüchte",     "bread": "Hülsenfrüchte", "url": "pulses"},
  "retail":    {"hero": "Einzelhandel",      "bread": "Einzelhandel",  "url": "retail"},
}

# ── page generator ───────────────────────────────────────────────────────────

def build_page(lang, p):
    slug = p["slug"]
    cat  = p["category"]

    if lang == "bg":
        name      = p["bg_name"]
        tagline   = p["bg_tagline"]
        certs     = p["bg_certs"]
        moq       = p["moq"]
        packaging = p["packaging_bg"]
        h2        = p["bg_h2"]
        body      = p["bg_body"]
        spec_rows = p["spec_bg"]
        cta_title = p["bg_cta_title"]
        crosslink = p["bg_crosslink"]
        cat_info  = CAT_BG[cat]
        canonical = f"https://www.agros-grain.com/bg/{slug}"
        og_locale = "bg_BG"
        meta_desc = f"{name} от България на едро — {tagline[:80]}."

        lang_active_en = ""
        lang_active_bg = ' util-bar__lang--active" aria-current="true'
        lang_active_de = ""
        nav_lang_en_active = ""
        nav_lang_bg_active = " nav__lang--active"
        nav_lang_de_active = ""
        path_prefix = "/bg/"
        contact_url = "/bg/contact"
        products_url = "/bg/products"
        home_url     = "/bg"
        privacy_url  = "/bg/privacy"
        country_schema = "България"
        offers_url   = "https://www.agros-grain.com/bg/contact"

        # UI strings
        nav_home     = "Начало"
        nav_products = "Продукти"
        nav_news     = "Новини"
        nav_about    = "За нас"
        nav_contact  = "Контакт"
        nav_cta      = "Запитване"
        bread_home   = "Начало"
        bread_prods  = "Продукти"
        moq_heading  = "Детайли на поръчката"
        moq_label    = "МОК"
        origin_label = "Произход"
        origin_val   = "България"
        pkg_heading  = "Опции за опаковка"
        spec_th_p    = "Параметър"
        spec_th_s    = "Спецификация"
        doc_title    = "Документация"
        doc_sub      = "Налично с всяка пратка"
        doc_std      = "Стандартен"
        doc_req      = "При заявка"
        cta_sub      = "Свържете се с нашия екип за цени, наличности и условия за доставка."
        cta_all      = "Всички продукти"
        cta_btn_cat  = f"Всички {cat_info['bread']}"
        footer_tagline = "От полето до крайната опаковка — качество, което можете да проследите."
        footer_h_prods = "Продукти"
        footer_oil   = "Маслодайни семена"
        footer_grains= "Зърнени култури"
        footer_pulses= "Бобови растения"
        footer_retail= "Дребна търговия"
        footer_all   = "Всички продукти &rarr;"
        footer_h_co  = "Компания"
        footer_home  = "Начало"
        footer_co_c  = "Контакт"
        footer_h_ct  = "Контакт"
        footer_sales_name = "Виктория Йорданова"
        footer_sales_lbl  = "Продажби"
        footer_acct_lbl   = "Счетоводство"
        footer_acct_name  = "Ирина Тодорова"
        footer_loc   = "Суворово и Варна, България"
        footer_vat   = "ДДС №: BG204623096"
        footer_copy  = "&copy; 2026 Stufiyan Agro. Всички права запазени."
        footer_priv  = "Политика за поверителност"
        loc_label    = "България | Суворово &amp; Варна"
        all_label    = "Всички продукти →"
        rel_eyebrow  = "Свързани продукти"
        rel_label    = "Може да ви трябва и"
        rel_cta      = "Виж спецификации →"
        render_nav   = f"renderNavDropdown({{ pathPrefix: '/bg/', allLabel: 'Всички продукти →', locationLabel: 'България | Суворово &amp; Варна' }});"
        render_rel   = f"renderRelatedProducts({{ pathPrefix: '/bg/', eyebrow: 'Свързани продукти', label: 'Може да ви трябва и', cta: 'Виж спецификации →' }});"
        js_data      = "../js/products-data-bg.js"
        doc_cards    = [
            ("&#x1F4CB;", "Сертификат за анализ", "Влажност, масленост, чистота за партида", doc_std),
            ("&#x1F30D;", "Сертификат за произход", "Български произход, EUR.1 за ЕС", doc_std),
            ("&#x1F33F;", "Фитосанитарен сертификат", "Издаден от БАБХ", doc_req),
            ("&#x1F52C;", "Лабораторен доклад", "Пестицидни остатъци, тежки метали", doc_req),
        ]

    else:  # de
        name      = p["de_name"]
        tagline   = p["de_tagline"]
        certs     = p["de_certs"]
        moq       = p["moq_de"]
        packaging = p["packaging_de"]
        h2        = p["de_h2"]
        body      = p["de_body"]
        spec_rows = p["spec_de"]
        cta_title = p["de_cta_title"]
        crosslink = p["de_crosslink"]
        cat_info  = CAT_DE[cat]
        canonical = f"https://www.agros-grain.com/de/{slug}"
        og_locale = "de_DE"
        meta_desc = f"{name} aus Bulgarien Großhandel — {tagline[:80]}."

        lang_active_en = ""
        lang_active_bg = ""
        lang_active_de = ' util-bar__lang--active" aria-current="true'
        nav_lang_en_active = ""
        nav_lang_bg_active = ""
        nav_lang_de_active = " nav__lang--active"
        path_prefix = "/de/"
        contact_url = "/de/contact"
        products_url = "/de/products"
        home_url     = "/de"
        privacy_url  = "/de/privacy"
        country_schema = "Bulgarien"
        offers_url   = "https://www.agros-grain.com/de/contact"

        nav_home     = "Startseite"
        nav_products = "Produkte"
        nav_news     = "Neuigkeiten"
        nav_about    = "Über uns"
        nav_contact  = "Kontakt"
        nav_cta      = "Angebot anfragen"
        bread_home   = "Startseite"
        bread_prods  = "Produkte"
        moq_heading  = "Bestelldetails"
        moq_label    = "Mindestbestellmenge"
        origin_label = "Herkunft"
        origin_val   = "Bulgarien"
        pkg_heading  = "Verpackungsoptionen"
        spec_th_p    = "Parameter"
        spec_th_s    = "Spezifikation"
        doc_title    = "Dokumentation"
        doc_sub      = "Mit jeder Lieferung verfügbar"
        doc_std      = "Standard"
        doc_req      = "Auf Anfrage"
        cta_sub      = "Kontaktieren Sie unser Vertriebsteam für Preise, Verfügbarkeit und Lieferbedingungen."
        cta_all      = "Alle Produkte"
        cta_btn_cat  = f"Alle {cat_info['bread']}"
        footer_tagline = "Vom Feld bis zur Endverpackung — Qualität, die Sie nachverfolgen können."
        footer_h_prods = "Produkte"
        footer_oil   = "Ölsaaten"
        footer_grains= "Getreide"
        footer_pulses= "Hülsenfrüchte"
        footer_retail= "Einzelhandel"
        footer_all   = "Alle Produkte &rarr;"
        footer_h_co  = "Unternehmen"
        footer_home  = "Startseite"
        footer_co_c  = "Kontakt"
        footer_h_ct  = "Kontakt"
        footer_sales_name = "Viktoria Yordanova"
        footer_sales_lbl  = "Vertrieb"
        footer_acct_lbl   = "Buchhaltung"
        footer_acct_name  = "Irina Todorova"
        footer_loc   = "Suworowo &amp; Warna, Bulgarien"
        footer_vat   = "USt-IdNr.: BG204623096"
        footer_copy  = "&copy; 2026 Stufiyan Agro. Alle Rechte vorbehalten."
        footer_priv  = "Datenschutz"
        loc_label    = "Bulgarien | Suworowo &amp; Warna"
        all_label    = "Alle Produkte →"
        rel_eyebrow  = "Verwandte Produkte"
        rel_label    = "Das könnte Sie auch interessieren"
        rel_cta      = "Vollständige Spezifikation →"
        render_nav   = f"renderNavDropdown({{ pathPrefix: '/de/', allLabel: 'Alle Produkte →', locationLabel: 'Bulgarien | Suworowo &amp; Warna' }});"
        render_rel   = f"renderRelatedProducts({{ pathPrefix: '/de/', eyebrow: 'Verwandte Produkte', label: 'Das könnte Sie auch interessieren', cta: 'Vollständige Spezifikation →' }});"
        js_data      = "../js/products-data-de.js"
        doc_cards    = [
            ("&#x1F4CB;", "Analysezertifikat", "Feuchtigkeit, Ölgehalt, Reinheit je Charge", doc_std),
            ("&#x1F30D;", "Ursprungszeugnis", "Bulgarische Herkunft, EUR.1 für die EU", doc_std),
            ("&#x1F33F;", "Pflanzengesundheitszeugnis", "Ausgestellt von der bulgarischen BFSA", doc_req),
            ("&#x1F52C;", "Laborbericht", "Pestizidrückstände, Schwermetalle", doc_req),
        ]

    # cert badges
    cert_html = "".join(f'<span class="prod-hero__cert">{c}</span>' for c in certs)

    # packaging rows
    pkg_rows = "".join(
        f'<div class="prod-hero__moq-row"><span class="prod-hero__moq-label">{k}</span>'
        f'<span class="prod-hero__moq-val">{v}</span></div>'
        for k, v in packaging
    )

    # spec table rows
    spec_html = "".join(
        f"<tr><td>{r[0]}</td><td>{r[1]}</td></tr>"
        for r in spec_rows
    )

    # CTA button row
    if crosslink:
        btn_html = crosslink[0]
        cta_extra_btn = f'<a href="{contact_url}" class="btn btn--gold">Запитване</a>' if lang == "bg" else f'<a href="{contact_url}" class="btn btn--gold">Angebot anfragen</a>'
        hero_buttons = (
            f'<div style="display:flex;gap:1rem;flex-wrap:wrap">'
            f'<a href="{contact_url}" class="btn btn--primary">'
            + ("Запитване за цена" if lang == "bg" else "Preis anfragen") +
            f'</a>{btn_html}</div>'
        )
    else:
        hero_buttons = (
            f'<div style="display:flex;gap:1rem;flex-wrap:wrap">'
            f'<a href="{contact_url}" class="btn btn--primary">'
            + ("Запитване за цена" if lang == "bg" else "Preis anfragen") +
            f'</a></div>'
        )

    # doc cards html
    dc_html = ""
    for icon, title, sub, status_txt in doc_cards:
        status_cls = "doc-card__status--available" if status_txt in (doc_std,) else "doc-card__status--on-request"
        dc_html += (
            f'<div class="doc-card"><div class="doc-card__icon">{icon}</div>'
            f'<div><p class="doc-card__title">{title}</p>'
            f'<p class="doc-card__sub">{sub}</p>'
            f'<span class="doc-card__status {status_cls}">{status_txt}</span></div></div>'
        )

    # JSON-LD isRelatedTo (use EN slugs to build full URLs)
    related = p.get("related_en", [])
    related_items = ",\n        ".join(
        f'{{"@type":"Product","name":"{r}","url":"https://www.agros-grain.com/{lang}/{r}"}}'
        for r in related
    )

    # JSON-LD spec offers
    schema_name = name
    schema_cat  = cat_info["bread"]

    # Util-bar lang links
    util_en_cls  = f'class="util-bar__lang{lang_active_en}"'
    util_bg_cls  = f'class="util-bar__lang{lang_active_bg}"'
    util_de_cls  = f'class="util-bar__lang{lang_active_de}"'

    html = f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/jpeg" href="../Media/logo.jpg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{name} | Stufiyan Agro България</title>
  <meta name="description" content="{meta_desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{name} | Stufiyan Agro" />
  <meta property="og:description" content="{meta_desc}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:locale" content="{og_locale}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="{name} | Stufiyan Agro" />
  <meta name="twitter:description" content="{meta_desc}" />
  <link rel="alternate" hreflang="en" href="https://www.agros-grain.com/{slug}" />
  <link rel="alternate" hreflang="bg" href="https://www.agros-grain.com/bg/{slug}" />
  <link rel="alternate" hreflang="de" href="https://www.agros-grain.com/de/{slug}" />
  <link rel="alternate" hreflang="x-default" href="https://www.agros-grain.com/{slug}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../css/styles.css" />
  <link rel="stylesheet" href="../css/products.css" />
  <link rel="canonical" href="{canonical}" />
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "{canonical}#product",
    "name": "{schema_name}",
    "description": "{meta_desc}",
    "category": "{schema_cat}",
    "brand": {{"@type": "Brand", "name": "Stufiyan Agro"}},
    "manufacturer": {{"@type": "Organization", "name": "Stufiyan Agro", "url": "https://www.agros-grain.com"}},
    "countryOfOrigin": "{country_schema}",
    "offers": {{
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "priceSpecification": {{"@type": "PriceSpecification", "price": "0", "priceCurrency": "EUR"}},
      "availability": "https://schema.org/InStock",
      "seller": {{"@type": "Organization", "name": "Stufiyan Agro"}},
      "url": "{offers_url}"
    }},
    "isRelatedTo": [
      {related_items}
    ]
  }}
  </script>
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {{"@type": "ListItem", "position": 1, "name": "{bread_home}", "item": "https://www.agros-grain.com/{lang}"}},
      {{"@type": "ListItem", "position": 2, "name": "{bread_prods}", "item": "https://www.agros-grain.com/{lang}/products"}},
      {{"@type": "ListItem", "position": 3, "name": "{cat_info['bread']}", "item": "https://www.agros-grain.com/{lang}/products?cat={cat}"}},
      {{"@type": "ListItem", "position": 4, "name": "{name}", "item": "{canonical}"}}
    ]
  }}
  </script>
</head>
<body>

<!-- ===== UTILITY BAR ===== -->
<div class="util-bar">
  <div class="container">
    <div class="util-bar__inner">
      <div class="util-bar__left">
        <a href="tel:+359889297893" class="util-bar__item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.46 16z"/></svg>
          +359 889 297 893
        </a>
        <a href="mailto:sales@stufiyan-agro.com" class="util-bar__item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          sales@stufiyan-agro.com
        </a>
        <span class="util-bar__item util-bar__loc">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Varna, Bulgaria
        </span>
      </div>
      <div class="util-bar__right">
        <a href="/" {util_en_cls}>EN</a>
        <a href="/bg" {util_bg_cls}>BG</a>
        <a href="/de" {util_de_cls}>DE</a>
        <a href="https://www.linkedin.com/company/stufiyan-agro-llc" class="util-bar__linkedin" target="_blank" rel="noopener noreferrer" aria-label="Stufiyan Agro on LinkedIn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          LinkedIn
        </a>
      </div>
    </div>
  </div>
</div>

<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="container"><div class="nav__inner">
    <a href="{home_url}" class="nav__logo"><img src="../Media/logo.jpg" alt="Stufiyan Agro" class="nav__logo-img" /></a>
    <ul class="nav__links" role="list">
      <li><a href="{home_url}" class="nav__link">{nav_home}</a></li>
      <li class="nav__item--has-dropdown"><a href="{products_url}" class="nav__link">{nav_products} <svg class="nav__dropdown-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6l4 4 4-4"/></svg></a><div class="nav__mega-dropdown" id="nav-dropdown"></div></li>
      <li><a href="{home_url}/news" class="nav__link">{nav_news}</a></li>
      <li><a href="{home_url}/about" class="nav__link">{nav_about}</a></li>
      <li><a href="{contact_url}" class="nav__link">{nav_contact}</a></li>
    </ul>
    <div class="nav__lang">
      <a href="/{slug}" class="nav__lang-link{nav_lang_en_active}" hreflang="en">EN</a>
      <a href="/bg/{slug}" class="nav__lang-link{nav_lang_bg_active}" hreflang="bg">BG</a>
      <a href="/de/{slug}" class="nav__lang-link{nav_lang_de_active}" hreflang="de">DE</a>
    </div>
    <a href="{contact_url}" class="nav__cta">{nav_cta}</a>
    <button class="nav__hamburger" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
  </div></div>
</nav>
<div class="nav__mobile" role="dialog" aria-label="Mobile navigation">
  <nav class="nav__mobile-links">
    <a href="{home_url}" class="nav__mobile-link">{nav_home}</a>
    <a href="{products_url}" class="nav__mobile-link">{nav_products}</a>
    <a href="{home_url}/news" class="nav__mobile-link">{nav_news}</a>
    <a href="{home_url}/about" class="nav__mobile-link">{nav_about}</a>
    <a href="{contact_url}" class="nav__mobile-link">{nav_contact}</a>
  </nav>
  <a href="{contact_url}" class="nav__mobile-cta">{nav_cta}</a>
</div>

<main id="main-content">
<div class="breadcrumb"><div class="container"><ol class="breadcrumb__list">
  <li class="breadcrumb__item"><a href="{home_url}">{bread_home}</a></li>
  <li class="breadcrumb__sep">&rsaquo;</li>
  <li class="breadcrumb__item"><a href="{products_url}">{bread_prods}</a></li>
  <li class="breadcrumb__sep">&rsaquo;</li>
  <li class="breadcrumb__item"><a href="{products_url}?cat={cat}">{cat_info['bread']}</a></li>
  <li class="breadcrumb__sep">&rsaquo;</li>
  <li class="breadcrumb__item" aria-current="page">{name}</li>
</ol></div></div>

<section class="prod-hero" aria-labelledby="prod-title">
  <div class="container"><div class="prod-hero__content">
    <div>
      <p class="prod-hero__cat-label">{cat_info['hero']}</p>
      <h1 class="prod-hero__title" id="prod-title">{name}</h1>
      <p class="prod-hero__tagline">{tagline}</p>
      <div class="prod-hero__certs">{cert_html}</div>
      {hero_buttons}
    </div>
    <div class="prod-hero__moq">
      <p class="prod-hero__moq-heading">{moq_heading}</p>
      <div class="prod-hero__moq-row"><span class="prod-hero__moq-label">{moq_label}</span><span class="prod-hero__moq-val">{moq}</span></div>
      <div class="prod-hero__moq-row"><span class="prod-hero__moq-label">{origin_label}</span><span class="prod-hero__moq-val">{origin_val}</span></div>
      <hr class="prod-hero__moq-divider" />
      <p class="prod-hero__moq-heading" style="margin-bottom:0.75rem">{pkg_heading}</p>
      {pkg_rows}
    </div>
  </div></div>
</section>

<section class="prod-body section"><div class="container"><div class="prod-body__grid">
  <div class="prod-body__desc reveal reveal--left">
    <h2 class="prod-body__desc-title">{h2}</h2>
    {body}
  </div>
  <div class="reveal reveal--right">
    <h2 class="prod-body__desc-title">{"Технически спецификации" if lang == "bg" else "Technische Spezifikationen"}</h2>
    <table class="spec-table"><thead class="spec-table__head"><tr><th>{spec_th_p}</th><th>{spec_th_s}</th></tr></thead><tbody>
      {spec_html}
    </tbody></table>
  </div>
</div></div></section>

<section class="docs-section section"><div class="container">
  <div class="section__header reveal"><p class="section__eyebrow">{doc_title}</p><h2 class="section__title">{doc_sub}</h2></div>
  <div class="docs-grid reveal">
    {dc_html}
  </div>
</div></section>

<section class="cta-band"><div class="container"><div class="cta-band__inner"><div>
  <h2 class="cta-band__title">{cta_title}</h2>
  <p class="cta-band__subtitle">{cta_sub}</p>
</div><div class="cta-band__actions">
  <a href="{contact_url}" class="btn btn--gold">{"Запитване за цена" if lang == "bg" else "Preis anfragen"}</a>
  <a href="{products_url}?cat={cat}" class="btn btn--outline-light">{cta_btn_cat}</a>
</div></div></div></section>
</main>

<footer class="footer" role="contentinfo"><div class="container"><div class="footer__grid">
  <div class="footer__brand">
    <a href="{home_url}" class="footer__logo"><img src="../Media/logo.jpg" alt="Stufiyan Agro" class="footer__logo-img" loading="lazy" /></a>
    <p class="footer__tagline">{footer_tagline}</p>
    <p class="footer__tagline" style="margin-top:0.5rem;font-size:0.8rem;opacity:0.7;">{footer_vat}</p>
  </div>
  <div>
    <p class="footer__heading">{footer_h_prods}</p>
    <ul class="footer__links">
      <li><a href="{products_url}?cat=oil-seeds" class="footer__link">{footer_oil}</a></li>
      <li><a href="{products_url}?cat=grains" class="footer__link">{footer_grains}</a></li>
      <li><a href="{products_url}?cat=pulses" class="footer__link">{footer_pulses}</a></li>
      <li><a href="{products_url}?cat=retail" class="footer__link">{footer_retail}</a></li>
      <li><a href="{products_url}" class="footer__link">{footer_all}</a></li>
    </ul>
  </div>
  <div>
    <p class="footer__heading">{footer_h_co}</p>
    <ul class="footer__links">
      <li><a href="{home_url}" class="footer__link">{footer_home}</a></li>
      <li><a href="{contact_url}" class="footer__link">{footer_co_c}</a></li>
    </ul>
  </div>
  <div>
    <p class="footer__heading">{footer_h_ct}</p>
    <div class="footer__contact-item">
      <div><strong>{footer_sales_lbl}</strong> {footer_sales_name}<br>
        <a href="mailto:sales@stufiyan-agro.com" class="footer__contact-link">sales@stufiyan-agro.com</a>
      </div>
    </div>
    <div class="footer__contact-item" style="margin-top:0.75rem">
      <div><strong>{footer_acct_lbl}</strong> {footer_acct_name}<br>
        <a href="mailto:accounting@stufiyan-agro.com" class="footer__contact-link">accounting@stufiyan-agro.com</a>
      </div>
    </div>
    <div class="footer__contact-item" style="margin-top:0.75rem">
      <div><strong>{"Локация" if lang == "bg" else "Standort"}</strong><br>{footer_loc}</div>
    </div>
  </div>
</div></div>
<div class="footer__bottom"><div class="container" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
  <p class="footer__copy">{footer_copy}</p>
  <a href="{privacy_url}" class="footer__copy" style="text-decoration:underline;">{footer_priv}</a>
</div></div></footer>

<script src="{js_data}" defer></script>
<script src="../js/main.js" defer></script>
<script>document.addEventListener('DOMContentLoaded',function(){{{render_nav}{render_rel}}});</script>
</body>
</html>"""
    return html


# ── write files ──────────────────────────────────────────────────────────────

created = []
for p in PRODUCTS:
    for lang in ("bg", "de"):
        out_dir  = os.path.join(ROOT, lang)
        out_path = os.path.join(out_dir, f"{p['slug']}.html")
        os.makedirs(out_dir, exist_ok=True)
        content = build_page(lang, p)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(content)
        created.append(f"{lang}/{p['slug']}.html")

print(f"Created {len(created)} files:")
for name in created:
    print(f"  {name}")
