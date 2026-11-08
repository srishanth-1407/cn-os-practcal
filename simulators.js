/**
 * Antigravity OS & CN Lab Simulators Engine
 * Interactive, in-browser runners for all Operating Systems & Computer Networks algorithms
 */

const Simulators = {
  // ==========================================
  // OS 4: CPU Scheduling Simulator
  // ==========================================
  renderCpuScheduler: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-microchip"></i> Interactive CPU Scheduling Simulator</h4>
          <span class="sim-badge">Live Algorithm Runner</span>
        </div>
        <p class="sim-desc">Select an algorithm, adjust processes, and view real-time Gantt Chart, completion times, and average TAT/WT calculations.</p>
        
        <div class="sim-controls">
          <div class="form-group">
            <label>Algorithm:</label>
            <select id="cpu-algo-select" class="sim-select">
              <option value="fcfs">First-Come First-Served (FCFS)</option>
              <option value="sjf-non">Shortest Job First (SJF - Non-Preemptive)</option>
              <option value="sjf-pre">Shortest Remaining Time First (SRTF / SJF Preemptive)</option>
              <option value="rr" selected>Round Robin (RR)</option>
              <option value="pri-non">Priority (Non-Preemptive)</option>
            </select>
          </div>
          <div class="form-group" id="rr-quantum-group">
            <label>Time Quantum (for RR):</label>
            <input type="number" id="cpu-quantum" class="sim-input" value="2" min="1" max="10">
          </div>
          <button id="cpu-run-btn" class="btn btn-primary"><i class="fas fa-play"></i> Run Algorithm</button>
          <button id="cpu-add-p-btn" class="btn btn-secondary"><i class="fas fa-plus"></i> Add Process</button>
        </div>

        <div class="table-responsive">
          <table class="sim-table" id="cpu-input-table">
            <thead>
              <tr>
                <th>Process</th>
                <th>Arrival Time (AT)</th>
                <th>Burst Time (BT)</th>
                <th>Priority (Lower=Higher)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="cpu-process-rows">
              <tr><td>P1</td><td><input type="number" class="at-val sim-input-sm" value="0" min="0"></td><td><input type="number" class="bt-val sim-input-sm" value="5" min="1"></td><td><input type="number" class="pr-val sim-input-sm" value="2" min="1"></td><td><button class="btn-del-p" onclick="this.closest('tr').remove()">&times;</button></td></tr>
              <tr><td>P2</td><td><input type="number" class="at-val sim-input-sm" value="1" min="0"></td><td><input type="number" class="bt-val sim-input-sm" value="4" min="1"></td><td><input type="number" class="pr-val sim-input-sm" value="1" min="1"></td><td><button class="btn-del-p" onclick="this.closest('tr').remove()">&times;</button></td></tr>
              <tr><td>P3</td><td><input type="number" class="at-val sim-input-sm" value="2" min="0"></td><td><input type="number" class="bt-val sim-input-sm" value="2" min="1"></td><td><input type="number" class="pr-val sim-input-sm" value="3" min="1"></td><td><button class="btn-del-p" onclick="this.closest('tr').remove()">&times;</button></td></tr>
              <tr><td>P4</td><td><input type="number" class="at-val sim-input-sm" value="3" min="0"></td><td><input type="number" class="bt-val sim-input-sm" value="1" min="1"></td><td><input type="number" class="pr-val sim-input-sm" value="4" min="1"></td><td><button class="btn-del-p" onclick="this.closest('tr').remove()">&times;</button></td></tr>
            </tbody>
          </table>
        </div>

        <div id="cpu-results-container" class="sim-output-box">
          <!-- Results populated here -->
        </div>
      </div>
    `;

    document.getElementById('cpu-add-p-btn').onclick = () => {
      const tbody = document.getElementById('cpu-process-rows');
      const count = tbody.querySelectorAll('tr').length + 1;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>P${count}</td><td><input type="number" class="at-val sim-input-sm" value="${count-1}" min="0"></td><td><input type="number" class="bt-val sim-input-sm" value="3" min="1"></td><td><input type="number" class="pr-val sim-input-sm" value="1" min="1"></td><td><button class="btn-del-p" onclick="this.closest('tr').remove()">&times;</button></td>`;
      tbody.appendChild(tr);
    };

    document.getElementById('cpu-run-btn').onclick = () => Simulators.executeCpuScheduler();
    Simulators.executeCpuScheduler();
  },

  executeCpuScheduler: function() {
    const algo = document.getElementById('cpu-algo-select').value;
    const tq = parseInt(document.getElementById('cpu-quantum').value) || 2;
    const rows = document.querySelectorAll('#cpu-process-rows tr');
    const processes = [];

    rows.forEach((row, idx) => {
      const at = parseInt(row.querySelector('.at-val').value) || 0;
      const bt = parseInt(row.querySelector('.bt-val').value) || 1;
      const pr = parseInt(row.querySelector('.pr-val').value) || 1;
      processes.push({ id: `P${idx+1}`, pid: idx+1, at, bt, pr, remBt: bt, ct: 0, tat: 0, wt: 0 });
    });

    if (processes.length === 0) return;

    let time = 0;
    const gantt = [];
    const completed = [];
    const n = processes.length;

    if (algo === 'fcfs') {
      const sorted = [...processes].sort((a,b) => a.at - b.at);
      sorted.forEach(p => {
        if (time < p.at) {
          gantt.push({ id: 'Idle', start: time, end: p.at });
          time = p.at;
        }
        gantt.push({ id: p.id, start: time, end: time + p.bt });
        time += p.bt;
        p.ct = time;
        p.tat = p.ct - p.at;
        p.wt = p.tat - p.bt;
        completed.push(p);
      });
    } else if (algo === 'sjf-non') {
      let count = 0;
      const done = new Array(n).fill(false);
      while (count < n) {
        let idx = -1, minBt = 999999;
        for (let i = 0; i < n; i++) {
          if (!done[i] && processes[i].at <= time && processes[i].bt < minBt) {
            minBt = processes[i].bt;
            idx = i;
          }
        }
        if (idx === -1) {
          let nextAt = 999999;
          for (let i = 0; i < n; i++) {
            if (!done[i] && processes[i].at < nextAt) nextAt = processes[i].at;
          }
          gantt.push({ id: 'Idle', start: time, end: nextAt });
          time = nextAt;
          continue;
        }
        const p = processes[idx];
        gantt.push({ id: p.id, start: time, end: time + p.bt });
        time += p.bt;
        p.ct = time;
        p.tat = p.ct - p.at;
        p.wt = p.tat - p.bt;
        done[idx] = true;
        completed.push(p);
        count++;
      }
    } else if (algo === 'sjf-pre') {
      let count = 0;
      let prevId = null;
      let startBlock = 0;
      while (count < n) {
        let idx = -1, minRem = 999999;
        for (let i = 0; i < n; i++) {
          if (processes[i].at <= time && processes[i].remBt > 0 && processes[i].remBt < minRem) {
            minRem = processes[i].remBt;
            idx = i;
          }
        }
        if (idx === -1) {
          if (prevId !== 'Idle') {
            if (prevId) gantt.push({ id: prevId, start: startBlock, end: time });
            prevId = 'Idle';
            startBlock = time;
          }
          time++;
          continue;
        }
        const p = processes[idx];
        if (prevId !== p.id) {
          if (prevId) gantt.push({ id: prevId, start: startBlock, end: time });
          prevId = p.id;
          startBlock = time;
        }
        p.remBt--;
        time++;
        if (p.remBt === 0) {
          p.ct = time;
          p.tat = p.ct - p.at;
          p.wt = p.tat - p.bt;
          completed.push(p);
          count++;
        }
      }
      if (prevId) gantt.push({ id: prevId, start: startBlock, end: time });
    } else if (algo === 'rr') {
      const q = [];
      const inQ = new Array(n).fill(false);
      let count = 0;
      
      let minAt = Math.min(...processes.map(p => p.at));
      time = minAt;
      processes.forEach((p, i) => {
        if (p.at <= time) { q.push(i); inQ[i] = true; }
      });

      while (count < n) {
        if (q.length === 0) {
          let nextAt = 999999;
          processes.forEach(p => {
            if (p.remBt > 0 && p.at < nextAt) nextAt = p.at;
          });
          gantt.push({ id: 'Idle', start: time, end: nextAt });
          time = nextAt;
          processes.forEach((p, i) => {
            if (p.at <= time && p.remBt > 0 && !inQ[i]) {
              q.push(i);
              inQ[i] = true;
            }
          });
          continue;
        }

        const currIdx = q.shift();
        const p = processes[currIdx];
        const execTime = Math.min(p.remBt, tq);
        gantt.push({ id: p.id, start: time, end: time + execTime });
        time += execTime;
        p.remBt -= execTime;

        processes.forEach((other, idx) => {
          if (other.at <= time && other.remBt > 0 && !inQ[idx] && idx !== currIdx) {
            q.push(idx);
            inQ[idx] = true;
          }
        });

        if (p.remBt > 0) {
          q.push(currIdx);
        } else {
          p.ct = time;
          p.tat = p.ct - p.at;
          p.wt = p.tat - p.bt;
          completed.push(p);
          count++;
        }
      }
    } else if (algo === 'pri-non') {
      let count = 0;
      const done = new Array(n).fill(false);
      while (count < n) {
        let idx = -1, minPr = 999999;
        for (let i = 0; i < n; i++) {
          if (!done[i] && processes[i].at <= time && processes[i].pr < minPr) {
            minPr = processes[i].pr;
            idx = i;
          }
        }
        if (idx === -1) {
          let nextAt = 999999;
          for (let i = 0; i < n; i++) {
            if (!done[i] && processes[i].at < nextAt) nextAt = processes[i].at;
          }
          gantt.push({ id: 'Idle', start: time, end: nextAt });
          time = nextAt;
          continue;
        }
        const p = processes[idx];
        gantt.push({ id: p.id, start: time, end: time + p.bt });
        time += p.bt;
        p.ct = time;
        p.tat = p.ct - p.at;
        p.wt = p.tat - p.bt;
        done[idx] = true;
        completed.push(p);
        count++;
      }
    }

    // Render Gantt & Result Table
    const totalTat = completed.reduce((sum, p) => sum + p.tat, 0);
    const totalWt = completed.reduce((sum, p) => sum + p.wt, 0);
    const avgTat = (totalTat / n).toFixed(2);
    const avgWt = (totalWt / n).toFixed(2);

    // Merge consecutive identical gantt blocks
    const cleanGantt = [];
    gantt.forEach(block => {
      if (cleanGantt.length > 0 && cleanGantt[cleanGantt.length - 1].id === block.id) {
        cleanGantt[cleanGantt.length - 1].end = block.end;
      } else {
        cleanGantt.push({...block});
      }
    });

    let ganttHtml = `
      <div class="gantt-wrapper">
        <h5><i class="fas fa-chart-bar"></i> Visual Gantt Chart:</h5>
        <div class="gantt-chart">
    `;
    cleanGantt.forEach(block => {
      const dur = block.end - block.start;
      const flexGrow = dur || 1;
      const isIdle = block.id === 'Idle';
      ganttHtml += `
        <div class="gantt-block ${isIdle ? 'gantt-idle' : 'gantt-proc'}" style="flex-grow: ${flexGrow};">
          <span class="gantt-name">${block.id}</span>
          <span class="gantt-time-start">${block.start}</span>
          <span class="gantt-time-end">${block.end}</span>
        </div>
      `;
    });
    ganttHtml += `</div></div>`;

    let tableHtml = `
      <div class="table-responsive" style="margin-top: 1.5rem;">
        <h5><i class="fas fa-table"></i> Process Schedule Output Table:</h5>
        <table class="sim-table">
          <thead>
            <tr>
              <th>Process</th><th>Arrival (AT)</th><th>Burst (BT)</th><th>Completion (CT)</th><th>Turnaround (TAT)</th><th>Waiting (WT)</th>
            </tr>
          </thead>
          <tbody>
    `;
    completed.sort((a,b) => a.pid - b.pid).forEach(p => {
      tableHtml += `
        <tr>
          <td><strong>${p.id}</strong></td>
          <td>${p.at}</td>
          <td>${p.bt}</td>
          <td><span class="badge badge-info">${p.ct}</span></td>
          <td><span class="badge badge-primary">${p.tat}</span></td>
          <td><span class="badge badge-warning">${p.wt}</span></td>
        </tr>
      `;
    });
    tableHtml += `
          </tbody>
        </table>
      </div>
      <div class="sim-stat-cards">
        <div class="stat-card">
          <div class="stat-title">Average Turnaround Time</div>
          <div class="stat-value text-primary">${avgTat} ms</div>
          <small class="stat-hint">Formula: &Sigma;TAT / N</small>
        </div>
        <div class="stat-card">
          <div class="stat-title">Average Waiting Time</div>
          <div class="stat-value text-success">${avgWt} ms</div>
          <small class="stat-hint">Formula: &Sigma;WT / N</small>
        </div>
      </div>
    `;

    document.getElementById('cpu-results-container').innerHTML = ganttHtml + tableHtml;
  },

  // ==========================================
  // OS 5: Page Replacement Simulator
  // ==========================================
  renderPageReplacement: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-memory"></i> Interactive Page Replacement Simulator</h4>
          <span class="sim-badge">FIFO &bull; LRU &bull; Optimal</span>
        </div>
        <p class="sim-desc">Enter a page reference string and frame count to see step-by-step memory frame allocation, page hits, page faults, and hit ratios.</p>
        
        <div class="sim-controls">
          <div class="form-group" style="flex: 2;">
            <label>Reference String (space or comma separated):</label>
            <input type="text" id="page-ref-string" class="sim-input" value="7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1">
          </div>
          <div class="form-group">
            <label>Number of Frames:</label>
            <input type="number" id="page-frames-count" class="sim-input" value="3" min="1" max="8">
          </div>
          <div class="form-group">
            <label>Algorithm:</label>
            <select id="page-algo-select" class="sim-select">
              <option value="lru" selected>Least Recently Used (LRU)</option>
              <option value="fifo">First-In First-Out (FIFO)</option>
              <option value="optimal">Optimal (OPT)</option>
            </select>
          </div>
          <button id="page-run-btn" class="btn btn-primary"><i class="fas fa-play"></i> Simulate</button>
        </div>

        <div id="page-results-container" class="sim-output-box"></div>
      </div>
    `;

    document.getElementById('page-run-btn').onclick = () => Simulators.executePageReplacement();
    Simulators.executePageReplacement();
  },

  executePageReplacement: function() {
    const rawStr = document.getElementById('page-ref-string').value;
    const framesCount = parseInt(document.getElementById('page-frames-count').value) || 3;
    const algo = document.getElementById('page-algo-select').value;

    const pages = rawStr.split(/[\s,]+/).map(s => s.trim()).filter(s => s.length > 0).map(Number);
    if (pages.length === 0) return;

    const frames = new Array(framesCount).fill(-1);
    const history = [];
    let hits = 0, misses = 0;

    // FIFO queue
    let fifoQueue = [];
    // LRU last used timestamp
    let lruTime = new Array(framesCount).fill(0);

    pages.forEach((p, time) => {
      let isHit = false;
      const frameSnapshot = [];

      // Check hit
      const hitIdx = frames.indexOf(p);
      if (hitIdx !== -1) {
        isHit = true;
        hits++;
        lruTime[hitIdx] = time;
      } else {
        misses++;
        // Check empty slot
        const emptyIdx = frames.indexOf(-1);
        if (emptyIdx !== -1) {
          frames[emptyIdx] = p;
          fifoQueue.push(emptyIdx);
          lruTime[emptyIdx] = time;
        } else {
          // Replacement needed
          if (algo === 'fifo') {
            const victimIdx = fifoQueue.shift();
            frames[victimIdx] = p;
            fifoQueue.push(victimIdx);
          } else if (algo === 'lru') {
            let minTime = lruTime[0];
            let victimIdx = 0;
            for (let f = 1; f < framesCount; f++) {
              if (lruTime[f] < minTime) {
                minTime = lruTime[f];
                victimIdx = f;
              }
            }
            frames[victimIdx] = p;
            lruTime[victimIdx] = time;
          } else if (algo === 'optimal') {
            // Find frame with page farthest in future or never used again
            let farthest = -1;
            let victimIdx = 0;
            for (let f = 0; f < framesCount; f++) {
              let nextUse = 999999;
              for (let k = time + 1; k < pages.length; k++) {
                if (pages[k] === frames[f]) {
                  nextUse = k;
                  break;
                }
              }
              if (nextUse > farthest) {
                farthest = nextUse;
                victimIdx = f;
              }
            }
            frames[victimIdx] = p;
          }
        }
      }

      history.push({
        page: p,
        frames: [...frames],
        isHit
      });
    });

    const totalRefs = pages.length;
    const hitRatio = ((hits / totalRefs) * 100).toFixed(1);
    const missRatio = ((misses / totalRefs) * 100).toFixed(1);

    let html = `
      <div class="table-responsive">
        <table class="sim-table page-table">
          <thead>
            <tr>
              <th>Ref</th>
              ${history.map(h => `<th>${h.page}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;

    for (let f = 0; f < framesCount; f++) {
      html += `<tr><td><strong>Frame ${f+1}</strong></td>`;
      history.forEach(h => {
        const val = h.frames[f];
        html += `<td>${val === -1 ? '-' : val}</td>`;
      });
      html += `</tr>`;
    }

    html += `
          <tr class="status-row">
            <td><strong>Status</strong></td>
            ${history.map(h => `<td class="${h.isHit ? 'cell-hit' : 'cell-miss'}">${h.isHit ? '<span class="badge badge-success">HIT</span>' : '<span class="badge badge-danger">FAULT</span>'}</td>`).join('')}
          </tr>
          </tbody>
        </table>
      </div>

      <div class="sim-stat-cards">
        <div class="stat-card">
          <div class="stat-title">Total Page Faults (Misses)</div>
          <div class="stat-value text-danger">${misses}</div>
          <small class="stat-hint">Miss Ratio: ${missRatio}%</small>
        </div>
        <div class="stat-card">
          <div class="stat-title">Total Page Hits</div>
          <div class="stat-value text-success">${hits}</div>
          <small class="stat-hint">Hit Ratio: ${hitRatio}%</small>
        </div>
      </div>
    `;

    document.getElementById('page-results-container').innerHTML = html;
  },

  // ==========================================
  // OS 9: Banker's Algorithm Simulator
  // ==========================================
  renderBankersAlgo: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-shield-alt"></i> Banker's Algorithm Deadlock Avoidance Simulator</h4>
          <span class="sim-badge">Safe Sequence Finder</span>
        </div>
        <p class="sim-desc">Verify system safety state by simulating Dijkstra's Banker's Algorithm with 5 processes and 3 resource types (A, B, C).</p>
        
        <div class="sim-controls">
          <button id="banker-run-btn" class="btn btn-primary"><i class="fas fa-calculator"></i> Compute Safe State</button>
          <button id="banker-req-btn" class="btn btn-warning"><i class="fas fa-hand-holding"></i> Simulate Resource Request (P1 requests [1, 0, 2])</button>
          <button id="banker-reset-btn" class="btn btn-secondary"><i class="fas fa-undo"></i> Reset to Default</button>
        </div>

        <div class="grid-2-col">
          <div>
            <h5>Allocation Matrix (A B C)</h5>
            <div id="banker-alloc-inputs"></div>
          </div>
          <div>
            <h5>Maximum Matrix (A B C)</h5>
            <div id="banker-max-inputs"></div>
          </div>
        </div>

        <div style="margin-top: 1rem;">
          <h5>Available Resources (A B C):</h5>
          <div id="banker-avail-inputs" class="flex-row gap-2"></div>
        </div>

        <div id="banker-results-container" class="sim-output-box" style="margin-top: 1.5rem;"></div>
      </div>
    `;

    const defaultAlloc = [
      [0, 1, 0],
      [2, 0, 0],
      [3, 0, 2],
      [2, 1, 1],
      [0, 0, 2]
    ];
    const defaultMax = [
      [7, 5, 3],
      [3, 2, 2],
      [9, 0, 2],
      [2, 2, 2],
      [4, 3, 3]
    ];
    const defaultAvail = [3, 3, 2];

    function populateInputs(alloc, max, avail) {
      const allocBox = document.getElementById('banker-alloc-inputs');
      const maxBox = document.getElementById('banker-max-inputs');
      const availBox = document.getElementById('banker-avail-inputs');

      allocBox.innerHTML = alloc.map((row, p) => `
        <div class="matrix-row"><span>P${p}:</span>
          <input type="number" class="sim-input-sm alloc-p${p}" value="${row[0]}" min="0">
          <input type="number" class="sim-input-sm alloc-p${p}" value="${row[1]}" min="0">
          <input type="number" class="sim-input-sm alloc-p${p}" value="${row[2]}" min="0">
        </div>
      `).join('');

      maxBox.innerHTML = max.map((row, p) => `
        <div class="matrix-row"><span>P${p}:</span>
          <input type="number" class="sim-input-sm max-p${p}" value="${row[0]}" min="0">
          <input type="number" class="sim-input-sm max-p${p}" value="${row[1]}" min="0">
          <input type="number" class="sim-input-sm max-p${p}" value="${row[2]}" min="0">
        </div>
      `).join('');

      availBox.innerHTML = `
        <input type="number" id="avail-a" class="sim-input-sm" value="${avail[0]}" min="0">
        <input type="number" id="avail-b" class="sim-input-sm" value="${avail[1]}" min="0">
        <input type="number" id="avail-c" class="sim-input-sm" value="${avail[2]}" min="0">
      `;
    }

    populateInputs(defaultAlloc, defaultMax, defaultAvail);

    document.getElementById('banker-reset-btn').onclick = () => {
      populateInputs(defaultAlloc, defaultMax, defaultAvail);
      Simulators.executeBankers(false);
    };

    document.getElementById('banker-run-btn').onclick = () => Simulators.executeBankers(false);
    document.getElementById('banker-req-btn').onclick = () => Simulators.executeBankers(true);

    Simulators.executeBankers(false);
  },

  executeBankers: function(simulateReq) {
    const n = 5, m = 3;
    const alloc = [];
    const max = [];

    for (let p = 0; p < n; p++) {
      const aInputs = document.querySelectorAll(`.alloc-p${p}`);
      const mInputs = document.querySelectorAll(`.max-p${p}`);
      alloc.push([parseInt(aInputs[0].value), parseInt(aInputs[1].value), parseInt(aInputs[2].value)]);
      max.push([parseInt(mInputs[0].value), parseInt(mInputs[1].value), parseInt(mInputs[2].value)]);
    }

    let avail = [
      parseInt(document.getElementById('avail-a').value),
      parseInt(document.getElementById('avail-b').value),
      parseInt(document.getElementById('avail-c').value)
    ];

    let logHtml = '';

    if (simulateReq) {
      const req = [1, 0, 2];
      const targetP = 1;
      logHtml += `<div class="alert alert-info"><strong>Simulating Request:</strong> Process P${targetP} requests resources [${req.join(', ')}]. Checking if Request &le; Need and Request &le; Available...</div>`;
      
      const pNeed = [max[targetP][0] - alloc[targetP][0], max[targetP][1] - alloc[targetP][1], max[targetP][2] - alloc[targetP][2]];
      if (req[0] <= pNeed[0] && req[1] <= pNeed[1] && req[2] <= pNeed[2] &&
          req[0] <= avail[0] && req[1] <= avail[1] && req[2] <= avail[2]) {
        // Pretend to allocate
        avail[0] -= req[0]; avail[1] -= req[1]; avail[2] -= req[2];
        alloc[targetP][0] += req[0]; alloc[targetP][1] += req[1]; alloc[targetP][2] += req[2];
        logHtml += `<div class="text-success"><i class="fas fa-check"></i> Request condition satisfied. Temporarily allocated resources to P${targetP}. Running Safety Check...</div>`;
      } else {
        logHtml += `<div class="alert alert-danger"><i class="fas fa-times"></i> Request CANNOT be granted immediately (exceeds need or available resources). P${targetP} must wait!</div>`;
        document.getElementById('banker-results-container').innerHTML = logHtml;
        return;
      }
    }

    // Compute Need Matrix
    const need = [];
    for (let i = 0; i < n; i++) {
      need.push([max[i][0] - alloc[i][0], max[i][1] - alloc[i][1], max[i][2] - alloc[i][2]]);
    }

    // Safety Algorithm
    const work = [...avail];
    const finish = new Array(n).fill(false);
    const safeSeq = [];
    const stepLogs = [];

    let count = 0;
    while (count < n) {
      let found = false;
      for (let i = 0; i < n; i++) {
        if (!finish[i]) {
          if (need[i][0] <= work[0] && need[i][1] <= work[1] && need[i][2] <= work[2]) {
            const oldWork = [...work];
            work[0] += alloc[i][0];
            work[1] += alloc[i][1];
            work[2] += alloc[i][2];
            finish[i] = true;
            safeSeq.push(`P${i}`);
            stepLogs.push(`Process <strong>P${i}</strong> can satisfy need [${need[i].join(', ')}] with available work [${oldWork.join(', ')}]. It executes, finishes, and releases allocation [${alloc[i].join(', ')}]. New Work = [${work.join(', ')}].`);
            found = true;
            count++;
          }
        }
      }
      if (!found) break;
    }

    const isSafe = (count === n);
    let resultBanner = isSafe 
      ? `<div class="alert alert-success"><i class="fas fa-check-circle"></i> <strong>SYSTEM IS IN A SAFE STATE!</strong><br>Safe Execution Sequence: <span class="badge badge-success font-mono" style="font-size: 1.1rem;">${safeSeq.join(' &rarr; ')}</span></div>`
      : `<div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i> <strong>DEADLOCK DETECTED! System is in an UNSAFE state.</strong><br>Unfinished processes: ${finish.map((f, i) => f ? null : 'P'+i).filter(Boolean).join(', ')}</div>`;

    let stepsHtml = `
      <div style="margin-top: 1rem;">
        <h5><i class="fas fa-list-ol"></i> Step-by-Step Safety Derivation:</h5>
        <ol class="step-list">
          ${stepLogs.map(s => `<li>${s}</li>`).join('')}
        </ol>
      </div>
    `;

    document.getElementById('banker-results-container').innerHTML = logHtml + resultBanner + stepsHtml;
  },

  // ==========================================
  // OS 8: Classical Synchronization (Producer-Consumer & Dining Philosophers)
  // ==========================================
  renderSyncVisualizer: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-sync-alt"></i> Process Synchronization Simulator</h4>
          <span class="sim-badge">Producer-Consumer &bull; Dining Philosophers</span>
        </div>
        <div class="tab-pills" style="margin-bottom: 1rem;">
          <button id="tab-prod-cons" class="tab-pill active">Producer-Consumer (Bounded Buffer)</button>
          <button id="tab-dining-phil" class="tab-pill">Dining Philosophers Problem</button>
        </div>

        <div id="sync-subview"></div>
      </div>
    `;

    const subview = document.getElementById('sync-subview');
    const tabPC = document.getElementById('tab-prod-cons');
    const tabDP = document.getElementById('tab-dining-phil');

    function showPC() {
      tabPC.classList.add('active');
      tabDP.classList.remove('active');
      subview.innerHTML = `
        <p class="sim-desc">Circular buffer of size 5 synchronized with binary mutex and counting semaphores: <code>empty</code> (slots free) and <code>full</code> (items to consume).</p>
        <div class="sim-controls">
          <button id="btn-produce" class="btn btn-primary"><i class="fas fa-plus"></i> Produce Item</button>
          <button id="btn-consume" class="btn btn-success"><i class="fas fa-minus"></i> Consume Item</button>
          <button id="btn-auto-pc" class="btn btn-secondary"><i class="fas fa-robot"></i> Auto Step</button>
        </div>
        
        <div class="sync-semaphore-bar">
          <div class="stat-card"><div class="stat-title">Mutex Lock</div><div id="pc-mutex-val" class="stat-value text-success">UNLOCKED</div></div>
          <div class="stat-card"><div class="stat-title">empty semaphore</div><div id="pc-empty-val" class="stat-value text-info">5</div></div>
          <div class="stat-card"><div class="stat-title">full semaphore</div><div id="pc-full-val" class="stat-value text-warning">0</div></div>
        </div>

        <div class="buffer-display-wrapper">
          <h5>Circular Buffer State (Size: 5):</h5>
          <div id="buffer-slots" class="buffer-slots"></div>
        </div>

        <div class="terminal-box" id="pc-log">
          <div class="term-line text-muted">// Producer-Consumer Synchronization Log initialized...</div>
        </div>
      `;

      let buffer = [null, null, null, null, null];
      let inIdx = 0, outIdx = 0, count = 0, itemCounter = 1;

      function updateUI(msg) {
        document.getElementById('pc-empty-val').innerText = 5 - count;
        document.getElementById('pc-full-val').innerText = count;
        
        const slotsDiv = document.getElementById('buffer-slots');
        slotsDiv.innerHTML = buffer.map((val, i) => `
          <div class="buffer-slot ${val !== null ? 'slot-filled' : 'slot-empty'}">
            <span class="slot-idx">Slot ${i}</span>
            <span class="slot-content">${val !== null ? 'Item #' + val : 'Empty'}</span>
            ${i === inIdx ? '<span class="pointer-badge badge-in">[IN]</span>' : ''}
            ${i === outIdx ? '<span class="pointer-badge badge-out">[OUT]</span>' : ''}
          </div>
        `).join('');

        if (msg) {
          const logDiv = document.getElementById('pc-log');
          const line = document.createElement('div');
          line.className = 'term-line';
          line.innerHTML = msg;
          logDiv.appendChild(line);
          logDiv.scrollTop = logDiv.scrollHeight;
        }
      }

      document.getElementById('btn-produce').onclick = () => {
        if (count >= 5) {
          updateUI(`<span class="text-danger">[PRODUCER BLOCKED] Buffer is FULL (empty == 0). Must wait for consumer!</span>`);
          return;
        }
        const item = itemCounter++;
        buffer[inIdx] = item;
        const placedAt = inIdx;
        inIdx = (inIdx + 1) % 5;
        count++;
        updateUI(`<span class="text-primary">[PRODUCER] sem_wait(empty) &rarr; lock(mutex) &rarr; Wrote Item #${item} to Slot ${placedAt} &rarr; unlock(mutex) &rarr; sem_post(full)</span>`);
      };

      document.getElementById('btn-consume').onclick = () => {
        if (count <= 0) {
          updateUI(`<span class="text-danger">[CONSUMER BLOCKED] Buffer is EMPTY (full == 0). Must wait for producer!</span>`);
          return;
        }
        const item = buffer[outIdx];
        buffer[outIdx] = null;
        const takenFrom = outIdx;
        outIdx = (outIdx + 1) % 5;
        count--;
        updateUI(`<span class="text-success">[CONSUMER] sem_wait(full) &rarr; lock(mutex) &rarr; Consumed Item #${item} from Slot ${takenFrom} &rarr; unlock(mutex) &rarr; sem_post(empty)</span>`);
      };

      document.getElementById('btn-auto-pc').onclick = () => {
        if (Math.random() > 0.4 && count < 5) {
          document.getElementById('btn-produce').click();
        } else {
          document.getElementById('btn-consume').click();
        }
      };

      updateUI();
    }

    function showDP() {
      tabDP.classList.add('active');
      tabPC.classList.remove('active');
      subview.innerHTML = `
        <p class="sim-desc">5 Philosophers sit around a circular table. Each needs both adjacent chopsticks to eat. Symmetry is broken to prevent circular deadlock.</p>
        <div class="sim-controls">
          <button id="dp-step-btn" class="btn btn-primary"><i class="fas fa-play"></i> Simulate Next State</button>
        </div>

        <div class="dining-table-container">
          <div class="dining-table">
            <div class="dining-center">Table</div>
            <div class="philosopher-node phil-0" id="phil-0">P0<br><small>Thinking</small></div>
            <div class="philosopher-node phil-1" id="phil-1">P1<br><small>Thinking</small></div>
            <div class="philosopher-node phil-2" id="phil-2">P2<br><small>Thinking</small></div>
            <div class="philosopher-node phil-3" id="phil-3">P3<br><small>Thinking</small></div>
            <div class="philosopher-node phil-4" id="phil-4">P4<br><small>Thinking</small></div>
          </div>
        </div>

        <div class="terminal-box" id="dp-log">
          <div class="term-line text-muted">// Dining Philosophers State Machine Active...</div>
        </div>
      `;

      const states = ['THINKING', 'HUNGRY', 'EATING'];
      const philStates = [0, 0, 0, 0, 0];
      const chopsticks = [true, true, true, true, true]; // true = free

      function renderDP(msg) {
        for (let i = 0; i < 5; i++) {
          const el = document.getElementById(`phil-${i}`);
          el.className = `philosopher-node phil-${i} state-${states[philStates[i]].toLowerCase()}`;
          el.innerHTML = `<strong>P${i}</strong><br><small>${states[philStates[i]]}</small>`;
        }
        if (msg) {
          const logDiv = document.getElementById('dp-log');
          const line = document.createElement('div');
          line.className = 'term-line';
          line.innerHTML = msg;
          logDiv.appendChild(line);
          logDiv.scrollTop = logDiv.scrollHeight;
        }
      }

      document.getElementById('dp-step-btn').onclick = () => {
        const p = Math.floor(Math.random() * 5);
        const left = p;
        const right = (p + 1) % 5;

        if (philStates[p] === 0) { // THINKING -> HUNGRY
          philStates[p] = 1;
          renderDP(`Philosopher P${p} is now <span class="text-warning">HUNGRY</span>.`);
        } else if (philStates[p] === 1) { // HUNGRY -> EATING (if chopsticks free)
          if (chopsticks[left] && chopsticks[right]) {
            chopsticks[left] = false;
            chopsticks[right] = false;
            philStates[p] = 2;
            renderDP(`Philosopher P${p} picked up chopsticks ${left} & ${right} and is now <span class="text-success">EATING</span>.`);
          } else {
            renderDP(`Philosopher P${p} is waiting: adjacent chopsticks occupied.`);
          }
        } else if (philStates[p] === 2) { // EATING -> THINKING
          chopsticks[left] = true;
          chopsticks[right] = true;
          philStates[p] = 0;
          renderDP(`Philosopher P${p} finished eating, put down chopsticks ${left} & ${right}, and returned to <span class="text-info">THINKING</span>.`);
        }
      };

      renderDP();
    }

    tabPC.onclick = showPC;
    tabDP.onclick = showDP;
    showPC();
  },

  // ==========================================
  // OS 6: Multithreading & Race Condition Simulator
  // ==========================================
  renderThreadsRace: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-network-wired"></i> POSIX Thread Race Condition Simulator</h4>
          <span class="sim-badge">Mutex Lock vs Unsynchronized</span>
        </div>
        <p class="sim-desc">Spawn 2 concurrent threads each incrementing a shared counter 1,000 times. See the race condition occur when Mutex is OFF vs guaranteed accuracy when Mutex is ON.</p>
        
        <div class="sim-controls">
          <div class="form-group">
            <label>Mutex Lock:</label>
            <select id="thread-mutex-toggle" class="sim-select">
              <option value="enabled" selected>ENABLED (Thread Safe)</option>
              <option value="disabled">DISABLED (Race Condition Hazard!)</option>
            </select>
          </div>
          <button id="thread-run-btn" class="btn btn-primary"><i class="fas fa-play"></i> Run Threads</button>
        </div>

        <div class="sim-stat-cards">
          <div class="stat-card">
            <div class="stat-title">Expected Counter Value</div>
            <div class="stat-value text-info">2000</div>
            <small class="stat-hint">2 threads &times; 1000 increments</small>
          </div>
          <div class="stat-card">
            <div class="stat-title">Actual Counter Value</div>
            <div id="thread-actual-counter" class="stat-value text-primary">0</div>
            <small id="thread-hazard-label" class="stat-hint">Ready to run</small>
          </div>
        </div>

        <div class="terminal-box" id="thread-log">
          <div class="term-line text-muted">// Thread runtime log ready...</div>
        </div>
      </div>
    `;

    document.getElementById('thread-run-btn').onclick = () => {
      const mutexEnabled = document.getElementById('thread-mutex-toggle').value === 'enabled';
      const log = document.getElementById('thread-log');
      log.innerHTML = `<div class="term-line text-muted">[Main] pthread_create(&t1) and pthread_create(&t2) launched...</div>`;

      let counter = 0;
      if (mutexEnabled) {
        counter = 2000;
        document.getElementById('thread-actual-counter').innerText = counter;
        document.getElementById('thread-actual-counter').className = 'stat-value text-success';
        document.getElementById('thread-hazard-label').innerHTML = `<span class="text-success"><i class="fas fa-check"></i> Mutex locked critical sections! Zero race condition.</span>`;
        log.innerHTML += `
          <div class="term-line text-success">[Thread 1] Acquired mutex, performed 1000 safe increments, unlocked mutex.</div>
          <div class="term-line text-success">[Thread 2] Acquired mutex, performed 1000 safe increments, unlocked mutex.</div>
          <div class="term-line text-info">[Main] pthread_join() completed. Final counter = 2000.</div>
        `;
      } else {
        // Simulate race condition lost updates
        const lost = Math.floor(Math.random() * 400) + 150;
        counter = 2000 - lost;
        document.getElementById('thread-actual-counter').innerText = counter;
        document.getElementById('thread-actual-counter').className = 'stat-value text-danger';
        document.getElementById('thread-hazard-label').innerHTML = `<span class="text-danger"><i class="fas fa-times-circle"></i> Race Condition detected! ${lost} increments were lost due to unsynchronized interleaving.</span>`;
        log.innerHTML += `
          <div class="term-line text-danger">[Thread 1 &amp; 2] Concurrent read-modify-write on shared variable without mutex!</div>
          <div class="term-line text-danger">[HAZARD] Thread 1 and Thread 2 read same value simultaneously and overwrote each other's increments.</div>
          <div class="term-line text-warning">[Main] Final counter = ${counter} (Expected: 2000, Lost: ${lost}).</div>
        `;
      }
    };
  },

  // ==========================================
  // OS 1 & 2: VFS System Call & Process Tree Simulator
  // ==========================================
  renderVfsSimulator: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-terminal"></i> Interactive Linux VFS &amp; System Calls Runner</h4>
          <span class="sim-badge">open &bull; write &bull; lseek &bull; read &bull; stat</span>
        </div>
        <p class="sim-desc">Simulate low-level kernel system calls on a virtual file system. Type commands or click quick actions below.</p>
        
        <div class="quick-chips">
          <button class="chip" onclick="Simulators.runVfsCmd('open lab.txt O_CREAT')">open("lab.txt", O_CREAT)</button>
          <button class="chip" onclick="Simulators.runVfsCmd('write 3 CBIT_OS_Lab')">write(3, "CBIT_OS_Lab")</button>
          <button class="chip" onclick="Simulators.runVfsCmd('lseek 3 0 SEEK_SET')">lseek(3, 0, SEEK_SET)</button>
          <button class="chip" onclick="Simulators.runVfsCmd('read 3')">read(3)</button>
          <button class="chip" onclick="Simulators.runVfsCmd('stat lab.txt')">stat("lab.txt")</button>
          <button class="chip" onclick="Simulators.runVfsCmd('close 3')">close(3)</button>
        </div>

        <div class="terminal-box" id="vfs-term" style="min-height: 220px;">
          <div class="term-line text-muted">[Kernel VFS Simulator Initialized. Type 'help' for commands.]</div>
        </div>

        <div class="term-input-row">
          <span class="term-prompt">student@cselab:~$</span>
          <input type="text" id="vfs-input" class="term-input" placeholder="e.g. open test.txt O_CREAT">
          <button id="vfs-submit-btn" class="btn btn-primary btn-sm">Exec</button>
        </div>
      </div>
    `;

    document.getElementById('vfs-submit-btn').onclick = () => {
      const inp = document.getElementById('vfs-input');
      Simulators.runVfsCmd(inp.value);
      inp.value = '';
    };

    document.getElementById('vfs-input').onkeydown = (e) => {
      if (e.key === 'Enter') {
        const inp = document.getElementById('vfs-input');
        Simulators.runVfsCmd(inp.value);
        inp.value = '';
      }
    };
  },

  vfsState: { files: {}, openFds: { 0: 'stdin', 1: 'stdout', 2: 'stderr' }, nextFd: 3 },

  runVfsCmd: function(cmdStr) {
    if (!cmdStr || !cmdStr.trim()) return;
    const term = document.getElementById('vfs-term');
    const line = document.createElement('div');
    line.className = 'term-line font-mono';
    line.innerHTML = `<span class="term-prompt">student@cselab:~$</span> ${cmdStr}`;
    term.appendChild(line);

    const parts = cmdStr.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const resp = document.createElement('div');
    resp.className = 'term-line';

    if (cmd === 'open') {
      const name = parts[1] || 'file.txt';
      const fd = Simulators.vfsState.nextFd++;
      Simulators.vfsState.openFds[fd] = { name, offset: 0 };
      if (!Simulators.vfsState.files[name]) {
        Simulators.vfsState.files[name] = { content: '', inode: Math.floor(Math.random() * 800000) + 100000, mode: '0644' };
      }
      resp.innerHTML = `<span class="text-success">[+] open("${name}") returned File Descriptor: ${fd}</span>`;
    } else if (cmd === 'write') {
      const fd = parseInt(parts[1]);
      const data = parts.slice(2).join(' ') || 'Sample Data';
      const fileRef = Simulators.vfsState.openFds[fd];
      if (!fileRef) {
        resp.innerHTML = `<span class="text-danger">[-] write() error: Bad file descriptor ${parts[1]}</span>`;
      } else {
        const f = Simulators.vfsState.files[fileRef.name];
        f.content += data;
        fileRef.offset += data.length;
        resp.innerHTML = `<span class="text-success">[+] write(${fd}) wrote ${data.length} bytes to '${fileRef.name}'. (Offset: ${fileRef.offset})</span>`;
      }
    } else if (cmd === 'lseek') {
      const fd = parseInt(parts[1]);
      const off = parseInt(parts[2]) || 0;
      const whence = parts[3] || 'SEEK_SET';
      const fileRef = Simulators.vfsState.openFds[fd];
      if (!fileRef) {
        resp.innerHTML = `<span class="text-danger">[-] lseek() error: Bad file descriptor ${parts[1]}</span>`;
      } else {
        fileRef.offset = off;
        resp.innerHTML = `<span class="text-success">[+] lseek(${fd}, ${off}, ${whence}) = ${off} (Offset reset)</span>`;
      }
    } else if (cmd === 'read') {
      const fd = parseInt(parts[1]);
      const fileRef = Simulators.vfsState.openFds[fd];
      if (!fileRef) {
        resp.innerHTML = `<span class="text-danger">[-] read() error: Bad file descriptor ${parts[1]}</span>`;
      } else {
        const content = Simulators.vfsState.files[fileRef.name].content.slice(fileRef.offset);
        resp.innerHTML = `<span class="text-info">[+] read(${fd}) returned: "${content}" (${content.length} bytes)</span>`;
      }
    } else if (cmd === 'stat') {
      const name = parts[1] || 'lab.txt';
      const f = Simulators.vfsState.files[name];
      if (!f) {
        resp.innerHTML = `<span class="text-danger">[-] stat("${name}"): No such file or directory</span>`;
      } else {
        resp.innerHTML = `<span class="text-primary">[+] stat("${name}") &bull; Size: ${f.content.length} bytes &bull; Inode: ${f.inode} &bull; Mode: ${f.mode} &bull; Links: 1</span>`;
      }
    } else if (cmd === 'close') {
      const fd = parseInt(parts[1]);
      if (Simulators.vfsState.openFds[fd]) {
        delete Simulators.vfsState.openFds[fd];
        resp.innerHTML = `<span class="text-success">[+] close(${fd}) succeeded. Descriptor closed.</span>`;
      } else {
        resp.innerHTML = `<span class="text-danger">[-] close(${fd}) error: Invalid descriptor</span>`;
      }
    } else {
      resp.innerHTML = `<span class="text-warning">Available: open &lt;file&gt;, write &lt;fd&gt; &lt;text&gt;, lseek &lt;fd&gt; &lt;offset&gt;, read &lt;fd&gt;, stat &lt;file&gt;, close &lt;fd&gt;</span>`;
    }

    term.appendChild(resp);
    term.scrollTop = term.scrollHeight;
  },

  // ==========================================
  // OS 2: Process Tree Simulator
  // ==========================================
  renderProcessTree: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-sitemap"></i> Process Tree &amp; Zombie / Orphan Lifecycle</h4>
          <span class="sim-badge">fork &bull; wait &bull; exit</span>
        </div>
        <p class="sim-desc">Spawn processes using <code>fork()</code>, demonstrate zombie state creation when parent doesn't call <code>wait()</code>, and orphan adoption by Init (PID 1).</p>
        
        <div class="sim-controls">
          <button id="btn-fork-proc" class="btn btn-primary"><i class="fas fa-code-branch"></i> Call fork()</button>
          <button id="btn-wait-proc" class="btn btn-success"><i class="fas fa-check-double"></i> Call wait() [Reap Zombie]</button>
          <button id="btn-kill-parent" class="btn btn-danger"><i class="fas fa-user-slash"></i> Terminate Parent (Make Orphan)</button>
          <button id="btn-reset-proc" class="btn btn-secondary"><i class="fas fa-redo"></i> Reset Tree</button>
        </div>

        <div class="proc-tree-display" id="proc-tree-display"></div>
        <div class="terminal-box" id="proc-log"><div class="term-line text-muted">[Process Tree Manager Initialized]</div></div>
      </div>
    `;

    let procState = {
      parentPid: 1024,
      children: []
    };

    function updateTree(msg) {
      const disp = document.getElementById('proc-tree-display');
      disp.innerHTML = `
        <div class="proc-node node-init">
          <strong>Init System</strong><br><small>PID: 1</small>
        </div>
        <div class="proc-branch">
          <div class="proc-node ${procState.parentDead ? 'node-dead' : 'node-parent'}">
            <strong>Parent Process</strong><br>
            <small>PID: ${procState.parentPid}</small><br>
            <span class="badge ${procState.parentDead ? 'badge-danger' : 'badge-primary'}">${procState.parentDead ? 'TERMINATED' : 'RUNNING'}</span>
          </div>
          <div class="proc-children">
            ${procState.children.map(c => `
              <div class="proc-node ${c.status === 'zombie' ? 'node-zombie' : c.status === 'orphan' ? 'node-orphan' : 'node-child'}">
                <strong>Child</strong><br><small>PID: ${c.pid}</small><br>
                <span class="badge ${c.status === 'zombie' ? 'badge-danger' : c.status === 'orphan' ? 'badge-warning' : 'badge-success'}">${c.status.toUpperCase()}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      if (msg) {
        const log = document.getElementById('proc-log');
        const l = document.createElement('div');
        l.className = 'term-line';
        l.innerHTML = msg;
        log.appendChild(l);
        log.scrollTop = log.scrollHeight;
      }
    }

    document.getElementById('btn-fork-proc').onclick = () => {
      const nextPid = 2000 + procState.children.length + 1;
      procState.children.push({ pid: nextPid, status: 'zombie' });
      updateTree(`<span class="text-primary">[fork()] Created Child PID ${nextPid}. Child finished execution without wait() &rarr; currently ZOMBIE in process table!</span>`);
    };

    document.getElementById('btn-wait-proc').onclick = () => {
      const z = procState.children.find(c => c.status === 'zombie');
      if (z) {
        z.status = 'reaped';
        procState.children = procState.children.filter(c => c.status !== 'reaped');
        updateTree(`<span class="text-success">[wait()] Parent collected exit code for Child PID ${z.pid}. Zombie reaped from process table!</span>`);
      } else {
        updateTree(`<span class="text-muted">[wait()] No zombie children currently waiting to be reaped.</span>`);
      }
    };

    document.getElementById('btn-kill-parent').onclick = () => {
      procState.parentDead = true;
      procState.children.forEach(c => {
        if (c.status !== 'reaped') c.status = 'orphan';
      });
      updateTree(`<span class="text-danger">[exit()] Parent terminated! Remaining children are now ORPHANS and adopted by init (PID 1).</span>`);
    };

    document.getElementById('btn-reset-proc').onclick = () => {
      procState = { parentPid: 1024, children: [], parentDead: false };
      updateTree(`<span class="text-info">Process tree reset.</span>`);
    };

    updateTree();
  },

  // ==========================================
  // OS 3: Shell Script Runner
  // ==========================================
  renderShellRunner: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-code"></i> Live Bash Shell Script Runner</h4>
          <span class="sim-badge">Bash Terminal Emulator</span>
        </div>
        <p class="sim-desc">Execute practical shell scripts from CBIT syllabus in a live terminal simulator.</p>
        
        <div class="sim-controls">
          <div class="form-group">
            <label>Select Script:</label>
            <select id="shell-script-select" class="sim-select">
              <option value="evenodd">1. Even or Odd Checker</option>
              <option value="prime" selected>2. Prime Number Checker</option>
              <option value="fact">3. Factorial Calculator</option>
              <option value="fibo">4. Fibonacci Generator</option>
              <option value="palin">5. Palindrome Number</option>
            </select>
          </div>
          <div class="form-group">
            <label>Input Argument:</label>
            <input type="number" id="shell-arg-input" class="sim-input" value="17" min="0">
          </div>
          <button id="shell-run-btn" class="btn btn-primary"><i class="fas fa-terminal"></i> Execute Script</button>
        </div>

        <div class="terminal-box" id="shell-term-box">
          <div class="term-line text-muted">student@cselab:~$ ./run_script.sh</div>
        </div>
      </div>
    `;

    document.getElementById('shell-run-btn').onclick = () => {
      const script = document.getElementById('shell-script-select').value;
      const num = parseInt(document.getElementById('shell-arg-input').value) || 0;
      const term = document.getElementById('shell-term-box');

      let cmd = '', output = '';
      if (script === 'evenodd') {
        cmd = `./evenodd.sh ${num}`;
        output = (num % 2 === 0) ? `${num} is an EVEN number.` : `${num} is an ODD number.`;
      } else if (script === 'prime') {
        cmd = `./prime.sh ${num}`;
        if (num <= 1) {
          output = `${num} is NEITHER prime nor composite.`;
        } else {
          let isP = true;
          for (let i = 2; i * i <= num; i++) {
            if (num % i === 0) { isP = false; break; }
          }
          output = isP ? `${num} is a PRIME number.` : `${num} is NOT a prime number.`;
        }
      } else if (script === 'fact') {
        cmd = `./factorial.sh ${num}`;
        let f = 1;
        for (let i = 1; i <= Math.min(num, 15); i++) f *= i;
        output = `Factorial of ${num} (${num}!) = ${f}`;
      } else if (script === 'fibo') {
        cmd = `./fibonacci.sh ${num}`;
        let a = 0, b = 1, res = [];
        for (let i = 0; i < Math.min(num, 20); i++) {
          res.push(a);
          let fn = a + b;
          a = b;
          b = fn;
        }
        output = `Fibonacci Series (${num} terms): ${res.join(' ')}`;
      } else if (script === 'palin') {
        cmd = `./palindrome.sh ${num}`;
        const s = num.toString();
        const rev = s.split('').reverse().join('');
        output = (s === rev) ? `${num} is a PALINDROME.` : `${num} is NOT a palindrome (reversed: ${rev}).`;
      }

      term.innerHTML += `
        <div class="term-line font-mono"><span class="term-prompt">student@cselab:~$</span> ${cmd}</div>
        <div class="term-line text-success">${output}</div>
      `;
      term.scrollTop = term.scrollHeight;
    };
  },

  // ==========================================
  // OS 10: File Allocation Simulator
  // ==========================================
  renderFileAlloc: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-hdd"></i> Disk File Allocation Visualizer</h4>
          <span class="sim-badge">Contiguous &bull; Linked &bull; Indexed</span>
        </div>
        <p class="sim-desc">Visualize disk block allocation schemes across a 32-block storage device.</p>
        
        <div class="sim-controls">
          <div class="form-group">
            <label>Allocation Strategy:</label>
            <select id="disk-strat-select" class="sim-select">
              <option value="contiguous" selected>Contiguous (Sequential) Allocation</option>
              <option value="linked">Linked List Allocation</option>
              <option value="indexed">Indexed Allocation</option>
            </select>
          </div>
          <div class="form-group">
            <label>File Name:</label>
            <input type="text" id="disk-file-name" class="sim-input" value="notes.txt">
          </div>
          <div class="form-group">
            <label>Blocks Needed:</label>
            <input type="number" id="disk-block-count" class="sim-input-sm" value="4" min="1" max="10">
          </div>
          <button id="disk-alloc-btn" class="btn btn-primary"><i class="fas fa-save"></i> Allocate File</button>
          <button id="disk-reset-btn" class="btn btn-secondary"><i class="fas fa-trash"></i> Format Disk</button>
        </div>

        <div class="disk-grid-wrapper">
          <h5>Disk Blocks Grid (32 Blocks):</h5>
          <div class="disk-blocks-grid" id="disk-blocks-grid"></div>
        </div>

        <div id="disk-file-table" class="table-responsive" style="margin-top: 1rem;"></div>
      </div>
    `;

    const totalBlocks = 32;
    let disk = new Array(totalBlocks).fill(null); // null = free, else { name, color, type, next, indexBlock }
    let files = [];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

    function renderDisk() {
      const grid = document.getElementById('disk-blocks-grid');
      grid.innerHTML = disk.map((blk, i) => `
        <div class="disk-block ${blk ? 'disk-occupied' : 'disk-free'}" style="${blk ? 'background-color:' + blk.color + ';' : ''}">
          <span class="block-num">${i}</span>
          <span class="block-label">${blk ? blk.name : 'Free'}</span>
        </div>
      `).join('');

      const tbl = document.getElementById('disk-file-table');
      tbl.innerHTML = `
        <table class="sim-table">
          <thead><tr><th>File Name</th><th>Strategy</th><th>Blocks Allocated</th><th>Color</th></tr></thead>
          <tbody>
            ${files.map(f => `
              <tr>
                <td><strong>${f.name}</strong></td>
                <td>${f.type}</td>
                <td>${f.blocks.join(', ')}</td>
                <td><span class="color-badge" style="background:${f.color};"></span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    document.getElementById('disk-alloc-btn').onclick = () => {
      const strat = document.getElementById('disk-strat-select').value;
      const name = document.getElementById('disk-file-name').value || 'file.dat';
      const count = parseInt(document.getElementById('disk-block-count').value) || 3;
      const color = colors[files.length % colors.length];

      if (strat === 'contiguous') {
        let start = -1;
        for (let i = 0; i <= totalBlocks - count; i++) {
          let freeSpan = true;
          for (let k = 0; k < count; k++) {
            if (disk[i + k] !== null) { freeSpan = false; break; }
          }
          if (freeSpan) { start = i; break; }
        }
        if (start === -1) {
          alert('Cannot allocate contiguously: Not enough contiguous space (External Fragmentation)!');
          return;
        }
        const blks = [];
        for (let k = 0; k < count; k++) {
          disk[start + k] = { name, color, type: 'Contiguous' };
          blks.push(start + k);
        }
        files.push({ name, type: 'Contiguous', blocks: blks, color });
      } else if (strat === 'linked') {
        const freeIndices = [];
        disk.forEach((b, i) => { if (b === null) freeIndices.push(i); });
        if (freeIndices.length < count) {
          alert('Disk full!');
          return;
        }
        const blks = freeIndices.slice(0, count);
        blks.forEach((idx, i) => {
          disk[idx] = { name, color, type: 'Linked', next: (i < count - 1) ? blks[i + 1] : -1 };
        });
        files.push({ name, type: 'Linked', blocks: blks, color });
      } else if (strat === 'indexed') {
        const freeIndices = [];
        disk.forEach((b, i) => { if (b === null) freeIndices.push(i); });
        if (freeIndices.length < count + 1) { // 1 index block + data blocks
          alert('Not enough blocks for Index block and data blocks!');
          return;
        }
        const indexBlock = freeIndices[0];
        const dataBlocks = freeIndices.slice(1, count + 1);
        disk[indexBlock] = { name: name + ' [IDX]', color, type: 'IndexBlock' };
        dataBlocks.forEach(idx => {
          disk[idx] = { name, color, type: 'Indexed' };
        });
        files.push({ name, type: 'Indexed', blocks: [indexBlock + ' (Index)', ...dataBlocks], color });
      }

      renderDisk();
    };

    document.getElementById('disk-reset-btn').onclick = () => {
      disk = new Array(totalBlocks).fill(null);
      files = [];
      renderDisk();
    };

    renderDisk();
  },

  // ==========================================
  // CN 3: CRC Binary Division Simulator
  // ==========================================
  renderCrcCalc: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-calculator"></i> CRC Modulo-2 Division &amp; Error Injection Simulator</h4>
          <span class="sim-badge">Sender &bull; Receiver &bull; Bit-Flip</span>
        </div>
        <p class="sim-desc">Enter a binary data word and generator polynomial. Watch full XOR division step-by-step, generate the codeword, and simulate transmission bit errors.</p>
        
        <div class="sim-controls">
          <div class="form-group">
            <label>Data Word (Binary):</label>
            <input type="text" id="crc-data-input" class="sim-input" value="100100">
          </div>
          <div class="form-group">
            <label>Generator Polynomial:</label>
            <input type="text" id="crc-poly-input" class="sim-input" value="1101">
          </div>
          <button id="crc-calc-btn" class="btn btn-primary"><i class="fas fa-play"></i> Compute CRC</button>
        </div>

        <div id="crc-results-container" class="sim-output-box"></div>
      </div>
    `;

    document.getElementById('crc-calc-btn').onclick = () => Simulators.executeCrc();
    Simulators.executeCrc();
  },

  executeCrc: function() {
    const data = document.getElementById('crc-data-input').value.trim();
    const poly = document.getElementById('crc-poly-input').value.trim();
    if (!/^[01]+$/.test(data) || !/^[01]+$/.test(poly)) {
      alert('Data and polynomial must only contain binary digits (0 and 1)!');
      return;
    }

    const n = poly.length;
    const padded = data + '0'.repeat(n - 1);

    function mod2Div(dividend, divisor) {
      let cur = dividend.slice(0, divisor.length).split('');
      for (let i = divisor.length; i <= dividend.length; i++) {
        if (cur[0] === '1') {
          for (let j = 0; j < divisor.length; j++) {
            cur[j] = (cur[j] === divisor[j]) ? '0' : '1';
          }
        }
        cur.shift();
        if (i < dividend.length) cur.push(dividend[i]);
      }
      return cur.join('');
    }

    const remainder = mod2Div(padded, poly);
    const codeword = data + remainder;

    let html = `
      <div class="grid-2-col">
        <div class="stat-card">
          <div class="stat-title">Sender CRC Checksum</div>
          <div class="stat-value text-primary font-mono">${remainder}</div>
          <small class="stat-hint">Modulo-2 XOR Remainder (${n-1} bits)</small>
        </div>
        <div class="stat-card">
          <div class="stat-title">Transmitted Codeword</div>
          <div class="stat-value text-success font-mono">${codeword}</div>
          <small class="stat-hint">Data (${data}) + CRC (${remainder})</small>
        </div>
      </div>

      <div style="margin-top: 1.5rem;">
        <h5><i class="fas fa-satellite-dish"></i> Receiver Verification &amp; Error Injection:</h5>
        <div class="flex-row gap-2" style="align-items: center; margin-bottom: 1rem;">
          <button id="crc-verify-valid-btn" class="btn btn-success"><i class="fas fa-check"></i> Verify Without Error</button>
          <button id="crc-inject-err-btn" class="btn btn-danger"><i class="fas fa-bug"></i> Inject Bit Flip Error</button>
        </div>
        <div id="crc-receiver-verdict" class="terminal-box" style="min-height: 80px;"></div>
      </div>
    `;

    document.getElementById('crc-results-container').innerHTML = html;

    function verifyReceiver(cw, hasErr) {
      const recRem = mod2Div(cw, poly);
      const isClean = !recRem.includes('1');
      const box = document.getElementById('crc-receiver-verdict');
      box.innerHTML = `
        <div class="term-line">[Receiver] Received Codeword: <strong class="font-mono ${hasErr ? 'text-danger' : 'text-success'}">${cw}</strong></div>
        <div class="term-line">[Receiver] Modulo-2 Division Remainder: <strong class="font-mono">${recRem}</strong></div>
        <div class="term-line ${isClean ? 'text-success' : 'text-danger'}">
          ${isClean ? '<i class="fas fa-check-circle"></i> VERDICT: Remainder is ZERO. Frame is ERROR-FREE and ACCEPTED!' : '<i class="fas fa-times-circle"></i> VERDICT: Non-zero remainder detected! Frame CORRUPTED and DISCARDED.'}
        </div>
      `;
    }

    document.getElementById('crc-verify-valid-btn').onclick = () => verifyReceiver(codeword, false);
    document.getElementById('crc-inject-err-btn').onclick = () => {
      const flipped = (codeword[0] === '1' ? '0' : '1') + codeword.slice(1);
      verifyReceiver(flipped, true);
    };

    verifyReceiver(codeword, false);
  },

  // ==========================================
  // CN 12: Socket Programming Dual Terminal Simulator
  // ==========================================
  renderSocketTerminal: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-plug"></i> Interactive Dual-Terminal Socket Simulator</h4>
          <span class="sim-badge">server.py &bull; client.py</span>
        </div>
        <p class="sim-desc">Experience real-time execution of the exact Python TCP socket code provided in your syllabus. The left terminal executes <code>run_server()</code> and the right terminal executes <code>run_client()</code>.</p>
        
        <div class="sim-controls">
          <button id="socket-start-server" class="btn btn-success"><i class="fas fa-server"></i> 1. Start Server (Port 8000)</button>
          <button id="socket-connect-client" class="btn btn-primary" disabled><i class="fas fa-laptop"></i> 2. Connect Client</button>
          <button id="socket-send-hello" class="btn btn-secondary" disabled>Send "Hello Server!"</button>
          <button id="socket-send-cbit" class="btn btn-secondary" disabled>Send "CBIT CN Lab"</button>
          <button id="socket-send-close" class="btn btn-danger" disabled>Send "close"</button>
          <button id="socket-reset" class="btn btn-secondary"><i class="fas fa-redo"></i> Reset</button>
        </div>

        <div class="term-split-grid">
          <div>
            <div class="term-title-bar"><i class="fas fa-terminal"></i> Terminal 1: python server.py</div>
            <div class="terminal-box" id="sock-term-server" style="min-height: 250px;">
              <div class="term-line text-muted">// Server terminal waiting to start...</div>
            </div>
          </div>
          <div>
            <div class="term-title-bar"><i class="fas fa-terminal"></i> Terminal 2: python client.py</div>
            <div class="terminal-box" id="sock-term-client" style="min-height: 250px;">
              <div class="term-line text-muted">// Client terminal waiting for server...</div>
            </div>
          </div>
        </div>

        <div class="term-input-row" style="margin-top: 1rem;">
          <span class="term-prompt">Client Input:</span>
          <input type="text" id="sock-custom-msg" class="term-input" placeholder="Type custom message to send..." disabled>
          <button id="sock-send-custom" class="btn btn-primary btn-sm" disabled>Send</button>
        </div>
      </div>
    `;

    let serverRunning = false;
    let clientConnected = false;

    const sTerm = document.getElementById('sock-term-server');
    const cTerm = document.getElementById('sock-term-client');

    function logS(msg) {
      sTerm.innerHTML += `<div class="term-line font-mono">${msg}</div>`;
      sTerm.scrollTop = sTerm.scrollHeight;
    }
    function logC(msg) {
      cTerm.innerHTML += `<div class="term-line font-mono">${msg}</div>`;
      cTerm.scrollTop = cTerm.scrollHeight;
    }

    document.getElementById('socket-start-server').onclick = () => {
      serverRunning = true;
      logS(`<span class="term-prompt">student@cselab:~$</span> python server.py`);
      logS(`Listening on 127.0.0.1:8000`);
      document.getElementById('socket-start-server').disabled = true;
      document.getElementById('socket-connect-client').disabled = false;
    };

    document.getElementById('socket-connect-client').onclick = () => {
      clientConnected = true;
      logC(`<span class="term-prompt">student@cselab:~$</span> python client.py`);
      logC(`[+] Connected to 127.0.0.1:8000`);
      logS(`Accepted connection from 127.0.0.1:54128`);

      document.getElementById('socket-connect-client').disabled = true;
      document.getElementById('socket-send-hello').disabled = false;
      document.getElementById('socket-send-cbit').disabled = false;
      document.getElementById('socket-send-close').disabled = false;
      document.getElementById('sock-custom-msg').disabled = false;
      document.getElementById('sock-send-custom').disabled = false;
    };

    function sendMessage(msg) {
      if (!clientConnected) return;
      logC(`<span class="term-prompt">Enter message:</span> ${msg}`);
      
      if (msg.toLowerCase() === 'close') {
        logS(`Received: ${msg}`);
        logS(`[Server] Sent: "closed" &amp; closing sockets...`);
        logC(`Received: closed`);
        logC(`Connection to server closed`);
        logS(`Connection to client closed`);
        clientConnected = false;
        serverRunning = false;
        document.getElementById('socket-send-hello').disabled = true;
        document.getElementById('socket-send-cbit').disabled = true;
        document.getElementById('socket-send-close').disabled = true;
        document.getElementById('sock-custom-msg').disabled = true;
        document.getElementById('sock-send-custom').disabled = true;
      } else {
        logS(`Received: ${msg}`);
        logS(`[Server] Sent: "accepted"`);
        logC(`Received: accepted`);
      }
    }

    document.getElementById('socket-send-hello').onclick = () => sendMessage('Hello Server!');
    document.getElementById('socket-send-cbit').onclick = () => sendMessage('CBIT CN Lab 2026');
    document.getElementById('socket-send-close').onclick = () => sendMessage('close');

    document.getElementById('sock-send-custom').onclick = () => {
      const inp = document.getElementById('sock-custom-msg');
      if (inp.value.trim()) {
        sendMessage(inp.value.trim());
        inp.value = '';
      }
    };

    document.getElementById('socket-reset').onclick = () => {
      serverRunning = false;
      clientConnected = false;
      sTerm.innerHTML = `<div class="term-line text-muted">// Server reset. Click 'Start Server' to begin.</div>`;
      cTerm.innerHTML = `<div class="term-line text-muted">// Client reset.</div>`;
      document.getElementById('socket-start-server').disabled = false;
      document.getElementById('socket-connect-client').disabled = true;
      document.getElementById('socket-send-hello').disabled = true;
      document.getElementById('socket-send-cbit').disabled = true;
      document.getElementById('socket-send-close').disabled = true;
      document.getElementById('sock-custom-msg').disabled = true;
      document.getElementById('sock-send-custom').disabled = true;
    };
  },

  // ==========================================
  // CN 1: Network CLI Terminal Simulator
  // ==========================================
  renderNetworkCli: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-terminal"></i> Network Diagnostics CLI Simulator</h4>
          <span class="sim-badge">ping &bull; arp &bull; tracert &bull; netstat</span>
        </div>
        <p class="sim-desc">Execute practical networking diagnostic commands. Click quick chips or type commands in the interactive terminal.</p>
        
        <div class="quick-chips">
          <button class="chip" onclick="Simulators.runNetCli('ping 8.8.8.8')">ping 8.8.8.8</button>
          <button class="chip" onclick="Simulators.runNetCli('ipconfig /all')">ipconfig /all</button>
          <button class="chip" onclick="Simulators.runNetCli('arp -a')">arp -a</button>
          <button class="chip" onclick="Simulators.runNetCli('netstat -ano')">netstat -ano</button>
          <button class="chip" onclick="Simulators.runNetCli('tracert cbit.ac.in')">tracert cbit.ac.in</button>
          <button class="chip" onclick="Simulators.runNetCli('nslookup google.com')">nslookup google.com</button>
        </div>

        <div class="terminal-box" id="net-cli-term" style="min-height: 250px;">
          <div class="term-line text-muted">Antigravity Network Diagnostic Suite [Version 10.0.22631]</div>
          <div class="term-line text-muted">(c) Microsoft Corporation / CBIT Network Lab. All rights reserved.</div>
        </div>

        <div class="term-input-row">
          <span class="term-prompt">C:\\Users\\Student&gt;</span>
          <input type="text" id="net-cli-input" class="term-input" placeholder="Type network command (e.g. ping google.com)">
          <button id="net-cli-exec-btn" class="btn btn-primary btn-sm">Run</button>
        </div>
      </div>
    `;

    document.getElementById('net-cli-exec-btn').onclick = () => {
      const inp = document.getElementById('net-cli-input');
      Simulators.runNetCli(inp.value);
      inp.value = '';
    };

    document.getElementById('net-cli-input').onkeydown = (e) => {
      if (e.key === 'Enter') {
        const inp = document.getElementById('net-cli-input');
        Simulators.runNetCli(inp.value);
        inp.value = '';
      }
    };
  },

  runNetCli: function(cmdStr) {
    if (!cmdStr || !cmdStr.trim()) return;
    const term = document.getElementById('net-cli-term');
    term.innerHTML += `<div class="term-line font-mono"><span class="term-prompt">C:\\Users\\Student&gt;</span> ${cmdStr}</div>`;

    const lower = cmdStr.toLowerCase().trim();
    let out = '';

    if (lower.startsWith('ping')) {
      const host = cmdStr.split(' ')[1] || '8.8.8.8';
      out = `
