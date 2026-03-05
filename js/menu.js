// ── MENU PAGE LOGIC ─────────────────────────────────────────────
(function () {
  const params = new URLSearchParams(window.location.search);
  let cat = params.get('cat') || 'veg';
  if (!['veg', 'nonveg', 'deals'].includes(cat)) cat = 'veg';

  let viewMode = 'wheel';
  let wheelIndex = 0;
  let isAnimating = false;

  const listView    = document.getElementById('listView');
  const wheelView   = document.getElementById('wheelView');
  const listToggle  = document.getElementById('listToggle');
  const wheelToggle = document.getElementById('wheelToggle');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');
  const wheelStage  = document.getElementById('wheelStage');
  const wheelDetail = document.getElementById('wheelDetail');
  const wheelCounter= document.getElementById('wheelCounter');
  const pageTitle   = document.getElementById('pageTitle');
  const pageSub     = document.getElementById('pageSub');

  const pizzas = PIZZAS[cat] || [];
  const categoryMeta = {
    veg:    { title: 'Vegetarian Pizzas',     sub: 'Garden-fresh, lovingly crafted.' },
    nonveg: { title: 'Non-Vegetarian Pizzas', sub: 'Bold flavors, premium meats.' },
    deals:  { title: 'Hot Deals',             sub: 'The best value on the menu — today only.' }
  };
  if (pageTitle) pageTitle.textContent = categoryMeta[cat].title;
  if (pageSub)   pageSub.textContent   = categoryMeta[cat].sub;

  document.querySelectorAll('.nav-link').forEach(l => {
    if (l.href.includes(`cat=${cat}`)) l.classList.add('active');
  });

  // ── DEALS → list only ────────────────────────────────────────
  if (cat === 'deals') {
    document.querySelector('.view-toggle')?.remove();
    renderDeals();
    listView.classList.add('active');
    return;
  }

  // ── VIEW TOGGLE ───────────────────────────────────────────────
  if (listToggle) listToggle.addEventListener('click', () => setView('list'));
  if (wheelToggle) wheelToggle.addEventListener('click', () => setView('wheel'));

  function setView(mode) {
    viewMode = mode;
    if (mode === 'list') {
      listView.classList.add('active');
      wheelView.classList.remove('active');
      listToggle.classList.add('active');
      wheelToggle.classList.remove('active');
      renderList();
    } else {
      wheelView.classList.add('active');
      listView.classList.remove('active');
      wheelToggle.classList.add('active');
      listToggle.classList.remove('active');
      renderWheel();
    }
  }

  // ── LIST VIEW ─────────────────────────────────────────────────
  function renderList() {
    const grid = document.getElementById('pizzaGrid');
    if (grid.dataset.rendered) return;
    grid.innerHTML = pizzas.map(p => pizzaCardHTML(p)).join('');
    grid.dataset.rendered = '1';
    grid.querySelectorAll('.customize-btn').forEach(btn => {
      btn.addEventListener('click', () => openCustomizer(btn.dataset.id));
    });
  }

  function pizzaCardHTML(p) {
    const spiceDots = [1,2,3].map(i =>
      `<span class="spice-dot ${i <= p.spice ? 'hot' : ''}"></span>`
    ).join('');
    const stars = '★'.repeat(Math.floor(p.rating));
    const tagsHTML = (p.tags||[]).map(t => `<span class="tag-pill">${t}</span>`).join('');
    const sizeBadges = Object.entries(SIZE_PRICES).map(([key, s]) =>
      `<span class="size-price-badge">${s.label} <span>${formatINR(Math.round(p.basePrice * s.multiplier))}</span></span>`
    ).join('');
    return `
      <div class="pizza-card">
        <div class="card-img-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <span class="card-badge">★ ${p.rating}</span>
        </div>
        <div class="card-body">
          <div class="card-top">
            <div class="card-name">${p.name}</div>
            <div class="card-price">${formatINR(p.basePrice)}</div>
          </div>
          <div class="card-tagline">${p.tagline}</div>
          <div class="card-desc">${p.description}</div>
          <div class="size-badges">${sizeBadges}</div>
          <div class="card-meta">
            <span class="rating-stars">${stars}</span>
            <div class="spice-dots">${spiceDots}</div>
          </div>
          <div class="card-tags">${tagsHTML}</div>
          <div class="card-footer">
            <button class="add-btn customize-btn" data-id="${p.id}">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              Customise & Add
            </button>
          </div>
        </div>
      </div>`;
  }

  // ── WHEEL VIEW ────────────────────────────────────────────────
  function renderWheel() {
    if (!pizzas.length) return;
    wheelIndex = 0;
    buildWheelSlot(pizzas[0], false);
    updateWheelDetail(pizzas[0]);
    updateCounter();
    updateArrows();
  }

  function buildWheelSlot(pizza, animate, direction) {
    wheelStage.querySelectorAll('.pizza-wheel-slot:not(.exiting-next):not(.exiting-prev)').forEach(el => el.remove());
    const slot = document.createElement('div');
    slot.className = 'pizza-wheel-slot';
    slot.innerHTML = `<img src="${pizza.image}" alt="${pizza.name}" loading="lazy">`;
    if (animate) slot.classList.add(direction === 'next' ? 'entering-next' : 'entering-prev');
    wheelStage.appendChild(slot);
    let label = wheelStage.querySelector('.wheel-pizza-label');
    if (!label) { label = document.createElement('div'); label.className = 'wheel-pizza-label'; wheelStage.appendChild(label); }
    label.textContent = pizza.name;
  }

  function updateWheelDetail(pizza) {
    const spiceDots = [1,2,3].map(i => `<span class="spice-dot ${i <= pizza.spice ? 'hot' : ''}"></span>`).join('');
    const tagsHTML = (pizza.tags||[]).map(t => `<span class="tag-pill">${t}</span>`).join('');
    const sizeBadges = Object.entries(SIZE_PRICES).map(([key,s]) =>
      `<span class="size-price-badge">${s.label} <span>${formatINR(Math.round(pizza.basePrice * s.multiplier))}</span></span>`
    ).join('');
    wheelDetail.innerHTML = `
      <p class="wd-eyebrow">${pizza.tags?.[0] || 'Signature'}</p>
      <h2 class="wd-name">${pizza.name}</h2>
      <p class="wd-desc">${pizza.description}</p>
      <div class="wd-meta">
        <span class="wd-price">${formatINR(pizza.basePrice)}</span>
        <div class="wd-divider"></div>
        <div class="spice-dots">${spiceDots}</div>
        <div class="wd-divider"></div>
        <span class="rating-stars" style="font-size:1rem">★ ${pizza.rating}</span>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:10px">${sizeBadges}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:20px">${tagsHTML}</div>
      <div class="wd-add">
        <button class="add-btn" id="wheelAddBtn" data-id="${pizza.id}">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Customise & Add
        </button>
      </div>`;
    document.getElementById('wheelAddBtn').addEventListener('click', () => openCustomizer(pizza.id));
  }

  function updateCounter() {
    if (wheelCounter) wheelCounter.innerHTML = `<strong>${wheelIndex + 1}</strong> / ${pizzas.length}`;
  }

  function updateArrows() {
    if (prevBtn) prevBtn.disabled = wheelIndex === 0;
    if (nextBtn) nextBtn.disabled = wheelIndex === pizzas.length - 1;
  }

  function navigate(direction) {
    if (isAnimating) return;
    const newIndex = direction === 'next' ? wheelIndex + 1 : wheelIndex - 1;
    if (newIndex < 0 || newIndex >= pizzas.length) return;
    isAnimating = true;
    const currentSlot = wheelStage.querySelector('.pizza-wheel-slot');
    if (currentSlot) {
      currentSlot.classList.add(direction === 'next' ? 'exiting-next' : 'exiting-prev');
      currentSlot.addEventListener('animationend', () => currentSlot.remove(), { once: true });
    }
    wheelIndex = newIndex;
    buildWheelSlot(pizzas[wheelIndex], true, direction);
    updateWheelDetail(pizzas[wheelIndex]);
    updateCounter();
    updateArrows();
    setTimeout(() => { isAnimating = false; }, 650);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => navigate('next'));
  if (prevBtn) prevBtn.addEventListener('click', () => navigate('prev'));
  document.addEventListener('keydown', e => {
    if (viewMode !== 'wheel') return;
    if (e.key === 'ArrowRight') navigate('next');
    if (e.key === 'ArrowLeft')  navigate('prev');
  });

  // ── CUSTOMIZER MODAL ──────────────────────────────────────────
  let custPizza = null;
  let custSize = 'medium';
  let custToppings = [];

  function openCustomizer(pizzaId) {
    const allPizzas = [...PIZZAS.veg, ...PIZZAS.nonveg];
    custPizza = allPizzas.find(p => p.id === pizzaId);
    if (!custPizza) return;
    custSize = 'medium';
    custToppings = [...(custPizza.defaultToppings || [])];
    renderCustomizer();
    document.getElementById('custOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCustomizer() {
    document.getElementById('custOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCustomizer() {
    const modal = document.getElementById('custModal');
    const price = computePrice(custPizza, custSize, custToppings);

    // Size buttons
    const sizeBtns = Object.entries(SIZE_PRICES).map(([key, s]) => `
      <button class="size-btn ${custSize === key ? 'selected' : ''}" data-size="${key}">
        <span class="s-inch">${s.inch}</span>
        <span class="s-label">${s.label}</span>
        <span class="s-price">${formatINR(Math.round(custPizza.basePrice * s.multiplier))}</span>
      </button>`).join('');

    // Group toppings
    const grouped = { veg: [], cheese: [], nonveg: [] };
    ALL_TOPPINGS.forEach(t => grouped[t.type]?.push(t));

    function toppingGroup(label, type) {
      return `
        <div class="modal-section-label">${label}</div>
        <div class="topping-grid">
          ${grouped[type].map(t => `
            <button class="topping-chip ${custToppings.includes(t.id) ? 'active' : ''}" data-tid="${t.id}">
              <span class="tc-dot ${t.type}"></span>
              <span class="tc-name">${t.name}</span>
              <span class="tc-price">+${formatINR(t.price)}</span>
            </button>`).join('')}
        </div>`;
    }

    modal.innerHTML = `
      <div class="modal-header">
        <img class="modal-img" src="${custPizza.image}" alt="${custPizza.name}">
        <div class="modal-title-wrap">
          <div class="modal-title">${custPizza.name}</div>
          <div class="modal-tagline">${custPizza.tagline}</div>
        </div>
        <button class="modal-close" id="custClose">✕</button>
      </div>
      <div class="modal-body">
        <div class="modal-section-label">Choose Size</div>
        <div class="size-selector">${sizeBtns}</div>
        ${toppingGroup('Vegetables', 'veg')}
        ${toppingGroup('Cheese', 'cheese')}
        ${cat === 'nonveg' ? toppingGroup('Meats', 'nonveg') : ''}
      </div>
      <div class="modal-footer">
        <div class="modal-price-wrap">
          <span class="mp-label">Total Price</span>
          <span class="mp-total" id="custPrice">${formatINR(price)}</span>
        </div>
        <button class="add-btn" id="custAddBtn">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Add to Cart
        </button>
      </div>`;

    // Bind close
    document.getElementById('custClose').addEventListener('click', closeCustomizer);

    // Bind size buttons
    modal.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        custSize = btn.dataset.size;
        modal.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        updateModalPrice();
      });
    });

    // Bind topping chips
    modal.querySelectorAll('.topping-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const tid = chip.dataset.tid;
        if (custToppings.includes(tid)) {
          custToppings = custToppings.filter(t => t !== tid);
          chip.classList.remove('active');
        } else {
          custToppings.push(tid);
          chip.classList.add('active');
        }
        updateModalPrice();
      });
    });

    // Add to cart
    document.getElementById('custAddBtn').addEventListener('click', () => {
      const finalPrice = computePrice(custPizza, custSize, custToppings);
      const sizeInfo = SIZE_PRICES[custSize];
      const toppingNames = custToppings.map(tid => getToppingById(tid)?.name).filter(Boolean);
      Cart.add({
        ...custPizza,
        price: finalPrice,
        cartLabel: `${custPizza.name} (${sizeInfo.label})`,
        size: sizeInfo.inch,
        toppings: toppingNames,
        cartId: `${custPizza.id}_${custSize}_${custToppings.sort().join('_')}`
      });
      closeCustomizer();
    });
  }

  function updateModalPrice() {
    const p = computePrice(custPizza, custSize, custToppings);
    const el = document.getElementById('custPrice');
    if (el) el.textContent = formatINR(p);
  }

  // Close on overlay click
  document.getElementById('custOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('custOverlay')) closeCustomizer();
  });

  // ── DEALS ─────────────────────────────────────────────────────
  function renderDeals() {
    const grid = document.getElementById('pizzaGrid');
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
    grid.innerHTML = PIZZAS.deals.map(d => `
      <div class="deal-card">
        <div class="deal-badge">${d.discount}</div>
        <div style="overflow:hidden"><img class="deal-img" src="${d.image}" alt="${d.name}" loading="lazy"></div>
        <div class="deal-info">
          <div class="deal-name">${d.name}</div>
          <div class="deal-tagline">${d.tagline}</div>
          <div class="deal-desc">${d.description}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
            ${d.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
          </div>
          <div class="deal-prices">
            <span class="deal-price">${formatINR(d.basePrice)}</span>
            <span class="deal-original">${formatINR(d.originalPrice)}</span>
          </div>
          <button class="add-btn" onclick='Cart.add(${JSON.stringify({...d, price: d.basePrice, cartId: d.id})})'>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Grab This Deal
          </button>
        </div>
      </div>`).join('');
  }

  // ── INIT ──────────────────────────────────────────────────────
  setView('wheel');
})();
