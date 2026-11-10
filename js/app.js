(() => {
  const DATA = window.EPASLUGA_DATA;
  const PAGE_SIZE = 16;
  const FAV_KEY = "epasluga-favs";
  const DRAFT_PREFIX = "epasluga-draft:";
  const APPS_KEY = "epasluga-apps";
  const NOTIF_KEY = "epasluga-notifs";
  const AUTH_KEY = "epasluga-auth";
  const NAV_SOON_KEY = "epasluga-nav-soon";
  const TRAIL_KEY = "epasluga-trail";
  const STATUSES = ["Черновик", "На проверке", "Ожидает оплаты", "Выполнено", "Отозвано", "Отказано"];
  const PERSONA = {
    lastName: "Иванов",
    firstName: "Алексей",
    middleName: "Сергеевич",
    fullName: "Иванов Алексей Сергеевич",
    shortName: "Алексей Сергеевич",
    initials: "АС",
    idNumber: "1140390A012PB8",
    birthDate: "14.03.1990",
    gender: "мужской",
    citizenship: "Республика Беларусь",
    address: "220030, г. Минск, ул. Карла Маркса, д. 14, кв. 27",
    passport: {
      series: "MP",
      number: "3456789",
      until: "15.08.2032",
      issued: "РУВД Московского района г. Минска",
    },
    contacts: [
      { type: "Мобильный телефон", value: "+375 29 555-12-34" },
      { type: "Домашний телефон", value: "+375 17 287-11-20" },
      { type: "Электронная почта", value: "a.ivanov@example.by" },
      { type: "Электронная почта (дополнительная)", value: "ivanov.as@mail.by" },
    ],
    phone: "+375 29 555-12-34",
    email: "a.ivanov@example.by",
  };

  const CATEGORIES = [
    { id: "ip", title: "Объекты промышленной собственности", desc: "Патенты, товарные знаки, лицензии на изобретения и бренды.", icon: "star" },
    { id: "law", title: "Правопорядок и ответственность", desc: "Судимость, штрафы не из ГАИ, банкротство, исполнительные листы.", icon: "scale" },
    { id: "edu", title: "Образование, наука и культура", desc: "Детский сад, учёба, стипендия, памятники и культура.", icon: "cap" },
    { id: "family", title: "Семья и быт", desc: "Пособия на детей, состав семьи, многодетность, захоронения.", icon: "family" },
    { id: "work", title: "Работа и занятость", desc: "Стаж, безработица, занятость в экономике, сведения о работе.", icon: "brief" },
    { id: "visa", title: "Визы и путешествия", desc: "Приглашения, временное проживание, пересечение границы.", icon: "plane" },
    { id: "internet", title: "Интернет, безопасность", desc: "Радиочастоты, радиолюбители, электронные средства связи.", icon: "wifi" },
    { id: "land", title: "Земельно-имущественные отношения", desc: "Жильё, земля, недвижимость, учёт нуждающихся.", icon: "home" },
    { id: "health", title: "Здравоохранение", desc: "Медсправки, больничные, сведения о здоровье.", icon: "health" },
    { id: "finance", title: "Финансы и торговля", desc: "Налоги, доходы, пенсии, торговый реестр, лицевой счёт.", icon: "wallet" },
    { id: "edo", title: "Электронный документооборот", desc: "Квитанции, проверка подлинности электронных документов.", icon: "folder" },
    { id: "documents", title: "Документы", desc: "Справки, выписки и сведения, которые не легли в другие темы.", icon: "file" },
    { id: "agro", title: "Сельское хозяйство", desc: "Паспорт животного, сорта растений, селекция.", icon: "leaf" },
    { id: "passport", title: "Гражданство, паспорт, ID-карта", desc: "Паспорт, регистрация, действительность документов, личные данные.", icon: "id" },
    { id: "border", title: "Граница и таможня", desc: "Декларации, таможенные платежи, пропуска в погранзону.", icon: "border" },
    { id: "gai", title: "ГАИ, транспорт", desc: "Авто, VIN, права, штрафы ПДД, диагностика.", icon: "car" },
    { id: "license", title: "Лицензирование", desc: "Лицензии, адвокатура, перевозки, оружие, образовательные разрешения.", icon: "check-square" },
  ];

  /* Жизненные ситуации на главной. Порядок и размер плиток — по опросу 214 человек. */
  const LIFE = [
    { id: "job", title: "Работа и справки", hint: "Справка о доходах, стаж, пособие по безработице", icon: "brief", size: "xl", pct: 57, sits: ["work"], re: /справк/ },
    { id: "move", title: "Переезд", hint: "Регистрация по месту жительства, жильё", icon: "move", size: "wide", pct: 47, sits: ["housing"], re: /по месту (жительства|пребывания)|место жительства/ },
    { id: "study", title: "Учёба", hint: "Садик, школа, колледж, вуз", icon: "cap", pct: 46, sits: ["study"] },
    { id: "baby", title: "Рождение ребёнка", hint: "Пособия, садик, состав семьи", icon: "baby", pct: 41, sits: ["family"] },
    { id: "business", title: "Своё дело", hint: "ИП, лицензии, репутация", icon: "building", pct: 37, sits: ["business"] },
    { id: "pets", title: "Питомцы", hint: "Паспорт животного", icon: "paw", pct: 37, re: /животн|ветерин/ },
    { id: "car", title: "Покупка авто", hint: "Регистрация, проверка по VIN", icon: "car", pct: 33, sits: ["transport"] },
    { id: "license", title: "Обмен прав", hint: "Медсправка водителя, удостоверение", icon: "id", pct: 32, re: /водител|права на управлен|удостоверени\S* мвд/ },
  ];

  const SOON = [
    "Деловая репутация",
    "Финансовая информация",
    "Почта гражданина",
    "Проверка документа",
    "Репозиторий документов",
    "Активация кабинета организации",
    "ЕС ИФЮЛ",
    "Документация",
  ];

  const NEWS = [
    { when: "Сегодня", tag: "Услуга", title: "Справка о доходах — без ID-карты", text: "Сведения, которыми располагает налоговый орган, можно получить в кабинете. Электронная подпись для этой справки не нужна." },
    { when: "Вчера", tag: "Работы", title: "1 ноября кабинет будет недоступен ночью", text: "Плановые работы с 00:00 до 02:00. Заявления и черновики сохранятся. Статусы, отправленные вечером 31 октября, обновятся после работ." },
    { when: "28 октября", tag: "Новый раздел", title: "Далонь: семейные начисления в одном месте", text: "Налоги, штрафы ГАИ, садик и кружки всей семьи — в одном списке. Реквизиты вводить не нужно, оплата через ЕРИП." },
    { when: "25 октября", tag: "Обновление", title: "Услуги собраны по категориям", text: "В каталоге сначала темы: ГАИ, семья, паспорт, налоги. Полный список — переключателем «Все услуги»." },
  ];

  const MONTHS_GEN = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const MONTHS_SHORT = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  /* ---------- Хранилище ---------- */

  function safeStore(name) {
    try {
      const s = window[name];
      s.setItem("__ep", "1");
      s.removeItem("__ep");
      return s;
    } catch (_) {
      const mem = {};
      return {
        getItem: (k) => (k in mem ? mem[k] : null),
        setItem: (k, v) => {
          mem[k] = String(v);
        },
        removeItem: (k) => {
          delete mem[k];
        },
      };
    }
  }
  const LS = safeStore("localStorage");
  const SS = safeStore("sessionStorage");

  function readJson(store, key, fallback) {
    try {
      const raw = store.getItem(key);
      if (raw == null) {
        return fallback;
      }
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }
  function writeJson(store, key, value) {
    try {
      store.setItem(key, JSON.stringify(value));
    } catch (_) {
      /* хранилище недоступно — демо работает без сохранения */
    }
  }

  const state = { route: { name: "home" }, q: "", situation: "", category: "", life: "", view: "cats", page: 1 };

  let trail = (() => {
    const saved = readJson(SS, TRAIL_KEY, []);
    return Array.isArray(saved) ? saved : [];
  })();
  const saveTrail = () => writeJson(SS, TRAIL_KEY, trail);
  const trailHas = (key) => trail.some((t) => t.key === key);

  const favs = new Set(readJson(LS, FAV_KEY, ["3.05.03", "200.12.1", "200.15.11"]));
  const saveFavs = () => writeJson(LS, FAV_KEY, [...favs]);
  if (LS.getItem(FAV_KEY) == null) {
    saveFavs();
  }
  function sortFavFirst(list) {
    return [...list].sort((a, b) => Number(favs.has(b.id)) - Number(favs.has(a.id)));
  }

  /* ---------- Утилиты ---------- */

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function plural(n, one, few, many) {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) {
      return `${n} ${one}`;
    }
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) {
      return `${n} ${few}`;
    }
    return `${n} ${many}`;
  }

  function startOfDay(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }
  function addDays(d, n) {
    const x = startOfDay(d);
    x.setDate(x.getDate() + n);
    return x;
  }
  function daysUntil(d) {
    return Math.round((startOfDay(d) - startOfDay(new Date())) / 86400000);
  }
  function fmtDay(d) {
    const x = new Date(d);
    return `${x.getDate()} ${MONTHS_GEN[x.getMonth()]}`;
  }
  function fmtDayShort(d) {
    const x = new Date(d);
    return { day: x.getDate(), mon: MONTHS_SHORT[x.getMonth()] };
  }
  function fmtMoney(n) {
    return Number(n).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function untilText(d) {
    const n = daysUntil(d);
    if (n < 0) {
      return `просрочено на ${plural(-n, "день", "дня", "дней")}`;
    }
    if (n === 0) {
      return "срок сегодня";
    }
    if (n === 1) {
      return "срок завтра";
    }
    return `осталось ${plural(n, "день", "дня", "дней")}`;
  }
  function toneFor(d) {
    const n = daysUntil(d);
    if (n <= 5) {
      return "urgent";
    }
    if (n <= 14) {
      return "soon";
    }
    return "calm";
  }

  function todayIso() {
    return new Date().toISOString();
  }
  function daysAgoIso(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  }

  function formatWhen(iso) {
    const d = new Date(iso);
    const diff = Math.round((startOfDay(new Date()) - startOfDay(d)) / 86400000);
    if (diff === 0) {
      return "Сегодня";
    }
    if (diff === 1) {
      return "Вчера";
    }
    return d.toLocaleDateString("ru-BY", { day: "numeric", month: "long", year: "numeric" });
  }

  function norm(s) {
    return (s || "").toLowerCase().replace(/ё/g, "е").trim();
  }

  /* ---------- Иконки ---------- */

  const ICONS = {
    home: `<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1v-8.5Z"/>`,
    user: `<circle cx="12" cy="8.2" r="3.4"/><path d="M5 19.5c1.4-3.2 4-4.8 7-4.8s5.6 1.6 7 4.8"/>`,
    bell: `<path d="M6.2 16.5h11.6l-1.3-2.2V10.2a4.5 4.5 0 0 0-9 0v4.1l-1.3 2.2Z"/><path d="M10 19.2a2.2 2.2 0 0 0 4 0"/>`,
    list: `<rect x="5" y="3.5" width="14" height="17" rx="2.2"/><path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4.5"/>`,
    grid: `<rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/>`,
    star: `<path d="m12 4.2 2.3 4.7 5.1.7-3.7 3.6.9 5.1L12 15.9l-4.6 2.4.9-5.1-3.7-3.6 5.1-.7L12 4.2Z"/>`,
    "star-fill": `<path d="m12 4.2 2.3 4.7 5.1.7-3.7 3.6.9 5.1L12 15.9l-4.6 2.4.9-5.1-3.7-3.6 5.1-.7L12 4.2Z" fill="currentColor"/>`,
    brief: `<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5"/><path d="M3.5 12.5h17"/>`,
    wallet: `<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H17v2.5"/><rect x="4" y="7.5" width="16" height="11.5" rx="2"/><path d="M15.5 13.2h2"/>`,
    mail: `<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4.5 7.5 7.5 5.5 7.5-5.5"/>`,
    building: `<path d="M4 20V9l6-3v14"/><path d="M10 20V4.5l10 3.5v12"/><path d="M3 20h18"/><path d="M13.5 10.5h3M13.5 14h3M6.5 12h1M6.5 15.5h1"/>`,
    search: `<circle cx="11" cy="11" r="6.2"/><path d="m19.5 19.5-4-4"/>`,
    folder: `<path d="M3.5 7a1.5 1.5 0 0 1 1.5-1.5h4.6l2 2.2H19a1.5 1.5 0 0 1 1.5 1.5v8.3A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5V7Z"/>`,
    id: `<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><circle cx="8.7" cy="11.2" r="2"/><path d="M5.8 15.6c.6-1.3 1.7-2 2.9-2s2.3.7 2.9 2M14 10h4.5M14 13.2h3"/>`,
    "check-square": `<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8.2 12.2 2.6 2.6 5-5.3"/>`,
    check: `<path d="m5 12.5 4.4 4.4L19 7.4"/>`,
    file: `<path d="M7 3.5h7l4.5 4.5v12.5H7a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 7 3.5Z"/><path d="M14 3.5V8h4.5"/><path d="M9 13h6M9 16.3h4"/>`,
    car: `<path d="M5.2 12 7 7.6A2 2 0 0 1 8.8 6.3h6.4a2 2 0 0 1 1.8 1.3l1.8 4.4"/><path d="M3.5 13.5a1.5 1.5 0 0 1 1.5-1.5h14a1.5 1.5 0 0 1 1.5 1.5v3.5h-17v-3.5Z"/><path d="M6 17v2M18 17v2"/><circle cx="7.6" cy="14.6" r=".7" fill="currentColor"/><circle cx="16.4" cy="14.6" r=".7" fill="currentColor"/>`,
    hand: `<path d="M8 13V6.2a1.5 1.5 0 0 1 3 0V12"/><path d="M11 11.5V4.7a1.5 1.5 0 0 1 3 0v6.8"/><path d="M14 11.5V5.9a1.5 1.5 0 0 1 3 0v8.1c0 3.7-2.6 6.5-6.1 6.5-2 0-3.7-1-4.8-2.6L3.9 14.3a1.6 1.6 0 0 1 2.5-2L8 14"/>`,
    family: `<circle cx="8" cy="7" r="2.6"/><circle cx="16.5" cy="8.5" r="2.1"/><path d="M3.5 19c.6-3.4 2.3-5.4 4.5-5.4s3.9 2 4.5 5.4"/><path d="M13 19c.5-2.6 1.8-4.1 3.5-4.1s3 1.5 3.5 4.1"/>`,
    cap: `<path d="m2.8 9.3 9.2-4.6 9.2 4.6-9.2 4.6-9.2-4.6Z"/><path d="M6.5 11.2v4.3c1.5 1.4 3.4 2.1 5.5 2.1s4-.7 5.5-2.1v-4.3"/><path d="M21.2 9.3v5"/>`,
    move: `<path d="M3 11.2 9.5 5.5l6.5 5.7"/><path d="M5 9.6V19h9V9.6"/><path d="M15.5 15.5h5.5m-2.2-2.3 2.2 2.3-2.2 2.3"/>`,
    baby: `<path d="M3.5 6h2l1.3 2.6"/><path d="M6.8 8.6h12.7a6.8 6.8 0 0 1-6.8 6.6h-1.4a5 5 0 0 1-4.5-6.6Z"/><path d="M13 8.6V3.8a6 6 0 0 1 6.5 4.8"/><circle cx="9" cy="19" r="1.6"/><circle cx="16" cy="19" r="1.6"/>`,
    paw: `<circle cx="6.8" cy="10.2" r="1.7"/><circle cx="10" cy="6.5" r="1.7"/><circle cx="14.4" cy="6.5" r="1.7"/><circle cx="17.6" cy="10.2" r="1.7"/><path d="M8.3 17.2c0-2.9 1.8-5.2 3.9-5.2s3.9 2.3 3.9 5.2c0 1.6-1.2 2.5-2.6 2.2-.6-.1-1-.4-1.3-.4s-.7.3-1.3.4c-1.4.3-2.6-.6-2.6-2.2Z"/>`,
    calendar: `<rect x="4" y="5.5" width="16" height="14.5" rx="2.2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>`,
    clock: `<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>`,
    shield: `<path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-2.5Z"/><path d="m9 12 2.2 2.2 3.9-4"/>`,
    lock: `<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/><path d="M12 14.5v2.5"/>`,
    logout: `<path d="M14 4.5h3.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H14"/><path d="M10 16.5 5.5 12 10 7.5M5.5 12H15"/>`,
    x: `<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>`,
    alert: `<path d="M10.3 4.9a2 2 0 0 1 3.4 0l7 12.2a2 2 0 0 1-1.7 3H5a2 2 0 0 1-1.7-3l7-12.2Z"/><path d="M12 9.5v4.5M12 17v.1"/>`,
    info: `<circle cx="12" cy="12" r="8.2"/><path d="M12 11v5.2M12 7.8v.1"/>`,
    download: `<path d="M12 4v10.5m-4.2-4.2L12 14.5l4.2-4.2"/><path d="M5 19.5h14"/>`,
    "chev-right": `<path d="m9.5 6 6 6-6 6"/>`,
    "chev-left": `<path d="m14.5 6-6 6 6 6"/>`,
    "chev-down": `<path d="m6 9.5 6 6 6-6"/>`,
    sms: `<path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 19 17h-8.5l-4.5 3.5V17H5a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 5 5.5Z"/><path d="M8.5 11.3h.1M12 11.3h.1M15.5 11.3h.1"/>`,
    finger: `<path d="M7.6 18.6c.9-1.9 1.4-3.9 1.4-6.1a3 3 0 0 1 6 0c0 1.2-.1 2.4-.4 3.5"/><path d="M12 12.5c0 3-.7 5.6-2.1 7.8"/><path d="M5 15.7c.4-1 .5-2.1.5-3.2a6.5 6.5 0 0 1 11.3-4.4"/><path d="M18.3 10.6c.2.6.2 1.3.2 1.9 0 1.7-.2 3.3-.6 4.8"/><path d="M14.4 19.9c.4-.8.7-1.7.9-2.6"/>`,
    phone: `<rect x="7" y="3" width="10" height="18" rx="2.4"/><path d="M11 17.6h2"/>`,
    receipt: `<path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3v-17Z"/><path d="M9 8h6M9 11.5h6M9 15h3.5"/>`,
    card: `<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="M3 10h18M7 15h3"/>`,
    more: `<circle cx="6" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18" cy="12" r="1.2" fill="currentColor"/>`,
    refresh: `<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.6 4.5v4h-4"/>`,
    archive: `<rect x="3.5" y="4.5" width="17" height="4.2" rx="1.2"/><path d="M5 8.7V18a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 18V8.7M10 12.5h4"/>`,
    undo: `<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>`,
    trash: `<path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.5h6.4a1.5 1.5 0 0 0 1.5-1.5l.8-12"/>`,
    edit: `<path d="M5 19h3.5L19 8.5 15.5 5 5 15.5V19Z"/><path d="m13.5 7 3.5 3.5"/>`,
    child: `<circle cx="12" cy="6.5" r="2.6"/><path d="M8.5 20.5v-6L6 12.3l2.7-2.6h6.6l2.7 2.6-2.5 2.2v6"/><path d="M12 15v5.5"/>`,
    tax: `<path d="M4 9.5 12 5l8 4.5"/><path d="M5.5 10v7M9.8 10v7M14.2 10v7M18.5 10v7"/><path d="M3.5 19.5h17"/>`,
    scale: `<path d="M12 4v15.5M7 19.5h10M5 7.5h14"/><path d="m5 7.5-2.5 6a3 3 0 0 0 5 0L5 7.5ZM19 7.5l-2.5 6a3 3 0 0 0 5 0L19 7.5Z"/>`,
    plane: `<path d="M10.5 13.5 4 11.3l1.3-1.3 7.2.8 4.3-4.3a1.8 1.8 0 0 1 2.6 2.6l-4.3 4.3.8 7.2-1.3 1.3-2.2-6.5-3 3v2.4l-1 1-1.4-3-3-1.4 1-1h2.4l3-3Z"/>`,
    wifi: `<path d="M4 9.5a11.5 11.5 0 0 1 16 0"/><path d="M7 12.8a7 7 0 0 1 10 0"/><path d="M10 16a2.8 2.8 0 0 1 4 0"/><circle cx="12" cy="18.8" r=".8" fill="currentColor"/>`,
    health: `<path d="M12 20s-7.5-4.3-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.7-7.5 10-7.5 10Z"/><path d="M9.5 12.5h5M12 10v5"/>`,
    leaf: `<path d="M5 19c0-8 5-13.5 14-14 .4 8.8-5 14-12.4 14"/><path d="M5 19c2.5-4 5.4-6.6 9-8.5"/>`,
    border: `<path d="M5 20.5V4"/><path d="M5 5h11.5l-2 3.2 2 3.3H5"/>`,
    plus: `<path d="M12 5.5v13M5.5 12h13"/>`,
    eye: `<path d="M2.8 12S6.2 5.5 12 5.5 21.2 12 21.2 12 17.8 18.5 12 18.5 2.8 12 2.8 12Z"/><circle cx="12" cy="12" r="2.8"/>`,
    pin: `<path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 0 0-13 0c0 5.4 6.5 11 6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>`,
  };

  function icon(name, size = 22) {
    return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ICONS.file}</svg>`;
  }

  /* Орнамент: ромб «вышивки» из клеток 9×9 и точка-разделитель. */
  const ORN_CELLS = [
    [4, 0], [3, 1], [5, 1], [2, 2], [4, 2], [6, 2],
    [1, 3], [3, 3], [4, 3], [5, 3], [7, 3],
    [0, 4], [2, 4], [3, 4], [5, 4], [6, 4], [8, 4], [10, 4],
    [1, 5], [3, 5], [4, 5], [5, 5], [7, 5],
    [2, 6], [4, 6], [6, 6], [3, 7], [5, 7], [4, 8],
  ];
  const ORN_RECTS = ORN_CELLS.map(([x, y]) => `<rect x="${x}" y="${y}" width="1" height="1"/>`).join("");

  function ornament(id, cell = 3) {
    const w = 12 * cell;
    const h = 9 * cell;
    return `<svg class="orn" width="100%" height="${h}" aria-hidden="true" focusable="false">
      <defs><pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"><g transform="scale(${cell})" fill="currentColor">${ORN_RECTS}</g></pattern></defs>
      <rect width="100%" height="${h}" fill="url(#${id})"/>
    </svg>`;
  }

  function brandMark() {
    return `<svg class="mark" viewBox="0 0 36 36" aria-hidden="true" focusable="false">
      <rect width="36" height="36" rx="11" class="mark-bg"/>
      <path d="M18 7.5 28.5 18 18 28.5 7.5 18Z" class="mark-line"/>
      <path d="M18 13.2 22.8 18 18 22.8 13.2 18Z" class="mark-core"/>
    </svg>`;
  }

  /* ---------- Данные услуг ---------- */

  function serviceCategory(s) {
    const t = `${s.title} ${s.official} ${s.code}`.toLowerCase();
    if (s.situations.includes("ip") || /патент|товарн|изобрет|полезн|бренд|селекц/.test(t)) {
      if (/сорт расте|животн|стада|селекц/.test(t)) {
        return "agro";
      }
      return "ip";
    }
    if (s.situations.includes("transport") || /гибдд|пдд|vin|автомоб|транспорт|водитель|гаи/.test(t)) {
      return "gai";
    }
    if (s.situations.includes("customs") || /тамож|погран/.test(t)) {
      return "border";
    }
    if (s.situations.includes("health") || /медицин|больнич|здоров/.test(t)) {
      return "health";
    }
    if (s.situations.includes("study") || /образован|садик|стипенд|талантлив/.test(t)) {
      return "edu";
    }
    if (/виз|приглашен|временн(ое|ого) прожив|пересечен/.test(t)) {
      return "visa";
    }
    if (/паспорт|гражданств|id-карт|удостовер.*личн|регистрац.*населен/.test(t) && !/авто|транспорт/.test(t)) {
      return "passport";
    }
    if (s.situations.includes("family") || /пособи|дете|семь|многодетн|захоронен/.test(t)) {
      return "family";
    }
    if (s.situations.includes("housing") || /жил|земел|недвижим|кадастр/.test(t)) {
      return "land";
    }
    if (s.situations.includes("work") && !s.situations.includes("tax")) {
      return "work";
    }
    if (/радио|частот|интернет/.test(t)) {
      return "internet";
    }
    if (/квитанц|дtc|дтс|подлинност.*эд|электронн.*документ/.test(t)) {
      return "edo";
    }
    if (/лиценз|адвокат|оруж/.test(t) || s.situations.includes("business")) {
      return "license";
    }
    if (/правонаруш|судим|банкрот|исполнител|приказн/.test(t) || s.situations.includes("army")) {
      return "law";
    }
    if (s.situations.includes("tax") || s.situations.includes("pension") || /налог|доход|пенс|торгов/.test(t)) {
      return "finance";
    }
    return "documents";
  }

  const CAT_COUNTS = (() => {
    const counts = {};
    DATA.services.forEach((s) => {
      const c = serviceCategory(s);
      counts[c] = (counts[c] || 0) + 1;
    });
    return counts;
  })();

  function lifeById(id) {
    return LIFE.find((l) => l.id === id);
  }

  function lifeMatch(life, s) {
    const text = `${s.title} ${s.official}`.toLowerCase();
    const bySit = (life.sits || []).some((x) => s.situations.includes(x));
    const byRe = life.re ? life.re.test(text) : false;
    return bySit || byRe;
  }

  function serviceById(id) {
    return DATA.services.find((s) => s.id === id || s.code === id);
  }

  function searchServices(q, situation, category, life) {
    const query = norm(q);
    let list = DATA.services;
    if (situation) {
      list = list.filter((s) => s.situations.includes(situation));
    }
    if (category) {
      list = list.filter((s) => serviceCategory(s) === category);
    }
    const lifeObj = life ? lifeById(life) : null;
    if (lifeObj) {
      list = list.filter((s) => lifeMatch(lifeObj, s));
    }
    if (!query) {
      return list;
    }
    const synHits = new Set();
    Object.entries(DATA.synonyms).forEach(([key, ids]) => {
      if (query.includes(norm(key)) || norm(key).includes(query)) {
        ids.forEach((id) => synHits.add(id));
      }
    });
    const isSyn = (s) => synHits.has(s.code) || synHits.has(s.id);
    const inTitle = (s) => norm(s.title).includes(query);
    const rank = (s) => (isSyn(s) ? 0 : inTitle(s) ? 1 : 2);
    return list
      .filter((s) => {
        const blob = norm([s.title, s.official, s.code, s.org.name].join(" "));
        return blob.includes(query) || isSyn(s);
      })
      .sort((a, b) => rank(a) - rank(b));
  }

  function suggestions(q) {
    const found = searchServices(q, "", "", "");
    const cats = CATEGORIES.filter((c) => norm(c.title + " " + c.desc).includes(norm(q)));
    const extra = [];
    Object.entries(DATA.synonyms).forEach(([key, ids]) => {
      if (norm(key).includes(norm(q))) {
        extra.push({ key, ids });
      }
    });
    return { services: found.slice(0, 6), syn: extra.slice(0, 2), cats: cats.slice(0, 3) };
  }

  /* ---------- Заявления и уведомления ---------- */

  function normalizeApp(r) {
    let status = r.status || "На проверке";
    if (status.includes("Принято")) {
      status = "На проверке";
    }
    return {
      id: r.id || "a" + (r.num || Date.now()),
      num: r.num,
      title: r.title,
      serviceId: r.serviceId,
      initiator: r.initiator || "—",
      status: STATUSES.includes(status) ? status : "На проверке",
      at: r.at || todayIso(),
      comment: r.comment || "",
    };
  }
  function seedApps() {
    const rows = [
      { id: "a1", num: "453346557107272", title: "Справка о доходах", serviceId: "3.05.03", initiator: "Министерство по налогам и сборам", status: "Выполнено", at: daysAgoIso(0), comment: "" },
      { id: "a2", num: "289953663290680", title: "Справка о доходах", serviceId: "3.05.03", initiator: "Министерство по налогам и сборам", status: "Ожидает оплаты", at: daysAgoIso(0), comment: "" },
      { id: "a3", num: "100294837561002", title: "Паспорт", serviceId: "200.12.1", initiator: "Министерство внутренних дел", status: "На проверке", at: daysAgoIso(1), comment: "" },
      { id: "a4", num: "100294837561088", title: "Зарегистрировать авто", serviceId: "200.15.11", initiator: "Министерство внутренних дел", status: "Черновик", at: daysAgoIso(2), comment: "" },
      { id: "a5", num: "100294837561201", title: "Справка призывнику", serviceId: "200.20.5", initiator: "Министерство обороны", status: "Отозвано", at: daysAgoIso(4), comment: "" },
      { id: "a6", num: "100294837561333", title: "Лицензия адвоката", serviceId: "200.17-1.1", initiator: "Министерство юстиции", status: "Отказано", at: daysAgoIso(8), comment: "Неполный комплект документов" },
    ];
    const existing = readJson(LS, APPS_KEY, null);
    if (!Array.isArray(existing)) {
      writeJson(LS, APPS_KEY, rows);
      return rows;
    }
    const stored = existing.map(normalizeApp);
    if (stored.some((r) => r.id === "a1")) {
      return stored;
    }
    const merged = [...stored.filter((r) => r.num && !rows.some((s) => s.num === r.num)), ...rows];
    writeJson(LS, APPS_KEY, merged);
    return merged;
  }
  function loadApps() {
    return seedApps();
  }
  function saveApps(rows) {
    writeJson(LS, APPS_KEY, rows);
  }

  function seedNotifs() {
    const existing = readJson(LS, NOTIF_KEY, null);
    if (Array.isArray(existing)) {
      return existing;
    }
    const rows = [
      { id: "n1", kind: "legal", title: "Справка о доходах — готово", body: "Документ можно скачать в разделе «Мои услуги».", at: daysAgoIso(0), archived: false },
      { id: "n2", kind: "legal", title: "Справка о доходах — ожидает оплаты", body: "Заявление 289953663290680 не будет выдано, пока не поступит оплата.", at: daysAgoIso(0), archived: false },
      { id: "n7", kind: "info", title: "Далонь: скидка 50% на штраф ГАИ скоро закончится", body: "Штраф по автомобилю 7714 AB-7 можно оплатить за половину суммы. Откройте раздел «Далонь» в меню — ссылок на оплату в уведомлениях мы не присылаем.", at: daysAgoIso(0), archived: false },
      { id: "n3", kind: "legal", title: "Справка призывнику — отозвано", body: "Вы отменили заявление. Документ не действует. Можно подать новое.", at: daysAgoIso(4), archived: false },
      { id: "n4", kind: "legal", title: "Лицензия адвоката — отказано", body: "Ведомство не смогло оказать услугу. Причина указана в «Мои услуги».", at: daysAgoIso(8), archived: false },
      { id: "n5", kind: "info", title: "Плановые работы на портале 1 ноября", body: "Ночью кабинет может быть недоступен около двух часов.", at: daysAgoIso(1), archived: false },
      { id: "n6", kind: "info", title: "Черновик заявления не отправлен", body: "Регистрация авто сохранена как черновик. Его можно дозаполнить в «Мои услуги».", at: daysAgoIso(2), archived: false },
    ];
    writeJson(LS, NOTIF_KEY, rows);
    return rows;
  }
  function loadNotifs() {
    return seedNotifs();
  }
  function saveNotifs(rows) {
    writeJson(LS, NOTIF_KEY, rows);
  }
  function addNotif(kind, title, body) {
    const rows = loadNotifs();
    rows.unshift({ id: "n" + Date.now() + Math.floor(Math.random() * 1000), kind, title, body, at: todayIso(), archived: false });
    saveNotifs(rows);
  }

  /* ---------- Вход ---------- */

  function getAuth() {
    return readJson(LS, AUTH_KEY, null);
  }
  function isAuthed() {
    const a = getAuth();
    return !!(a && a.method);
  }
  function setAuth(method) {
    writeJson(LS, AUTH_KEY, { method, at: todayIso() });
  }
  function logout() {
    LS.removeItem(AUTH_KEY);
    go("#/login");
  }

  /* ---------- Маршруты ---------- */

  function parseHash() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, query = ""] = raw.split("?");
    const params = new URLSearchParams(query);
    const parts = path.split("/").filter(Boolean);
    if (!parts.length) {
      return { name: "home" };
    }
    const head = parts[0];
    if (head === "login") {
      return { name: "login", next: params.get("next") || "" };
    }
    if (head === "catalog") {
      const cat = params.get("cat") || "";
      const life = params.get("life") || "";
      const view = params.get("view") || (cat || life ? "list" : "cats");
      return {
        name: "catalog",
        q: params.get("q") || "",
        situation: params.get("sit") || "",
        category: cat,
        life,
        view,
        page: Math.max(1, parseInt(params.get("page") || "1", 10)),
      };
    }
    if (head === "service" && parts[1]) {
      return {
        name: "service",
        id: decodeURIComponent(parts[1]),
        from: params.get("from") || "list",
        cat: params.get("cat") || "",
      };
    }
    if (head === "profile") {
      return { name: "profile" };
    }
    if (head === "apps") {
      return { name: "apps" };
    }
    if (head === "inbox") {
      return { name: "inbox", box: params.get("box") || "in", kind: params.get("kind") || "" };
    }
    if (head === "dalon") {
      return { name: "dalon", sub: parts[1] || "panel", params };
    }
    if (head === "more") {
      return { name: "more" };
    }
    return { name: "home" };
  }

  function go(hash) {
    location.hash = hash.startsWith("#") ? hash : `#${hash}`;
  }

  function catalogHash(over = {}) {
    const pick = (k) => (over[k] !== undefined ? over[k] : state[k]);
    const q = pick("q");
    const sit = pick("situation");
    const cat = pick("category");
    const life = pick("life");
    const view = pick("view");
    const page = pick("page");
    const p = new URLSearchParams();
    if (view && view !== "cats") {
      p.set("view", view);
    }
    if (q) {
      p.set("q", q);
    }
    if (sit) {
      p.set("sit", sit);
    }
    if (cat) {
      p.set("cat", cat);
    }
    if (life) {
      p.set("life", life);
    }
    if (page > 1) {
      p.set("page", String(page));
    }
    const qs = p.toString();
    return `#/catalog${qs ? `?${qs}` : ""}`;
  }

  function serviceHref(s) {
    return `#/service/${encodeURIComponent(s.id)}`;
  }

  const DALON_LABELS = { panel: "Панель", reminders: "Напоминания", family: "Семья и права", pay: "Оплата", history: "История и квитанции" };

  function crumbNode(route) {
    if (route.name === "home") {
      return { key: "home", href: "#/", label: "Главная", root: true };
    }
    if (route.name === "profile") {
      return { key: "profile", href: "#/profile", label: "Мой профиль", root: true };
    }
    if (route.name === "apps") {
      return { key: "apps", href: "#/apps", label: "Мои услуги", root: true };
    }
    if (route.name === "more") {
      return { key: "more", href: "#/more", label: "Ещё", root: true };
    }
    if (route.name === "dalon") {
      return { key: "dalon", href: "#/dalon", label: "Далонь", root: true };
    }
    if (route.name === "inbox") {
      if (route.box === "arch") {
        return {
          key: "inbox-arch",
          href: "#/inbox?box=arch",
          label: "Архив",
          fallback: [{ key: "inbox", href: "#/inbox", label: "Уведомления" }],
        };
      }
      return { key: "inbox", href: "#/inbox", label: "Уведомления", root: true };
    }
    if (route.name === "catalog") {
      if (route.view === "favs") {
        return { key: "favs", href: "#/catalog?view=favs", label: "Избранные услуги", root: true };
      }
      if (route.life) {
        const life = lifeById(route.life);
        return {
          key: "life:" + route.life,
          href: catalogHash({ life: route.life, view: "list", page: 1, q: "", situation: "", category: "" }),
          label: life ? life.title : "Жизненная ситуация",
          root: true,
        };
      }
      if (route.category) {
        const cat = CATEGORIES.find((c) => c.id === route.category);
        return {
          key: "cat:" + route.category,
          href: catalogHash({ category: route.category, view: "list", page: 1, q: "", situation: "", life: "" }),
          label: cat ? cat.title : "Категория",
          fallback: [{ key: "cats", href: "#/catalog", label: "Услуги по категориям" }],
        };
      }
      if (route.view === "cats") {
        return { key: "cats", href: "#/catalog", label: "Услуги по категориям", root: true };
      }
      return { key: "list", href: "#/catalog?view=list", label: "Все услуги", root: true };
    }
    if (route.name === "service") {
      const svc = serviceById(route.id);
      let fallback = [{ key: "list", href: "#/catalog?view=list", label: "Все услуги" }];
      if (route.from === "apps") {
        fallback = [{ key: "apps", href: "#/apps", label: "Мои услуги" }];
      } else if (route.from === "favs") {
        fallback = [{ key: "favs", href: "#/catalog?view=favs", label: "Избранные услуги" }];
      } else if (route.from === "cats") {
        fallback = [{ key: "cats", href: "#/catalog", label: "Услуги по категориям" }];
        const cat = CATEGORIES.find((c) => c.id === route.cat);
        if (cat) {
          fallback.push({
            key: "cat:" + cat.id,
            href: catalogHash({ category: cat.id, view: "list", page: 1, q: "", situation: "", life: "" }),
            label: cat.title,
          });
        }
      }
      return {
        key: "svc:" + route.id,
        href: `#/service/${encodeURIComponent(route.id)}`,
        label: svc ? svc.title : "Услуга",
        leaf: true,
        fallback,
      };
    }
    return { key: "home", href: "#/", label: "Главная", root: true };
  }

  function syncTrail(node) {
    const home = { key: "home", href: "#/", label: "Главная" };
    const asItem = (n) => ({ key: n.key, href: n.href, label: n.label, leaf: !!n.leaf });
    if (!node || node.key === "home") {
      trail = [home];
    } else if (node.root) {
      trail = [home, asItem(node)];
    } else {
      const idx = trail.findIndex((t) => t.key === node.key);
      const last = trail[trail.length - 1];
      if (idx >= 0) {
        trail = trail.slice(0, idx).concat([asItem(node)]);
      } else if (node.leaf && last && last.leaf) {
        trail = trail.slice(0, -1).concat([asItem(node)]);
      } else if (trail.length > 1) {
        trail = trail.concat([asItem(node)]);
      } else {
        trail = [home, ...(node.fallback || []), asItem(node)];
      }
    }
    saveTrail();
  }

  function crumb(parts) {
    const items = parts
      .map((p, i) => {
        const last = i === parts.length - 1;
        if (!last && p.href) {
          return `<li><a href="${p.href}">${esc(p.label)}</a></li>`;
        }
        return `<li aria-current="page">${esc(p.label)}</li>`;
      })
      .join("");
    return `<nav class="crumb" aria-label="Вы здесь"><ol>${items}</ol></nav>`;
  }

  function pageCrumb() {
    if (trail.length < 2) {
      return "";
    }
    return crumb(trail.map((t, i) => (i === trail.length - 1 ? { label: t.label } : t)));
  }

  /* ---------- Оболочка ---------- */

  function dalonApi() {
    return window.EP_DALON || null;
  }

  function navHtml() {
    const r = state.route;
    const fromApps = r.name === "service" && trailHas("apps");
    const fromFavs = r.name === "service" && trailHas("favs");
    const fromCats = r.name === "service" && trail.some((t) => t.key === "cats" || t.key.startsWith("cat:"));
    const catsOn = r.name === "catalog" ? r.view === "cats" || (!!r.category && !r.life) : fromCats;
    const favsOn = r.name === "catalog" ? r.view === "favs" : fromFavs;
    const listOn = r.name === "catalog" ? !catsOn && !favsOn : r.name === "service" && !fromApps && !fromFavs && !fromCats;
    const apps = loadApps();
    const needAct = apps.filter((a) => a.status === "Ожидает оплаты" || a.status === "Черновик").length;
    const unread = loadNotifs().filter((n) => !n.archived).length;
    const dal = dalonApi() ? dalonApi().summary(ctx) : null;
    const soonOpen = readJson(SS, NAV_SOON_KEY, false);
    const link = (o) => {
      const cls = ["nav-link", o.active ? "is-active" : "", o.cls || ""].join(" ").trim();
      const badge = o.badge ? `<span class="nav-badge">${o.badge}${o.badgeLabel ? `<span class="sr"> ${o.badgeLabel}</span>` : ""}</span>` : "";
      return `<a class="${cls}" href="${o.href}"${o.active ? ' aria-current="page"' : ""}>${icon(o.icon)}<span class="nav-text">${o.label}</span>${badge}</a>`;
    };
    return `
      <div class="nav-group">
        ${link({ href: "#/", icon: "home", label: "Главная", active: r.name === "home" })}
        ${link({ href: "#/dalon", icon: "hand", label: "Далонь", cls: "nav-dalon", active: r.name === "dalon", badge: dal && dal.count ? dal.count : "", badgeLabel: "начислений к оплате" })}
        ${link({ href: "#/apps", icon: "list", label: "Мои услуги", active: r.name === "apps" || fromApps, badge: needAct || "", badgeLabel: "ждут действия" })}
        ${link({ href: "#/inbox", icon: "bell", label: "Уведомления", active: r.name === "inbox", badge: unread || "", badgeLabel: "во входящих" })}
        ${link({ href: "#/profile", icon: "user", label: "Мой профиль", active: r.name === "profile" })}
      </div>
      <div class="nav-group">
        <p class="nav-cap">Услуги</p>
        ${link({ href: "#/catalog", icon: "grid", label: "По категориям", active: catsOn })}
        ${link({ href: "#/catalog?view=list", icon: "search", label: "Все услуги", active: listOn })}
        ${link({ href: "#/catalog?view=favs", icon: "star", label: "Избранное", active: favsOn, badge: favs.size || "", badgeLabel: "в избранном" })}
      </div>
      <details class="nav-soon" id="nav-soon"${soonOpen ? " open" : ""}>
        <summary>${icon("more")}<span class="nav-text">Ещё</span><span class="soon-tag">скоро</span>${icon("chev-down", 18)}</summary>
        <p class="nav-soon-note">Эти разделы портала появятся в следующих версиях прототипа. Пока они не открываются.</p>
        <ul>${SOON.map((t) => `<li>${t}</li>`).join("")}</ul>
      </details>
    `;
  }

  function tabbarHtml() {
    const r = state.route;
    const tab = (href, ico, label, active) =>
      `<a class="tab-link${active ? " is-active" : ""}" href="${href}"${active ? ' aria-current="page"' : ""}>${icon(ico, 24)}<span>${label}</span></a>`;
    return [
      tab("#/", "home", "Главная", r.name === "home"),
      tab("#/catalog", "grid", "Услуги", r.name === "catalog" || (r.name === "service" && !trailHas("apps"))),
      tab("#/dalon", "hand", "Далонь", r.name === "dalon"),
      tab("#/apps", "list", "Заявления", r.name === "apps" || (r.name === "service" && trailHas("apps"))),
      tab("#/more", "more", "Ещё", r.name === "more" || r.name === "profile" || r.name === "inbox"),
    ].join("");
  }

  function layout(inner) {
    const r = state.route;
    const unread = loadNotifs().filter((n) => !n.archived).length;
    return `
      <button class="skip" type="button" data-skip>Перейти к содержанию</button>
      <aside class="side" aria-label="Меню кабинета">
        <a class="side-brand" href="#/">${brandMark()}<span><b>Е-Паслуга</b><small>Личный кабинет</small></span></a>
        <nav class="nav" aria-label="Разделы">${navHtml()}</nav>
        <div class="side-orn">${ornament("orn-side", 2)}</div>
      </aside>
      <div class="work">
        <header class="top">
          <a class="top-brand" href="#/">${brandMark()}<b>Е-Паслуга</b></a>
          <p class="top-place">Личный кабинет гражданина</p>
          <div class="top-actions">
            <a class="top-icon" href="#/inbox" aria-label="Уведомления${unread ? `, во входящих ${unread}` : ""}">${icon("bell")}${unread ? `<span class="dot-count">${unread}</span>` : ""}</a>
            <a class="top-user" href="#/profile" title="Мой профиль"><span class="avatar">${PERSONA.initials}</span><span class="top-user-name">${PERSONA.shortName}</span></a>
            <button class="top-out" type="button" data-logout>${icon("logout", 20)}<span>Выйти</span></button>
          </div>
        </header>
        <main class="page page-${r.name}" id="main" tabindex="-1">${inner}</main>
        <footer class="foot">
          <div>
            <p>© 2026 Республиканское унитарное предприятие «Национальный центр электронных услуг»</p>
            <p>220140, г. Минск, ул. Притыцкого, 64. УНП 191700161</p>
            <p class="foot-note">Учебный прототип. Данные условные, оплата демонстрационная.</p>
          </div>
          <ul class="pay-row" aria-label="Способы оплаты">
            ${["ЕРИП", "Белкарт", "Visa", "Mastercard", "МИР"].map((t) => `<li>${t}</li>`).join("")}
          </ul>
        </footer>
      </div>
      <nav class="tabbar" aria-label="Основные разделы">${tabbarHtml()}</nav>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
      <div class="modal-back" id="modal"></div>
    `;
  }

  /* ---------- Тосты и модальные окна ---------- */

  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    if (!el) {
      return;
    }
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove("is-on");
    }, 2800);
  }

  let lastFocus = null;
  function openModal(html, onOpen) {
    const back = $("#modal");
    if (!back) {
      return;
    }
    lastFocus = document.activeElement;
    back.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">${html}</div>`;
    back.classList.add("is-on");
    document.body.classList.add("has-modal");
    const box = $(".modal", back);
    $$("[data-close]", box).forEach((b) => {
      b.addEventListener("click", closeModal);
    });
    back.onclick = (e) => {
      if (e.target === back) {
        closeModal();
      }
    };
    if (onOpen) {
      onOpen(box);
    }
    const first = $("input:not([disabled]), select, textarea, button", box);
    if (first) {
      first.focus();
    }
  }
  function closeModal() {
    const back = $("#modal");
    if (!back || !back.classList.contains("is-on")) {
      return;
    }
    back.classList.remove("is-on");
    back.innerHTML = "";
    document.body.classList.remove("has-modal");
    if (lastFocus && document.contains(lastFocus)) {
      lastFocus.focus();
    }
  }

  function safetyNotes(withMoney) {
    return `
      <div class="notes">
        ${
          withMoney
            ? `<p class="note note-money">${icon("lock", 20)}<span><b>Деньги не хранятся в Е-Паслуге.</b> Платёж идёт через ЕРИП из вашего банка прямо получателю.</span></p>`
            : ""
        }
        <p class="note note-fraud">${icon("shield", 20)}<span><b>Мы никогда не просим коды из SMS и не присылаем ссылки на оплату.</b> Если «сотрудник Е-Паслуги» звонит или пишет с такой просьбой — это мошенник.</span></p>
      </div>`;
  }

  /* ---------- Подсказки поиска ---------- */

  function renderSuggest(box, q) {
    if (!box) {
      return;
    }
    if (!q) {
      box.classList.remove("is-open");
      box.innerHTML = "";
      return;
    }
    const { services, syn, cats } = suggestions(q);
    if (!services.length && !syn.length && !cats.length) {
      box.classList.add("is-open");
      box.innerHTML = `<p class="suggest-empty">Ничего не нашли по «${esc(q)}». Попробуйте другими словами: «доходы», «паспорт», «права».</p>`;
      return;
    }
    const catHtml = cats
      .map((c) => `<button type="button" data-cat="${c.id}">${icon(c.icon, 20)}<span><b>${c.title}</b><small>Категория услуг</small></span></button>`)
      .join("");
    const synHtml = syn
      .map((s) => `<button type="button" data-syn="${esc(s.key)}">${icon("search", 20)}<span><b>Искать «${esc(s.key)}»</b><small>${plural(s.ids.length, "подходящая услуга", "подходящие услуги", "подходящих услуг")}</small></span></button>`)
      .join("");
    const svcHtml = services
      .map((s) => `<button type="button" data-id="${esc(s.id)}">${icon("file", 20)}<span><b>${s.title}</b><small>${s.noId ? "Без ID-карты" : "Нужна ID-карта"}, код ${s.code}</small></span></button>`)
      .join("");
    box.innerHTML = catHtml + synHtml + svcHtml;
    box.classList.add("is-open");
    $$("button", box).forEach((btn) => {
      btn.addEventListener("mousedown", (e) => {
        e.preventDefault();
      });
      btn.addEventListener("click", () => {
        box.classList.remove("is-open");
        if (btn.dataset.id) {
          const svc = serviceById(btn.dataset.id);
          go(svc ? serviceHref(svc) : `#/service/${encodeURIComponent(btn.dataset.id)}`);
        } else if (btn.dataset.syn) {
          go(catalogHash({ q: btn.dataset.syn, page: 1, view: "list", category: "", life: "", situation: "" }));
        } else if (btn.dataset.cat) {
          go(catalogHash({ category: btn.dataset.cat, view: "list", page: 1, q: "", life: "", situation: "" }));
        }
      });
      btn.addEventListener("keydown", (e) => {
        const all = $$("button", box);
        const i = all.indexOf(btn);
        if (e.key === "ArrowDown" && all[i + 1]) {
          e.preventDefault();
          all[i + 1].focus();
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          if (i > 0) {
            all[i - 1].focus();
          } else {
            const input = box.parentElement && $("input", box.parentElement);
            if (input) {
              input.focus();
            }
          }
        }
        if (e.key === "Escape") {
          box.classList.remove("is-open");
        }
      });
    });
  }

  function bindSuggestInput(input, box, onEnter) {
    if (!input) {
      return;
    }
    input.addEventListener("input", () => {
      renderSuggest(box, input.value);
    });
    input.addEventListener("focus", () => {
      renderSuggest(box, input.value);
    });
    input.addEventListener("blur", () => {
      setTimeout(() => {
        if (box && !box.contains(document.activeElement)) {
          box.classList.remove("is-open");
        }
      }, 120);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" && box) {
        const first = $("button", box);
        if (first) {
          e.preventDefault();
          first.focus();
        }
      }
      if (e.key === "Escape" && box) {
        box.classList.remove("is-open");
      }
      if (e.key === "Enter") {
        e.preventDefault();
        onEnter(input.value.trim());
      }
    });
  }

  /* ---------- Главная ---------- */

  function attentionItems() {
    const items = [];
    const today = startOfDay(new Date());
    const D = dalonApi();
    if (D) {
      D.attention(ctx).forEach((x) => items.push(x));
    }
    loadApps().forEach((a) => {
      if (a.status === "Ожидает оплаты") {
        items.push({ due: today, tag: "Заявление", title: `${a.title}: ждёт оплаты`, text: "Документ выдадут сразу после оплаты.", href: "#/apps", action: "Оплатить", tone: "soon" });
      }
      if (a.status === "Черновик") {
        items.push({ due: null, mark: "edit", tag: "Черновик", title: a.title, text: "Заявление не отправлено. Всё, что вы ввели, сохранено.", href: a.serviceId ? `#/service/${encodeURIComponent(a.serviceId)}?from=apps` : "#/apps", action: "Продолжить", tone: "calm" });
      }
      if (a.status === "Выполнено" && Math.abs(daysUntil(a.at)) <= 2) {
        items.push({ due: null, mark: "check", tag: "Готово", title: a.title, text: "Документ готов, его можно скачать.", href: "#/apps", action: "Скачать", tone: "done" });
      }
    });
    return items.sort((a, b) => {
      if (a.due && b.due) {
        return a.due - b.due;
      }
      if (a.due) {
        return -1;
      }
      if (b.due) {
        return 1;
      }
      return 0;
    });
  }

  function attentionRow(x) {
    const dateBox = x.due
      ? (() => {
          const d = fmtDayShort(x.due);
          return `<span class="attn-date"><b>${d.day}</b><span>${d.mon}</span></span>`;
        })()
      : `<span class="attn-date attn-date-ico">${icon(x.mark || "info", 22)}</span>`;
    return `
      <li class="attn-row tone-${x.tone}">
        ${dateBox}
        <div class="attn-body">
          <p class="attn-tag">${x.tag}${x.due ? `<span class="attn-left">${untilText(x.due)}</span>` : ""}</p>
          <h3>${x.title}</h3>
          <p>${x.text}</p>
        </div>
        <a class="btn btn-quiet btn-sm" href="${x.href}">${x.action}</a>
      </li>`;
  }

  function homePage() {
    const h = new Date().getHours();
    let greet = "Добрый вечер";
    if (h < 6) {
      greet = "Доброй ночи";
    } else if (h < 12) {
      greet = "Доброе утро";
    } else if (h < 18) {
      greet = "Добрый день";
    }
    const items = attentionItems();
    const shown = items.slice(0, 5);
    const rest = items.length - shown.length;
    const apps = loadApps();
    const checking = apps.filter((a) => a.status === "На проверке").length;
    const D = dalonApi();
    const dal = D ? D.summary(ctx) : null;
    const quick = ["справка о доходах", "паспорт", "права", "садик", "пособие"];
    const noIdSvc = DATA.quickActions
      .map((q) => serviceById(q.id))
      .filter((s) => s && s.noId)
      .slice(0, 4);
    const popular = ["3.05.03", "3.25.03", "200.2.30", ...DATA.quickActions.map((q) => q.id)];
    const popRank = (svc) => (popular.includes(svc.id) ? popular.indexOf(svc.id) : 999);
    const lifeTiles = LIFE.map((l) => {
      const found = DATA.services.filter((s) => lifeMatch(l, s));
      const examples = l.size === "xl"
        ? [...found].sort((a, b) => popRank(a) - popRank(b)).slice(0, 4)
        : [];
      return `
        <a class="life-tile life-${l.size || "s"}" href="${catalogHash({ life: l.id, view: "list", category: "", situation: "", q: "", page: 1 })}">
          <span class="life-ico">${icon(l.icon, l.size === "xl" ? 34 : 26)}</span>
          <span class="life-title">${l.title}</span>
          <span class="life-hint">${l.hint}</span>
          ${examples.length ? `<span class="life-examples">${examples.map((e) => `<span>${e.title}</span>`).join("")}</span>` : ""}
          <span class="life-count">${plural(found.length, "услуга", "услуги", "услуг")}</span>
        </a>`;
    }).join("");

    return `
      <section class="home-hero">
        <p class="hello">${greet}, ${PERSONA.shortName}</p>
        <h1 class="hero-q">Что нужно сделать?</h1>
        <form class="bigsearch" id="home-search" role="search" autocomplete="off">
          <label class="sr" for="home-q">Поиск услуги</label>
          <span class="bigsearch-ico">${icon("search", 26)}</span>
          <input id="home-q" type="search" placeholder="Например: справка о доходах, обменять права" autocomplete="off">
          <button class="btn btn-primary" type="submit">Найти</button>
          <div class="suggest" id="home-suggest"></div>
        </form>
        <p class="quick">
          <span>Часто ищут:</span>
          ${quick.map((k) => `<a href="${catalogHash({ q: k, view: "list", page: 1, category: "", life: "", situation: "" })}">${k}</a>`).join("")}
        </p>
      </section>

      <section class="attn" aria-labelledby="attn-h">
        <div class="sec-head">
          <h2 id="attn-h">Требует внимания</h2>
          ${items.length ? `<span class="count-pill">${items.length}</span>` : ""}
        </div>
        <div class="attn-grid">
          <div class="attn-panel">
            ${
              shown.length
                ? `<ol class="attn-list">${shown.map(attentionRow).join("")}</ol>`
                : `<div class="empty-state">${icon("check", 30)}<h3>Срочного ничего нет</h3><p>Сроки, штрафы и статусы заявлений появятся здесь, как только будут.</p></div>`
            }
            <div class="attn-foot">
              ${rest > 0 ? `<a class="link" href="#/dalon">Ещё ${plural(rest, "дело", "дела", "дел")} — в Далони и «Моих услугах»</a>` : ""}
              ${checking ? `<a class="link" href="#/apps">${plural(checking, "заявление", "заявления", "заявлений")} на проверке</a>` : ""}
            </div>
          </div>
          <a class="dalon-promo" href="#/dalon">
            <span class="dalon-promo-mark">${icon("hand", 30)}</span>
            <span class="dalon-promo-name">Далонь</span>
            <span class="dalon-promo-tag">Всё о семье — в одной ладони</span>
            ${
              dal
                ? `<span class="dalon-promo-sum"><b>${fmtMoney(dal.total)}</b> BYN</span><span class="dalon-promo-note">${plural(dal.count, "начисление", "начисления", "начислений")} у семьи. Государство присылает их само — реквизиты вводить не нужно.</span>`
                : ""
            }
            <span class="dalon-promo-go">Открыть Далонь</span>
          </a>
        </div>
      </section>

      <section class="life" aria-labelledby="life-h">
        <div class="sec-head">
          <h2 id="life-h">Жизненные ситуации</h2>
          <p class="sec-lead">Начните с того, что происходит у вас, — подходящие услуги подберём сами.</p>
        </div>
        <div class="life-grid">${lifeTiles}</div>
        <p class="fine">Плитки упорядочены по опросу 214 молодых пользователей: чем крупнее плитка, тем чаще ситуацию называли.</p>
      </section>

      <section class="online-now" aria-labelledby="online-h">
        <div>
          <h2 id="online-h">Можно без ID-карты и ЭЦП</h2>
          <p>Войдите по паролю и коду из SMS — эти справки придут прямо в кабинет.</p>
        </div>
        <ul>
          ${noIdSvc.map((s) => `<li><a href="${serviceHref(s)}">${icon("file", 20)}<span>${s.title}</span></a></li>`).join("")}
        </ul>
      </section>

      <section class="news" aria-labelledby="news-h">
        <h2 id="news-h">Новости портала</h2>
        <ul class="news-list">
          ${NEWS.map((n) => `
            <li>
              <details>
                <summary><time>${n.when}</time><span class="news-tag">${n.tag}</span><span class="news-title">${n.title}</span>${icon("chev-down", 18)}</summary>
                <p>${n.text}</p>
              </details>
            </li>`).join("")}
        </ul>
      </section>
    `;
  }

  /* ---------- Профиль ---------- */

  function profilePage() {
    const p = PERSONA.passport;
    const auth = getAuth();
    const L = window.EP_LOGIN;
    const method = auth && L ? L.methodTitle(auth.method) : "—";
    const at = auth ? new Date(auth.at) : null;
    const atText = at ? `${formatWhen(at.toISOString()).toLowerCase()} в ${at.toLocaleTimeString("ru-BY", { hour: "2-digit", minute: "2-digit" })}` : "";
    return `
      ${pageCrumb()}
      <header class="page-head">
        <h1>Мой профиль</h1>
        <p class="lead">Сведения из регистра населения. Они сами подставляются в заявления — вводить их заново не нужно.</p>
      </header>
      <div class="profile">
        <div class="idcard" aria-label="Карточка гражданина">
          <div class="idcard-top"><span>Республика Беларусь</span><span>Регистр населения</span></div>
          <div class="idcard-body">
            <span class="idcard-photo" aria-hidden="true">${PERSONA.initials}</span>
            <div>
              <p class="idcard-name">${PERSONA.lastName}<br>${PERSONA.firstName} ${PERSONA.middleName}</p>
              <dl class="idcard-dl">
                <div><dt>Личный номер</dt><dd>${PERSONA.idNumber}</dd></div>
                <div><dt>Дата рождения</dt><dd>${PERSONA.birthDate}</dd></div>
              </dl>
            </div>
          </div>
          <div class="idcard-orn">${ornament("orn-id", 2)}</div>
        </div>
        <div class="psecs">
          <section class="psec">
            <h2>Личные данные</h2>
            <dl class="dl">
              <div><dt>Пол</dt><dd>${PERSONA.gender}</dd></div>
              <div><dt>Гражданство</dt><dd>${PERSONA.citizenship}</dd></div>
              <div><dt>Адрес регистрации</dt><dd>${PERSONA.address}</dd></div>
            </dl>
          </section>
          <section class="psec">
            <h2>Документ, удостоверяющий личность</h2>
            <dl class="dl">
              <div><dt>Паспорт</dt><dd>${p.series} ${p.number}</dd></div>
              <div><dt>Действует до</dt><dd>${p.until}</dd></div>
              <div><dt>Кем выдан</dt><dd>${p.issued}</dd></div>
            </dl>
          </section>
          <section class="psec">
            <h2>Как с вами связаться</h2>
            <dl class="dl">
              ${PERSONA.contacts.map((c) => `<div><dt>${c.type}</dt><dd>${c.value}</dd></div>`).join("")}
            </dl>
          </section>
          <section class="psec">
            <h2>Вход и безопасность</h2>
            <p class="psec-line">${icon("lock", 20)}<span>Сейчас вы вошли: <b>${method}</b>${atText ? `, ${atText}` : ""}.</span></p>
            ${safetyNotes(false)}
          </section>
          <p class="fine">Опеку, брак и другие специальные сведения в этой карточке не показываем. Семья и дети — в разделе <a href="#/dalon/family">Далонь</a>.</p>
        </div>
      </div>
    `;
  }

  /* ---------- Каталог ---------- */

  function badgesHtml(s) {
    return `
      <span class="badges">
        ${s.noId ? `<span class="badge badge-free">Без ID-карты</span>` : `<span class="badge badge-id">Нужна ID-карта</span>`}
        ${s.ecp ? `<span class="badge badge-ecp" title="Электронная цифровая подпись нужна только для отправки заявления">ЭЦП — нужна подпись</span>` : ""}
      </span>`;
  }

  function svcRow(s) {
    const on = favs.has(s.id);
    return `
      <li class="svc-row">
        <a class="svc-link" href="${serviceHref(s)}">
          <span class="svc-title">${s.title}</span>
          <span class="svc-official">${s.official}</span>
          <span class="svc-meta">${badgesHtml(s)}<span class="svc-code">Код ${s.code}</span></span>
        </a>
        <button type="button" class="star${on ? " is-on" : ""}" data-fav="${esc(s.id)}" data-fkey="fav-${esc(s.id)}" aria-pressed="${on}" aria-label="${on ? "Убрать из избранного" : "Добавить в избранное"}: ${esc(s.title)}">${icon(on ? "star-fill" : "star", 24)}</button>
      </li>`;
  }

  function pagerHtml(page, pages) {
    if (pages <= 1) {
      return "";
    }
    const nums = [];
    for (let i = 1; i <= pages; i++) {
      if (pages > 9 && i > 2 && i < pages - 1 && Math.abs(i - page) > 1) {
        if (nums[nums.length - 1] !== "…") {
          nums.push("…");
        }
        continue;
      }
      nums.push(i);
    }
    const btns = [
      `<button type="button" data-page="${Math.max(1, page - 1)}" ${page === 1 ? "disabled" : ""} aria-label="Предыдущая страница">${icon("chev-left", 20)}</button>`,
      ...nums.map((n) =>
        n === "…"
          ? `<span class="pager-gap">…</span>`
          : `<button type="button" data-page="${n}" class="${n === page ? "is-on" : ""}"${n === page ? ' aria-current="page"' : ""}>${n}</button>`
      ),
      `<button type="button" data-page="${Math.min(pages, page + 1)}" ${page === pages ? "disabled" : ""} aria-label="Следующая страница">${icon("chev-right", 20)}</button>`,
    ];
    return `<nav class="pager" aria-label="Страницы">${btns.join("")}</nav>`;
  }

  function catalogSwitch(view) {
    const catsOn = (view === "cats" && !state.life) || (!!state.category && !state.life);
    const listOn = view === "list" && !state.category && !state.life;
    const seg = (href, label, on) => `<a class="seg-item${on ? " is-on" : ""}" href="${href}"${on ? ' aria-current="page"' : ""}>${label}</a>`;
    return `
      <div class="seg" role="navigation" aria-label="Вид каталога">
        ${seg("#/catalog", "По категориям", catsOn)}
        ${seg("#/catalog?view=list", "Все услуги", listOn)}
        ${seg("#/catalog?view=favs", `Избранное <span class="seg-n">${favs.size}</span>`, view === "favs")}
      </div>`;
  }

  function searchField(id, value, placeholder) {
    return `
      <div class="field-search">
        <label class="sr" for="${id}">Поиск</label>
        <span class="field-search-ico">${icon("search", 22)}</span>
        <input id="${id}" type="search" placeholder="${placeholder}" value="${esc(value)}" autocomplete="off">
        <div class="suggest" id="${id}-suggest"></div>
      </div>`;
  }

  function catalogPage() {
    const view = state.view || "cats";

    if (view === "favs") {
      const list = sortFavFirst(searchServices(state.q, "", "", "").filter((s) => favs.has(s.id)));
      const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      const page = Math.min(state.page, pages);
      const slice = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
      return `
        ${pageCrumb()}
        <header class="page-head">
          <h1>Избранные услуги</h1>
          <p class="lead">То, что вы отметили звёздочкой. В общем списке они тоже стоят первыми. Нажмите звезду ещё раз, чтобы убрать услугу.</p>
        </header>
        ${catalogSwitch(view)}
        ${
          favs.size
            ? `${searchField("cat-q", state.q, "Найти среди избранного")}
               <div class="meta-row"><p>${state.q ? `Нашли: <b>${list.length}</b>` : `В избранном: <b>${list.length}</b>`}</p>${pagerHtml(page, pages)}</div>
               ${slice.length ? `<ul class="svc-list">${slice.map(svcRow).join("")}</ul>` : `<div class="empty-state">${icon("search", 30)}<h3>В избранном нет «${esc(state.q)}»</h3><p>Попробуйте поискать во всех услугах.</p><a class="btn btn-quiet" href="${catalogHash({ view: "list", q: state.q, page: 1, category: "", life: "", situation: "" })}">Искать во всех услугах</a></div>`}`
            : `<div class="empty-state">${icon("star", 30)}<h3>Здесь пока пусто</h3><p>Откройте каталог и нажмите звезду у услуги, которой пользуетесь часто, — она появится здесь.</p><a class="btn btn-primary" href="#/catalog?view=list">Открыть все услуги</a></div>`
        }
      `;
    }

    if (view !== "list" && !state.category && !state.life) {
      const q = norm(state.q);
      const cats = q ? CATEGORIES.filter((c) => norm(c.title + " " + c.desc).includes(q)) : CATEGORIES;
      const foundSvc = q ? searchServices(state.q, "", "", "") : [];
      return `
        ${pageCrumb()}
        <header class="page-head">
          <h1>Услуги по категориям</h1>
          <p class="lead">Выберите тему — внутри будет список услуг. Или найдите услугу своими словами.</p>
        </header>
        ${catalogSwitch(view)}
        ${searchField("cat-q", state.q, "Категория или услуга: паспорт, таможня, доходы")}
        ${
          cats.length
            ? `<ul class="cat-index">
                ${cats
                  .map((c) => {
                    const n = CAT_COUNTS[c.id] || 0;
                    return `<li><a class="cat-row" href="${catalogHash({ category: c.id, view: "list", page: 1, q: "", life: "", situation: "" })}">
                      <span class="cat-ico">${icon(c.icon, 24)}</span>
                      <span class="cat-text"><b>${c.title}</b><span>${c.desc}</span></span>
                      <span class="cat-n${n ? "" : " is-zero"}">${n ? plural(n, "услуга", "услуги", "услуг") : "пока нет"}</span>
                    </a></li>`;
                  })
                  .join("")}
              </ul>`
            : `<div class="empty-state">${icon("grid", 30)}<h3>Категории «${esc(state.q)}» нет</h3><p>${foundSvc.length ? "Но есть подходящие услуги — они ниже." : "Попробуйте другое слово или откройте все услуги."}</p></div>`
        }
        ${
          q && foundSvc.length
            ? `<h2 class="sub-h">Услуги по запросу «${esc(state.q)}»</h2><ul class="svc-list">${sortFavFirst(foundSvc).slice(0, 8).map(svcRow).join("")}</ul>`
            : ""
        }
      `;
    }

    const cat = CATEGORIES.find((c) => c.id === state.category);
    const life = state.life ? lifeById(state.life) : null;
    const list = sortFavFirst(searchServices(state.q, state.situation, state.category, state.life));
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const page = Math.min(state.page, pages);
    const slice = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    let heading = "Все услуги";
    let lead = "Найдите услугу своими словами или выберите из списка. Отмеченные звёздочкой стоят первыми.";
    if (cat) {
      heading = cat.title;
      lead = cat.desc;
    }
    if (life) {
      heading = life.title;
      lead = `Жизненная ситуация: ${life.hint.toLowerCase()}. Ниже — всё, что можно сделать онлайн.`;
    }
    const filters = [];
    if (life) {
      filters.push(`<a class="filter-chip" href="${catalogHash({ life: "", page: 1 })}">Ситуация: ${life.title} ${icon("x", 16)}<span class="sr">убрать фильтр</span></a>`);
    }
    if (state.q) {
      filters.push(`<a class="filter-chip" href="${catalogHash({ q: "", page: 1 })}">Запрос: «${esc(state.q)}» ${icon("x", 16)}<span class="sr">убрать фильтр</span></a>`);
    }
    return `
      ${pageCrumb()}
      <header class="page-head">
        <h1>${heading}</h1>
        <p class="lead">${lead}</p>
      </header>
      ${catalogSwitch(view)}
      <div class="toolbar">
        ${searchField("cat-q", state.q, "Что нужно сделать: доходы, паспорт, авто")}
        <div class="code-field">
          <label for="code-q">Код услуги</label>
          <input id="code-q" inputmode="text" placeholder="3.05.03" value="${/^[0-9.\/\-Kк]+$/i.test(state.q) ? esc(state.q) : ""}">
        </div>
        <button class="btn btn-quiet" type="button" id="reset-filters">Сбросить</button>
      </div>
      ${
        cat || life
          ? ""
          : `<div class="chips" role="group" aria-label="Темы">
              <button type="button" class="chip${!state.situation ? " is-on" : ""}" data-sit="" aria-pressed="${!state.situation}">Все темы</button>
              ${DATA.situations.map((s) => `<button type="button" class="chip${state.situation === s.id ? " is-on" : ""}" data-sit="${s.id}" aria-pressed="${state.situation === s.id}">${s.title}</button>`).join("")}
            </div>`
      }
      ${filters.length ? `<div class="filters">${filters.join("")}</div>` : ""}
      <div class="meta-row">
        <p>${list.length ? `Найдено: <b>${plural(list.length, "услуга", "услуги", "услуг")}</b>` : ""}</p>
        ${pagerHtml(page, pages)}
      </div>
      ${
        slice.length
          ? `<ul class="svc-list">${slice.map(svcRow).join("")}</ul>`
          : `<div class="empty-state">${icon("search", 30)}<h3>${cat && !state.q ? "В этой категории пока нет услуг" : "Ничего не нашли"}</h3><p>${cat && !state.q ? "Категорию оставили, чтобы была видна структура портала. Загляните в соседние темы." : "Попробуйте другими словами или сбросьте фильтры. Например: «доходы», «паспорт», «права»."}</p><a class="btn btn-quiet" href="#/catalog?view=list">Показать все услуги</a></div>`
      }
      ${pages > 1 ? `<div class="meta-row meta-row-end">${pagerHtml(page, pages)}</div>` : ""}
    `;
  }

  /* ---------- Карточка услуги ---------- */

  function field(name, label, opts = {}) {
    const { type = "text", required = false, value = "", placeholder = "", hint = "", autocomplete = "" } = opts;
    const id = `f-${name}`;
    const control =
      type === "textarea"
        ? `<textarea id="${id}" name="${name}" placeholder="${placeholder}" aria-describedby="${id}-err">${esc(value)}</textarea>`
        : `<input id="${id}" name="${name}" type="${type}" value="${esc(value)}" placeholder="${placeholder}"${autocomplete ? ` autocomplete="${autocomplete}"` : ""} aria-describedby="${id}-err"${required ? ' aria-required="true"' : ""}>`;
    return `
      <div class="field" data-field="${name}">
        <label for="${id}">${label}${required ? ` <span class="req" aria-hidden="true">*</span>` : ""}</label>
        ${control}
        ${hint ? `<p class="field-hint">${hint}</p>` : ""}
        <p class="err" id="${id}-err"></p>
      </div>`;
  }

  function servicePage(svc) {
    const draft = readJson(LS, DRAFT_PREFIX + svc.id, null) || {
      lastName: PERSONA.lastName,
      firstName: PERSONA.firstName,
      middleName: PERSONA.middleName,
      phone: PERSONA.phone,
      email: PERSONA.email,
      idNumber: PERSONA.idNumber,
    };
    const on = favs.has(svc.id);
    const steps = svc.steps.map((t) => t.replace(" (раздел — в следующем этапе)", "").replace("Раздел — в следующем этапе", "смотрите «Мои услуги»"));
    return `
      ${pageCrumb()}
      <header class="svc-head">
        <div class="svc-head-main">
          ${badgesHtml(svc)}
          <h1>${svc.title}</h1>
          <p class="official-line">Официально: ${svc.official}</p>
          <p class="org-line">Оказывает: <b>${svc.org.name}</b>, УНП ${svc.org.unp}. Код услуги ${svc.code}.</p>
        </div>
        <button type="button" class="star star-lg${on ? " is-on" : ""}" data-fav="${esc(svc.id)}" data-fkey="fav-${esc(svc.id)}" aria-pressed="${on}">${icon(on ? "star-fill" : "star", 24)}<span>${on ? "В избранном" : "В избранное"}</span></button>
      </header>

      <section class="get" aria-labelledby="get-h">
        <h2 id="get-h">Что вы получите</h2>
        <dl class="get-strip">
          <div>${icon("file", 24)}<dt>Результат</dt><dd>${svc.result.format}</dd></div>
          <div>${icon("clock", 24)}<dt>Срок</dt><dd>${svc.result.term}</dd></div>
          <div>${icon("wallet", 24)}<dt>Стоимость</dt><dd>${svc.result.cost}</dd></div>
        </dl>
      </section>

      <div class="svc-layout">
        <div class="svc-aside">
          <h2>Как это работает</h2>
          <ol class="steps">
            ${steps.map((t, i) => `<li><span class="step-n">${i + 1}</span><span>${t}</span></li>`).join("")}
          </ol>
          <div class="access-box">
            <h3>${svc.noId ? "ID-карта не нужна" : "Как войти для этой услуги"}</h3>
            <p>${svc.noId ? "Достаточно входа по паролю и коду из SMS." : "Нужна ID-карта или мобильная ЭЦП. Посмотреть сведения о себе можно и по паролю с SMS."}</p>
            ${svc.ecp ? `<p>Электронная подпись понадобится только в конце — чтобы подписать заявление. Заполнить его можно без неё.</p>` : ""}
          </div>
        </div>
        <form class="form-card" id="svc-form" novalidate>
          <div class="form-card-head">
            <h2>Заявление</h2>
            <p class="draft-bar" id="draft-bar" role="status">${draft.savedAt ? `${icon("check", 18)} Черновик сохранён ${draft.savedAt}` : "Черновик сохраняется сам — можно закрыть вкладку и вернуться."}</p>
          </div>
          <div class="field">
            <label for="f-id">Идентификационный номер</label>
            <input id="f-id" value="${PERSONA.idNumber}" disabled>
            <p class="field-hint">Из регистра населения, изменить нельзя.</p>
          </div>
          <div class="field-row">
            ${field("lastName", "Фамилия", { required: true, value: draft.lastName || "", placeholder: "Иванов", autocomplete: "family-name" })}
            ${field("firstName", "Имя", { required: true, value: draft.firstName || "", placeholder: "Алексей", autocomplete: "given-name" })}
          </div>
          ${field("middleName", "Отчество", { value: draft.middleName || "", placeholder: "Сергеевич", autocomplete: "additional-name" })}
          <div class="field-row">
            ${field("phone", "Контактный телефон", { required: true, type: "tel", value: draft.phone || "", placeholder: "+375 29 000-00-00", autocomplete: "tel" })}
            ${field("email", "Электронная почта", { type: "email", value: draft.email || "", placeholder: "name@example.by", autocomplete: "email" })}
          </div>
          ${field("comment", "Дополнительная информация", { type: "textarea", value: draft.comment || "", hint: "Необязательно. До 500 символов." })}
          <div class="field" data-field="consent">
            <label class="check">
              <input type="checkbox" name="consent" ${draft.consent ? "checked" : ""}>
              <span class="check-box" aria-hidden="true">${icon("check", 16)}</span>
              <span>Согласен на обработку персональных данных для оказания услуги <span class="req" aria-hidden="true">*</span></span>
            </label>
            <p class="err" data-err="consent"></p>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary btn-lg" type="submit">Подать заявление</button>
            <button class="btn btn-quiet" type="button" id="clear-draft">Очистить черновик</button>
          </div>
        </form>
      </div>
    `;
  }

  /* ---------- Мои услуги ---------- */

  function statusClass(st) {
    const map = {
      "Выполнено": "st-done",
      "Ожидает оплаты": "st-pay",
      "Черновик": "st-draft",
      "На проверке": "st-check",
      "Отозвано": "st-cancel",
      "Отказано": "st-deny",
    };
    return map[st] || "";
  }

  function statusHelp(st) {
    if (st === "Отозвано") {
      return "Вы отменили это заявление. Оно больше не рассматривается. Можно подать новое по той же услуге.";
    }
    if (st === "Отказано") {
      return "Ведомство не оказало услугу. Причина — ниже. Исправьте и подайте заявление заново.";
    }
    if (st === "Ожидает оплаты") {
      return "Заявление принято. Документ выдадут сразу после оплаты.";
    }
    if (st === "Черновик") {
      return "Вы ещё не отправили заявление. Всё введённое сохранено — можно продолжить.";
    }
    if (st === "На проверке") {
      return "Ведомство проверяет заявление. Мы пришлём уведомление, когда статус изменится.";
    }
    if (st === "Выполнено") {
      return "Готово. Документ можно скачать.";
    }
    return "";
  }

  function tracker(st) {
    const steps = ["Подано", "Проверка", "Оплата", "Готово"];
    const idx = { "Черновик": -1, "На проверке": 1, "Ожидает оплаты": 2, "Выполнено": 3 }[st];
    if (idx === undefined) {
      return "";
    }
    return `<ol class="tracker" aria-label="Ход рассмотрения">
      ${steps.map((s, i) => `<li class="${i < idx ? "is-past" : ""}${i === idx ? " is-now" : ""}"${i === idx ? ' aria-current="step"' : ""}>${s}</li>`).join("")}
    </ol>`;
  }

  function appItem(r) {
    const svcLink = r.serviceId ? `#/service/${encodeURIComponent(r.serviceId)}?from=apps` : "";
    let main = "";
    if (r.status === "Выполнено") {
      main = `<button class="btn btn-primary btn-sm" type="button" data-pdf="${r.id}">${icon("download", 18)}Скачать документ</button>`;
    } else if (r.status === "Ожидает оплаты") {
      main = `<button class="btn btn-primary btn-sm" type="button" data-pay="${r.id}">Оплатить</button>`;
    } else if (r.status === "Черновик" && svcLink) {
      main = `<a class="btn btn-primary btn-sm" href="${svcLink}">Продолжить заполнение</a>`;
    } else if ((r.status === "Отозвано" || r.status === "Отказано") && svcLink) {
      main = `<a class="btn btn-quiet btn-sm" href="${svcLink}">Подать заново</a>`;
    }
    const open = svcLink && r.status !== "Черновик" && r.status !== "Отозвано" && r.status !== "Отказано" ? `<a class="btn btn-text btn-sm" href="${svcLink}">Об услуге</a>` : "";
    return `
      <article class="app-item ${statusClass(r.status)}">
        <div class="app-main">
          <p class="app-status"><span class="status ${statusClass(r.status)}">${r.status}</span><span class="app-when">${formatWhen(r.at)}</span></p>
          <h3>${esc(r.title)}</h3>
          <p class="app-help">${statusHelp(r.status)}</p>
          ${r.comment && r.status === "Отказано" ? `<p class="app-reason">${icon("info", 18)}<span>Причина: ${esc(r.comment)}</span></p>` : ""}
          ${tracker(r.status)}
          <p class="app-meta">Заявление № ${r.num}. Рассматривает: ${esc(r.initiator)}</p>
        </div>
        <div class="app-acts">
          ${main}
          ${open}
          <button class="btn btn-text btn-sm" type="button" data-edit="${r.id}">Демо: сменить статус</button>
        </div>
      </article>`;
  }

  function appsPage() {
    const rows = loadApps();
    const lanes = [
      { id: "act", title: "Нужно ваше действие", statuses: ["Ожидает оплаты", "Черновик"], empty: "Оплачивать и дозаполнять сейчас нечего." },
      { id: "work", title: "На рассмотрении", statuses: ["На проверке"], empty: "Сейчас ведомства ничего не рассматривают. Новое заявление можно подать из каталога." },
      { id: "done", title: "Завершены", statuses: ["Выполнено", "Отозвано", "Отказано"], empty: "Завершённых заявлений пока нет." },
    ];
    return `
      ${pageCrumb()}
      <header class="page-head">
        <h1>Мои услуги</h1>
        <p class="lead">Все ваши заявления: что нужно сделать, что рассматривается и что уже готово.</p>
      </header>
      <div class="lanes">
        ${lanes
          .map((lane) => {
            const items = rows.filter((r) => lane.statuses.includes(r.status));
            return `
              <section class="lane lane-${lane.id}" aria-labelledby="lane-${lane.id}">
                <h2 id="lane-${lane.id}">${lane.title}<span class="lane-n">${items.length}</span></h2>
                ${items.length ? items.map(appItem).join("") : `<p class="lane-empty">${lane.empty}</p>`}
              </section>`;
          })
          .join("")}
      </div>
      <p class="fine">«Демо: сменить статус» нужен только для показа прототипа — в настоящем кабинете статус меняет ведомство.</p>
    `;
  }

  /* ---------- Уведомления ---------- */

  function inboxPage() {
    const box = state.route.box || "in";
    const kind = state.route.kind || "";
    const all = loadNotifs();
    const inBox = all.filter((n) => (box === "arch" ? n.archived : !n.archived));
    const rows = kind ? inBox.filter((n) => n.kind === kind) : inBox;
    const inCount = all.filter((n) => !n.archived).length;
    const archCount = all.filter((n) => n.archived).length;
    const kindHref = (k) => `#/inbox?${new URLSearchParams({ ...(box === "arch" ? { box: "arch" } : {}), ...(k ? { kind: k } : {}) }).toString()}`;
    let emptyTitle = box === "arch" ? "В архиве пусто" : "Новых уведомлений нет";
    let emptyText = box === "arch" ? "Сюда попадают уведомления, которые вы убрали из входящих." : "Когда изменится статус заявления или подойдёт срок платежа, сообщение появится здесь.";
    if (kind && inBox.length) {
      emptyTitle = "В этом разделе пусто";
      emptyText = "Попробуйте показать все уведомления.";
    }
    return `
      ${pageCrumb()}
      <header class="page-head">
        <h1>Уведомления</h1>
        <p class="lead">Юридически значимые связаны с заявлениями — их нельзя удалить, только убрать в архив. Информационные можно удалить.</p>
      </header>
      <p class="note note-fraud note-wide">${icon("shield", 22)}<span><b>Мы никогда не просим коды из SMS и не присылаем ссылки на оплату.</b> Оплачивать можно только в кабинете или через ЕРИП в своём банке. Звонок или сообщение «от Е-Паслуги» с такой просьбой — мошенничество.</span></p>
      <div class="inbox-bar">
        <div class="seg" role="navigation" aria-label="Папка">
          <a class="seg-item${box === "in" ? " is-on" : ""}" href="#/inbox">Входящие <span class="seg-n">${inCount}</span></a>
          <a class="seg-item${box === "arch" ? " is-on" : ""}" href="#/inbox?box=arch">Архив <span class="seg-n">${archCount}</span></a>
        </div>
        <div class="chips chips-tight" role="group" aria-label="Тип уведомлений">
          <a class="chip${!kind ? " is-on" : ""}" href="${kindHref("")}">Все</a>
          <a class="chip${kind === "legal" ? " is-on" : ""}" href="${kindHref("legal")}">Юридически значимые</a>
          <a class="chip${kind === "info" ? " is-on" : ""}" href="${kindHref("info")}">Информационные</a>
        </div>
      </div>
      ${
        rows.length
          ? `<ul class="mail-list">${rows
              .map(
                (n) => `
              <li class="mail ${n.kind}">
                <span class="mail-ico">${icon(n.kind === "legal" ? "file" : "bell", 22)}</span>
                <div class="mail-body">
                  <p class="mail-meta"><span class="kind">${n.kind === "legal" ? "Юридически значимое" : "Информационное"}</span><time>${formatWhen(n.at)}</time></p>
                  <h3>${esc(n.title)}</h3>
                  <p>${esc(n.body)}</p>
                  <div class="mail-acts">
                    ${
                      box === "in"
                        ? `<button class="btn btn-text btn-sm" type="button" data-arch="${n.id}">${icon("archive", 18)}В архив</button>`
                        : `<button class="btn btn-text btn-sm" type="button" data-unarch="${n.id}">${icon("undo", 18)}Вернуть во входящие</button>`
                    }
                    ${n.kind === "info" ? `<button class="btn btn-text btn-sm btn-danger" type="button" data-del="${n.id}">${icon("trash", 18)}Удалить</button>` : `<span class="mail-lock">${icon("lock", 16)}Удалить нельзя</span>`}
                  </div>
                </div>
              </li>`
              )
              .join("")}</ul>`
          : `<div class="empty-state">${icon(box === "arch" ? "archive" : "bell", 30)}<h3>${emptyTitle}</h3><p>${emptyText}</p>${box === "arch" ? `<a class="btn btn-quiet" href="#/inbox">Ко входящим</a>` : ""}</div>`
      }
    `;
  }

  /* ---------- Ещё (мобильное меню) ---------- */

  function morePage() {
    const unread = loadNotifs().filter((n) => !n.archived).length;
    const row = (href, ico, label, note) => `<li><a class="more-row" href="${href}">${icon(ico, 24)}<span><b>${label}</b>${note ? `<small>${note}</small>` : ""}</span>${icon("chev-right", 20)}</a></li>`;
    return `
      <header class="page-head">
        <h1>Ещё</h1>
      </header>
      <ul class="more-list">
        ${row("#/profile", "user", "Мой профиль", PERSONA.fullName)}
        ${row("#/inbox", "bell", "Уведомления", unread ? `${unread} во входящих` : "Новых нет")}
        ${row("#/catalog?view=favs", "star", "Избранные услуги", plural(favs.size, "услуга", "услуги", "услуг"))}
        ${row("#/dalon/history", "receipt", "История платежей семьи", "Квитанции Далони")}
      </ul>
      <section class="more-soon">
        <h2>Скоро</h2>
        <p>Эти разделы портала появятся в следующих версиях прототипа.</p>
        <ul>${SOON.map((t) => `<li>${t}</li>`).join("")}</ul>
      </section>
      <button class="btn btn-quiet btn-lg btn-block" type="button" data-logout>${icon("logout", 20)}Выйти из кабинета</button>
    `;
  }

  /* ---------- Форма заявления ---------- */

  const NAME_RE = /^[А-ЯЁа-яёA-Za-z-]{2,}(?:\s[А-ЯЁа-яёA-Za-z-]{2,})?$/;
  const PHONE_RE = /^\+375\s?\(?(?:17|25|29|33|44)\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(form) {
    const data = Object.fromEntries(new FormData(form));
    data.consent = form.consent.checked;
    const errors = {};
    if (!NAME_RE.test((data.lastName || "").trim())) {
      errors.lastName = "Укажите фамилию — минимум 2 буквы";
    }
    if (!NAME_RE.test((data.firstName || "").trim())) {
      errors.firstName = "Укажите имя — минимум 2 буквы";
    }
    if (data.middleName && !NAME_RE.test(data.middleName.trim())) {
      errors.middleName = "Только буквы, минимум 2";
    }
    if (!PHONE_RE.test((data.phone || "").trim())) {
      errors.phone = "Номер в формате +375 29 000-00-00";
    }
    if (data.email && !EMAIL_RE.test(data.email.trim())) {
      errors.email = "Проверьте адрес: в нём должны быть @ и точка";
    }
    if ((data.comment || "").length > 500) {
      errors.comment = `Не больше 500 символов, сейчас ${data.comment.length}`;
    }
    if (!data.consent) {
      errors.consent = "Отметьте согласие — без него заявление не отправить";
    }
    return { data, errors, ok: Object.keys(errors).length === 0 };
  }

  function paintErrors(form, errors, touched) {
    $$("[data-field]", form).forEach((wrap) => {
      const name = wrap.dataset.field;
      const input = $("input, textarea", wrap);
      const err = $(".err", wrap);
      if (!input || !err) {
        return;
      }
      const show = errors[name] && (!touched || touched.has(name));
      input.classList.toggle("is-bad", !!show);
      input.setAttribute("aria-invalid", show ? "true" : "false");
      err.textContent = show ? errors[name] : "";
    });
  }

  function downloadDemoPdf(row) {
    const body = `E-Pasluga demo document\nApplication ${row.num}\n${row.title}\n${PERSONA.fullName}\nStatus: ${row.status}\n`;
    const pdf = `%PDF-1.1
1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj
2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj
3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj
4 0 obj<< /Length 120 >>stream
BT /F1 12 Tf 50 780 Td (${body.replace(/[()\\]/g, " ").replace(/\n/g, ") Tj T* (")}) Tj ET
endstream
endobj
5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000266 00000 n
0000000437 00000 n
trailer<< /Size 6 /Root 1 0 R >>
startxref
510
%%EOF`;
    downloadBlob(new Blob([pdf], { type: "application/pdf" }), `dokument-${row.num}.pdf`);
  }

  function downloadBlob(blob, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
    }, 1000);
  }

  function bindForm(svc) {
    const form = $("#svc-form");
    if (!form) {
      return;
    }
    const bar = $("#draft-bar");
    const touched = new Set();
    let t = null;
    const persist = () => {
      const { data } = validate(form);
      const savedAt = new Date().toLocaleString("ru-BY", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
      writeJson(LS, DRAFT_PREFIX + svc.id, { ...data, savedAt });
      bar.innerHTML = `${icon("check", 18)} Черновик сохранён ${savedAt}`;
    };
    form.addEventListener("input", (e) => {
      if (e.target.name) {
        touched.add(e.target.name);
      }
      paintErrors(form, validate(form).errors, touched);
      clearTimeout(t);
      t = setTimeout(persist, 400);
    });
    form.addEventListener("focusout", (e) => {
      if (e.target.name) {
        touched.add(e.target.name);
        paintErrors(form, validate(form).errors, touched);
      }
    });
    form.addEventListener("change", persist);
    $("#clear-draft").addEventListener("click", () => {
      LS.removeItem(DRAFT_PREFIX + svc.id);
      form.reset();
      $$("input:not([disabled]), textarea", form).forEach((el) => {
        if (el.type === "checkbox") {
          el.checked = false;
        } else {
          el.value = "";
        }
      });
      touched.clear();
      paintErrors(form, {}, null);
      bar.textContent = "Черновик очищен. Поля пустые.";
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const { data, errors, ok } = validate(form);
      paintErrors(form, errors, null);
      if (!ok) {
        const firstBad = $(".is-bad", form) || $("[name=consent]", form);
        if (firstBad) {
          firstBad.focus();
        }
        return;
      }
      const num = String(Date.now()).slice(-12);
      const rows = loadApps();
      rows.unshift({
        id: "a" + Date.now(),
        num,
        title: svc.title,
        serviceId: svc.id,
        initiator: svc.org.name,
        status: "На проверке",
        at: todayIso(),
        comment: data.comment || "",
      });
      saveApps(rows);
      addNotif("legal", `${svc.title} — на проверке`, `Заявление ${num} принято. Статус смотрите в «Мои услуги».`);
      LS.removeItem(DRAFT_PREFIX + svc.id);
      openModal(`
        <div class="modal-ok">${icon("check", 30)}</div>
        <h2 id="modal-title">Заявление отправлено</h2>
        <p>Номер <b>${num}</b>, услуга «${svc.title}».</p>
        <p class="muted">Оно уже в «Моих услугах» со статусом «На проверке». Когда ведомство ответит, придёт уведомление.</p>
        <div class="modal-actions">
          <a class="btn btn-primary" href="#/apps">Открыть «Мои услуги»</a>
          <button class="btn btn-quiet" type="button" data-close>Закрыть</button>
        </div>`);
      form.reset();
      touched.clear();
      paintErrors(form, {}, null);
      bar.textContent = "Можно подать ещё одно заявление.";
    });
  }

  /* ---------- Действия в «Моих услугах» ---------- */

  function openEditApp(id) {
    const rows = loadApps();
    const row = rows.find((r) => r.id === id);
    if (!row) {
      return;
    }
    openModal(
      `
      <h2 id="modal-title">Демо: сменить статус</h2>
      <p class="muted">В настоящем кабинете статус меняет ведомство. Здесь — чтобы показать все состояния.</p>
      <div class="field"><label for="ed-st">Статус</label>
        <select id="ed-st">${STATUSES.map((s) => `<option ${s === row.status ? "selected" : ""}>${s}</option>`).join("")}</select>
      </div>
      <div class="field"><label for="ed-c">Комментарий ведомства</label><textarea id="ed-c">${esc(row.comment || "")}</textarea></div>
      <div class="modal-actions">
        <button class="btn btn-primary" type="button" id="ed-save">Сохранить</button>
        <button class="btn btn-quiet" type="button" data-close>Отмена</button>
      </div>`,
      (box) => {
        $("#ed-save", box).addEventListener("click", () => {
          row.status = $("#ed-st", box).value;
          row.comment = $("#ed-c", box).value;
          saveApps(rows);
          closeModal();
          render({ keepScroll: true });
          toast(`Статус: ${row.status}`);
        });
      }
    );
  }

  function openAppPay(id) {
    const rows = loadApps();
    const row = rows.find((r) => r.id === id);
    if (!row) {
      return;
    }
    const svc = row.serviceId ? serviceById(row.serviceId) : null;
    openModal(
      `
      <h2 id="modal-title">Оплата заявления</h2>
      <p class="muted">${esc(row.title)}, заявление № ${row.num}</p>
      <dl class="kv">
        <div><dt>Стоимость</dt><dd>${svc && svc.result.cost !== "Бесплатно" ? svc.result.cost : "Сбор за выдачу по тарифу ведомства (демо)"}</dd></div>
        <div><dt>Способ</dt><dd>ЕРИП — через ваш интернет-банк</dd></div>
      </dl>
      ${safetyNotes(true)}
      <div class="modal-actions">
        <button class="btn btn-primary" type="button" id="app-pay-go">Оплатить через ЕРИП</button>
        <button class="btn btn-quiet" type="button" data-close>Отмена</button>
      </div>`,
      (box) => {
        const btn = $("#app-pay-go", box);
        btn.addEventListener("click", () => {
          btn.disabled = true;
          btn.classList.add("is-loading");
          btn.textContent = "Ждём ответ банка";
          setTimeout(() => {
            row.status = "Выполнено";
            saveApps(rows);
            addNotif("legal", `${row.title} — готово`, "Оплата прошла через ЕРИП (демо). Документ можно скачать.");
            closeModal();
            render({ keepScroll: true });
            toast("Оплачено. Документ можно скачать");
          }, 1100);
        });
      }
    );
  }

  /* ---------- Привязка событий ---------- */

  function bindCommon() {
    $$("[data-logout]").forEach((b) => {
      b.addEventListener("click", logout);
    });
    const skip = $("[data-skip]");
    if (skip) {
      skip.addEventListener("click", () => {
        const main = $("#main");
        if (main) {
          main.focus();
        }
      });
    }
    const soon = $("#nav-soon");
    if (soon) {
      soon.addEventListener("toggle", () => {
        writeJson(SS, NAV_SOON_KEY, soon.open);
      });
    }
    $$("[data-fav]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.fav;
        const adding = !favs.has(id);
        if (adding) {
          favs.add(id);
        } else {
          favs.delete(id);
        }
        saveFavs();
        render({ keepScroll: true, focusKey: btn.dataset.fkey });
        toast(adding ? "Добавлено в избранное" : "Убрано из избранного");
      });
    });
  }

  function bindHome() {
    const input = $("#home-q");
    const box = $("#home-suggest");
    const toList = (v) => {
      go(catalogHash({ q: v, page: 1, view: "list", category: "", life: "", situation: "" }));
    };
    bindSuggestInput(input, box, toList);
    const form = $("#home-search");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        toList(input.value.trim());
      });
    }
  }

  function bindCatalog() {
    const input = $("#cat-q");
    const box = $("#cat-q-suggest");
    bindSuggestInput(input, box, (v) => {
      if (state.view === "favs") {
        go(catalogHash({ q: v, view: "favs", page: 1 }));
      } else if (state.view !== "list" && !state.category && !state.life) {
        go(catalogHash({ q: v, view: "cats", page: 1 }));
      } else {
        go(catalogHash({ q: v, view: "list", page: 1 }));
      }
    });
    const code = $("#code-q");
    if (code) {
      code.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          go(catalogHash({ q: e.target.value.trim(), view: "list", page: 1, category: "", life: "", situation: "" }));
        }
      });
    }
    const reset = $("#reset-filters");
    if (reset) {
      reset.addEventListener("click", () => {
        go("#/catalog?view=list");
      });
    }
    $$("button.chip[data-sit]").forEach((c) => {
      c.addEventListener("click", () => {
        go(catalogHash({ situation: c.dataset.sit, page: 1, view: "list" }));
      });
    });
    $$(".pager [data-page]").forEach((b) => {
      if (b.disabled) {
        return;
      }
      b.addEventListener("click", () => {
        go(catalogHash({ page: Number(b.dataset.page) }));
      });
    });
  }

  function bindApps() {
    $$("[data-pay]").forEach((b) => {
      b.addEventListener("click", () => {
        openAppPay(b.dataset.pay);
      });
    });
    $$("[data-pdf]").forEach((b) => {
      b.addEventListener("click", () => {
        const row = loadApps().find((r) => r.id === b.dataset.pdf);
        if (row) {
          downloadDemoPdf(row);
          toast("Документ скачан (демо PDF)");
        }
      });
    });
    $$("[data-edit]").forEach((b) => {
      b.addEventListener("click", () => {
        openEditApp(b.dataset.edit);
      });
    });
  }

  function bindInbox() {
    const update = (id, fn, msg) => {
      const rows = loadNotifs();
      const n = rows.find((x) => x.id === id);
      if (n) {
        fn(n);
      }
      saveNotifs(rows);
      render({ keepScroll: true });
      toast(msg);
    };
    $$("[data-arch]").forEach((b) => {
      b.addEventListener("click", () => {
        update(
          b.dataset.arch,
          (n) => {
            n.archived = true;
          },
          "Перенесено в архив"
        );
      });
    });
    $$("[data-unarch]").forEach((b) => {
      b.addEventListener("click", () => {
        update(
          b.dataset.unarch,
          (n) => {
            n.archived = false;
          },
          "Возвращено во входящие"
        );
      });
    });
    $$("[data-del]").forEach((b) => {
      b.addEventListener("click", () => {
        saveNotifs(loadNotifs().filter((x) => x.id !== b.dataset.del));
        render({ keepScroll: true });
        toast("Уведомление удалено");
      });
    });
  }

  /* ---------- Контекст для модулей Далони и входа ---------- */

  const ctx = {
    icon,
    go,
    esc,
    plural,
    toast,
    openModal,
    closeModal,
    ornament,
    brandMark,
    safetyNotes,
    fmtMoney,
    fmtDay,
    fmtDayShort,
    untilText,
    toneFor,
    daysUntil,
    addDays,
    startOfDay,
    addNotif,
    downloadBlob,
    readJson: (key, fallback) => readJson(LS, key, fallback),
    writeJson: (key, value) => writeJson(LS, key, value),
    readSession: (key, fallback) => readJson(SS, key, fallback),
    writeSession: (key, value) => writeJson(SS, key, value),
    persona: PERSONA,
    servicesCount: DATA.services.length,
    serviceById,
    serviceHref,
    setAuth,
    render: (opts) => render(opts),
  };

  /* ---------- Рендер ---------- */

  function render(opts = {}) {
    const route = parseHash();
    state.route = route;
    if (route.name !== "login" && !isAuthed()) {
      const next = location.hash && location.hash !== "#" ? location.hash : "#/";
      location.replace(`#/login?next=${encodeURIComponent(next)}`);
      return;
    }
    const y = window.scrollY;
    const root = $("#app");
    if (route.name === "login") {
      root.className = "app app-login";
      root.innerHTML = window.EP_LOGIN ? window.EP_LOGIN.page(ctx, route) : "<p>Модуль входа не загрузился.</p>";
      if (window.EP_LOGIN) {
        window.EP_LOGIN.bind(ctx, route);
      }
      if (!opts.keepScroll) {
        window.scrollTo(0, 0);
      }
      return;
    }
    root.className = route.name === "dalon" ? "app app-dalon" : "app";
    syncTrail(crumbNode(route));
    if (route.name === "catalog") {
      state.q = route.q;
      state.situation = route.situation;
      state.category = route.category;
      state.life = route.life;
      state.view = route.view;
      state.page = route.page;
    }
    let svc = null;
    let inner = "";
    if (route.name === "home") {
      inner = homePage();
    } else if (route.name === "profile") {
      inner = profilePage();
    } else if (route.name === "catalog") {
      inner = catalogPage();
    } else if (route.name === "apps") {
      inner = appsPage();
    } else if (route.name === "inbox") {
      inner = inboxPage();
    } else if (route.name === "more") {
      inner = morePage();
    } else if (route.name === "dalon") {
      inner = dalonApi() ? dalonApi().page(ctx, route) : `<div class="empty-state"><h3>Раздел не загрузился</h3><p>Обновите страницу.</p></div>`;
    } else if (route.name === "service") {
      svc = serviceById(route.id);
      inner = svc
        ? servicePage(svc)
        : `<div class="empty-state">${icon("search", 30)}<h3>Такой услуги нет</h3><p>Возможно, ссылка устарела. Найдите услугу в каталоге.</p><a class="btn btn-primary" href="#/catalog">Открыть каталог</a></div>`;
    }
    root.innerHTML = layout(inner);
    bindCommon();
    if (route.name === "home") {
      bindHome();
    }
    if (route.name === "catalog") {
      bindCatalog();
    }
    if (route.name === "apps") {
      bindApps();
    }
    if (route.name === "inbox") {
      bindInbox();
    }
    if (route.name === "service" && svc) {
      bindForm(svc);
    }
    if (route.name === "dalon" && dalonApi()) {
      dalonApi().bind(ctx, route);
    }
    if (opts.keepScroll) {
      window.scrollTo(0, y);
      if (opts.focusKey) {
        const el = $(`[data-fkey="${opts.focusKey}"]`);
        if (el) {
          el.focus({ preventScroll: true });
        }
      }
    } else {
      window.scrollTo(0, 0);
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  seedApps();
  seedNotifs();
  window.addEventListener("hashchange", () => {
    closeModal();
    render();
  });
  if (!location.hash) {
    location.replace("#/");
  }
  render();
})();
