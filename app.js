const galleryKey = "ruaBrasilGaleria";
const quotaKey = "ruaBrasilCotas";
const expenseKey = "ruaBrasilDespesas";
const accessKey = "ruaBrasilAccessMode";
const config = window.RUA_BRASIL_CONFIG || {};
const hasSupabase = Boolean(config.supabaseUrl && config.supabaseAnonKey && window.supabase);
const hasJsonBlob = Boolean(config.jsonBlobUrl);
const hasCloudinary = Boolean(config.cloudinaryCloudName && config.cloudinaryUploadPreset);
const maxVideoSeconds = Number(config.maxVideoSeconds || 30);
const db = hasSupabase
  ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey)
  : null;

const mediaForm = document.querySelector("#mediaForm");
const mediaFile = document.querySelector("#mediaFile");
const mediaLink = document.querySelector("#mediaLink");
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
const expenseForm = document.querySelector("#expenseForm");
const expenseDate = document.querySelector("#expenseDate");
const expenseCategory = document.querySelector("#expenseCategory");
const expenseValue = document.querySelector("#expenseValue");
const expenseDescription = document.querySelector("#expenseDescription");
const expenseReceipt = document.querySelector("#expenseReceipt");
const expenseRows = document.querySelector("#expenseRows");
const financeSummary = document.querySelector("#financeSummary");
const loginScreen = document.querySelector("#loginScreen");
const visitorAccess = document.querySelector("#visitorAccess");
const adminAccess = document.querySelector("#adminAccess");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminPassword = document.querySelector("#adminPassword");
const loginMessage = document.querySelector("#loginMessage");
const logoutButton = document.querySelector("#logoutButton");

let gallery = [];
let quotas = [];
let expenses = [];
let accessMode = localStorage.getItem(accessKey) || "";

function isAdmin() {
  return accessMode === "admin";
}

function applyAccessMode() {
  document.body.classList.toggle("is-locked", !accessMode);
  document.body.classList.toggle("is-admin", isAdmin());
  loginScreen.hidden = Boolean(accessMode);
  logoutButton.textContent = isAdmin() ? "Sair do admin" : "Trocar acesso";
}

function setAccessMode(mode) {
  accessMode = mode;
  localStorage.setItem(accessKey, mode);
  applyAccessMode();
  renderGallery();
  renderQuotas();
  renderExpenses();
}

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
  return item.media_url || item.dataUrl || item.externalUrl;
}

function mediaType(item) {
  return item.media_type || item.type || guessMediaType(mediaUrl(item));
}

function guessMediaType(url = "") {
  const cleanUrl = url.split("?")[0].toLowerCase();
  if (isYoutubeUrl(url) || cleanUrl.endsWith(".mp4") || cleanUrl.endsWith(".webm") || cleanUrl.endsWith(".mov")) {
    return "video/link";
  }
  return "image/link";
}

function isYoutubeUrl(url = "") {
  return url.includes("youtube.com/watch") || url.includes("youtu.be/");
}

