/**
 * Antigravity OS & CN Master Lab - Main App Controller
 */

const AppState = {
  currentSubject: 'os', // 'os' or 'cn'
  currentExpId: 'os-exp-4', // Default to CPU scheduling
  searchQuery: '',
  activeTab: 'theory' // 'theory', 'algo', 'code', 'output', 'simulator', 'viva'
};

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  bindHeaderEvents();
  renderSidebar();
  renderActiveExperiment();
}

function bindHeaderEvents() {
  // Subject Switcher
  const btnOs = document.getElementById('btn-subject-os');
  const btnCn = document.getElementById('btn-subject-cn');

  btnOs.addEventListener('click', () => {
    if (AppState.currentSubject !== 'os') {
      AppState.currentSubject = 'os';
      btnOs.classList.add('active');
      btnCn.classList.remove('active');
      AppState.currentExpId = OS_EXPERIMENTS[0].id;
      renderSidebar();
      renderActiveExperiment();
    }
  });

  btnCn.addEventListener('click', () => {
    if (AppState.currentSubject !== 'cn') {
      AppState.currentSubject = 'cn';
      btnCn.classList.add('active');
      btnOs.classList.remove('active');
      AppState.currentExpId = CN_EXPERIMENTS[0].id;
      renderSidebar();
      renderActiveExperiment();
    }
  });

  // Search input
  const searchInput = document.getElementById('global-search-input');
  searchInput.addEventListener('input', (e) => {
    AppState.searchQuery = e.target.value.toLowerCase().trim();
    renderSidebar();
  });

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle-btn');
  themeToggle.addEventListener('click', () => {
    const curTheme = document.body.getAttribute('data-theme');
    const newTheme = curTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'light' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === '/') {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

function getActiveExperimentList() {
  return AppState.currentSubject === 'os' ? OS_EXPERIMENTS : CN_EXPERIMENTS;
}

function renderSidebar() {
  const navList = document.getElementById('sidebar-nav-list');
  const titleHeader = document.getElementById('sidebar-subject-title');
  const list = getActiveExperimentList();

  titleHeader.innerText = AppState.currentSubject === 'os' 
    ? 'Operating Systems Lab (22CSC18N)' 
    : 'Computer Networks Lab (22ITC11N)';

  const filtered = list.filter(exp => {
    if (!AppState.searchQuery) return true;
    return exp.title.toLowerCase().includes(AppState.searchQuery) ||
           exp.num.toString().includes(AppState.searchQuery) ||
           exp.aim.toLowerCase().includes(AppState.searchQuery);
  });

  if (filtered.length === 0) {
    navList.innerHTML = `<li class="term-line text-muted" style="padding:1rem;">No experiments match "${AppState.searchQuery}"</li>`;
    return;
  }

  navList.innerHTML = filtered.map(exp => `
    <li class="exp-nav-item ${exp.id === AppState.currentExpId ? 'active' : ''}" 
        onclick="switchExperiment('${exp.id}')">
      <span class="exp-nav-badge">#${exp.num}</span>
      <span class="exp-nav-title">${exp.title}</span>
    </li>
  `).join('');
}

function switchExperiment(expId) {
  AppState.currentExpId = expId;
  renderSidebar();
  renderActiveExperiment();
  // Scroll to top of main content
  document.querySelector('.app-content').scrollTo({ top: 0, behavior: 'smooth' });
}

function renderActiveExperiment() {
  const list = getActiveExperimentList();
  const exp = list.find(e => e.id === AppState.currentExpId) || list[0];
  const container = document.getElementById('main-experiment-container');

  const subjectCode = AppState.currentSubject === 'os' ? '22CSC18N &bull; OS' : '22ITC11N &bull; CN';

  container.innerHTML = `
    <div class="exp-header">
      <div class="exp-meta">
        <span class="exp-badge-subject">${subjectCode}</span>
        <span class="exp-badge-num">Experiment ${exp.num}</span>
      </div>
      <h2 class="exp-title">${exp.title}</h2>
      <div class="exp-aim-box">
        <strong><i class="fas fa-bullseye"></i> AIM:</strong>
        <p>${exp.aim}</p>
      </div>
    </div>

    <!-- Tab Buttons -->
    <div class="exp-tabs">
      <button class="tab-btn ${AppState.activeTab === 'theory' ? 'active' : ''}" onclick="switchTab('theory')">
        <i class="fas fa-book-open"></i> Theory &amp; Concepts
      </button>
      <button class="tab-btn ${AppState.activeTab === 'algo' ? 'active' : ''}" onclick="switchTab('algo')">
        <i class="fas fa-project-diagram"></i> Algorithm
      </button>
      <button class="tab-btn ${AppState.activeTab === 'code' ? 'active' : ''}" onclick="switchTab('code')">
        <i class="fas fa-code"></i> Source Code
      </button>
      <button class="tab-btn ${AppState.activeTab === 'output' ? 'active' : ''}" onclick="switchTab('output')">
        <i class="fas fa-terminal"></i> Output
      </button>
      <button class="tab-btn ${AppState.activeTab === 'simulator' ? 'active' : ''}" onclick="switchTab('simulator')">
        <i class="fas fa-play-circle"></i> Run Algorithm <span class="tab-badge" style="background:#10b981; color:white;">LIVE</span>
      </button>
      <button class="tab-btn ${AppState.activeTab === 'viva' ? 'active' : ''}" onclick="switchTab('viva')">
        <i class="fas fa-question-circle"></i> Viva Voce Q&amp;A
      </button>
    </div>

    <!-- Tab 1: Theory & Objectives -->
    <div class="tab-pane ${AppState.activeTab === 'theory' ? 'active' : ''}" id="pane-theory">
      <div class="card-section">
        <h3><i class="fas fa-crosshairs"></i> Learning Objectives</h3>
        <ul>
          ${exp.objectives ? exp.objectives.map(o => `<li>${o}</li>`).join('') : '<li>Master theoretical principles and practical realization.</li>'}
        </ul>
      </div>
      <div class="card-section">
        ${exp.theory}
      </div>
    </div>

    <!-- Tab 2: Algorithm -->
    <div class="tab-pane ${AppState.activeTab === 'algo' ? 'active' : ''}" id="pane-algo">
      <div class="card-section">
        <h3><i class="fas fa-list-ol"></i> Step-by-Step Algorithm / Pseudocode</h3>
        <pre class="code-content" style="background:transparent; padding:0; color:var(--text-secondary); white-space:pre-wrap;">${exp.algorithm.trim()}</pre>
      </div>
    </div>

    <!-- Tab 3: Code -->
    <div class="tab-pane ${AppState.activeTab === 'code' ? 'active' : ''}" id="pane-code">
      <div class="code-container">
        <div class="code-header">
          <span class="code-lang-tag"><i class="fas fa-file-code"></i> Optimized Implementation</span>
          <button class="btn-copy" onclick="copyCode()"><i class="fas fa-copy"></i> Copy Code</button>
        </div>
        <pre class="code-content" id="active-code-block">${escapeHtml(exp.code.trim())}</pre>
      </div>
    </div>

    <!-- Tab 4: Output -->
    <div class="tab-pane ${AppState.activeTab === 'output' ? 'active' : ''}" id="pane-output">
      <div class="card-section">
        <h3><i class="fas fa-desktop"></i> Sample Execution Output</h3>
        <div class="output-terminal">${escapeHtml(exp.output.trim())}</div>
      </div>
    </div>

    <!-- Tab 5: Interactive Simulator / Live Runner -->
    <div class="tab-pane ${AppState.activeTab === 'simulator' ? 'active' : ''}" id="pane-simulator">
      <div id="simulator-mount-point"></div>
    </div>

    <!-- Tab 6: Viva Voce Q&A -->
    <div class="tab-pane ${AppState.activeTab === 'viva' ? 'active' : ''}" id="pane-viva">
      <div class="card-section">
        <h3><i class="fas fa-user-graduate"></i> High-Yield Viva Voce Questions &amp; Model Answers</h3>
        <p class="sim-desc">Curated from CBIT previous viva examinations and lab external evaluations.</p>
        <div class="viva-list">
          ${exp.viva ? exp.viva.map((v, i) => `
            <div class="viva-item">
              <div class="viva-q">
                <span class="viva-q-badge">Q${i+1}.</span>
                <span>${v.q}</span>
              </div>
              <div class="viva-a">
                <strong>Ans:</strong> ${v.a}
              </div>
            </div>
          `).join('') : '<p>No viva questions listed.</p>'}
        </div>
      </div>
    </div>
  `;

  // Mount simulator if simulator tab is active
  mountSimulator(exp);
}

function switchTab(tabId) {
  AppState.activeTab = tabId;
  const tabs = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(t => t.classList.remove('active'));
  panes.forEach(p => p.classList.remove('active'));

  const targetPane = document.getElementById(`pane-${tabId}`);
  if (targetPane) targetPane.classList.add('active');

  const list = getActiveExperimentList();
  const exp = list.find(e => e.id === AppState.currentExpId) || list[0];

  // Update active tab buttons
  const activeBtn = Array.from(tabs).find(b => b.getAttribute('onclick')?.includes(tabId));
  if (activeBtn) activeBtn.classList.add('active');

  if (tabId === 'simulator') {
    mountSimulator(exp);
  }
}

function mountSimulator(exp) {
  const mount = document.getElementById('simulator-mount-point');
  if (!mount) return;

  const type = exp.simulatorType;
  if (type === 'cpu-scheduler') {
    Simulators.renderCpuScheduler(mount);
  } else if (type === 'page-replacement') {
    Simulators.renderPageReplacement(mount);
  } else if (type === 'bankers-algo') {
    Simulators.renderBankersAlgo(mount);
  } else if (type === 'sync-visualizer') {
    Simulators.renderSyncVisualizer(mount);
  } else if (type === 'threads-race') {
    Simulators.renderThreadsRace(mount);
  } else if (type === 'vfs') {
    Simulators.renderVfsSimulator(mount);
  } else if (type === 'process-tree') {
    Simulators.renderProcessTree(mount);
  } else if (type === 'shell-runner') {
    Simulators.renderShellRunner(mount);
  } else if (type === 'file-alloc') {
    Simulators.renderFileAlloc(mount);
  } else if (type === 'crc-calc') {
    Simulators.renderCrcCalc(mount);
  } else if (type === 'socket-terminal') {
    Simulators.renderSocketTerminal(mount);
  } else if (type === 'network-cli') {
    Simulators.renderNetworkCli(mount);
  } else if (type === 'sliding-window' || type === 'stop-wait') {
    Simulators.renderSlidingWindow(mount);
  } else if (type === 'routing-algo') {
    Simulators.renderRoutingAlgo(mount);
  } else if (type === 'cisco-router') {
    Simulators.renderCiscoRouter(mount);
  } else {
    Simulators.renderGenericFallback(mount, exp.title, `Live simulator environment loaded for ${exp.title}. You can execute this algorithm and verify outputs directly.`);
  }
}

function copyCode() {
  const codeEl = document.getElementById('active-code-block');
  if (!codeEl) return;
  const text = codeEl.innerText;

  navigator.clipboard.writeText(text).then(() => {
    const copyBtn = document.querySelector('.btn-copy');
    if (copyBtn) {
      const orig = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      copyBtn.style.background = '#10b981';
      setTimeout(() => {
        copyBtn.innerHTML = orig;
        copyBtn.style.background = '';
      }, 2000);
    }
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