Pinging ${host} with 32 bytes of data:
Reply from ${host}: bytes=32 time=14ms TTL=116
Reply from ${host}: bytes=32 time=15ms TTL=116
Reply from ${host}: bytes=32 time=13ms TTL=116
Reply from ${host}: bytes=32 time=14ms TTL=116

Ping statistics for ${host}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 13ms, Maximum = 15ms, Average = 14ms`;
    } else if (lower.startsWith('ipconfig')) {
      out = `
Windows IP Configuration

Ethernet adapter vEthernet (WSL):
   Connection-specific DNS Suffix  . :
   IPv4 Address. . . . . . . . . . . : 172.24.160.1
   Subnet Mask . . . . . . . . . . . : 255.255.240.0
   Default Gateway . . . . . . . . . :

Wireless LAN adapter Wi-Fi:
   Connection-specific DNS Suffix  . : cbit.ac.in
   Description . . . . . . . . . . . : Intel(R) Wi-Fi 6 AX201 160MHz
   Physical Address. . . . . . . . . : 3C-E9-0E-88-2A-11
   DHCP Enabled. . . . . . . . . . . : Yes
   IPv4 Address. . . . . . . . . . . : 192.168.1.45
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 8.8.8.8, 1.1.1.1`;
    } else if (lower.startsWith('arp')) {
      out = `
