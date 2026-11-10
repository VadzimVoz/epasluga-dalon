/* Экран входа (демо). Любой способ пускает в кабинет. */
(() => {
  const METHODS = [
    {
      id: "sms",
      title: "Пароль и код из SMS",
      icon: "sms",
      note: "Так удобнее всего 57,5% опрошенных",
      gives: [
        { ok: true, text: "Начисления, штрафы и их оплата" },
        { ok: true, text: "Справки, которые не требуют ID-карты" },
        { ok: false, text: "Подпись заявлений — нужна ЭЦП" },
      ],
    },
    {
      id: "bio",
      title: "Биометрия или мобильная ЭЦП",
      icon: "finger",
      note: "Так удобно 57% опрошенных",
      gives: [
        { ok: true, text: "Всё, что даёт вход по паролю" },
        { ok: true, text: "Подпись заявлений прямо с телефона" },
      ],
    },
    {
      id: "id",
      title: "ID-карта",
      icon: "id",
      note: "",
      gives: [
        { ok: true, text: "Полный доступ к кабинету" },
        { ok: true, text: "Юридически значимые действия с ЭЦП" },
      ],
    },
  ];

  const view = { method: "sms", step: 1, phone: "+375 29 555-12-34" };

  function methodTitle(id) {
    const m = METHODS.find((x) => x.id === id);
    return m ? m.title : "—";
  }

  function givesHtml(ctx, m) {
    return `<ul class="gives">${m.gives
      .map((g) => `<li class="${g.ok ? "is-ok" : "is-no"}">${ctx.icon(g.ok ? "check" : "x", 16)}<span>${g.text}</span></li>`)
      .join("")}</ul>`;
  }

  function panelHtml(ctx) {
    const { icon } = ctx;
    if (view.method === "sms" && view.step === 1) {
      return `
        <form class="login-form" id="login-form" novalidate>
          <div class="field">
            <label for="lg-phone">Телефон или личный номер</label>
            <input id="lg-phone" name="phone" type="text" autocomplete="username" value="${ctx.esc(view.phone)}">
          </div>
          <div class="field">
            <label for="lg-pass">Пароль</label>
            <input id="lg-pass" name="pass" type="password" autocomplete="current-password" placeholder="В демо подойдёт любой">
          </div>
          <button class="btn btn-primary btn-lg btn-block" type="submit">Получить код из SMS</button>
          <p class="login-fine">В демо пароль не проверяется — подойдёт любой.</p>
        </form>`;
    }
    if (view.method === "sms" && view.step === 2) {
      return `
        <form class="login-form" id="login-code" novalidate>
          <p class="login-sent">${icon("sms", 20)}<span>Отправили код на ${ctx.esc(view.phone)}.</span></p>
          <div class="field" data-field="code">
            <label for="lg-code">Код из SMS</label>
            <input id="lg-code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="4 цифры" aria-describedby="lg-code-err lg-code-hint">
            <p class="field-hint" id="lg-code-hint">Демо: подойдут любые 4 цифры.</p>
            <p class="err" id="lg-code-err"></p>
          </div>
          <p class="note note-fraud">${icon("shield", 20)}<span><b>Этот код вводите только здесь.</b> Сотрудники Е-Паслуги, банка и милиции никогда его не спрашивают.</span></p>
          <button class="btn btn-primary btn-lg btn-block" type="submit">Войти</button>
          <button class="btn btn-text btn-block" type="button" data-back>Изменить номер</button>
        </form>`;
    }
    if (view.method === "bio") {
      return `
        <div class="login-form">
          <div class="login-device">${icon("phone", 34)}</div>
          <p>Откройте приложение «Е-Паслуга» на телефоне и подтвердите вход отпечатком пальца, лицом или ПИН-кодом мобильной ЭЦП.</p>
          <button class="btn btn-primary btn-lg btn-block" type="button" data-confirm>Подтвердить в приложении (демо)</button>
          <p class="login-fine">Приложение не открывается? Войдите по паролю и SMS — начисления и справки доступны и так.</p>
        </div>`;
    }
    return `
      <div class="login-form">
        <div class="login-device">${icon("id", 34)}</div>
        <p>Приложите ID-карту к телефону с NFC или вставьте её в считыватель. ПИН-код вводится в приложении, а не на сайте.</p>
        <button class="btn btn-primary btn-lg btn-block" type="button" data-confirm>Считать карту (демо)</button>
        <details class="login-trouble">
          <summary>Карта не считывается?</summary>
          <ul>
            <li>Снимите чехол и держите карту у задней панели телефона 3–5 секунд.</li>
            <li>Проверьте, что NFC включён в настройках телефона.</li>
            <li>Если карта не читается ни на одном устройстве, проверьте срок её действия.</li>
          </ul>
          <button class="btn btn-quiet btn-sm" type="button" data-switch="sms">Войти по паролю и SMS</button>
        </details>
      </div>`;
  }

  function page(ctx) {
    const { icon, ornament, brandMark } = ctx;
    return `
      <div class="login">
        <section class="login-brand">
          <p class="login-logo">${brandMark()}<b>Е-Паслуга</b></p>
          <h1 class="login-title">Государственные услуги — из дома, без очереди</h1>
          <p class="login-lead">${ctx.servicesCount} услуг онлайн: справки, заявления, начисления и семейные платежи в одном кабинете.</p>
          <ul class="login-facts">
            <li>${icon("eye", 22)}<span><b>Смотреть можно без ЭЦП.</b> Начисления, штрафы, статусы заявлений и многие справки доступны после входа по паролю и SMS.</span></li>
            <li>${icon("edit", 22)}<span><b>ЭЦП — только для подписи.</b> Она нужна, когда заявление должно иметь юридическую силу.</span></li>
          </ul>
          <div class="login-orn">${ornament("orn-login", 4)}</div>
        </section>
        <section class="login-main" aria-labelledby="login-h">
          <div class="login-card">
            <h2 id="login-h">Вход в личный кабинет</h2>
            <p class="login-sub">Выберите удобный способ. Любой подойдёт для просмотра начислений и справок.</p>
            <div class="methods" role="radiogroup" aria-label="Способ входа">
              ${METHODS.map(
                (m) => `
                <label class="method${view.method === m.id ? " is-on" : ""}">
                  <input type="radio" name="method" value="${m.id}"${view.method === m.id ? " checked" : ""}>
                  <span class="method-ico">${icon(m.icon, 26)}</span>
                  <span class="method-text">
                    <b>${m.title}</b>
                    ${m.note ? `<small>${m.note}</small>` : ""}
                    ${givesHtml(ctx, m)}
                  </span>
                </label>`
              ).join("")}
            </div>
            <div class="method-panel" id="method-panel" aria-live="polite">${panelHtml(ctx)}</div>
            ${ctx.safetyNotes(false)}
          </div>
        </section>
      </div>`;
  }

  function finish(ctx, route, btn) {
    if (btn) {
      btn.disabled = true;
      btn.classList.add("is-loading");
      btn.textContent = "Входим";
    }
    setTimeout(() => {
      ctx.setAuth(view.method);
      view.step = 1;
      const next = route.next && !route.next.startsWith("#/login") ? route.next : "#/";
      ctx.go(next);
    }, 650);
  }

  function bindPanel(ctx, route) {
    const panel = document.getElementById("method-panel");
    if (!panel) {
      return;
    }
    const form = document.getElementById("login-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        view.phone = form.phone.value.trim() || view.phone;
        view.step = 2;
        refresh(ctx, route);
        const code = document.getElementById("lg-code");
        if (code) {
          code.focus();
        }
      });
    }
    const codeForm = document.getElementById("login-code");
    if (codeForm) {
      const input = codeForm.code;
      const err = document.getElementById("lg-code-err");
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 6);
        input.classList.remove("is-bad");
        err.textContent = "";
      });
      codeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!/^\d{4,6}$/.test(input.value)) {
          input.classList.add("is-bad");
          input.setAttribute("aria-invalid", "true");
          err.textContent = "Введите 4 цифры из SMS";
          input.focus();
          return;
        }
        finish(ctx, route, codeForm.querySelector("button[type=submit]"));
      });
      const back = codeForm.querySelector("[data-back]");
      if (back) {
        back.addEventListener("click", () => {
          view.step = 1;
          refresh(ctx, route);
        });
      }
    }
    const confirm = panel.querySelector("[data-confirm]");
    if (confirm) {
      confirm.addEventListener("click", () => {
        finish(ctx, route, confirm);
      });
    }
    const sw = panel.querySelector("[data-switch]");
    if (sw) {
      sw.addEventListener("click", () => {
        setMethod(ctx, route, sw.dataset.switch);
      });
    }
  }

  function refresh(ctx, route) {
    const panel = document.getElementById("method-panel");
    if (panel) {
      panel.innerHTML = panelHtml(ctx);
      bindPanel(ctx, route);
    }
  }

  function setMethod(ctx, route, id) {
    view.method = id;
    view.step = 1;
    document.querySelectorAll(".method").forEach((el) => {
      const input = el.querySelector("input");
      const on = input.value === id;
      input.checked = on;
      el.classList.toggle("is-on", on);
    });
    refresh(ctx, route);
  }

  function bind(ctx, route) {
    document.querySelectorAll(".method input").forEach((input) => {
      input.addEventListener("change", () => {
        setMethod(ctx, route, input.value);
      });
    });
    bindPanel(ctx, route);
  }

  window.EP_LOGIN = { page, bind, methodTitle };
})();
