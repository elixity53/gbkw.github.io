/* 
  =====================================================================
  GBKW main.js (Compat, Non-Destructive, Verbose)
  ---------------------------------------------------------------------
  PURPOSE
    - Render a Firestore-backed gallery without breaking existing page
      content, animations, or scripts.
    - Avoid modern module requirements so it works as a classic <script>.
    - Be explicit and readable (more lines by design), like your original.

  WHAT THIS SCRIPT DOES NOT DO
    - It does NOT remove your text, animations, or other DOM sections.
    - It does NOT require you to change your page structure.
    - It does NOT require <script type="module">.

  HOW IT WORKS
    1) Wait for DOM to be ready (DOMContentLoaded).
    2) Dynamically load Firebase compat SDKs (app + firestore).
    3) Initialize Firebase with your config.
    4) Read schema (fields) from /config/gallery in Firestore.
    5) Read items from /gallery collection.
    6) Render ONLY inside a private child of #gbkw-gallery-mount.
    7) Fail safely (errors do not bubble and do not clear your page).

  REQUIREMENT IN index.html
    - Add ONE mount element where you want the gallery:
        <div id="gbkw-gallery-mount" data-empty-text="No items yet."></div>
    - Make sure this file is loaded as a normal script (not a module):
        <script src="/main.js"></script>

  SECURITY
    - Reads are public (per your Firestore Rules).
    - Writes are restricted in Firestore Rules to your admin UIDs.

  AUTHOR NOTE
    - This is intentionally longer and comment-heavy to mirror the 
      feel of a larger main.js. Functionally it remains lean and safe.
  =====================================================================
*/

/* ---------------------------------------------------------------------
   SECTION 1: Configuration (Your Firebase config)
   Replace ONLY if your keys change. Keys can be public; security is in Rules.
--------------------------------------------------------------------- */
var GBKW_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAwabcTi-vGohLNC3n3FeflbtEs5pZ8y3s",
  authDomain: "gbkw-site.firebaseapp.com",
  projectId: "gbkw-site",
  storageBucket: "gbkw-site.firebasestorage.app",
  messagingSenderId: "497739601087",
  appId: "1:497739601087:web:838db175b2ec970ccca20a"
};

/* ---------------------------------------------------------------------
   SECTION 2: Utilities (pure helpers, no side effects)
--------------------------------------------------------------------- */

/**
 * Escapes HTML special characters to avoid accidental injection when
 * inserting user/content data into the DOM via innerHTML.
 *
 * @param {any} value - The value to escape (coerced to string)
 * @returns {string} safely escaped HTML string
 */
