const galleryKey = "ruaBrasilGaleria";
const quotaKey = "ruaBrasilCotas";
const config = window.RUA_BRASIL_CONFIG || {};
const hasSupabase = Boolean(config.supabaseUrl && config.supabaseAnonKey && window.supabase);
const hasJsonBlob = Boolean(config.jsonBlobUrl);
const db = hasSupabase
  ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey)
  : null;

const mediaForm = document.querySelector("#mediaForm");
const mediaFile = document.querySelector("#mediaFile");
const mediaYear = document.querySelector("#mediaYear");
const mediaCaption = document.querySelector("#mediaCaption");
const yearFilter = document.querySelector("#yearFilter");
const galleryGrid = document.querySelector("#galleryGrid");
const clearGallery = document.querySelector("#clearGallery");
const connectionStatus = document.querySelector("#connectionStatus");

const quotaForm = document.querySelector("#quotaForm");
const quotaName = document.querySelector("#quotaName");
const quotaValue = document.querySelector("#quotaValue");
const quotaPaid = document.querySelector("#quotaPaid");
const quotaRows = document.querySelector("#quotaRows");
const quotaSummary = document.querySelector("#quotaSummary");

let gallery = [];
let quotas = [];

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function money(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mediaUrl(item) {
  return item.media_url || item.dataUrl;
}

function mediaType(item) {
  return item.media_type || item.type || "";
}

function showMessage(message, isError = false) {
  connectionStatus.textContent = message;
  connectionStatus.classList.toggle("error", isError);
}

async function loadData() {
  if (!hasSupabase) {
    if (hasJsonBlob) {
      try {
        const response = await fetch(config.jsonBlobUrl, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Falha ao carregar JSONBlob");
        }
        const data = await response.json();
        gallery = data.gallery || [];
        quotas = data.quotas || [];
        showMessage("Dados salvos em banco persistente compartilhado.");
      } catch {
        gallery = readStorage(galleryKey);
        quotas = readStorage(quotaKey);
        showMessage("Nao foi possivel carregar o banco. Usando modo local neste navegador.", true);
      }
      renderGallery();
      renderQuotas();
      return;
    }

    gallery = readStorage(galleryKey);
    quotas = readStorage(quotaKey);
    showMessage("Modo local: configure o Supabase para salvar os dados na web.");
    renderGallery();
    renderQuotas();
    return;
  }

  showMessage("Conectado ao banco de dados. Carregando informacoes...");
  const [{ data: galleryData, error: galleryError }, { data: quotaData, error: quotaError }] = await Promise.all([
    db.from("gallery_items").select("*").order("created_at", { ascending: false }),
    db.from("quotas").select("*").order("created_at", { ascending: false })
  ]);

  if (galleryError || quotaError) {
    showMessage("Nao foi possivel carregar o banco. Confira a configuracao do Supabase.", true);
    return;
  }

  gallery = galleryData || [];
  quotas = quotaData || [];
  showMessage("Dados salvos em banco persistente.");
  renderGallery();
  renderQuotas();
}

async function saveJsonBlob() {
  if (!hasJsonBlob) {
    return;
  }

  const response = await fetch(config.jsonBlobUrl, {
    method: config.jsonBlobUrl.includes("mantledb.sh") ? "POST" : "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ gallery, quotas })
  });

  if (!response.ok) {
    throw new Error("Falha ao salvar JSONBlob");
  }
}

function renderYearFilter() {
  const selected = yearFilter.value;
  const years = [...new Set(gallery.map((item) => item.year))].sort((a, b) => b - a);

  yearFilter.innerHTML = '<option value="todos">Todos os anos</option>';
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearFilter.append(option);
  });

  yearFilter.value = years.includes(Number(selected)) ? selected : "todos";
}