Interface: 192.168.1.45 --- 0xc
  Internet Address      Physical Address      Type
  192.168.1.1           e0-28-6d-74-aa-10     dynamic
  192.168.1.20          00-1a-2b-3c-4d-5e     dynamic
  192.168.1.255         ff-ff-ff-ff-ff-ff     static
  224.0.0.22           01-00-5e-00-00-16     static`;
    } else if (lower.startsWith('netstat')) {
      out = `
Active Connections

  Proto  Local Address          Foreign Address        State           PID
  TCP    0.0.0.0:8000           0.0.0.0:0              LISTENING       4120
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       988
  TCP    127.0.0.1:8000         127.0.0.1:54128        ESTABLISHED     4120
  TCP    192.168.1.45:51240     142.250.193.206:443    ESTABLISHED     11244
  UDP    0.0.0.0:5353           *:*                                    524`;
    } else if (lower.startsWith('tracert')) {
      const host = cmdStr.split(' ')[1] || 'cbit.ac.in';
      out = `
Tracing route to ${host} [103.206.115.148]
over a maximum of 30 hops:

  1    <1 ms    <1 ms    <1 ms  192.168.1.1
  2     4 ms     5 ms     4 ms  10.244.12.1
  3    12 ms    11 ms    12 ms  182.79.245.105
  4    18 ms    17 ms    17 ms  103.206.115.148

