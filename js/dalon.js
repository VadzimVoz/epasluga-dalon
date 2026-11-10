/* «Далонь» — семейный раздел Е-Паслуги. Данные условные, состояние в localStorage. */
(() => {
  const KEY = "epasluga-dalon";
  const SEL_KEY = "epasluga-dalon-sel";
  const VERSION = 2;

  const MEMBERS = [
    { id: "me", name: "Алексей", full: "Иванов Алексей Сергеевич", role: "Вы", kind: "adult", short: "Ал", finger: "thumb" },
    { id: "anna", name: "Анна", full: "Иванова Анна Викторовна", role: "Супруга", kind: "adult", short: "Ан", finger: "index" },
    { id: "masha", name: "Маша", full: "Иванова Мария Алексеевна", role: "Дочь, 9 лет", kind: "child", short: "Ма", finger: "middle" },
    { id: "misha", name: "Миша", full: "Иванов Михаил Алексеевич", role: "Сын, 4 года", kind: "child", short: "Ми", finger: "ring" },
    { id: "car", name: "Polo", full: "Volkswagen Polo", role: "7714 AB-7, владелец — вы", kind: "car", short: "", finger: "pinky" },
  ];

  const TYPE_LABEL = {
    fine: { text: "Штраф ГАИ", cls: "lbl-rose" },
    car: { text: "Авто", cls: "lbl-rose" },
    kids: { text: "Дети", cls: "lbl-peach" },
    tax: { text: "Налог", cls: "lbl-sand" },
    doc: { text: "Документ", cls: "lbl-sand" },
  };

  const SEED_CHARGES = [
    { id: "c-tax", member: "me", type: "tax", title: "Налог на недвижимость", detail: "Квартира: г. Минск, ул. Карла Маркса, 14–27", payee: "Инспекция МНС по Московскому району г. Минска", amount: 186.4, dueIn: 5 },
    { id: "c-land", member: "anna", type: "tax", title: "Земельный налог", detail: "Участок: Минский район, д. Ратомка", payee: "Инспекция МНС по Минскому району", amount: 12.4, dueIn: 5 },
    { id: "c-kg", member: "misha", type: "kids", title: "Детский сад: питание за ноябрь", detail: "Ясли-сад № 512, группа «Солнышко»", payee: "ГУО «Ясли-сад № 512 г. Минска»", amount: 45.3, dueIn: 10 },
    { id: "c-fine", member: "car", type: "fine", title: "Превышение скорости", detail: "Камера на пр. Победителей, 2 ноября, +22 км/ч", payee: "УГАИ ГУВД Мингорисполкома", amount: 84, discount: 0.5, discountIn: 14, dueIn: 30 },
    { id: "c-club", member: "masha", type: "kids", title: "Кружок робототехники: ноябрь", detail: "Дворец детского творчества, 8 занятий", payee: "Дворец детского творчества Московского района", amount: 38, dueIn: 14 },
    { id: "c-to", member: "car", type: "car", title: "Техосмотр: госпошлина за допуск к движению", detail: "Оплатите до диагностики — квитанция придёт в станцию техосмотра сама", payee: "Госпошлина через ЕРИП", amount: 107.1, dueIn: 19 },
  ];

  const SEED_DOCS = [
    { id: "r-to", member: "car", type: "car", title: "Пройти техосмотр Polo", detail: "Разрешение на допуск действует ещё 19 дней. Запишитесь на диагностику заранее.", dueIn: 19, href: "#/service/3.62.01", action: "Как записаться" },
    { id: "r-pass", member: "anna", type: "doc", title: "Паспорт Анны заканчивается", detail: "Подайте на замену за 2 месяца до конца срока, чтобы не остаться без документа.", dueIn: 122, href: "#/service/200.12.1", action: "Об услуге" },
  ];

  const SEED_HISTORY = [
    { id: "h1", title: "Детский сад: питание за октябрь", member: "misha", type: "kids", payee: "ГУО «Ясли-сад № 512 г. Минска»", amount: 44.9, ago: 21, method: "ЕРИП", receipt: "ЕР-26104821" },
    { id: "h2", title: "Кружок робототехники: октябрь", member: "masha", type: "kids", payee: "Дворец детского творчества Московского района", amount: 38, ago: 24, method: "ЕРИП", receipt: "ЕР-26102267" },
    { id: "h3", title: "Штраф ГАИ: парковка", member: "car", type: "fine", payee: "УГАИ ГУВД Мингорисполкома", amount: 21, ago: 47, method: "Банковская карта", receipt: "БК-26095310" },
    { id: "h4", title: "Детский сад: питание за сентябрь", member: "misha", type: "kids", payee: "ГУО «Ясли-сад № 512 г. Минска»", amount: 43.2, ago: 52, method: "ЕРИП", receipt: "ЕР-26091744" },
    { id: "h5", title: "Кружок робототехники: сентябрь", member: "masha", type: "kids", payee: "Дворец детского творчества Московского района", amount: 38, ago: 55, method: "ЕРИП", receipt: "ЕР-26090632" },
  ];

  const pay = { ids: "", method: "erip", fail: false, stage: "confirm", result: null };

  /* ---------- Состояние ---------- */

  function isoAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  }

  function seed() {
    return {
      v: VERSION,
      charges: SEED_CHARGES.map((c) => ({ ...c })),
      history: SEED_HISTORY.map((h) => ({ ...h, paidAt: isoAgo(h.ago) })),
      people: [
        { id: "anna", name: "Анна", full: "Иванова Анна Викторовна", role: "Супруга", consent: "given", at: isoAgo(58), sees: true, pays: true },
        { id: "dad", name: "Сергей Петрович", full: "Иванов Сергей Петрович", role: "Отец", consent: "pending", at: isoAgo(1), sees: true, pays: false },
      ],
      remind: { d7: true, d1: true, d0: false, push: true, sms: false, email: true, tax: true, fine: true, kids: true, doc: true },
    };
  }

  function load(ctx) {
    let s = ctx.readJson(KEY, null);
    if (!s || s.v !== VERSION) {
      s = seed();
      ctx.writeJson(KEY, s);
    }
    return s;
  }

  function save(ctx, s) {
    ctx.writeJson(KEY, s);
  }

  function capFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function member(id) {
    return MEMBERS.find((m) => m.id === id);
  }

  function person(s, id) {
    return s.people.find((p) => p.id === id);
  }

  function annaOk(s) {
    const p = person(s, "anna");
    return !!(p && p.consent === "given");
  }

  function visible(s) {
    return s.charges.filter((c) => c.member !== "anna" || annaOk(s));
  }

  function keyDate(ctx, c) {
    const today = new Date();
    return ctx.addDays(today, c.discount ? c.discountIn : c.dueIn);
  }

  function amountDue(c) {
    return c.discount ? Math.round(c.amount * (1 - c.discount) * 100) / 100 : c.amount;
  }

  function sumOf(list) {
    return Math.round(list.reduce((acc, c) => acc + amountDue(c), 0) * 100) / 100;
  }

  function getSel(ctx, s) {
    const vis = visible(s);
    let sel = ctx.readSession(SEL_KEY, null);
    if (!Array.isArray(sel)) {
      sel = vis.filter((c) => ctx.daysUntil(keyDate(ctx, c)) <= 14).map((c) => c.id);
      ctx.writeSession(SEL_KEY, sel);
    }
    return sel.filter((id) => vis.some((c) => c.id === id));
  }

  function dueText(ctx, c) {
    if (c.discount) {
      return `Скидка 50% до ${ctx.fmtDay(keyDate(ctx, c))}, ${ctx.untilText(keyDate(ctx, c))}`;
    }
    return `До ${ctx.fmtDay(keyDate(ctx, c))}, ${ctx.untilText(keyDate(ctx, c))}`;
  }

  /* ---------- Общие куски ---------- */

  function logo() {
    return `<svg class="dl-logo" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect x="4" y="15" width="6" height="14" rx="3" transform="rotate(-18 7 22)"/>
      <rect x="11.5" y="5" width="6" height="22" rx="3"/>
      <rect x="18.5" y="3" width="6" height="24" rx="3"/>
      <rect x="25.5" y="5.5" width="6" height="21.5" rx="3"/>
      <rect x="32" y="10" width="5.5" height="17" rx="2.75"/>
      <rect x="9" y="22" width="29" height="15" rx="7.5"/>
    </svg>`;
  }

  function label(type) {
    const l = TYPE_LABEL[type] || TYPE_LABEL.doc;
    return `<span class="lbl ${l.cls}">${l.text}</span>`;
  }

  function avatar(ctx, m, size) {
    if (!m) {
      return `<span class="mava">?</span>`;
    }
    if (m.kind === "car") {
      return `<span class="mava mava-car${size ? " mava-" + size : ""}">${ctx.icon("car", size === "lg" ? 26 : 22)}</span>`;
    }
    return `<span class="mava mava-${m.kind}${size ? " mava-" + size : ""}">${m.short}</span>`;
  }

  function head(ctx, route, s) {
    const tabs = [
      { id: "panel", href: "#/dalon", label: "Панель" },
      { id: "reminders", href: "#/dalon/reminders", label: "Напоминания" },
      { id: "family", href: "#/dalon/family", label: "Семья и права" },
      { id: "history", href: "#/dalon/history", label: "История" },
    ];
    const cur = route.sub === "pay" ? "panel" : route.sub;
    const pending = s.people.filter((p) => p.consent === "pending").length;
    return `
      <header class="dl-head">
        <div class="dl-brand">
          ${logo()}
          <div>
            <p class="dl-name">Далонь</p>
            <p class="dl-tag">Всё о семье — в одной ладони</p>
          </div>
        </div>
        <p class="dl-under">Семейный раздел Е-Паслуги: налоги, штрафы, садик и кружки всей семьи в одном списке.</p>
      </header>
      <nav class="dl-tabs" aria-label="Разделы Далони">
        ${tabs
          .map(
            (t) =>
              `<a class="dl-tab${cur === t.id ? " is-on" : ""}" href="${t.href}"${cur === t.id ? ' aria-current="page"' : ""}>${t.label}${t.id === "family" && pending ? `<span class="dl-tab-n" aria-label="ждут согласия">${pending}</span>` : ""}</a>`
          )
          .join("")}
      </nav>`;
  }

  /* ---------- Панель ---------- */

  function fingerHtml(ctx, s, m) {
    const list = visible(s).filter((c) => c.member === m.id);
    const hidden = m.id === "anna" && !annaOk(s);
    const sum = sumOf(list);
    let sumText = "оплачено";
    if (hidden) {
      sumText = "нет доступа";
    } else if (list.length) {
      sumText = `${ctx.fmtMoney(sum)}`;
    }
    return `
      <button type="button" class="finger finger-${m.finger}${list.length ? " has-due" : ""}" data-jump="m-${m.id}" aria-label="${m.name}: ${hidden ? "нет доступа" : list.length ? `${ctx.plural(list.length, "начисление", "начисления", "начислений")} на ${ctx.fmtMoney(sum)} BYN` : "всё оплачено"}">
        <span class="finger-in">
          ${avatar(ctx, m)}
          <span class="finger-name">${m.name}</span>
          <span class="finger-sum">${sumText}</span>
        </span>
      </button>`;
  }

  function chargeRow(ctx, c, sel) {
    const on = sel.includes(c.id);
    const tone = ctx.toneFor(keyDate(ctx, c));
    return `
      <li>
        <label class="charge${on ? " is-on" : ""}">
          <input type="checkbox" class="sr-check" data-sel="${c.id}"${on ? " checked" : ""}>
          <span class="cbox" aria-hidden="true">${ctx.icon("check", 16)}</span>
          <span class="charge-main">
            <span class="charge-top">${label(c.type)}<span class="charge-due tone-${tone}">${dueText(ctx, c)}</span></span>
            <b class="charge-title">${c.title}</b>
            <span class="charge-detail">${c.detail}</span>
          </span>
          <span class="charge-sum">${c.discount ? `<s>${ctx.fmtMoney(c.amount)}</s>` : ""}<b>${ctx.fmtMoney(amountDue(c))}</b><small>BYN</small></span>
        </label>
      </li>`;
  }

  function calendarHtml(ctx, items) {
    const today = ctx.startOfDay(new Date());
    const y = today.getFullYear();
    const mIdx = today.getMonth();
    const first = new Date(y, mIdx, 1);
    const daysIn = new Date(y, mIdx + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7;
    const monthName = capFirst(first.toLocaleDateString("ru-RU", { month: "long", year: "numeric" }));
    const marks = {};
    items.forEach((x) => {
      const d = x.date;
      if (d.getFullYear() === y && d.getMonth() === mIdx) {
        const k = d.getDate();
        marks[k] = marks[k] || [];
        marks[k].push(x);
      }
    });
    const cells = [];
    for (let i = 0; i < lead; i++) {
      cells.push(`<span class="cal-cell is-blank" aria-hidden="true"></span>`);
    }
    for (let d = 1; d <= daysIn; d++) {
      const isToday = d === today.getDate();
      const mk = marks[d];
      const past = d < today.getDate();
      const cls = ["cal-cell", isToday ? "is-today" : "", mk ? "has-mark" : "", past ? "is-past" : ""].join(" ").trim();
      const title = mk ? mk.map((x) => x.title).join("; ") : "";
      cells.push(`<span class="${cls}"${title ? ` title="${ctx.esc(title)}" aria-label="${d}: ${ctx.esc(title)}"` : ""}>${d}</span>`);
    }
    return `
      <div class="cal" aria-label="Календарь сроков: ${monthName}">
        <p class="cal-month">${monthName}</p>
        <div class="cal-grid">
          ${["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((w) => `<span class="cal-wd" aria-hidden="true">${w}</span>`).join("")}
          ${cells.join("")}
        </div>
      </div>`;
  }

  function timelineItems(ctx, s) {
    const items = visible(s).map((c) => ({ date: keyDate(ctx, c), title: c.discount ? `Скидка на штраф ГАИ заканчивается` : c.title, who: member(c.member), sum: amountDue(c), type: c.type }));
    SEED_DOCS.forEach((d) => {
      if (d.member === "anna" && !annaOk(s)) {
        return;
      }
      items.push({ date: ctx.addDays(new Date(), d.dueIn), title: d.title, who: member(d.member), sum: null, type: d.type });
    });
    return items.sort((a, b) => a.date - b.date);
  }

  function panelPage(ctx, s) {
    const vis = visible(s);
    const sel = getSel(ctx, s);
    const total = sumOf(vis);
    const tl = timelineItems(ctx, s);
    const groups = MEMBERS.map((m) => {
      const list = vis.filter((c) => c.member === m.id).sort((a, b) => keyDate(ctx, a) - keyDate(ctx, b));
      const hidden = m.id === "anna" && !annaOk(s);
      let body = "";
      if (hidden) {
        body = `<p class="mgroup-empty">${ctx.icon("lock", 18)}<span>Начисления Анны скрыты: согласие на доступ отозвано. <a href="#/dalon/family">Семья и права</a></span></p>`;
      } else if (!list.length) {
        body = `<p class="mgroup-empty">${ctx.icon("check", 18)}<span>Начислений нет — всё оплачено.</span></p>`;
      } else {
        body = `<ul class="clist">${list.map((c) => chargeRow(ctx, c, sel)).join("")}</ul>`;
      }
      return `
        <section class="mgroup" id="m-${m.id}" tabindex="-1" aria-labelledby="mh-${m.id}">
          <header class="mgroup-head">
            ${avatar(ctx, m)}
            <div><h3 id="mh-${m.id}">${m.full}</h3><p>${m.role}</p></div>
            ${list.length ? `<span class="mgroup-sum">${ctx.fmtMoney(sumOf(list))} BYN</span>` : ""}
          </header>
          ${body}
        </section>`;
    }).join("");

    return `
      <div class="hand-wrap">
        <section class="hand" aria-labelledby="hand-h">
          <h2 class="sr" id="hand-h">Семья и сумма к оплате</h2>
          <div class="hand-fingers">${MEMBERS.map((m) => fingerHtml(ctx, s, m)).join("")}</div>
          <div class="hand-palm">
            <p class="palm-label">К оплате у семьи</p>
            <p class="palm-total"><span>${ctx.fmtMoney(total)}</span> BYN</p>
            <p class="palm-count">${vis.length ? ctx.plural(vis.length, "начисление", "начисления", "начислений") : "Начислений нет"}</p>
          </div>
        </section>
        <div class="hand-side">
          <p class="hand-claim">Реквизиты вводить не нужно</p>
          <p>Государство само присылает сюда начисления: налоги, штрафы ГАИ, садик и кружки. Вы только отмечаете, что оплатить.</p>
          ${
            tl.length
              ? `<p class="hand-next tone-${ctx.toneFor(tl[0].date)}">${ctx.icon("calendar", 20)}<span>Ближайший срок — <b>${ctx.fmtDay(tl[0].date)}</b>: ${tl[0].title.charAt(0).toLowerCase() + tl[0].title.slice(1)}</span></p>`
              : ""
          }
        </div>
      </div>

      <div class="dl-grid">
        <div class="dl-charges">
          <div class="dl-sec-head">
            <h2>Начисления</h2>
            ${vis.length ? `<button type="button" class="btn btn-text btn-sm" id="sel-all">${sel.length === vis.length ? "Снять выбор" : "Выбрать все"}</button>` : ""}
          </div>
          ${vis.length ? groups : `<div class="empty-state">${ctx.icon("check", 30)}<h3>Семья ничего не должна</h3><p>Новые начисления появятся здесь сами. Оплаченное — в <a href="#/dalon/history">истории</a>.</p></div>`}
        </div>
        <aside class="dl-dates" aria-labelledby="dates-h">
          <h2 id="dates-h">Сроки</h2>
          ${calendarHtml(ctx, tl)}
          <ol class="tl">
            ${tl
              .slice(0, 7)
              .map(
                (x) => `
              <li class="tl-item tone-${ctx.toneFor(x.date)}">
                <span class="tl-date">${ctx.fmtDay(x.date)}</span>
                <span class="tl-title">${x.title}</span>
                <span class="tl-who">${x.who ? x.who.name : ""}${x.sum != null ? `, ${ctx.fmtMoney(x.sum)} BYN` : ""}</span>
              </li>`
              )
              .join("")}
          </ol>
          <a class="btn btn-text btn-sm" href="#/dalon/reminders">${ctx.icon("bell", 18)}Настроить напоминания</a>
        </aside>
      </div>

      ${
        vis.length
          ? `<div class="paybar" role="region" aria-label="Оплата выбранного">
              <p class="paybar-sum"><span id="pay-count">${sel.length ? `Выбрано: ${sel.length}` : "Не выбрано"}</span><b id="pay-sum">${ctx.fmtMoney(sumOf(vis.filter((c) => sel.includes(c.id))))} BYN</b></p>
              <button type="button" class="btn btn-orange btn-lg" id="pay-go"${sel.length ? "" : " disabled"}>Оплатить выбранные</button>
            </div>`
          : ""
      }
    `;
  }

  function bindPanel(ctx, s) {
    const vis = visible(s);
    const update = () => {
      const sel = getSel(ctx, s);
      const chosen = vis.filter((c) => sel.includes(c.id));
      const count = document.getElementById("pay-count");
      const sum = document.getElementById("pay-sum");
      const btn = document.getElementById("pay-go");
      const all = document.getElementById("sel-all");
      if (count) {
        count.textContent = sel.length ? `Выбрано: ${sel.length}` : "Не выбрано";
      }
      if (sum) {
        sum.textContent = `${ctx.fmtMoney(sumOf(chosen))} BYN`;
      }
      if (btn) {
        btn.disabled = !sel.length;
      }
      if (all) {
        all.textContent = sel.length === vis.length ? "Снять выбор" : "Выбрать все";
      }
      document.querySelectorAll("[data-sel]").forEach((input) => {
        const on = sel.includes(input.dataset.sel);
        input.checked = on;
        input.closest(".charge").classList.toggle("is-on", on);
      });
    };
    document.querySelectorAll("[data-sel]").forEach((input) => {
      input.addEventListener("change", () => {
        const sel = new Set(getSel(ctx, s));
        if (input.checked) {
          sel.add(input.dataset.sel);
        } else {
          sel.delete(input.dataset.sel);
        }
        ctx.writeSession(SEL_KEY, [...sel]);
        update();
      });
    });
    const all = document.getElementById("sel-all");
    if (all) {
      all.addEventListener("click", () => {
        const sel = getSel(ctx, s);
        ctx.writeSession(SEL_KEY, sel.length === vis.length ? [] : vis.map((c) => c.id));
        update();
      });
    }
    const go = document.getElementById("pay-go");
    if (go) {
      go.addEventListener("click", () => {
        const sel = getSel(ctx, s);
        if (!sel.length) {
          return;
        }
        pay.stage = "confirm";
        pay.result = null;
        ctx.go(`#/dalon/pay?ids=${encodeURIComponent(sel.join(","))}`);
      });
    }
    document.querySelectorAll("[data-jump]").forEach((b) => {
      b.addEventListener("click", () => {
        const target = document.getElementById(b.dataset.jump);
        if (target) {
          target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  /* ---------- Напоминания ---------- */

  function remindersPage(ctx, s) {
    const vis = visible(s);
    const fine = vis.find((c) => c.discount);
    const r = s.remind;
    const items = [
      ...vis
        .filter((c) => !c.discount)
        .map((c) => ({
          date: keyDate(ctx, c),
          who: member(c.member),
          type: c.type,
          title: c.title,
          text: `${ctx.fmtMoney(amountDue(c))} BYN. ${c.payee}.`,
          href: `#/dalon/pay?ids=${c.id}`,
          action: "Оплатить",
        })),
      ...SEED_DOCS.filter((d) => d.member !== "anna" || annaOk(s)).map((d) => ({
        date: ctx.addDays(new Date(), d.dueIn),
        who: member(d.member),
        type: d.type,
        title: d.title,
        text: d.detail,
        href: d.href,
        action: d.action,
      })),
    ].sort((a, b) => a.date - b.date);
    const sw = (key, text, note, disabled) => `
      <label class="switch">
        <input type="checkbox" data-remind="${key}"${r[key] || disabled ? " checked" : ""}${disabled ? " disabled" : ""}>
        <span class="switch-track" aria-hidden="true"><span class="switch-dot"></span></span>
        <span class="switch-text"><b>${text}</b>${note ? `<small>${note}</small>` : ""}</span>
      </label>`;
    return `
      <div class="dl-grid dl-grid-rem">
        <div>
          ${
            fine
              ? `<section class="rem-feature" aria-labelledby="rf-h">
                  <p class="rem-feature-top">${label("fine")}<span>${member(fine.member).full}, ${member(fine.member).role.split(",")[0]}</span></p>
                  <h2 id="rf-h">Скидка 50% на штраф — до ${ctx.fmtDay(keyDate(ctx, fine))}</h2>
                  <p>${fine.title}: ${fine.detail}. Если оплатить до ${ctx.fmtDay(keyDate(ctx, fine))}, заплатите <b>${ctx.fmtMoney(amountDue(fine))} BYN</b> вместо ${ctx.fmtMoney(fine.amount)} BYN.</p>
                  <div class="rem-feature-act">
                    <a class="btn btn-orange btn-lg" href="#/dalon/pay?ids=${fine.id}">Оплатить со скидкой</a>
                    <span class="rem-left tone-${ctx.toneFor(keyDate(ctx, fine))}">${ctx.untilText(keyDate(ctx, fine))}</span>
                  </div>
                </section>`
              : ""
          }
          <section aria-labelledby="rem-h">
            <h2 class="dl-h2" id="rem-h">Ближайшие сроки</h2>
            ${
              items.length
                ? `<ol class="rem-list">
                ${items
                  .map(
                    (x) => `
                  <li class="rem tone-${ctx.toneFor(x.date)}">
                    <span class="rem-date"><b>${ctx.fmtDayShort(x.date).day}</b><span>${ctx.fmtDayShort(x.date).mon}</span></span>
                    <div class="rem-body">
                      <p class="rem-top">${label(x.type)}<span>${x.who ? x.who.name : ""}</span><span class="rem-left">${ctx.untilText(x.date)}</span></p>
                      <h3>${x.title}</h3>
                      <p>${x.text}</p>
                    </div>
                    <a class="btn btn-quiet btn-sm" href="${x.href}">${x.action}</a>
                  </li>`
                  )
                  .join("")}
              </ol>`
                : `<div class="empty-state">${ctx.icon("calendar", 30)}<h3>Сроков нет</h3><p>Когда появятся начисления или подойдёт срок документа, напоминание будет здесь.</p></div>`
            }
          </section>
        </div>
        <aside class="rem-settings" aria-labelledby="rs-h">
          <h2 id="rs-h">Как напоминать</h2>
          <fieldset>
            <legend>Когда</legend>
            ${sw("d7", "За 7 дней до срока")}
            ${sw("d1", "За день до срока")}
            ${sw("d0", "В день срока")}
          </fieldset>
          <fieldset>
            <legend>Куда</legend>
            ${sw("cab", "В кабинет Е-Паслуги", "Всегда включено", true)}
            ${sw("push", "Push в приложении «Е-Паслуга»")}
            ${sw("sms", "SMS", "На +375 29 555-12-34")}
            ${sw("email", "Электронная почта", "a.ivanov@example.by")}
          </fieldset>
          <fieldset>
            <legend>О чём</legend>
            ${sw("tax", "Налоги")}
            ${sw("fine", "Штрафы ГАИ и техосмотр")}
            ${sw("kids", "Садик и кружки")}
            ${sw("doc", "Сроки документов")}
          </fieldset>
          <p class="note note-fraud">${ctx.icon("shield", 20)}<span><b>В SMS и письмах нет ссылок на оплату.</b> Мы только напоминаем открыть кабинет. Ссылка «оплатить штраф» в сообщении — признак мошенников.</span></p>
        </aside>
      </div>`;
  }

  function bindReminders(ctx, s) {
    document.querySelectorAll("[data-remind]").forEach((input) => {
      if (input.disabled) {
        return;
      }
      input.addEventListener("change", () => {
        s.remind[input.dataset.remind] = input.checked;
        save(ctx, s);
        ctx.toast("Настройки напоминаний сохранены");
      });
    });
  }

  /* ---------- Семья и права ---------- */

  function consentPill(p, ctx) {
    if (p.consent === "given") {
      return `<span class="pill pill-ok">${ctx.icon("check", 16)}Согласие дано ${ctx.fmtDay(p.at)}</span>`;
    }
    if (p.consent === "pending") {
      return `<span class="pill pill-wait">${ctx.icon("clock", 16)}Ожидает согласия</span>`;
    }
    return `<span class="pill pill-off">${ctx.icon("x", 16)}Согласие отозвано</span>`;
  }

  function personCard(ctx, p) {
    const off = p.consent === "revoked";
    const role = (key, text, note) => `
      <label class="switch">
        <input type="checkbox" data-role="${p.id}:${key}"${p[key] ? " checked" : ""}${off ? " disabled" : ""}>
        <span class="switch-track" aria-hidden="true"><span class="switch-dot"></span></span>
        <span class="switch-text"><b>${text}</b><small>${note}</small></span>
      </label>`;
    let acts = "";
    if (p.consent === "given") {
      acts = `<button class="btn btn-text btn-sm btn-danger" type="button" data-revoke="${p.id}">Отозвать доступ</button>`;
    } else if (p.consent === "pending") {
      acts = `<button class="btn btn-quiet btn-sm" type="button" data-accept="${p.id}">Демо: ${p.name} соглашается</button><button class="btn btn-text btn-sm" type="button" data-cancel="${p.id}">Отменить запрос</button>`;
    } else {
      acts = `<button class="btn btn-quiet btn-sm" type="button" data-request="${p.id}">Отправить запрос снова</button>`;
    }
    const initials = p.full.split(" ").slice(0, 2).map((w) => w[0]).join("");
    return `
      <article class="pcard${off ? " is-off" : ""}">
        <header class="pcard-head">
          <span class="mava mava-adult">${initials}</span>
          <div><h3>${p.full}</h3><p>${p.role}</p></div>
          ${consentPill(p, ctx)}
        </header>
        <div class="pcard-roles">
          ${role("sees", "Видит", "начисления и сроки семьи")}
          ${role("pays", "Платит", "может оплачивать за семью")}
        </div>
        ${p.consent === "pending" ? `<p class="pcard-note">Запрос ушёл в кабинет Е-Паслуги. Доступ появится только после согласия.</p>` : ""}
        ${off ? `<p class="pcard-note">Доступа нет. Начисления этого человека в Далони не показываются.</p>` : ""}
        <div class="pcard-acts">${acts}</div>
      </article>`;
  }

  function familyPage(ctx, s) {
    const kids = MEMBERS.filter((m) => m.kind === "child");
    const car = member("car");
    return `
      <div class="dl-grid dl-grid-fam">
        <div>
          <section aria-labelledby="fam-adults">
            <div class="dl-sec-head">
              <h2 id="fam-adults">Взрослые</h2>
              <button class="btn btn-orange" type="button" id="add-person">${ctx.icon("plus", 20)}Добавить взрослого</button>
            </div>
            <article class="pcard pcard-me">
              <header class="pcard-head">
                <span class="mava mava-adult">АС</span>
                <div><h3>${ctx.persona.fullName}</h3><p>Вы — владелец семейного пространства</p></div>
                <span class="pill pill-me">Видит и платит</span>
              </header>
            </article>
            ${s.people.map((p) => personCard(ctx, p)).join("")}
          </section>
          <section aria-labelledby="fam-kids">
            <h2 class="dl-h2" id="fam-kids">Дети</h2>
            <div class="kids">
              ${kids
                .map(
                  (k) => `
                <article class="kcard">
                  <span class="mava mava-child">${k.short}</span>
                  <div>
                    <h3>${k.full}</h3>
                    <p>${k.role}</p>
                    <p class="kcard-rep">${ctx.icon("shield", 18)}<span>Законные представители: вы и Анна</span></p>
                  </div>
                  ${label("kids")}
                </article>`
                )
                .join("")}
            </div>
            <p class="fine">Согласие детей не нужно: начисления за садик, школу и кружки видят законные представители — по данным регистра населения.</p>
          </section>
          <section aria-labelledby="fam-car">
            <h2 class="dl-h2" id="fam-car">Имущество</h2>
            <article class="kcard">
              <span class="mava mava-car">${ctx.icon("car", 22)}</span>
              <div>
                <h3>${car.full}</h3>
                <p>${car.role}</p>
                <p class="kcard-rep">${ctx.icon("info", 18)}<span>Штрафы с камер и госпошлина за техосмотр приходят по номеру автомобиля сами.</span></p>
              </div>
              ${label("car")}
            </article>
          </section>
        </div>
        <aside class="fam-rules" aria-labelledby="rules-h">
          <h2 id="rules-h">Как устроен доступ</h2>
          <ul>
            <li><b>Взрослый — только с согласия.</b> Мы отправляем запрос в его кабинет. Пока он не согласится, вы ничего о нём не видите.</li>
            <li><b>Роли можно сочетать.</b> «Видит» — начисления и сроки семьи. «Платит» — может оплатить за кого угодно из семьи.</li>
            <li><b>Согласие отзывается в один клик.</b> Начисления человека сразу исчезают из Далони, история платежей остаётся.</li>
          </ul>
        </aside>
      </div>`;
  }

  function bindFamily(ctx, s) {
    const rerender = (msg) => {
      save(ctx, s);
      ctx.render({ keepScroll: true });
      if (msg) {
        ctx.toast(msg);
      }
    };
    document.querySelectorAll("[data-role]").forEach((input) => {
      input.addEventListener("change", () => {
        const [id, key] = input.dataset.role.split(":");
        const p = person(s, id);
        if (!p) {
          return;
        }
        p[key] = input.checked;
        save(ctx, s);
        ctx.toast(`${p.name}: ${key === "sees" ? "видит" : "платит"} — ${input.checked ? "включено" : "выключено"}`);
      });
    });
    document.querySelectorAll("[data-revoke]").forEach((b) => {
      b.addEventListener("click", () => {
        const p = person(s, b.dataset.revoke);
        if (!p) {
          return;
        }
        ctx.openModal(
          `
          <h2 id="modal-title">Отозвать доступ?</h2>
          <p>${p.full} перестанет видеть начисления семьи и оплачивать их. Начисления этого человека исчезнут из вашей Далони.</p>
          <p class="muted">История платежей сохранится. Вернуть доступ можно, отправив запрос снова.</p>
          <div class="modal-actions">
            <button class="btn btn-danger-solid" type="button" id="do-revoke">Отозвать доступ</button>
            <button class="btn btn-quiet" type="button" data-close>Оставить как есть</button>
          </div>`,
          (box) => {
            box.querySelector("#do-revoke").addEventListener("click", () => {
              p.consent = "revoked";
              p.at = new Date().toISOString();
              ctx.closeModal();
              rerender(`Доступ отозван: ${p.name}`);
            });
          }
        );
      });
    });
    document.querySelectorAll("[data-accept]").forEach((b) => {
      b.addEventListener("click", () => {
        const p = person(s, b.dataset.accept);
        if (p) {
          p.consent = "given";
          p.at = new Date().toISOString();
          ctx.addNotif("info", `Далонь: согласие получено — ${p.name}`, `${p.full} теперь в вашем семейном пространстве.`);
          rerender(`${p.name}: согласие получено`);
        }
      });
    });
    document.querySelectorAll("[data-cancel]").forEach((b) => {
      b.addEventListener("click", () => {
        const p = person(s, b.dataset.cancel);
        if (p) {
          p.consent = "revoked";
          rerender("Запрос отменён");
        }
      });
    });
    document.querySelectorAll("[data-request]").forEach((b) => {
      b.addEventListener("click", () => {
        const p = person(s, b.dataset.request);
        if (p) {
          p.consent = "pending";
          p.at = new Date().toISOString();
          rerender(`Запрос отправлен: ${p.name}`);
        }
      });
    });
    const add = document.getElementById("add-person");
    if (add) {
      add.addEventListener("click", () => {
        ctx.openModal(
          `
          <h2 id="modal-title">Добавить взрослого</h2>
          <p class="muted">Мы отправим запрос в его кабинет Е-Паслуги. Пока он не согласится, вы ничего о нём не увидите.</p>
          <form id="add-form" novalidate>
            <div class="field" data-field="fio">
              <label for="ad-fio">Фамилия, имя, отчество</label>
              <input id="ad-fio" name="fio" autocomplete="off" placeholder="Иванова Нина Петровна" aria-describedby="ad-fio-err">
              <p class="err" id="ad-fio-err"></p>
            </div>
            <div class="field">
              <label for="ad-rel">Кем приходится</label>
              <select id="ad-rel" name="rel">
                <option>Мать</option><option>Отец</option><option>Брат или сестра</option><option>Другой родственник</option>
              </select>
            </div>
            <div class="field" data-field="idn">
              <label for="ad-idn">Личный номер</label>
              <input id="ad-idn" name="idn" autocomplete="off" maxlength="14" placeholder="14 символов, как в паспорте" aria-describedby="ad-idn-err">
              <p class="err" id="ad-idn-err"></p>
            </div>
            <div class="modal-actions">
              <button class="btn btn-orange" type="submit">Отправить запрос</button>
              <button class="btn btn-quiet" type="button" data-close>Отмена</button>
            </div>
          </form>`,
          (box) => {
            const form = box.querySelector("#add-form");
            form.addEventListener("submit", (e) => {
              e.preventDefault();
              const els = form.elements;
              const name = els.fio.value.trim().replace(/\s+/g, " ");
              const idn = els.idn.value.trim().toUpperCase();
              const errs = {};
              if (!/^[А-ЯЁа-яё-]{2,}\s[А-ЯЁа-яё-]{2,}/.test(name)) {
                errs.fio = "Укажите хотя бы фамилию и имя";
              }
              if (!/^[0-9A-Z]{14}$/.test(idn)) {
                errs.idn = "Личный номер — 14 цифр и латинских букв";
              }
              ["fio", "idn"].forEach((k) => {
                const input = els[k];
                const err = box.querySelector(`#ad-${k}-err`);
                input.classList.toggle("is-bad", !!errs[k]);
                input.setAttribute("aria-invalid", errs[k] ? "true" : "false");
                err.textContent = errs[k] || "";
              });
              if (Object.keys(errs).length) {
                form.querySelector(".is-bad").focus();
                return;
              }
              const parts = name.split(" ");
              s.people.push({
                id: "p" + Date.now(),
                name: parts[1] || parts[0],
                full: name,
                role: els.rel.value,
                consent: "pending",
                at: new Date().toISOString(),
                sees: true,
                pays: false,
              });
              ctx.closeModal();
              rerender(`Запрос отправлен: ${parts[1] || parts[0]}`);
            });
          }
        );
      });
    }
  }

  /* ---------- Оплата ---------- */

  function receiptHtml(ctx, items, title) {
    const rows = items
      .map((h) => `<tr><td>${h.title}<br><small>${h.payee || ""}</small></td><td>${h.receipt}</td><td style="text-align:right">${ctx.fmtMoney(h.amount)}&nbsp;BYN</td></tr>`)
      .join("");
    const total = items.reduce((a, h) => a + h.amount, 0);
    return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Arial,sans-serif;max-width:640px;margin:40px auto;padding:0 16px;color:#2a2a2e}h1{font-size:22px}table{width:100%;border-collapse:collapse;margin:16px 0}td{padding:10px 6px;border-bottom:1px solid #ddd;vertical-align:top}small{color:#666}.t{font-size:18px;font-weight:bold}.n{color:#666;font-size:13px}</style></head>
<body><h1>${title}</h1><p>Плательщик: ${ctx.persona.fullName}<br>Дата: ${new Date(items[0].paidAt).toLocaleString("ru-BY")}<br>Способ: ${items[0].method}</p>
<table>${rows}</table><p class="t">Итого: ${ctx.fmtMoney(total)} BYN</p>
<p class="n">Демонстрационная квитанция учебного прототипа Е-Паслуги. Не является платёжным документом.</p></body></html>`;
  }

  function downloadReceipt(ctx, items) {
    const html = receiptHtml(ctx, items, items.length > 1 ? "Квитанции об оплате (демо)" : "Квитанция об оплате (демо)");
    const name = items.length > 1 ? "kvitancii-dalon.html" : `kvitanciya-${items[0].receipt}.html`;
    ctx.downloadBlob(new Blob([html], { type: "text/html;charset=utf-8" }), name);
  }

  function payPage(ctx, s, route) {
    const ids = (route.params.get("ids") || "").split(",").filter(Boolean);
    if (pay.ids !== ids.join(",")) {
      pay.ids = ids.join(",");
      pay.stage = pay.result && pay.result.key === pay.ids ? pay.stage : "confirm";
    }
    const back = `<a class="back-link" href="#/dalon">${ctx.icon("chev-left", 20)}К панели Далони</a>`;

    if (pay.stage === "ok" && pay.result && pay.result.key === pay.ids) {
      const items = pay.result.items;
      const total = items.reduce((a, h) => a + h.amount, 0);
      return `
        <div class="pay-wrap">
          <section class="pay-result is-ok" aria-labelledby="pr-h">
            <span class="pay-result-ico">${ctx.icon("check", 34)}</span>
            <h1 id="pr-h">Оплачено ${ctx.fmtMoney(total)} BYN</h1>
            <p>Деньги ушли получателям через ЕРИП. Ведомства увидят оплату в течение рабочего дня — начисления уже убраны из панели.</p>
            <ul class="pay-done">
              ${items.map((h) => `<li><span>${h.title}<small>Квитанция ${h.receipt}</small></span><b>${ctx.fmtMoney(h.amount)} BYN</b></li>`).join("")}
            </ul>
            <div class="pay-acts">
              <a class="btn btn-orange btn-lg" href="#/dalon">Вернуться в Далонь</a>
              <button class="btn btn-quiet btn-lg" type="button" id="dl-receipts">${ctx.icon("download", 20)}Скачать ${items.length > 1 ? "квитанции" : "квитанцию"}</button>
            </div>
            <a class="btn btn-text" href="#/dalon/history">Вся история платежей</a>
          </section>
        </div>`;
    }

    const list = visible(s).filter((c) => ids.includes(c.id));
    if (!list.length) {
      return `
        <div class="pay-wrap">
          ${back}
          <div class="empty-state">${ctx.icon("check", 30)}<h3>Оплачивать нечего</h3><p>Выбранные начисления уже оплачены или больше не показываются. Оплаченное — в истории.</p><div class="pay-acts"><a class="btn btn-quiet" href="#/dalon">К панели</a><a class="btn btn-text" href="#/dalon/history">История платежей</a></div></div>
        </div>`;
    }
    const total = sumOf(list);

    if (pay.stage === "fail") {
      return `
        <div class="pay-wrap">
          ${back}
          <section class="pay-result is-fail" aria-labelledby="pr-h" role="alert">
            <span class="pay-result-ico">${ctx.icon("alert", 34)}</span>
            <h1 id="pr-h">Платёж не прошёл. Деньги не списаны</h1>
            <p>Банк не ответил вовремя, и операция отменилась до списания. С вашего счёта ничего не ушло, начисления остались в списке.</p>
            <dl class="kv">
              <div><dt>Сумма</dt><dd>${ctx.fmtMoney(total)} BYN</dd></div>
              <div><dt>Что делать</dt><dd>Повторите через минуту или выберите другой способ оплаты</dd></div>
            </dl>
            <div class="pay-acts">
              <button class="btn btn-orange btn-lg" type="button" id="pay-retry">${ctx.icon("refresh", 20)}Повторить</button>
              <button class="btn btn-quiet btn-lg" type="button" id="pay-change">Выбрать другой способ</button>
            </div>
          </section>
        </div>`;
    }

    const busy = pay.stage === "processing";
    const methods = [
      { id: "erip", title: "ЕРИП через ваш интернет-банк", text: "Откроется ваш банк с уже заполненным платежом. Номер услуги и реквизиты вводить не нужно.", icon: "building" },
      { id: "card", title: "Банковская карта", text: "Белкарт, Visa, Mastercard, МИР. Данные карты вводятся на странице банка, а не в Е-Паслуге.", icon: "card" },
    ];
    return `
      <div class="pay-wrap">
        ${back}
        <header class="pay-head">
          <h1>Подтверждение оплаты</h1>
          <p class="lead">Проверьте, что оплачиваете, и выберите способ.</p>
        </header>
        <section class="receipt" aria-label="Что оплачиваете">
          <ul>
            ${list
              .map(
                (c) => `
              <li>
                <span class="receipt-who">${avatar(ctx, member(c.member))}</span>
                <span class="receipt-main"><b>${c.title}</b><small>${c.payee}</small></span>
                <span class="receipt-sum">${c.discount ? `<s>${ctx.fmtMoney(c.amount)}</s>` : ""}${ctx.fmtMoney(amountDue(c))} BYN</span>
              </li>`
              )
              .join("")}
          </ul>
          <p class="receipt-total"><span>Итого</span><b>${ctx.fmtMoney(total)} BYN</b></p>
        </section>
        <fieldset class="paymethods"${busy ? " disabled" : ""}>
          <legend>Способ оплаты</legend>
          ${methods
            .map(
              (m) => `
            <label class="paymethod${pay.method === m.id ? " is-on" : ""}">
              <input type="radio" name="paym" value="${m.id}"${pay.method === m.id ? " checked" : ""}>
              <span class="paymethod-ico">${ctx.icon(m.icon, 24)}</span>
              <span><b>${m.title}</b><small>${m.text}</small></span>
            </label>`
            )
            .join("")}
        </fieldset>
        ${ctx.safetyNotes(true)}
        <label class="demo-toggle">
          <input type="checkbox" id="demo-fail"${pay.fail ? " checked" : ""}${busy ? " disabled" : ""}>
          <span>Демо: смоделировать сбой банка</span>
        </label>
        <button class="btn btn-orange btn-lg btn-block${busy ? " is-loading" : ""}" type="button" id="pay-confirm"${busy ? " disabled" : ""}>${busy ? "Ждём ответ банка" : `Оплатить ${ctx.fmtMoney(total)} BYN`}</button>
      </div>`;
  }

  function bindPay(ctx, s, route) {
    document.querySelectorAll("input[name=paym]").forEach((r) => {
      r.addEventListener("change", () => {
        pay.method = r.value;
        document.querySelectorAll(".paymethod").forEach((el) => {
          el.classList.toggle("is-on", el.querySelector("input").checked);
        });
      });
    });
    const fail = document.getElementById("demo-fail");
    if (fail) {
      fail.addEventListener("change", () => {
        pay.fail = fail.checked;
      });
    }
    const run = () => {
      pay.stage = "processing";
      ctx.render({ keepScroll: true });
      setTimeout(() => {
        const ids = pay.ids.split(",");
        const list = visible(s).filter((c) => ids.includes(c.id));
        if (pay.fail) {
          /* Демо-сбой одноразовый: «Повторить» уже пройдёт успешно */
          pay.fail = false;
          pay.stage = "fail";
          ctx.render();
          return;
        }
        const method = pay.method === "erip" ? "ЕРИП" : "Банковская карта";
        const now = new Date().toISOString();
        const items = list.map((c) => ({
          id: "h" + Date.now() + c.id,
          title: c.discount ? `Штраф ГАИ: ${c.title.toLowerCase()} (скидка 50%)` : c.title,
          member: c.member,
          type: c.type,
          payee: c.payee,
          amount: amountDue(c),
          paidAt: now,
          method,
          receipt: `${pay.method === "erip" ? "ЕР" : "БК"}-${String(Math.floor(10000000 + Math.random() * 89999999))}`,
        }));
        s.charges = s.charges.filter((c) => !ids.includes(c.id));
        s.history = [...items, ...s.history];
        save(ctx, s);
        const sel = ctx.readSession(SEL_KEY, []);
        ctx.writeSession(SEL_KEY, Array.isArray(sel) ? sel.filter((id) => !ids.includes(id)) : []);
        const total = items.reduce((a, h) => a + h.amount, 0);
        ctx.addNotif("legal", `Далонь: оплачено ${ctx.fmtMoney(total)} BYN`, `${ctx.plural(items.length, "начисление", "начисления", "начислений")} оплачено через ${method}. Квитанции — в Далони, раздел «История».`);
        pay.stage = "ok";
        pay.result = { key: pay.ids, items };
        ctx.render();
      }, 1400);
    };
    const confirm = document.getElementById("pay-confirm");
    if (confirm) {
      confirm.addEventListener("click", run);
    }
    const retry = document.getElementById("pay-retry");
    if (retry) {
      retry.addEventListener("click", run);
    }
    const change = document.getElementById("pay-change");
    if (change) {
      change.addEventListener("click", () => {
        pay.stage = "confirm";
        pay.method = pay.method === "erip" ? "card" : "erip";
        ctx.render();
      });
    }
    const dl = document.getElementById("dl-receipts");
    if (dl && pay.result) {
      dl.addEventListener("click", () => {
        downloadReceipt(ctx, pay.result.items);
        ctx.toast("Квитанция скачана");
      });
    }
  }

  /* ---------- История ---------- */

  function historyPage(ctx, s, route) {
    const who = route.params.get("who") || "";
    const list = s.history.filter((h) => !who || h.member === who).sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));
    const year = new Date().getFullYear();
    const yearSum = s.history.filter((h) => new Date(h.paidAt).getFullYear() === year).reduce((a, h) => a + h.amount, 0);
    const groups = {};
    list.forEach((h) => {
      const d = new Date(h.paidAt);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      groups[k] = groups[k] || { title: capFirst(d.toLocaleDateString("ru-RU", { month: "long", year: "numeric" })), items: [] };
      groups[k].items.push(h);
    });
    const chip = (id, text) => `<a class="chip${who === id ? " is-on" : ""}" href="#/dalon/history${id ? `?who=${id}` : ""}">${text}</a>`;
    return `
      <div class="hist-top">
        <p class="hist-total"><span>Оплачено в ${year} году</span><b>${ctx.fmtMoney(yearSum)} BYN</b><small>${ctx.plural(s.history.length, "платёж", "платежа", "платежей")}</small></p>
        <div class="chips" role="group" aria-label="Чьи платежи">
          ${chip("", "Вся семья")}
          ${MEMBERS.map((m) => chip(m.id, m.name)).join("")}
        </div>
      </div>
      ${
        list.length
          ? Object.values(groups)
              .map(
                (g) => `
            <section class="hist-month">
              <h2 class="dl-h2">${g.title}</h2>
              <ul class="hist-list">
                ${g.items
                  .map(
                    (h) => `
                  <li class="hist-row">
                    <span class="hist-date">${ctx.fmtDay(h.paidAt)}</span>
                    <span class="hist-main"><b>${h.title}</b><small>${member(h.member) ? member(h.member).name : ""}, ${h.method}, квитанция ${h.receipt}</small></span>
                    <span class="hist-sum">${ctx.fmtMoney(h.amount)} BYN</span>
                    <button class="btn btn-text btn-sm" type="button" data-receipt="${h.id}" aria-label="Скачать квитанцию: ${ctx.esc(h.title)}">${ctx.icon("download", 18)}<span>Квитанция</span></button>
                  </li>`
                  )
                  .join("")}
              </ul>
            </section>`
              )
              .join("")
          : `<div class="empty-state">${ctx.icon("receipt", 30)}<h3>Платежей пока нет</h3><p>${who ? "У этого члена семьи ещё не было оплат через Далонь." : "После первой оплаты здесь появятся квитанции."}</p><a class="btn btn-quiet" href="#/dalon">К начислениям</a></div>`
      }`;
  }

  function bindHistory(ctx, s) {
    document.querySelectorAll("[data-receipt]").forEach((b) => {
      b.addEventListener("click", () => {
        const h = s.history.find((x) => x.id === b.dataset.receipt);
        if (h) {
          downloadReceipt(ctx, [h]);
          ctx.toast("Квитанция скачана");
        }
      });
    });
  }

  /* ---------- Публичный интерфейс ---------- */

  function page(ctx, route) {
    const s = load(ctx);
    let body = "";
    if (route.sub === "family") {
      body = familyPage(ctx, s);
    } else if (route.sub === "reminders") {
      body = remindersPage(ctx, s);
    } else if (route.sub === "history") {
      body = historyPage(ctx, s, route);
    } else if (route.sub === "pay") {
      body = payPage(ctx, s, route);
    } else {
      body = panelPage(ctx, s);
    }
    return `<div class="dalon dalon-${route.sub}">${route.sub === "pay" ? "" : head(ctx, route, s)}${body}</div>`;
  }

  function bind(ctx, route) {
    const s = load(ctx);
    if (route.sub === "family") {
      bindFamily(ctx, s);
    } else if (route.sub === "reminders") {
      bindReminders(ctx, s);
    } else if (route.sub === "history") {
      bindHistory(ctx, s);
    } else if (route.sub === "pay") {
      bindPay(ctx, s, route);
    } else {
      bindPanel(ctx, s);
    }
  }

  function summary(ctx) {
    const s = load(ctx);
    const vis = visible(s);
    return { count: vis.length, total: sumOf(vis) };
  }

  function attention(ctx) {
    const s = load(ctx);
    return visible(s)
      .map((c) => ({ c, d: keyDate(ctx, c) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .map(({ c, d }) => ({
        due: d,
        tag: `Далонь, ${member(c.member).name}`,
        title: c.discount ? `Штраф ГАИ: скидка 50% до ${ctx.fmtDay(d)}` : c.title,
        text: c.discount ? `${ctx.fmtMoney(amountDue(c))} BYN вместо ${ctx.fmtMoney(c.amount)}. ${c.detail}.` : `${ctx.fmtMoney(amountDue(c))} BYN. ${c.detail}.`,
        href: `#/dalon/pay?ids=${c.id}`,
        action: "Оплатить",
        tone: ctx.toneFor(d),
      }));
  }

  window.addEventListener("hashchange", () => {
    if (!location.hash.startsWith("#/dalon/pay")) {
      pay.stage = "confirm";
      pay.result = null;
      pay.ids = "";
    }
  });

  window.EP_DALON = { page, bind, summary, attention };
})();