function youtubeEmbedUrl(url = "") {
  try {
    const parsed = new URL(url);
    const id = parsed.hostname.includes("youtu.be")
      ? parsed.pathname.replace("/", "")
      : parsed.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
}

function isDirectMediaUrl(url = "") {
  const cleanUrl = url.split("?")[0].toLowerCase();
  return /\.(jpg|jpeg|png|gif|webp|mp4|webm|mov)$/.test(cleanUrl);
}

function createMediaElement(item) {
  const url = mediaUrl(item);

  if (isYoutubeUrl(url)) {
    const iframe = document.createElement("iframe");
    iframe.src = youtubeEmbedUrl(url);
    iframe.title = item.caption;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    return iframe;
  }

  if (!item.dataUrl && !isDirectMediaUrl(url)) {
    const link = document.createElement("a");
    link.className = "media-link-preview";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Abrir midia";
    return link;
  }

  const media = document.createElement(mediaType(item).startsWith("video") ? "video" : "img");
  media.src = url;
  media.alt = item.caption;
  if (media.tagName === "VIDEO") {
    media.controls = true;
  }
  return media;
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
        expenses = data.expenses || [];
        showMessage("Dados salvos em banco persistente compartilhado.");
      } catch {
        gallery = readStorage(galleryKey);
        quotas = readStorage(quotaKey);
        expenses = readStorage(expenseKey);
        showMessage("Nao foi possivel carregar o banco. Usando modo local neste navegador.", true);
      }
      renderGallery();
      renderQuotas();
      renderExpenses();
      return;
    }

    gallery = readStorage(galleryKey);
    quotas = readStorage(quotaKey);
    expenses = readStorage(expenseKey);
    showMessage("Modo local: configure o Supabase para salvar os dados na web.");
    renderGallery();
    renderQuotas();
    renderExpenses();
    return;
  }

  showMessage("Conectado ao banco de dados. Carregando informacoes...");
  const [
    { data: galleryData, error: galleryError },
    { data: quotaData, error: quotaError },
    { data: expenseData, error: expenseError }
  ] = await Promise.all([
    db.from("gallery_items").select("*").order("created_at", { ascending: false }),
    db.from("quotas").select("*").order("created_at", { ascending: false }),
    db.from("expenses").select("*").order("expense_date", { ascending: false }).order("created_at", { ascending: false })
  ]);

  if (galleryError || quotaError || expenseError) {
    showMessage("Nao foi possivel carregar o banco. Confira a configuracao do Supabase.", true);
    return;
  }

  gallery = galleryData || [];
  quotas = quotaData || [];
  expenses = expenseData || [];
  showMessage("Dados salvos em banco persistente.");
  renderGallery();
  renderQuotas();
  renderExpenses();
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
    body: JSON.stringify({ gallery, quotas, expenses })
  });

  if (!response.ok) {
    throw new Error("Falha ao salvar JSONBlob");
  }
}

function canStoreFileInJson(file) {
  if (!hasJsonBlob || hasSupabase || hasCloudinary) {
    return true;
  }

  const maxBytes = 700 * 1024;
  return file.size <= maxBytes;
}

function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Nao foi possivel ler a duracao do video"));
    };
    video.src = objectUrl;
  });
}

async function validateMediaFile(file) {
  if (!file.type.startsWith("video")) {
    return true;
  }

  try {
    const duration = await getVideoDuration(file);
    if (duration > maxVideoSeconds + 0.5) {
      showMessage(`O video tem ${Math.ceil(duration)} segundos. O limite e ${maxVideoSeconds} segundos.`, true);
      return false;
    }
    return true;
  } catch {
    showMessage("Nao foi possivel verificar a duracao do video. Tente outro arquivo.", true);
    return false;
  }
}

