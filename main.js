// main.js — safe gallery renderer that won't touch other content or animations.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// ---------- Firebase CONFIG (yours) ----------
const firebaseConfig = {
  apiKey: "AIzaSyAwabcTi-vGohLNC3n3FeflbtEs5pZ8y3s",
  authDomain: "gbkw-site.firebaseapp.com",
  projectId: "gbkw-site",
  storageBucket: "gbkw-site.firebasestorage.app",
  messagingSenderId: "497739601087",
  appId: "1:497739601087:web:838db175b2ec970ccca20a"
};
// --------------------------------------------

let app, db;

// Utility: escape HTML
function esc(s) {
  return (s || "").toString().replace(/[&<>"']/g, c => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" }[c]
  ));
}

// Render one card (fallback if you don't provide your own template)
function renderDefaultCard({ title, image, attrs, fields }) {
  const li = fields
    .map(f => attrs[f] ? `<li><strong>${esc(f)}:</strong> ${esc(attrs[f])}</li>` : "")
    .join("");
  return `
    <article class="card">
      <div class="media">${image ? `<img src="${esc(image)}" alt="${esc(title||'')}" />` : ""}</div>
      <div class="body">
        <h3 class="title">${esc(title || "(untitled)")}</h3>
        <ul class="specs">${li}</ul>
      </div>
    </article>
  `;
}

// If a <template id="gb-card-template"> exists in index.html, use it
function renderWithTemplate(tpl, { title, image, attrs, fields }) {
  const node = tpl.content.cloneNode(true);
  const titleEl = node.querySelector(".title");
  if (titleEl) titleEl.textContent = title || "(untitled)";
  const mediaEl = node.querySelector(".media");
  if (mediaEl) mediaEl.innerHTML = image ? `<img src="${esc(image)}" alt="${esc(title||'')}" />` : "";
  const specsEl = node.querySelector(".specs");
  if (specsEl) {
    specsEl.innerHTML = fields
      .map(f => attrs[f] ? `<li><strong>${esc(f)}:</strong> ${esc(attrs[f])}</li>` : "")
      .join("");
  }
  return node;
}

// Load config + items
async function loadSchema() {
  const cfg = await getDoc(doc(db, "config", "gallery"));
  return cfg.exists() ? (cfg.data().fields || []) : [];
}
async function loadItems() {
  const qy = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  const snap = await getDocs(qy);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Main render (non-destructive)
async function renderGallery() {
  // Only run if a gallery mount exists
  const mount = document.getElementById("gallery");
  if (!mount) return;

  // Create (or reuse) a private child so we don't touch the mount's existing content
  let inner = mount.querySelector(":scope > .gbkw-gallery-inner");
  if (!inner) {
    inner = document.createElement("div");
    inner.className = "gbkw-gallery-inner";
    // Append without clearing existing HTML/animations inside #gallery
    mount.appendChild(inner);
  }

  // Optional hint for empty text (won't create if you already place your own content)
  const emptyText = mount.getAttribute("data-empty-text") || "";

  try {
    const [fields, items] = await Promise.all([loadSchema(), loadItems()]);

    // Build new content in memory
    const frag = document.createDocumentFragment();
    const tpl = document.getElementById("gb-card-template");

    if (!items.length) {
      // If you want to keep your own empty state, do nothing.
      // Only inject a lightweight message if you provided data-empty-text.
      if (emptyText) {
        const p = document.createElement("p");
        p.className = "muted";
        p.textContent = emptyText;
        frag.appendChild(p);
      }
    } else {
      items.forEach(it => {
        const title = it.title || "";
        const image = (it.images && it.images[0]) || "";
        const attrs = it.attributes || {};
        if (tpl) {
          frag.appendChild(renderWithTemplate(tpl, { title, image, attrs, fields }));
        } else {
          const wrap = document.createElement("div");
          wrap.innerHTML = renderDefaultCard({ title, image, attrs, fields });
          frag.appendChild(wrap.firstElementChild);
        }
      });
    }

    // Replace only our private child content (NOT the mount, NOT anything else)
    inner.replaceChildren(frag);

  } catch (err) {
    // Fail safe: log error but don't alter existing content/animations
    console.error("Gallery render error:", err);
  }
}

// Boot after DOM is ready so we don't interfere with other scripts/animations
document.addEventListener("DOMContentLoaded", () => {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.error("Firebase init error:", e);
    return;
  }
  renderGallery();
});