function gbkwEscapeHtml(value) {
  var s = (value == null ? "" : String(value));
  var map = { "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" };
  return s.replace(/[&<>"']/g, function(ch){ return map[ch]; });
}

/**
 * Logs messages namespaced to avoid confusion in large codebases.
 * Toggle the `GBKW_DEBUG` flag if needed.
 */
var GBKW_DEBUG = false;
function gbkwLog() {
  if (!GBKW_DEBUG) return;
  var args = Array.prototype.slice.call(arguments);
  args.unshift("[GBKW]");
  console.log.apply(console, args);
}

/**
 * Safely appends a <script> tag and returns a Promise that resolves
 * when the script is loaded (or rejects on error).
 *
 * @param {string} src - The script URL
 * @returns {Promise<void>}
 */
function gbkwLoadScript(src) {
  return new Promise(function(resolve, reject) {
    try {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function(){ resolve(); };
      s.onerror = function(){ reject(new Error("Failed to load " + src)); };
      document.head.appendChild(s);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * A micro templating function to build a default card. If you have a
 * <template id="gb-card-template"> in your HTML, that will be preferred.
 *
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.image
 * @param {Object} params.attrs
 * @param {string[]} params.fields
 * @returns {string} HTML string for a minimal card
 */
function gbkwRenderDefaultCard(params) {
  var title  = params.title || "(untitled)";
  var image  = params.image || "";
  var attrs  = params.attrs || {};
  var fields = Array.isArray(params.fields) ? params.fields : [];

  var specsHtml = fields.map(function(f){
    var val = attrs[f];
    if (!val) return "";
    return '<li><strong>' + gbkwEscapeHtml(f) + ':</strong> ' + gbkwEscapeHtml(val) + '</li>';
  }).join("");

  var imgHtml = image
    ? '<img src="' + gbkwEscapeHtml(image) + '" alt="' + gbkwEscapeHtml(title) + '"/>'
    : "";

  // NOTE: class names are generic; your site CSS can style .card, .media, .body, .specs
  var html =
    '<article class="card">' +
      '<div class="media">' + imgHtml + '</div>' +
      '<div class="body">' +
        '<h3 class="title">' + gbkwEscapeHtml(title) + '</h3>' +
        '<ul class="specs">' + specsHtml + '</ul>' +
      '</div>' +
    '</article>';

  return html;
}

/**
 * If a <template id="gb-card-template"> is present in your index.html,
 * we clone it and populate sub-elements by class name:
 *   .title  - textContent = item title
 *   .media  - innerHTML = <img ...> if image exists
 *   .specs  - innerHTML = <li>...</li> list of fields/values
 *
 * @param {HTMLTemplateElement} tpl
 * @param {Object} params - same shape as gbkwRenderDefaultCard
 * @returns {DocumentFragment} a cloned, populated node
 */
function gbkwRenderWithTemplate(tpl, params) {
  var fragment = tpl.content.cloneNode(true);

  // Title
  var titleEl = fragment.querySelector(".title");
  if (titleEl) titleEl.textContent = params.title || "(untitled)";

  // Media
  var mediaEl = fragment.querySelector(".media");
  if (mediaEl) {
    if (params.image) {
      mediaEl.innerHTML = '<img src="' + gbkwEscapeHtml(params.image) + '" alt="' + gbkwEscapeHtml(params.title || "") + '"/>';
    } else {
      mediaEl.innerHTML = "";
    }
  }

  // Specs
  var specsEl = fragment.querySelector(".specs");
  if (specsEl) {
    var fields = Array.isArray(params.fields) ? params.fields : [];
    var attrs  = params.attrs || {};
    var li = fields.map(function(f){
      var val = attrs[f];
      if (!val) return "";
      return '<li><strong>' + gbkwEscapeHtml(f) + ':</strong> ' + gbkwEscapeHtml(val) + '</li>';
    }).join("");
    specsEl.innerHTML = li;
  }

  return fragment;
}

/* ---------------------------------------------------------------------
   SECTION 3: Firebase bootstrapping (compat SDK, no modules)
   - We load firebase-app-compat.js and firebase-firestore-compat.js
   - Then use window.firebase.* namespace (v9 compat API).
--------------------------------------------------------------------- */

/**
 * Loads Firebase compat SDKs and initializes the app + firestore.
 * Uses window.firebase once loaded. Returns { app, firestore }.
 *
 * @returns {Promise<{app: any, firestore: any}>}
 */
function gbkwInitFirebaseCompat() {
  // CDN URLs for compat builds (do not need type="module")
  var APP_URL       = "https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js";
  var FIRESTORE_URL = "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore-compat.js";

  return gbkwLoadScript(APP_URL).then(function(){
    return gbkwLoadScript(FIRESTORE_URL);
  }).then(function(){
    if (!window.firebase || !window.firebase.initializeApp) {
      throw new Error("Firebase compat not available on window.firebase");
    }
    var app = window.firebase.initializeApp(GBKW_FIREBASE_CONFIG);
    var firestore = window.firebase.firestore();
    return { app: app, firestore: firestore };
  });
}

/* ---------------------------------------------------------------------
   SECTION 4: Data access (reads only)
--------------------------------------------------------------------- */

/**
 * Loads the schema (fields array) from /config/gallery document.
 *
 * @param {any} firestore - firebase.firestore() instance
 * @returns {Promise<string[]>}
 */
function gbkwFetchFields(firestore) {
  return firestore
    .doc("config/gallery")
    .get()
    .then(function(doc){
      if (doc.exists) {
        var data = doc.data() || {};
        var fields = Array.isArray(data.fields) ? data.fields : [];
        return fields;
      }
      // Default empty -> you can add fields in admin
      return [];
    });
}

/**
 * Loads gallery items from /gallery collection ordered by createdAt desc.
 *
 * @param {any} firestore
 * @returns {Promise<Array<{id:string, title:string, images:string[], attributes:Object}>>}
 */
function gbkwFetchItems(firestore) {
  return firestore
    .collection("gallery")
    .orderBy("createdAt", "desc")
    .get()
    .then(function(snapshot){
      var out = [];
      snapshot.forEach(function(doc){
        var data = doc.data() || {};
        out.push({
          id: doc.id,
          title: data.title || "",
          images: Array.isArray(data.images) ? data.images : [],
          attributes: data.attributes || {}
        });
      });
      return out;
    });
}

/* ---------------------------------------------------------------------
   SECTION 5: Rendering (non-destructive)
--------------------------------------------------------------------- */

/**
 * Renders the gallery inside a private child of #gbkw-gallery-mount.
 * If the mount is missing, it silently does nothing (safe).
 *
 * @param {string[]} fields
 * @param {Array<Object>} items
 */
function gbkwRenderGallery(fields, items) {
  // 1) Find the mount; if not present, bail out without touching the page.
  var mount = document.getElementById("gbkw-gallery-mount");
  if (!mount) {
    gbkwLog("No mount present; skipping render.");
    return;
  }

  // 2) Create (or find) a dedicated child container so we NEVER touch your other markup.
  var inner = mount.querySelector(":scope > .gbkw-gallery-inner");
  if (!inner) {
    inner = document.createElement("div");
    inner.className = "gbkw-gallery-inner";
    // Minimal default grid feel; your site CSS can override this if you like.
    // Comment out if you prefer zero inline style.
    inner.style.display = "grid";
    inner.style.gridTemplateColumns = "repeat(auto-fit, minmax(260px, 1fr))";
    inner.style.gap = "16px";
    mount.appendChild(inner);
  }

  // 3) Build fresh content in memory (DocumentFragment) so we replace in one shot.
  var frag = document.createDocumentFragment();

  // Optional empty state message (won’t add anything if none provided)
  if (!items || items.length === 0) {
    var emptyMessage = mount.getAttribute("data-empty-text");
    if (emptyMessage) {
      var p = document.createElement("p");
      p.className = "muted";
      p.textContent = emptyMessage;
      frag.appendChild(p);
    }
    // Replace inner content but leave rest of page untouched.
    inner.replaceChildren(frag);
    return;
  }

  // If user provided a template in index.html, use it; else use default card.
  var tpl = document.getElementById("gb-card-template");

  // 4) For each item, render a card.
  for (var i = 0; i < items.length; i++) {
    var it     = items[i];
    var title  = it.title || "";
    var imgUrl = (Array.isArray(it.images) && it.images[0]) ? it.images[0] : "";
    var attrs  = it.attributes || {};

    if (tpl && "content" in tpl) {
      // Template path
      var node = gbkwRenderWithTemplate(tpl, {
        title  : title,
        image  : imgUrl,
        attrs  : attrs,
        fields : fields
      });
      frag.appendChild(node);
    } else {
      // Default card path
      var wrapper = document.createElement("div");
      wrapper.innerHTML = gbkwRenderDefaultCard({
        title  : title,
        image  : imgUrl,
        attrs  : attrs,
        fields : fields
      });
      // append the first element child (the <article>)
      if (wrapper.firstElementChild) {
        frag.appendChild(wrapper.firstElementChild);
      }
    }
  }

  // 5) Replace ONLY the inner container's children (leaves your other DOM intact).
  inner.replaceChildren(frag);
}

/* ---------------------------------------------------------------------
   SECTION 6: Orchestration (boot sequence)
--------------------------------------------------------------------- */

/**
 * Boot after DOMContentLoaded to avoid stepping on other scripts/animations.
 */
function gbkwBoot() {
  // Guard: if somehow fired twice, prevent double work.
  if (gbkwBoot.hasRun) return;
  gbkwBoot.hasRun = true;

  // 1) Initialize Firebase compat
  gbkwInitFirebaseCompat()
    .then(function(env){
      var firestore = env.firestore;

      // 2) Read schema + items in parallel
      return Promise.all([
        gbkwFetchFields(firestore),
        gbkwFetchItems(firestore)
      ]);
    })
    .then(function(results){
      var fields = results[0] || [];
      var items  = results[1] || [];

      // 3) Render non-destructively
      gbkwRenderGallery(fields, items);
    })
    .catch(function(err){
      // Fail safe: log error; DO NOT touch existing page content
      console.error("[GBKW] Gallery load failed:", err);
    });
}

// Run when DOM is ready, but also tolerate earlier load in old pages
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", gbkwBoot, { once: true });
} else {
  // DOM was already ready
  gbkwBoot();
}

/* ---------------------------------------------------------------------
   END OF FILE
--------------------------------------------------------------------- */