async function uploadToCloudinary(file, item) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", config.cloudinaryUploadPreset);
  formData.append("folder", "rua-do-brasil");
  formData.append("public_id", `${item.year}-${item.id}`);

  const resourceType = file.type.startsWith("video") ? "video" : "image";
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error("Falha ao enviar para o Cloudinary");
  }

  return response.json();
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

    const media = createMediaElement(item);

    const content = document.createElement("div");
    content.className = "media-card-content";
    content.innerHTML = `<strong>${item.year}</strong><p></p>`;
    content.querySelector("p").textContent = item.caption;

    if (isAdmin()) {
      const remove = document.createElement("button");
      remove.className = "small-danger";
      remove.type = "button";
      remove.textContent = "Remover";
      remove.addEventListener("click", () => removeGalleryItem(item));
      content.append(remove);
    }

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
      <td data-label="Nome"></td>
      <td data-label="Valor">${money(item.value)}</td>
      <td data-label="Status"><span class="status ${statusClass}">${statusText}</span></td>
      <td class="row-actions" data-label="Acoes"></td>
    `;
    row.children[0].textContent = item.name;

    const actions = row.querySelector(".row-actions");
    if (isAdmin()) {
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

      actions.append(toggle, remove);
    } else {
      actions.textContent = "Somente administrador";
    }

    quotaRows.append(row);
  });
}

function formatDate(dateString) {
  if (!dateString) {
    return "-";
  }

  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) {
    return dateString;
  }

  return `${day}/${month}/${year}`;
}

function renderExpenses() {
  expenseRows.innerHTML = "";

  const collectedTotal = quotas
    .filter((item) => item.paid)
    .reduce((total, item) => total + Number(item.value), 0);
  const spentTotal = expenses
    .reduce((total, item) => total + Number(item.value), 0);
  const balance = collectedTotal - spentTotal;

  financeSummary.innerHTML = `
    <div class="summary-card"><span>Total arrecadado</span><strong>${money(collectedTotal)}</strong></div>
    <div class="summary-card"><span>Total gasto</span><strong>${money(spentTotal)}</strong></div>
    <div class="summary-card ${balance >= 0 ? "balance-positive" : "balance-negative"}"><span>Saldo atual</span><strong>${money(balance)}</strong></div>
  `;

  if (!expenses.length) {
    expenseRows.innerHTML = '<tr><td colspan="6">Nenhuma despesa cadastrada ainda.</td></tr>';
    return;
  }

  expenses.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Data">${formatDate(item.expense_date || item.date)}</td>
      <td data-label="Categoria">${item.category || "-"}</td>
      <td data-label="Descricao"></td>
      <td data-label="Comprovante"></td>
      <td data-label="Valor">${money(item.value)}</td>
      <td class="row-actions" data-label="Acoes"></td>
    `;
    row.children[2].textContent = item.description;

    const receiptCell = row.children[3];
    if (item.receipt_url) {
      const link = document.createElement("a");
      link.href = item.receipt_url;
      link.target = "_blank";
      link.rel = "noopener";
      link.className = "receipt-link";
      link.textContent = "Ver comprovante";
      receiptCell.append(link);
    } else {
      receiptCell.textContent = "-";
    }

    const actions = row.querySelector(".row-actions");
    if (isAdmin()) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "small-danger";
      remove.textContent = "Remover";
      remove.addEventListener("click", () => removeExpense(item));
      actions.append(remove);
    } else {
      actions.textContent = "Somente administrador";
    }

    expenseRows.append(row);
  });
}

async function saveGalleryLink(url) {
  const item = {
    id: createId(),
    year: Number(mediaYear.value),
    caption: mediaCaption.value.trim(),
    type: guessMediaType(url),
    externalUrl: url
  };

  gallery.unshift(item);

  try {
    if (hasSupabase) {
      const { data, error } = await db.from("gallery_items").insert({
        year: item.year,
        caption: item.caption,
        media_url: item.externalUrl,
        media_path: "",
        media_type: item.type
      }).select().single();

      if (error) {
        throw error;
      }

      gallery = [data, ...gallery.filter((entry) => entry.id !== item.id)];
    } else if (hasJsonBlob) {
      await saveJsonBlob();
    } else {
      saveStorage(galleryKey, gallery);
    }

    mediaForm.reset();
    showMessage("Link salvo no banco persistente compartilhado.");
    renderGallery();
  } catch {
    gallery = gallery.filter((entry) => entry.id !== item.id);
    showMessage("Nao foi possivel salvar o link no banco. Tente novamente.", true);
    renderGallery();
  }
}

async function saveGalleryItem(file) {
  const validFile = await validateMediaFile(file);
  if (!validFile) {
    return;
  }

  const item = {
    id: createId(),
    year: Number(mediaYear.value),
    caption: mediaCaption.value.trim(),
    type: file.type
  };

  if (hasCloudinary && !hasSupabase) {
    showMessage("Enviando midia para o storage...");
    try {
      const upload = await uploadToCloudinary(file, item);
      const savedItem = {
        ...item,
        externalUrl: upload.secure_url,
        type: file.type || upload.resource_type
      };

      gallery.unshift(savedItem);
      if (hasJsonBlob) {
        await saveJsonBlob();
      } else {
        saveStorage(galleryKey, gallery);
      }

      mediaForm.reset();
      showMessage("Midia salva no storage e publicada na galeria.");
      renderGallery();
    } catch {
      showMessage("Nao foi possivel enviar o arquivo para o storage. Confira a configuracao do Cloudinary.", true);
    }
    return;
  }

  if (!hasSupabase) {
    if (!canStoreFileInJson(file)) {
      showMessage("Este arquivo e grande para o banco atual. Para salvar videos de ate 30 segundos como arquivo, configure Cloudinary ou Supabase Storage.", true);
      return;
    }

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
        gallery = gallery.filter((entry) => entry.id !== item.id);
        saveStorage(galleryKey, gallery);
        showMessage("Nao foi possivel salvar no banco. O registro nao foi publicado.", true);
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
    renderExpenses();
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
  renderExpenses();
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
    renderExpenses();
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
  renderExpenses();
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
    renderExpenses();
    return;
  }

  const { error } = await db.from("quotas").delete().eq("id", item.id);
  if (error) {
    showMessage("Nao foi possivel remover a cota.", true);
    return;
  }

  quotas = quotas.filter((entry) => entry.id !== item.id);
  renderQuotas();
  renderExpenses();
}

