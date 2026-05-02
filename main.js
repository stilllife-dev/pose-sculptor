const STROKE_WIDTH = 1.2;
const CATEGORIES = [{ id: 'STANDING', label: 'Standing' }, { id: 'SITTING', label: 'Sitting' }, { id: 'WALKING', label: 'Walking' }, { id: 'WORKING', label: 'Working' }, { id: 'RELAXING', label: 'Relaxing' }];

let state = { sex: 'MALE', category: 'STANDING', activePoseId: null };

function init() {
    renderCategories();
    selectCategory('STANDING');
}

function renderCategories() {
    const list = document.getElementById('category-list');
    list.innerHTML = '';
    CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `cat-btn ${cat.id === state.category ? 'active' : ''}`;
        btn.textContent = cat.label;
        btn.onclick = () => selectCategory(cat.id);
        list.appendChild(btn);
    });
}

function renderGrid() {
    const grid = document.getElementById('pose-grid');
    grid.innerHTML = '';
    const poses = POSES[state.sex][state.category] || [];
    poses.forEach(pose => {
        const card = document.createElement('div');
        card.className = `pose-card ${pose.id === state.activePoseId ? 'active' : ''}`;
        card.onclick = () => selectPose(pose.id);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '40 20 120 240');
        svg.innerHTML = buildPaths(pose.paths, STROKE_WIDTH, pose.id === state.activePoseId ? "#00FFFF" : "#AAAAAA");
        const span = document.createElement('span');
        span.textContent = pose.name;
        card.appendChild(svg);
        card.appendChild(span);
        grid.appendChild(card);
    });
}

function renderPreview() {
    const poses = POSES[state.sex][state.category] || [];
    const active = poses.find(p => p.id === state.activePoseId) || poses[0];
    if (active) {
        document.getElementById('main-preview').innerHTML = buildPaths(active.paths, STROKE_WIDTH * 1.5, "#AAAAAA");
        document.getElementById('preview-title').textContent = active.name;
    }
}

function buildPaths(p, sw, sc) {
    return p.map(d => `<path d="${d}" stroke="${sc}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`).join('');
}

window.setSex = (s) => {
    state.sex = s;
    document.getElementById('btn-male').classList.toggle('active', s === 'MALE');
    document.getElementById('btn-female').classList.toggle('active', s === 'FEMALE');
    selectCategory(state.category);
};

function selectCategory(c) {
    state.category = c;
    document.getElementById('category-title').textContent = CATEGORIES.find(x => x.id === c).label;
    renderCategories();
    const p = POSES[state.sex][state.category];
    state.activePoseId = p && p.length > 0 ? p[0].id : null;
    renderGrid();
    renderPreview();
}

function selectPose(id) {
    state.activePoseId = id;
    renderGrid();
    renderPreview();
}

window.downloadSVG = () => {
    const p = POSES[state.sex][state.category].find(x => x.id === state.activePoseId);
    if (!p) return;
    const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="400" height="600"><rect width="200" height="300" fill="#0D0D0D"/>${buildPaths(p.paths, STROKE_WIDTH, "#AAAAAA")}</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pose-${p.name}.svg`;
    a.click();
};

init();
