// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// ---------- Firebase CONFIG (as provided) ----------
const firebaseConfig = {
  apiKey: "AIzaSyAwabcTi-vGohLNC3n3FeflbtEs5pZ8y3s",
  authDomain: "gbkw-site.firebaseapp.com",
  projectId: "gbkw-site",
  storageBucket: "gbkw-site.firebasestorage.app",
  messagingSenderId: "497739601087",
  appId: "1:497739601087:web:838db175b2ec970ccca20a"
};
// ---------------------------------------------------

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function esc(s){return (s||"").toString().replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

async function loadSchema() {
  const cfg = await getDoc(doc(db, "config", "gallery"));
  return cfg.exists() ? (cfg.data().fields || []) : [];
}

async function loadItems() {
  const qy = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  const snap = await getDocs(qy);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Default simple card (only used if you don't provide your own markup/template)
function renderDefaultCard({ title, image, attrs, fields }) {
  const li = fields.map(f => attrs[f] ? `<li><strong>${esc(f)}:</strong> ${esc(attrs[f])}</li>` : "").join("");
  return `
    <article class="card">
      <div class="media">${image ? `<img src="${esc(image)}" alt="${esc(title||'')}" />` : ""}</div>
      <div class="body">
        <h3 class="title">${esc(title||"(untitled)")}</h3>
        <ul class="specs">${li}</ul>
      </div>
    </article>
  `;
}

// If you have <template id="gb-card-template"> in your index.html, we use it.
// Otherwise we fall back to the default card above, so your existing index stays intact.
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

async function renderGallery() {
  const mount = document.getElementById("gallery");
  if (!mount) return; // if your page doesn't have a gallery, do nothing

  const emptyText = mount.dataset.emptyText || "No items.";
  mount.innerHTML = "";

  try {
    const [fields, items] = await Promise.all([loadSchema(), loadItems()]);
    if (!items.length) {
      mount.innerHTML = `<p class="muted">${esc(emptyText)}</p>`;
      return;
    }

    const tpl = document.getElementById("gb-card-template");
    const frag = document.createDocumentFragment();

    items.forEach(it => {
      const title = it.title || "";
      const image = (it.images && it.images[0]) || "";
      const attrs = it.attributes || {};

      if (tpl) {
        frag.appendChild(renderWithTemplate(tpl, { title, image, attrs, fields }));
      } else {
        const wrapper = document.createElement("div");
        wrapper.className = "gb-card-wrap";
        wrapper.innerHTML = renderDefaultCard({ title, image, attrs, fields });
        frag.appendChild(wrapper.firstElementChild);
      }
    });

    mount.appendChild(frag);
  } catch (err) {
    console.error("Gallery render error:", err);
    mount.innerHTML = `<p class="muted">Unable to load gallery.</p>`;
  }
}

renderGallery();
