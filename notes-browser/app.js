const state = {
  query: "",
  folder: "全部",
  collectionKey: null,
  selectedId: null,
};

const notes = window.NOTES_DATA?.notes || [];
const folderIndex = window.NOTES_DATA?.folderIndex || [];
const stats = window.NOTES_DATA?.stats || {};
const collections = window.NOTES_DATA?.collections || {};

const statsGrid = document.getElementById("stats-grid");
const aboutButton = document.getElementById("about-button");
const adjustmentButton = document.getElementById("adjustment-button");
const folderList = document.getElementById("folder-list");
const searchInput = document.getElementById("search-input");
const collectionsGrid = document.getElementById("collections-grid");
const collectionSpotlight = document.getElementById("collection-spotlight");
const spotlightType = document.getElementById("spotlight-type");
const spotlightCount = document.getElementById("spotlight-count");
const spotlightTitle = document.getElementById("spotlight-title");
const spotlightSummary = document.getElementById("spotlight-summary");
const spotlightHighlights = document.getElementById("spotlight-highlights");
const spotlightNotes = document.getElementById("spotlight-notes");
const notesList = document.getElementById("notes-list");
const listTitle = document.getElementById("list-title");
const resultCount = document.getElementById("result-count");
const readerEmpty = document.getElementById("reader-empty");
const readerCard = document.getElementById("reader-card");
const readerTitle = document.getElementById("reader-title");
const readerAccount = document.getElementById("reader-account");
const readerFolder = document.getElementById("reader-folder");
const readerSummary = document.getElementById("reader-summary");
const readerSummaryText = document.getElementById("reader-summary-text");
const readerHighlights = document.getElementById("reader-highlights");
const readerEssay = document.getElementById("reader-essay");
const readerBody = document.getElementById("reader-body");
const readerPath = document.getElementById("reader-path");
const aboutData = window.NOTES_DATA?.about || null;
const adjustmentData = window.NOTES_DATA?.adjustment || null;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderStats() {
  const items = [
    { label: "笔记", value: stats.totalNotes || 0 },
    { label: "文件夹", value: stats.folders || 0 },
    { label: "账号", value: stats.accounts || 0 },
  ];

  statsGrid.innerHTML = items
    .map(
      (item) => `
        <div class="stat-card">
          <div class="stat-card__value">${item.value}</div>
          <div class="stat-card__label">${item.label}</div>
        </div>
      `
    )
    .join("");
}

function renderFolders() {
  const items = [{ folder: "全部", count: notes.length }, ...folderIndex];
  folderList.innerHTML = items
    .map(
      (item) => `
        <button class="folder-chip ${item.folder === state.folder ? "active" : ""}" data-folder="${escapeHtml(item.folder)}">
          ${escapeHtml(item.folder)} · ${item.count}
        </button>
      `
    )
    .join("");

  folderList.querySelectorAll(".folder-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.folder = chip.dataset.folder;
      state.collectionKey = null;
      render();
    });
  });
}

function flattenCollections() {
  return Object.entries(collections).flatMap(([type, items]) =>
    items.map((item) => ({
      ...item,
      key: `${type}:${item.id}`,
      type,
    }))
  );
}

function getSelectedCollection() {
  return flattenCollections().find((item) => item.key === state.collectionKey) || null;
}

function renderCollections() {
  const labels = {
    themes: "Theme",
    questions: "Question",
    places: "Place",
    timelines: "Timeline",
  };

  const cards = flattenCollections();
  collectionsGrid.innerHTML = cards
    .map(
      (item) => `
        <article class="collection-card ${state.collectionKey === item.key ? "active" : ""}" data-key="${escapeHtml(item.key)}">
          <div class="collection-card__eyebrow">${labels[item.type] || "Collection"}</div>
          <h3 class="collection-card__title">${escapeHtml(item.title)}</h3>
          <p class="collection-card__desc">${escapeHtml(item.description)}</p>
          <span class="collection-card__count">${item.count} 条相关笔记</span>
        </article>
      `
    )
    .join("");

  collectionsGrid.querySelectorAll(".collection-card").forEach((card) => {
    card.addEventListener("click", () => {
      const isSame = state.collectionKey === card.dataset.key;
      state.collectionKey = isSame ? null : card.dataset.key;
      state.folder = "全部";
      render();
    });
  });
}

function renderCollectionSpotlight() {
  const selectedCollection = getSelectedCollection();
  if (!selectedCollection) {
    collectionSpotlight.classList.add("hidden");
    return;
  }

  const typeLabels = {
    themes: "Theme",
    questions: "Question",
    places: "Place",
    timelines: "Timeline",
  };

  collectionSpotlight.classList.remove("hidden");
  spotlightType.textContent = typeLabels[selectedCollection.type] || "Collection";
  spotlightCount.textContent = `${selectedCollection.count} 条相关笔记`;
  spotlightTitle.textContent = selectedCollection.title;
  spotlightSummary.textContent = selectedCollection.summary || selectedCollection.description || "";
  spotlightHighlights.innerHTML = (selectedCollection.highlights || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const representativeNotes = (selectedCollection.representativeNoteIds || [])
    .map((id) => notes.find((note) => note.id === id))
    .filter(Boolean);

  spotlightNotes.innerHTML = representativeNotes
    .map(
      (note) => `
        <button class="spotlight-note" data-note-id="${escapeHtml(note.id)}">
          ${escapeHtml(note.title)}
        </button>
      `
    )
    .join("");

  spotlightNotes.querySelectorAll(".spotlight-note").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.noteId;
      render();
    });
  });
}