function renderGallery() {
  renderYearFilter();
  galleryGrid.innerHTML = "";

  const selectedYear = yearFilter.value;
  const items = selectedYear === "todos"
    ? gallery
    : gallery.filter((item) => String(item.year) === selectedYear);

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Ainda nao ha registros para mostrar. Adicione uma foto ou video da decoracao da rua.";
    galleryGrid.append(empty);
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "media-card";

    const media = document.createElement(mediaType(item).startsWith("video") ? "video" : "img");
    media.src = mediaUrl(item);
    media.alt = item.caption;
    if (media.tagName === "VIDEO") {
      media.controls = true;
    }

    const content = document.createElement("div");
    content.className = "media-card-content";
    content.innerHTML = `<strong>${item.year}</strong><p></p>`;
    content.querySelector("p").textContent = item.caption;

    const remove = document.createElement("button");
    remove.className = "small-danger";
    remove.type = "button";
    remove.textContent = "Remover";
    remove.addEventListener("click", () => removeGalleryItem(item));

    content.append(remove);
    card.append(media, content);
    galleryGrid.append(card);
  });
}

function renderQuotas() {
  quotaRows.innerHTML = "";

  const paidTotal = quotas
    .filter((item) => item.paid)
    .reduce((total, item) => total + Number(item.value), 0);
  const pendingTotal = quotas
    .filter((item) => !item.paid)
    .reduce((total, item) => total + Number(item.value), 0);

  quotaSummary.innerHTML = `
    <div class="summary-card"><span>Total pago</span><strong>${money(paidTotal)}</strong></div>
    <div class="summary-card"><span>Total pendente</span><strong>${money(pendingTotal)}</strong></div>
    <div class="summary-card"><span>Vizinhos cadastrados</span><strong>${quotas.length}</strong></div>
  `;

  if (!quotas.length) {
    quotaRows.innerHTML = '<tr><td colspan="4">Nenhuma cota cadastrada ainda.</td></tr>';
    return;
  }

  quotas.forEach((item) => {
    const row = document.createElement("tr");
    const statusClass = item.paid ? "paid" : "pending";
    const statusText = item.paid ? "Pago" : "Pendente";

    row.innerHTML = `
      <td></td>
      <td>${money(item.value)}</td>
      <td><span class="status ${statusClass}">${statusText}</span></td>
      <td class="row-actions"></td>
    `;
    row.children[0].textContent = item.name;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "small-danger";
    toggle.textContent = item.paid ? "Marcar pendente" : "Marcar pago";
    toggle.addEventListener("click", () => toggleQuota(item));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "small-danger";
    remove.textContent = "Remover";
    remove.addEventListener("click", () => removeQuota(item));

    row.querySelector(".row-actions").append(toggle, remove);
    quotaRows.append(row);
  });
}

async function saveGalleryItem(file) {
  const item = {
    id: createId(),
    year: Number(mediaYear.value),
    caption: mediaCaption.value.trim(),
    type: file.type
  };

  if (!hasSupabase) {
    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      gallery.unshift({ ...item, dataUrl: reader.result });
      try {
        if (hasJsonBlob) {
          await saveJsonBlob();
          showMessage("Registro salvo no banco persistente compartilhado.");
        } else {
          saveStorage(galleryKey, gallery);
        }
      } catch {
        saveStorage(galleryKey, gallery);
        showMessage("Nao foi possivel salvar no banco. Registro salvo apenas neste navegador.", true);
      }
      mediaForm.reset();
      renderGallery();
    });
    reader.readAsDataURL(file);
    return;
  }

  const extension = file.name.split(".").pop() || "midia";
  const mediaPath = `${item.year}/${item.id}.${extension}`;
  const upload = await db.storage
    .from(config.mediaBucket)
    .upload(mediaPath, file, { contentType: file.type, upsert: false });

  if (upload.error) {
    showMessage("Nao foi possivel enviar a midia. Confira o bucket do Supabase.", true);
    return;
  }

  const { data: publicUrl } = db.storage
    .from(config.mediaBucket)
    .getPublicUrl(mediaPath);

  const { data, error } = await db.from("gallery_items").insert({
    year: item.year,
    caption: item.caption,
    media_url: publicUrl.publicUrl,
    media_path: mediaPath,
    media_type: file.type
  }).select().single();

  if (error) {
    showMessage("Midia enviada, mas o registro nao foi salvo no banco.", true);
    return;
  }

  gallery.unshift(data);
  mediaForm.reset();
  showMessage("Registro salvo no banco persistente.");
  renderGallery();
}