Trace complete.`;
    } else if (lower.startsWith('nslookup')) {
      const host = cmdStr.split(' ')[1] || 'google.com';
      out = `
Server:  dns.google
Address:  8.8.8.8

Non-authoritative answer:
Name:    ${host}
Addresses:  142.250.193.206, 2607:f8b0:4004:801::200e`;
    } else if (lower === 'cls' || lower === 'clear') {
      term.innerHTML = '';
      return;
    } else {
      out = `'${cmdStr}' is not recognized as an internal or external command. Try: ping, ipconfig, arp -a, netstat -ano, tracert, nslookup`;
    }

    term.innerHTML += `<div class="term-line font-mono text-info" style="white-space: pre-wrap;">${out}</div>`;
    term.scrollTop = term.scrollHeight;
  },

  // ==========================================
  // CN 8 & 9: Stop-and-Wait & Sliding Window Simulator
  // ==========================================
  renderSlidingWindow: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-layer-group"></i> Sliding Window Protocol Simulator</h4>
          <span class="sim-badge">Go-Back-N vs Selective Repeat</span>
        </div>
        <p class="sim-desc">Compare how Go-Back-N (retransmits whole window upon loss) behaves differently from Selective Repeat (retransmits ONLY the lost frame using receiver buffer).</p>
        
        <div class="sim-controls">
          <div class="form-group">
            <label>Protocol:</label>
            <select id="sw-proto-select" class="sim-select">
              <option value="gbn" selected>Go-Back-N (GBN)</option>
              <option value="sr">Selective Repeat (SR)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Window Size (W):</label>
            <input type="number" id="sw-win-size" class="sim-input-sm" value="3" min="2" max="6">
          </div>
          <button id="sw-simulate-btn" class="btn btn-primary"><i class="fas fa-play"></i> Run Simulation (Packet #2 Lost)</button>
        </div>

        <div class="timeline-container" id="sw-timeline-box">
          <!-- Timeline animation steps rendered here -->
        </div>
      </div>
    `;

    document.getElementById('sw-simulate-btn').onclick = () => Simulators.executeSlidingWindow();
    Simulators.executeSlidingWindow();
  },

  executeSlidingWindow: function() {
    const proto = document.getElementById('sw-proto-select').value;
    const winSize = parseInt(document.getElementById('sw-win-size').value) || 3;
    const box = document.getElementById('sw-timeline-box');

    let steps = [];
    if (proto === 'gbn') {
      steps = [
        { time: 'T0', sender: `Sent Window [1, 2, 3] (Window Size = ${winSize})`, channel: 'Data Traveling...', receiver: 'Waiting' },
        { time: 'T1', sender: 'Waiting for ACKs', channel: '<span class="text-danger">Packet #2 LOST in transit!</span>', receiver: 'Received Packet #1 &rarr; Sent ACK 1' },
        { time: 'T2', sender: 'Received ACK 1 &bull; Slid window to [2, 3, 4]', channel: 'Packet #3 arrived out of order', receiver: '<span class="text-warning">Discarded Packet #3 (Expected #2)</span>' },
        { time: 'T3', sender: '<span class="text-danger font-bold">!! TIMEOUT for Packet #2 !!</span>', channel: 'Go-Back-N Triggered', receiver: 'Still waiting for #2' },
        { time: 'T4', sender: '<span class="text-primary font-bold">Retransmitting ENTIRE Window: [2, 3, 4]</span>', channel: 'Retransmitting', receiver: 'Ready' },
        { time: 'T5', sender: 'Waiting for cumulative ACK', channel: 'Delivered', receiver: '<span class="text-success">Received 2, 3, 4 in order &rarr; Sent Cumulative ACK 4</span>' },
        { time: 'T6', sender: '<span class="text-success font-bold">All frames delivered successfully!</span>', channel: 'Channel Idle', receiver: 'Complete' }
      ];
    } else {
      steps = [
        { time: 'T0', sender: `Sent Window [1, 2, 3] (Window Size = ${winSize})`, channel: 'Data Traveling...', receiver: 'Waiting' },
        { time: 'T1', sender: 'Waiting for ACKs', channel: '<span class="text-danger">Packet #2 LOST in transit!</span>', receiver: 'Received Packet #1 &rarr; Sent ACK 1' },
        { time: 'T2', sender: 'Received ACK 1', channel: 'Packet #3 arrived', receiver: '<span class="text-info">Buffered Packet #3 &rarr; Sent Selective ACK 3</span>' },
        { time: 'T3', sender: '<span class="text-danger font-bold">!! TIMEOUT for Packet #2 ONLY !!</span>', channel: 'Selective Retransmit', receiver: 'Waiting for #2' },
        { time: 'T4', sender: '<span class="text-success font-bold">Retransmitting ONLY Lost Packet #2 (No duplicate retransmission of #3!)</span>', channel: 'Retransmitting #2', receiver: 'Waiting' },
        { time: 'T5', sender: 'Delivered #2', channel: 'Delivered', receiver: '<span class="text-success">Received #2, merged with buffered #3 &rarr; Delivered to upper layer!</span>' },
        { time: 'T6', sender: '<span class="text-success font-bold">All frames delivered efficiently!</span>', channel: 'Channel Idle', receiver: 'Complete' }
      ];
    }

    box.innerHTML = `
      <div class="table-responsive">
        <table class="sim-table">
          <thead><tr><th>Time</th><th>Sender Action</th><th>Channel Status</th><th>Receiver Action</th></tr></thead>
          <tbody>
            ${steps.map(s => `
              <tr>
                <td><strong>${s.time}</strong></td>
                <td>${s.sender}</td>
                <td>${s.channel}</td>
                <td>${s.receiver}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ==========================================
  // CN 10: Routing Algorithm Simulator
  // ==========================================
  renderRoutingAlgo: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-route"></i> Distance Vector (Bellman-Ford) &amp; Link State (Dijkstra) Simulator</h4>
          <span class="sim-badge">Routing Convergence</span>
        </div>
        <p class="sim-desc">Observe routing table convergence on a 4-router network topology.</p>
        
        <div class="sim-controls">
          <div class="form-group">
            <label>Algorithm:</label>
            <select id="route-algo-select" class="sim-select">
              <option value="dvr" selected>Distance Vector Routing (Bellman-Ford / RIP)</option>
              <option value="lsr">Link State Routing (Dijkstra's Shortest Path)</option>
            </select>
          </div>
          <button id="route-run-btn" class="btn btn-primary"><i class="fas fa-play"></i> Compute Routing Tables</button>
        </div>

        <div id="route-output-box" class="sim-output-box"></div>
      </div>
    `;

    document.getElementById('route-run-btn').onclick = () => Simulators.executeRouting();
    Simulators.executeRouting();
  },

  executeRouting: function() {
    const algo = document.getElementById('route-algo-select').value;
    const box = document.getElementById('route-output-box');

    if (algo === 'dvr') {
      box.innerHTML = `
        <h5>Distance Vector Routing (Converged Tables after Bellman-Ford Iterations):</h5>
        <div class="grid-2-col">
          <div class="stat-card">
            <div class="stat-title">Router R1 Routing Table</div>
            <table class="sim-table">
              <thead><tr><th>Dest</th><th>Cost</th><th>Next Hop</th></tr></thead>
              <tbody>
                <tr><td>R1</td><td>0</td><td>Self</td></tr>
                <tr><td>R2</td><td>2</td><td>R2</td></tr>
                <tr><td>R3</td><td>5</td><td>R2</td></tr>
                <tr><td>R4</td><td>1</td><td>R4</td></tr>
              </tbody>
            </table>
          </div>
          <div class="stat-card">
            <div class="stat-title">Router R2 Routing Table</div>
            <table class="sim-table">
              <thead><tr><th>Dest</th><th>Cost</th><th>Next Hop</th></tr></thead>
              <tbody>
                <tr><td>R1</td><td>2</td><td>R1</td></tr>
                <tr><td>R2</td><td>0</td><td>Self</td></tr>
                <tr><td>R3</td><td>3</td><td>R3</td></tr>
                <tr><td>R4</td><td>3</td><td>R1</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else {
      box.innerHTML = `
        <h5>Link State Routing (Dijkstra Shortest Path Tree from Source R1):</h5>
        <div class="table-responsive">
          <table class="sim-table">
            <thead><tr><th>Destination</th><th>Shortest Path</th><th>Minimum Total Metric</th></tr></thead>
            <tbody>
              <tr><td>R2</td><td>R1 &rarr; R2</td><td>2</td></tr>
              <tr><td>R3</td><td>R1 &rarr; R2 &rarr; R3</td><td>5</td></tr>
              <tr><td>R4</td><td>R1 &rarr; R4</td><td>1</td></tr>
            </tbody>
          </table>
        </div>
      `;
    }
  },

  // ==========================================
  // CN 4: Cisco Router and VLAN CLI Simulator
  // ==========================================
  renderCiscoRouter: function(container) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-network-wired"></i> Cisco IOS Router &amp; VLAN Switch Simulator</h4>
          <span class="sim-badge">Cisco IOS CLI</span>
        </div>
        <p class="sim-desc">Practice configuring Cisco 2811 router static routes and Cisco 2960 switch VLANs in an interactive Cisco IOS terminal.</p>
        
        <div class="quick-chips">
          <button class="chip" onclick="Simulators.runCiscoCmd('enable')">enable</button>
          <button class="chip" onclick="Simulators.runCiscoCmd('conf t')">conf t</button>
          <button class="chip" onclick="Simulators.runCiscoCmd('interface fa0/0')">int fa0/0</button>
          <button class="chip" onclick="Simulators.runCiscoCmd('ip address 192.168.1.1 255.255.255.0')">ip address 192.168.1.1</button>
          <button class="chip" onclick="Simulators.runCiscoCmd('no shutdown')">no shutdown</button>
          <button class="chip" onclick="Simulators.runCiscoCmd('ip route 192.168.2.0 255.255.255.0 10.1.1.2')">ip route 192.168.2.0</button>
          <button class="chip" onclick="Simulators.runCiscoCmd('vlan 10')">vlan 10 (name CSE)</button>
          <button class="chip" onclick="Simulators.runCiscoCmd('switchport mode trunk')">switchport mode trunk</button>
          <button class="chip" onclick="Simulators.runCiscoCmd('show ip route')">show ip route</button>
          <button class="chip" onclick="Simulators.runCiscoCmd('show vlan brief')">show vlan brief</button>
        </div>

        <div class="terminal-box" id="cisco-term" style="min-height: 250px;">
          <div class="term-line text-muted">Cisco IOS Software, 2800 Software (C2800NM-ADVIPSERVICESK9-M), Version 15.1</div>
          <div class="term-line text-muted">Press RETURN to get started!</div>
        </div>

        <div class="term-input-row">
          <span class="term-prompt" id="cisco-prompt">Router&gt;</span>
          <input type="text" id="cisco-input" class="term-input" placeholder="Type Cisco command (e.g. enable, show ip route)">
          <button id="cisco-exec-btn" class="btn btn-primary btn-sm">Exec</button>
        </div>
      </div>
    `;

    document.getElementById('cisco-exec-btn').onclick = () => {
      const inp = document.getElementById('cisco-input');
      Simulators.runCiscoCmd(inp.value);
      inp.value = '';
    };

    document.getElementById('cisco-input').onkeydown = (e) => {
      if (e.key === 'Enter') {
        const inp = document.getElementById('cisco-input');
        Simulators.runCiscoCmd(inp.value);
        inp.value = '';
      }
    };
  },

  ciscoState: { mode: 'user', routes: [], vlans: ['1 default (active)'] },

  runCiscoCmd: function(cmdStr) {
    if (!cmdStr || !cmdStr.trim()) return;
    const term = document.getElementById('cisco-term');
    const promptEl = document.getElementById('cisco-prompt');
    const curPrompt = promptEl.innerText;

    term.innerHTML += `<div class="term-line font-mono"><span class="term-prompt">${curPrompt}</span> ${cmdStr}</div>`;
    const lower = cmdStr.toLowerCase().trim();
    let resp = '';

    if (lower === 'enable') {
      Simulators.ciscoState.mode = 'privileged';
      promptEl.innerText = 'Router#';
      resp = '% User EXEC entered Privileged EXEC mode.';
    } else if (lower === 'conf t' || lower === 'configure terminal') {
      Simulators.ciscoState.mode = 'global';
      promptEl.innerText = 'Router(config)#';
      resp = 'Enter configuration commands, one per line. End with CNTL/Z.';
    } else if (lower.startsWith('int') || lower.startsWith('interface')) {
      promptEl.innerText = 'Router(config-if)#';
      resp = '% Interface configuration mode entered.';
    } else if (lower.startsWith('ip address')) {
      resp = `% IP address set successfully.`;
    } else if (lower === 'no shut' || lower === 'no shutdown') {
      resp = `% LINK-5-CHANGED: Interface FastEthernet0/0, changed state to up\n% LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/0, changed state to up`;
    } else if (lower.startsWith('ip route')) {
      Simulators.ciscoState.routes.push(cmdStr);
      resp = `[+] Static route added to routing table: ${cmdStr}`;
    } else if (lower.startsWith('vlan')) {
      Simulators.ciscoState.vlans.push(cmdStr + ' (CSE/ECE)');
      resp = `[+] VLAN created: ${cmdStr}`;
    } else if (lower.includes('trunk')) {
      resp = `% 802.1Q trunking encapsulation active on interface.`;
    } else if (lower === 'show ip route') {
      resp = `Codes: C - connected, S - static, R - RIP\n\nGateway of last resort is not set\n\nC    192.168.1.0/24 is directly connected, FastEthernet0/0\nC    10.1.1.0/30 is directly connected, Serial0/0/0\nS    192.168.2.0/24 [1/0] via 10.1.1.2\nS    192.168.3.0/24 [1/0] via 10.1.1.2`;
    } else if (lower === 'show vlan brief' || lower === 'show vlan') {
      resp = `VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n1    default                          active    Fa0/3, Fa0/4\n10   CSE                              active    Fa0/1\n20   ECE                              active    Fa0/2`;
    } else if (lower === 'exit' || lower === 'end') {
      Simulators.ciscoState.mode = 'privileged';
      promptEl.innerText = 'Router#';
      resp = '% Exited to privileged mode.';
    } else {
      resp = `% Command '${cmdStr}' executed. Type 'show ip route' or 'show vlan brief' to inspect tables.`;
    }

    term.innerHTML += `<div class="term-line font-mono text-info" style="white-space: pre-wrap;">${resp}</div>`;
    term.scrollTop = term.scrollHeight;
  },

  // ==========================================
  // Generic Fallback Simulator
  // ==========================================
  renderGenericFallback: function(container, title, msg) {
    container.innerHTML = `
      <div class="sim-card">
        <div class="sim-header">
          <h4><i class="fas fa-terminal"></i> ${title} Simulator</h4>
          <span class="sim-badge">Interactive Shell</span>
        </div>
        <p class="sim-desc">${msg}</p>
        <div class="terminal-box">
          <div class="term-line text-success">[Interactive Simulation Environment Ready]</div>
          <div class="term-line text-info">Simulation loaded successfully. All parameters validated.</div>
        </div>
      </div>
    `;
  }
};

