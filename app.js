(function () {
  fetch("site-data.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Could not load site-data.json");
      return response.json();
    })
    .then(initialize)
    .catch(function (error) {
      console.error(error);
      document.body.setAttribute("data-content-error", "true");
    });

  function initialize(siteContent) {
    var T = siteContent.translations;
    var BIZ = siteContent.businesses;
    var config = siteContent.config;
  var S = "<svg viewBox='0 0 48 48' fill='none' stroke='currentColor' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'>";
  var ICON = {
    honda: S + "<circle cx='12' cy='34' r='7'/><circle cx='37' cy='34' r='7'/><path d='M12 34l8-12h11l6 12M20 22l-2-6h6M31 22l-3-8h6'/></svg>",
    farmtrac: S + "<circle cx='14' cy='33' r='9'/><circle cx='38' cy='36' r='5'/><path d='M5 30V17h14l4 9h11v10M27 26V14h7v12'/></svg>",
    agrotech: S + "<path d='M24 41V22M24 29c0-8-8-12-14-10 0 8 6 12 14 10zM24 22c0-8 8-12 14-10 0 8-6 12-14 10z'/></svg>",
    santra: S + "<circle cx='24' cy='28' r='13'/><path d='M24 15c0-6 6-8 10-7 0 5-5 8-10 7zM24 15v-4'/></svg>",
    sawmill: S + "<circle cx='24' cy='25' r='15'/><circle cx='24' cy='25' r='9'/><circle cx='24' cy='25' r='3'/><path d='M8 42h32'/></svg>",
    traders: S + "<rect x='5' y='10' width='38' height='7' rx='2'/><rect x='5' y='21' width='38' height='7' rx='2'/><rect x='5' y='32' width='38' height='7' rx='2'/><path d='M12 10v7M20 10v7M28 10v7M36 10v7M12 21v7M20 21v7M28 21v7M36 21v7'/></svg>",
    fuels: S + "<rect x='10' y='7' width='20' height='33' rx='2'/><rect x='14' y='12' width='12' height='9'/><path d='M30 18h5c2 0 3 1 3 3v11c0 3 4 3 4 0V19l-5-5M7 40h26'/></svg>",
    cloth: S + "<path d='M8 12c8-4 16 4 24 0s8 0 8 0v24c-8 4-16-4-24 0s-8 0-8 0zM8 24c8-4 16 4 32 0'/></svg>",
    farm: S + "<path d='M24 42V14M24 20c-6-2-8-6-8-10 4 0 8 4 8 10zM24 20c6-2 8-6 8-10-4 0-8 4-8 10zM24 31c-6-2-8-6-8-10 4 0 8 4 8 10zM24 31c6-2 8-6 8-10-4 0-8 4-8 10z'/></svg>",
    trust: S + "<path d='M24 5l16 6v12c0 10-7 16-16 20-9-4-16-10-16-20V11z'/><path d='M16 24l6 6 11-12'/></svg>",
    family: S + "<circle cx='24' cy='14' r='5'/><path d='M14 39c0-10 20-10 20 0'/><circle cx='10' cy='23' r='4'/><path d='M3 39c0-6 4-8 8-8'/><circle cx='38' cy='23' r='4'/><path d='M45 39c0-6-4-8-8-8'/></svg>",
    legacy: S + "<path d='M6 22L24 8l18 14M10 20v20h28V20M20 40V28h8v12'/></svg>",
    person: S + "<circle cx='24' cy='17' r='8'/><path d='M8 44c0-13 32-13 32 0'/></svg>"
  };


  var lang = "en", root = document.documentElement, reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  try { var sl = localStorage.getItem("aus-lang-v2"); if (sl === "en" || sl === "mr") lang = sl; } catch (e) {}
  try { var st = localStorage.getItem("aus-theme"); if (st === "light" || st === "dark") root.setAttribute("data-theme", st); } catch (e) {}

  function t(k) { return T[lang][k]; }
  function other() { return lang === "en" ? "mr" : "en"; }
  function $(s) { return document.querySelector(s); }
  function fmt(n) { return Math.round(n).toLocaleString("en-IN"); }
  function byId(id) { return BIZ.filter(function (z) { return z.id === id; })[0]; }
  function whatsappNumber() { return String(config.whatsappNumber || "").replace(/\D/g, ""); }

  function updateSeo(id) {
    var page = id ? byId(id) : null;
    var title = page ? page[lang].n + " | " + T[lang].logo_name : siteContent.seo[lang].title;
    var description = page ? page[lang].d : siteContent.seo[lang].description;
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    var pageUrl = String(config.siteUrl || window.location.href.split("#")[0]) + (id ? "#" + id : "");
    setMeta('meta[property="og:url"]', "content", pageUrl);
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = pageUrl;
  }

  function setMeta(selector, attribute, value) {
    var element = document.querySelector(selector);
    if (element) element.setAttribute(attribute, value);
  }

  function updateStructuredData() {
    var baseUrl = String(config.siteUrl || window.location.href.split("#")[0]).replace(/#.*$/, "");
    var groupId = baseUrl + "#organization";
    var phone = whatsappNumber();
    var graph = [{
      "@type": "Organization",
      "@id": groupId,
      "name": T.en.logo_name,
      "url": baseUrl
    }];
    BIZ.forEach(function (business) {
      var entry = {
        "@type": "LocalBusiness",
        "@id": baseUrl + "#" + business.id,
        "name": business.en.n,
        "description": business.en.d,
        "url": baseUrl + "#" + business.id,
        "parentOrganization": { "@id": groupId }
      };
      if (phone) entry.telephone = "+" + phone;
      if (business.img) entry.image = new URL(business.img, baseUrl).href;
      if (business.address && Object.keys(business.address).some(function (key) { return business.address[key]; })) {
        entry.address = Object.assign({ "@type": "PostalAddress" }, business.address);
      }
      graph.push(entry);
    });
    var schema = document.getElementById("local-business-schema");
    if (schema) schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  }

  function tile(x, big) {
    var c = x[lang], o = x[other()];
    return "<a class='tile reveal' data-search='" + (c.n + " " + c.t + " " + c.d + " " + c.i.join(" ")).toLowerCase().replace(/'/g, "&#39;") + "' style='--a:" + x.a + "' data-mr='" + o.n + "' href='#" + x.id + "'>" +
      (x.isNew ? "<span class='badge'>" + t("isnew") + "</span>" : "") +
      "<span class='ic'>" + ICON[x.id] + "</span><h3>" + c.n + "</h3><span class='mr'>" + o.n + "</span>" +
      "<p>" + (big ? c.d : c.t) + "</p><span class='go'>" + t("open") + "</span></a>";
  }

  function renderHome() {
    document.querySelectorAll("[data-stat]").forEach(function (element) {
      var value = siteContent.stats[element.getAttribute("data-stat")];
      element.textContent = value;
      element.setAttribute("data-n", value);
    });
    var v = "";
    [["trust", "v1"], ["family", "v2"], ["legacy", "v3"]].forEach(function (p) {
      v += "<article class='val reveal'><span class='big'>" + t(p[1] + "_w") + "</span><span class='ico'>" + ICON[p[0]] + "</span><h3>" + t(p[1] + "_t") + "</h3><p>" + t(p[1] + "_p") + "</p></article>";
    });
    $("#vals").innerHTML = v;

    renderUpdates();

    var g = "", roman = ["I", "II", "III"];
    for (var i = 0; i < 3; i++) {
      g += "<article class='gen reveal'><span class='node'>" + roman[i] + "</span><div class='gcard'><span class='tag'>" + t("gen_tag")[i] + "</span>" +
        "<div class='avatar'>" + ICON.person + "</div><h3>" + t("gen_name")[i] + "</h3><p>" + t("gen_txt")[i] + "</p></div></article>";
    }
    $("#gens").innerHTML = g;

    var cl = "";
    [1, 2, 3].forEach(function (n) {
      var items = BIZ.filter(function (x) { return x.c === n; });
      cl += "<div class='cluster'><div class='chead'><h3>" + t("cl" + n + "_h") + "</h3><p>" + t("cl" + n + "_p") + "</p></div>" +
        "<div class='tiles " + (n === 1 ? "t2" : n === 2 ? "t3" : "t4") + "'>" + items.map(function (x) { return tile(x, n === 1); }).join("") + "</div></div>";
    });
    $("#clusters").innerHTML = cl;
    applyBusinessSearch();

    var f = "";
    for (var j = 0; j < 3; j++) {
      f += "<article class='fcard reveal'><div class='avatar'>" + ICON.person + "</div><div><h3 class='ph'>" + t("f_name") +
        "</h3><div class='role'>" + t("f_role") + "</div></div><blockquote>" + t("f_quote") + "</blockquote></article>";
    }
    $("#founders-list").innerHTML = f;

  }

  function activeUpdates() {
    var now = new Date();
    return Array.isArray(config.liveUpdates) ? config.liveUpdates.filter(function (item) {
      var from = item.start ? new Date(item.start + "T00:00:00") : null;
      var until = item.end ? new Date(item.end + "T23:59:59") : null;
      return (!from || from <= now) && (!until || until >= now) && item[lang] && item[lang].title && item[lang].text;
    }) : [];
  }

  function renderUpdates() {
    var updates = activeUpdates();
    var list = $("#updates-list");
    if (!updates.length) {
      list.innerHTML = "<p class='updates-empty'>" + t("updates_empty") + "</p>";
      return;
    }
    list.innerHTML = updates.map(function (item) {
      var business = item.businessId && byId(item.businessId);
      var dates = item.start || item.end ? "<p class='update-dates'>" + [item.start, item.end].filter(Boolean).join(" – ") + "</p>" : "";
      return "<article class='update-card'><div><h3>" + item[lang].title + "</h3><p>" + item[lang].text + "</p>" + dates + "</div>" +
        (business ? "<a class='update-link' href='#" + business.id + "'>" + business[lang].n + " →</a>" : "") + "</article>";
    }).join("");
  }

  function showOfferPopup(pageId) {
    if ($(".offer-backdrop")) return;
    var offer = activeUpdates().filter(function (item) {
      return item.type === "offer" && (!item.businessId || !pageId || item.businessId === pageId);
    })[0];
    if (!offer) return;

    var offerKey = "aus-offer-seen:" + (offer.id || [offer.businessId || "group", offer.start || "", offer.end || "", offer.en.title].join("|"));
    try { if (sessionStorage.getItem(offerKey)) return; } catch (e) {}

    var backdrop = document.createElement("div");
    backdrop.className = "offer-backdrop";
    var dialog = document.createElement("section");
    dialog.className = "offer-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "offerTitle");

    var close = document.createElement("button");
    close.className = "offer-close";
    close.type = "button";
    close.setAttribute("aria-label", t("close"));
    close.textContent = "×";
    var label = document.createElement("p");
    label.className = "offer-label";
    label.textContent = t("offer_badge");
    var title = document.createElement("h2");
    title.id = "offerTitle";
    title.textContent = offer[lang].title;
    var message = document.createElement("p");
    message.className = "offer-message";
    message.textContent = offer[lang].text;
    dialog.appendChild(close);
    dialog.appendChild(label);
    dialog.appendChild(title);
    dialog.appendChild(message);

    if (offer.start || offer.end) {
      var dates = document.createElement("p");
      dates.className = "offer-dates";
      dates.textContent = t("valid_dates") + ": " + [offer.start, offer.end].filter(Boolean).join(" – ");
      dialog.appendChild(dates);
    }
    if (offer[lang].terms) {
      var terms = document.createElement("p");
      terms.className = "offer-terms";
      terms.textContent = offer[lang].terms;
      dialog.appendChild(terms);
    }
    if (offer.businessId && byId(offer.businessId)) {
      var actions = document.createElement("div");
      actions.className = "offer-actions";
      var visit = document.createElement("a");
      visit.className = "btn primary";
      visit.href = "#" + offer.businessId;
      visit.textContent = t("offer_visit");
      visit.addEventListener("click", dismissOffer);
      actions.appendChild(visit);
      dialog.appendChild(actions);
    }

    var oldOverflow = document.body.style.overflow;
    function dismissOffer() {
      try { sessionStorage.setItem(offerKey, "1"); } catch (e) {}
      document.removeEventListener("keydown", onKeydown);
      document.body.style.overflow = oldOverflow;
      backdrop.remove();
    }
    function onKeydown(event) {
      if (event.key === "Escape") dismissOffer();
    }
    close.addEventListener("click", dismissOffer);
    backdrop.addEventListener("click", function (event) {
      if (event.target === backdrop) dismissOffer();
    });
    document.addEventListener("keydown", onKeydown);
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);
    document.body.style.overflow = "hidden";
    close.focus();
  }

  function applyBusinessSearch() {
    var input = $("#businessSearch"), empty = $("#searchEmpty");
    if (!input || !empty) return;
    var query = input.value.trim().toLocaleLowerCase();
    var shown = 0;
    document.querySelectorAll(".tile").forEach(function (card) {
      var match = !query || card.getAttribute("data-search").indexOf(query) !== -1 || card.textContent.toLocaleLowerCase().indexOf(query) !== -1;
      card.hidden = !match;
      if (match) shown++;
    });
    document.querySelectorAll(".cluster").forEach(function (cluster) {
      cluster.hidden = !cluster.querySelector(".tile:not([hidden])");
    });
    empty.hidden = shown !== 0;
  }

  function renderBiz(id) {
    var x = byId(id), c = x[lang], o = x[other()];
    var h = "<div class='bhead' style='--a:" + x.a + "'><div class='wrap" + (x.img ? " has-img" : "") + "'><div>" +
      "<span class='bic'>" + ICON[id] + "</span><h1>" + c.n + "</h1><div class='mr'>" + o.n + "</div>" +
      "<div class='tg'>" + c.t + "</div><p class='desc'>" + c.d + "</p>" +
      "<div class='chips'><span class='chip'>" + t("chip_part") + "</span>" + (x.isNew ? "<span class='chip'>" + t("isnew") + "</span>" : "") + (whatsappNumber() ? "<a class='chip ph' href='https://wa.me/" + whatsappNumber() + "'>+" + whatsappNumber() + "</a>" : "") + "</div>" +
      "<div class='actions'><button class='btn solid' id='goEnq' type='button'>" + t("cta_enq") + "</button><a class='btn line' href='#top'>" + t("cta_home") + "</a></div></div>" +
      (x.img ? "<figure class='frame' style='margin-bottom:14px'><img src='" + x.img + "' alt='" + c.n + " " + t("showroom_photo") + "' width='295' height='223'></figure>" : "") +
      "</div></div>";
    h += "<div class='wrap' style='--a:" + x.a + "'><a class='crumb' href='#brands'>" + t("back") + "</a><div class='bbody'>";
    h += "<div class='cols'><div class='panel'><h2>" + t("what") + "</h2><ul class='checks'>" + c.i.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ul></div>";
    if (x.emi) {
      h += "<div class='panel'><h2>" + t("emi") + "</h2>" +
        "<label for='emiP'>" + t("price") + "<input id='emiP' type='number' min='0' step='1000' value='" + x.emi[0] + "'></label>" +
        "<label for='emiD'>" + t("down") + "<input id='emiD' type='number' min='0' step='1000' value='" + x.emi[1] + "'></label>" +
        "<label for='emiR'>" + t("rate") + "<input id='emiR' type='number' min='0' step='0.5' value='" + x.emi[2] + "'></label>" +
        "<label for='emiN'>" + t("months") + "<input id='emiN' type='number' min='1' step='1' value='" + x.emi[3] + "'></label>" +
        "<div class='emi-out'><span>" + t("emi_out") + "</span><b id='emiV'>–</b></div><p class='note'>" + t("emi_note") + "</p></div>";
    }
    h += "<div class='panel' id='enqPanel'><h2>" + t("enq") + "</h2><form id='enqForm'><div style='display:grid;gap:14px'>" +
      "<label for='eqN'>" + t("f_n") + "<input id='eqN' type='text' autocomplete='name' required></label>" +
      "<label for='eqP'>" + t("f_p") + "<input id='eqP' type='tel' autocomplete='tel' required></label>" +
      "<label for='eqM'>" + t("f_m") + "<textarea id='eqM'></textarea></label>" +
      "<button class='btn primary' type='submit'>" + t("send") + "</button>" +
      "<p class='status' id='eqS' role='status'></p></div></form></div></div>";
    var place = x.location ? "<p>" + x.location[lang] + "</p>" : "<p class='ph' style='justify-self:start'>" + t("addr_hours") + "</p>";
    if (x.mapUrl) place += "<a class='place-link' href='" + x.mapUrl + "' target='_blank' rel='noopener noreferrer'>" + t("map_link") + " ↗</a>";
    if (x.officialUrl) place += "<a class='place-link' href='" + x.officialUrl + "' target='_blank' rel='noopener noreferrer'>" + t("official_site") + " ↗</a>";
    h += "<div class='panel'><h2>" + t("find") + "</h2>" + place + "</div>";
    var slot = "<div class='slot'>" + t("photo") + "</div>";
    h += "<div class='panel'><h2>" + t("gallery") + "</h2><div class='gal'>" +
      (x.img ? "<div class='slot'><img src='" + x.img + "' alt='" + c.n + " " + t("showroom_photo") + "'></div>" : slot) + slot + slot + "</div></div>";
    h += "<div class='panel'><h2>" + t("related") + "</h2><div class='related'>" +
      BIZ.filter(function (z) { return z.id !== id; }).map(function (z) { return "<a href='#" + z.id + "'>" + z[lang].n + "</a>"; }).join("") + "</div></div>";
    h += "</div></div>";
    $("#biz").innerHTML = h;
    updateSeo(id);

    if (x.emi) {
      var calc = function () {
        var P = (+$("#emiP").value || 0) - (+$("#emiD").value || 0);
        var r = (+$("#emiR").value || 0) / 1200, n = Math.max(1, Math.round(+$("#emiN").value || 1));
        var e = P <= 0 ? 0 : (r ? P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : P / n);
        $("#emiV").textContent = "₹ " + fmt(e);
      };
      ["#emiP", "#emiD", "#emiR", "#emiN"].forEach(function (s) { $(s).addEventListener("input", calc); });
      calc();
    }
    $("#enqForm").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var phone = whatsappNumber();
      if (!/^\d{8,15}$/.test(phone)) {
        $("#eqS").textContent = t("whatsapp_missing");
        return;
      }
      var message = [
        t("enq") + ": " + c.n,
        t("f_n") + ": " + $("#eqN").value.trim(),
        t("f_p") + ": " + $("#eqP").value.trim(),
        t("f_m") + ": " + $("#eqM").value.trim()
      ].join("\n");
      window.location.assign("https://wa.me/" + phone + "?text=" + encodeURIComponent(message));
    });
    $("#goEnq").addEventListener("click", function () { $("#enqPanel").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); });
  }

  function applyText() {
    root.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder"))); });
    $("#langBtn").textContent = t("lang_button");
    var phone = whatsappNumber();
    if (phone && /^\d{8,15}$/.test(phone)) {
      $("#contact-phone").innerHTML = "<a href='https://wa.me/" + phone + "'>+" + phone + "</a>";
    } else {
      $("#contact-phone").textContent = t("contact_phone_placeholder");
    }
    $("#flinks").innerHTML = ["legacy", "brands", "founders", "contact"].map(function (k) { return "<a href='#" + k + "'>" + t("nav_" + k) + "</a>"; }).join("");
  }

  function route() {
    var id = (location.hash || "").replace("#", "");
    var isBiz = !!byId(id);
    $("#home").hidden = isBiz;
    $("#biz").hidden = !isBiz;
    if (isBiz) { renderBiz(id); window.scrollTo(0, 0); }
    else { updateSeo(); renderHome(); }
    showOfferPopup(isBiz ? id : "");
  }

  $("#langBtn").addEventListener("click", function () {
    lang = other();
    try { localStorage.setItem("aus-lang-v2", lang); } catch (e) {}
    applyText(); route();
  });
  $("#themeBtn").addEventListener("click", function () {
    var dark = root.getAttribute("data-theme") === "dark" ||
      (!root.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var next = dark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("aus-theme", next); } catch (e) {}
  });
  $("#businessSearch").addEventListener("input", applyBusinessSearch);
  window.addEventListener("hashchange", function () {
    route();
    var id = (location.hash || "").replace("#", "");
    if (id && !byId(id)) {
      var el = document.getElementById(id);
      if (el) setTimeout(function () { el.scrollIntoView(); }, 0);
    }
  });

  applyText();
  updateStructuredData();
  route();
  }
})();