async function removeGalleryItem(item) {
  if (!hasSupabase) {
    gallery = gallery.filter((entry) => entry.id !== item.id);
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
      } else {
        saveStorage(galleryKey, gallery);
      }
    } catch {
      saveStorage(galleryKey, gallery);
      showMessage("Nao foi possivel atualizar o banco. Alteracao salva apenas neste navegador.", true);
    }
    renderGallery();
    return;
  }

  const { error } = await db.from("gallery_items").delete().eq("id", item.id);
  if (error) {
    showMessage("Nao foi possivel remover o registro.", true);
    return;
  }

  if (item.media_path) {
    await db.storage.from(config.mediaBucket).remove([item.media_path]);
  }
  gallery = gallery.filter((entry) => entry.id !== item.id);
  renderGallery();
}

async function saveQuota() {
  const item = {
    id: createId(),
    name: quotaName.value.trim(),
    value: Number(quotaValue.value),
    paid: quotaPaid.value === "true"
  };

  if (!hasSupabase) {
    quotas.push(item);
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
        showMessage("Cota salva no banco persistente compartilhado.");
      } else {
        saveStorage(quotaKey, quotas);
      }
    } catch {
      saveStorage(quotaKey, quotas);
      showMessage("Nao foi possivel salvar no banco. Cota salva apenas neste navegador.", true);
    }
    quotaForm.reset();
    renderQuotas();
    return;
  }

  const { data, error } = await db.from("quotas").insert({
    name: item.name,
    value: item.value,
    paid: item.paid
  }).select().single();

  if (error) {
    showMessage("Nao foi possivel salvar a cota no banco.", true);
    return;
  }

  quotas.unshift(data);
  quotaForm.reset();
  showMessage("Cota salva no banco persistente.");
  renderQuotas();
}

async function toggleQuota(item) {
  if (!hasSupabase) {
    quotas = quotas.map((entry) => (
      entry.id === item.id ? { ...entry, paid: !entry.paid } : entry
    ));
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
      } else {
        saveStorage(quotaKey, quotas);
      }
    } catch {
      saveStorage(quotaKey, quotas);
      showMessage("Nao foi possivel atualizar o banco. Alteracao salva apenas neste navegador.", true);
    }
    renderQuotas();
    return;
  }

  const { error } = await db.from("quotas").update({ paid: !item.paid }).eq("id", item.id);
  if (error) {
    showMessage("Nao foi possivel atualizar a cota.", true);
    return;
  }

  quotas = quotas.map((entry) => (
    entry.id === item.id ? { ...entry, paid: !entry.paid } : entry
  ));
  renderQuotas();
}

async function removeQuota(item) {
  if (!hasSupabase) {
    quotas = quotas.filter((entry) => entry.id !== item.id);
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
      } else {
        saveStorage(quotaKey, quotas);
      }
    } catch {
      saveStorage(quotaKey, quotas);
      showMessage("Nao foi possivel atualizar o banco. Alteracao salva apenas neste navegador.", true);
    }
    renderQuotas();
    return;
  }

  const { error } = await db.from("quotas").delete().eq("id", item.id);
  if (error) {
    showMessage("Nao foi possivel remover a cota.", true);
    return;
  }

  quotas = quotas.filter((entry) => entry.id !== item.id);
  renderQuotas();
}

mediaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const [file] = mediaFile.files;

  if (!file) {
    return;
  }

  await saveGalleryItem(file);
});

yearFilter.addEventListener("change", renderGallery);

clearGallery.addEventListener("click", async () => {
  if (!gallery.length || !confirm("Deseja apagar todos os registros da galeria?")) {
    return;
  }

  if (!hasSupabase) {
    gallery = [];
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
      } else {
        saveStorage(galleryKey, gallery);
      }
    } catch {
      saveStorage(galleryKey, gallery);
      showMessage("Nao foi possivel limpar o banco. Galeria limpa apenas neste navegador.", true);
    }
    renderGallery();
    return;
  }

  const paths = gallery.map((item) => item.media_path).filter(Boolean);
  const { error } = await db.from("gallery_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) {
    showMessage("Nao foi possivel limpar a galeria.", true);
    return;
  }
  if (paths.length) {
    await db.storage.from(config.mediaBucket).remove(paths);
  }
  gallery = [];
  renderGallery();
});

quotaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveQuota();
});

loadData();