function filterNotes() {
  const query = state.query.trim().toLowerCase();
  const selectedCollection = getSelectedCollection();
  const collectionIds = new Set(selectedCollection?.noteIds || []);

  return notes.filter((note) => {
    const folderMatch =
      state.folder === "全部" || note.folder === state.folder;
    if (!folderMatch) return false;
    if (selectedCollection && !collectionIds.has(note.id)) return false;
    if (!query) return true;
    const haystack = `${note.title}\n${note.body}\n${note.folder}`.toLowerCase();
    return haystack.includes(query);
  });
}

function renderList(filtered) {
  const selectedCollection = getSelectedCollection();
  listTitle.textContent = selectedCollection
    ? selectedCollection.title
    : state.folder === "全部"
      ? "全部备忘录"
      : state.folder;
  resultCount.textContent = `${filtered.length} 条结果`;

  if (!filtered.length) {
    notesList.innerHTML = `<div class="note-card"><p class="note-card__excerpt">没有搜到符合条件的内容。</p></div>`;
    state.selectedId = null;
    renderReader(null);
    return;
  }

  if (!state.selectedId || !filtered.some((note) => note.id === state.selectedId)) {
    state.selectedId = filtered[0].id;
  }

  notesList.innerHTML = filtered
    .map(
      (note) => `
        <article class="note-card ${note.id === state.selectedId ? "active" : ""}" data-id="${escapeHtml(note.id)}">
          <div class="note-card__meta">
            <span class="meta-pill">${escapeHtml(note.folder)}</span>
            <span class="meta-pill">${escapeHtml(note.account)}</span>
          </div>
          <h3 class="note-card__title">${escapeHtml(note.title)}</h3>
          <p class="note-card__excerpt">${escapeHtml(note.excerpt || "这条笔记暂时没有摘要。")}</p>
        </article>
      `
    )
    .join("");

  notesList.querySelectorAll(".note-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedId = card.dataset.id;
      render();
    });
  });

  renderReader(filtered.find((note) => note.id === state.selectedId) || null, selectedCollection);
}

function renderReader(note, selectedCollection = null) {
  if (!note) {
    readerEmpty.classList.remove("hidden");
    readerCard.classList.add("hidden");
    return;
  }

  readerEmpty.classList.add("hidden");
  readerCard.classList.remove("hidden");
  readerTitle.textContent = note.title;
  readerAccount.textContent = note.account;
  readerFolder.textContent = note.folder;
  if (selectedCollection?.summary) {
    readerSummary.classList.remove("hidden");
    readerSummaryText.textContent = selectedCollection.summary;
    readerHighlights.innerHTML = (selectedCollection.highlights || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
  } else {
    readerSummary.classList.add("hidden");
    readerSummaryText.textContent = "";
    readerHighlights.innerHTML = "";
  }
  if (selectedCollection?.essay) {
    readerEssay.classList.remove("hidden");
    readerEssay.textContent = selectedCollection.essay;
  } else {
    readerEssay.classList.add("hidden");
    readerEssay.textContent = "";
  }
  readerBody.innerHTML = escapeHtml(note.body);
  readerPath.textContent = note.path;
}

function renderAboutPage() {
  if (!aboutData) return;
  state.collectionKey = null;
  state.folder = "全部";
  state.selectedId = null;

  collectionSpotlight.classList.add("hidden");
  readerEmpty.classList.add("hidden");
  readerCard.classList.remove("hidden");
  readerTitle.textContent = aboutData.title;
  readerAccount.textContent = "Portrait";
  readerFolder.textContent = "About You";
  readerSummary.classList.remove("hidden");
  readerSummaryText.textContent = aboutData.summary || "";
  readerHighlights.innerHTML = (aboutData.highlights || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  readerEssay.classList.remove("hidden");
  readerEssay.textContent = aboutData.essay || "";
  readerBody.innerHTML = "";
  readerPath.textContent = "Generated from your Apple Notes corpus";
}

function renderAdjustmentPage() {
  if (!adjustmentData) return;
  state.collectionKey = null;
  state.folder = "全部";
  state.selectedId = null;

  collectionSpotlight.classList.add("hidden");
  readerEmpty.classList.add("hidden");
  readerCard.classList.remove("hidden");
  readerTitle.textContent = adjustmentData.title;
  readerAccount.textContent = "Reflection";
  readerFolder.textContent = "Adjustment";
  readerSummary.classList.remove("hidden");
  readerSummaryText.textContent = adjustmentData.summary || "";
  readerHighlights.innerHTML = (adjustmentData.highlights || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  readerEssay.classList.remove("hidden");
  readerEssay.textContent = adjustmentData.essay || "";
  readerBody.innerHTML = "";
  readerPath.textContent = "Generated from your Apple Notes corpus";
}

function render() {
  const filtered = filterNotes();
  renderStats();
  renderFolders();
  renderCollections();
  renderCollectionSpotlight();
  renderList(filtered);
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

aboutButton.addEventListener("click", () => {
  render();
  renderAboutPage();
});

adjustmentButton.addEventListener("click", () => {
  render();
  renderAdjustmentPage();
});

render();