async function saveExpense() {
  const item = {
    id: createId(),
    date: expenseDate.value,
    category: expenseCategory.value,
    description: expenseDescription.value.trim(),
    receipt_url: expenseReceipt.value.trim(),
    value: Number(expenseValue.value)
  };

  if (!hasSupabase) {
    expenses.unshift(item);
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
        showMessage("Despesa salva no banco persistente compartilhado.");
      } else {
        saveStorage(expenseKey, expenses);
      }
    } catch {
      saveStorage(expenseKey, expenses);
      showMessage("Nao foi possivel salvar no banco. Despesa salva apenas neste navegador.", true);
    }
    expenseForm.reset();
    expenseDate.valueAsDate = new Date();
    renderExpenses();
    return;
  }

  const { data, error } = await db.from("expenses").insert({
    category: item.category,
    description: item.description,
    receipt_url: item.receipt_url || null,
    value: item.value,
    expense_date: item.date
  }).select().single();

  if (error) {
    showMessage("Nao foi possivel salvar a despesa no banco.", true);
    return;
  }

  expenses.unshift(data);
  expenseForm.reset();
  expenseDate.valueAsDate = new Date();
  showMessage("Despesa salva no banco persistente.");
  renderExpenses();
}

async function removeExpense(item) {
  if (!hasSupabase) {
    expenses = expenses.filter((entry) => entry.id !== item.id);
    try {
      if (hasJsonBlob) {
        await saveJsonBlob();
      } else {
        saveStorage(expenseKey, expenses);
      }
    } catch {
      saveStorage(expenseKey, expenses);
      showMessage("Nao foi possivel atualizar o banco. Alteracao salva apenas neste navegador.", true);
    }
    renderExpenses();
    return;
  }

  const { error } = await db.from("expenses").delete().eq("id", item.id);
  if (error) {
    showMessage("Nao foi possivel remover a despesa.", true);
    return;
  }

  expenses = expenses.filter((entry) => entry.id !== item.id);
  renderExpenses();
}

mediaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const [file] = mediaFile.files;
  const link = mediaLink.value.trim();

  if (!file && !link) {
    showMessage("Escolha um arquivo ou cole um link de foto/video.", true);
    return;
  }

  if (link) {
    await saveGalleryLink(link);
    return;
  }

  if (file) {
    await saveGalleryItem(file);
  }
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

expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveExpense();
});

visitorAccess.addEventListener("click", () => {
  setAccessMode("visitor");
});

adminAccess.addEventListener("click", () => {
  adminLoginForm.hidden = !adminLoginForm.hidden;
  if (!adminLoginForm.hidden) {
    adminPassword.focus();
  }
});

adminLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (adminPassword.value === config.adminPassword) {
    adminPassword.value = "";
    loginMessage.textContent = "";
    setAccessMode("admin");
    return;
  }

  loginMessage.textContent = "Senha incorreta.";
});

logoutButton.addEventListener("click", () => {
  accessMode = "";
  localStorage.removeItem(accessKey);
  adminLoginForm.hidden = true;
  loginMessage.textContent = "";
  applyAccessMode();
});

applyAccessMode();
expenseDate.valueAsDate = new Date();
loadData();
