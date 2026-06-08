(function() {
  let simInterval = null;
  let currentSpeed = 1000; // default 1s
  let isPaused = false;
  let matchState = null;
  let completionCallback = null;

  window.LiveMatchUI = {
    openLiveMatchOverlay: function(homeTeam, awayTeam, stage, onComplete) {
      completionCallback = onComplete;
      isPaused = false;
      currentSpeed = 1000;

      // Initialiser la simulation
      matchState = window.LiveMatchSim.initLiveMatch(homeTeam, awayTeam, stage);

      // Créer l'overlay s'il n'existe pas
      let overlay = document.getElementById("live-match-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "live-match-overlay";
        overlay.className = "live-overlay";
        document.body.appendChild(overlay);
      }

      // Injecter la structure HTML premium
      overlay.innerHTML = `
        <div class="live-container">
          <!-- TOP HEADER: SCOREBOARD -->
          <div class="live-scoreboard">
            <div class="score-team home">
              <span class="live-team-abbr">${homeTeam.id}</span>
              <span class="live-team-name">${homeTeam.city} ${homeTeam.name}</span>
            </div>
            
            <div class="score-center">
              <div class="live-clock-section">
                <span id="live-quarter">Q1</span>
                <span id="live-timer">12:00</span>
              </div>
              <div class="live-digital-scores">
                <span id="score-home" class="score-val">0</span>
                <span class="score-separator">-</span>
                <span id="score-away" class="score-val">0</span>
              </div>
            </div>

            <div class="score-team away">
              <span class="live-team-name">${awayTeam.city} ${awayTeam.name}</span>
              <span class="live-team-abbr">${awayTeam.id}</span>
            </div>
          </div>

          <!-- QUARTER BREAKDOWN BAR -->
          <div class="quarter-breakdown" id="quarter-scores-bar">
            <!-- Dynamically populated quarter scores -->
          </div>

          <!-- MAIN PANEL (TWO COLUMNS) -->
          <div class="live-main-content">
            <!-- LEFT PANEL: STATS & COURT -->
            <div class="live-left-pane">
              <!-- Visual Court/Possession Indicator -->
              <div class="court-visualizer" id="court-view">
                <div class="court-rim left"></div>
                <div class="court-center-circle"></div>
                <div class="court-rim right"></div>
                <div class="court-action-overlay" id="court-action-text">Coup d'envoi</div>
                <div class="possession-indicator-dot" id="possession-dot"></div>
              </div>

              <!-- Live Stats Tab Header -->
              <div class="live-stats-tabs">
                <button class="tab-btn active" id="btn-stats-home">${homeTeam.id} Stats</button>
                <button class="tab-btn" id="btn-stats-away">${awayTeam.id} Stats</button>
              </div>

              <!-- Stats Table -->
              <div class="live-stats-table-container">
                <table class="live-stats-table">
                  <thead>
                    <tr>
                      <th>Joueur</th>
                      <th>Pos</th>
                      <th>Min</th>
                      <th>PTS</th>
                      <th>REB</th>
                      <th>AST</th>
                      <th>STL</th>
                      <th>BLK</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody id="live-stats-body">
                    <!-- Dynamically populated stats -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- RIGHT PANEL: COMMENTARY FEED -->
            <div class="live-right-pane">
              <div class="pane-header">
                <h3><i class="fa-solid fa-microphone-lines"></i> Commentaires en direct</h3>
              </div>
              <div class="live-ticker" id="live-ticker-feed">
                <!-- Dynamically populated scrolling commentaries -->
              </div>
            </div>
          </div>

          <!-- BOTTOM CONTROLS -->
          <div class="live-controls">
            <div class="speed-controls">
              <button class="btn btn-live-control active" id="btn-speed-1x">1x</button>
              <button class="btn btn-live-control" id="btn-speed-2x">2x</button>
              <button class="btn btn-live-control" id="btn-speed-4x">4x</button>
              <button class="btn btn-live-control" id="btn-speed-8x">8x</button>
            </div>
            
            <div class="action-controls">
              <button class="btn btn-primary" id="btn-live-playpause">
                <i class="fa-solid fa-pause"></i> Pause
              </button>
              <button class="btn btn-danger-outline" id="btn-live-skip">
                <i class="fa-solid fa-forward-step"></i> Passer le match
              </button>
            </div>
          </div>
        </div>
      `;

      // Afficher l'overlay
      overlay.classList.add("active");

      // Bind Tab Events
      let activeStatsTeam = "home";
      const btnHome = document.getElementById("btn-stats-home");
      const btnAway = document.getElementById("btn-stats-away");

      btnHome.addEventListener("click", () => {
        activeStatsTeam = "home";
        btnHome.classList.add("active");
        btnAway.classList.remove("active");
        renderStatsTable(activeStatsTeam);
      });

      btnAway.addEventListener("click", () => {
        activeStatsTeam = "away";
        btnAway.classList.add("active");
        btnHome.classList.remove("active");
        renderStatsTable(activeStatsTeam);
      });

      // Bind Speed Buttons
      const speeds = [
        { id: "btn-speed-1x", val: 1200 },
        { id: "btn-speed-2x", val: 600 },
        { id: "btn-speed-4x", val: 250 },
        { id: "btn-speed-8x", val: 60 }
      ];

      speeds.forEach(sp => {
        const btn = document.getElementById(sp.id);
        btn.addEventListener("click", () => {
          speeds.forEach(s => document.getElementById(s.id).classList.remove("active"));
          btn.classList.add("active");
          currentSpeed = sp.val;
          if (!isPaused && !matchState.finished) {
            stopSimLoop();
            startSimLoop();
          }
        });
      });

      // Bind Action Buttons
      const playPauseBtn = document.getElementById("btn-live-playpause");
      playPauseBtn.addEventListener("click", () => {
        if (isPaused) {
          isPaused = false;
          playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause`;
          startSimLoop();
        } else {
          isPaused = true;
          playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i> Reprendre`;
          stopSimLoop();
        }
      });

      const skipBtn = document.getElementById("btn-live-skip");
      skipBtn.addEventListener("click", () => {
        skipToFinish();
      });

      // Render initial state
      updateUI();
      
      // Start Loop
      startSimLoop();
    }
  };

  function startSimLoop() {
    if (simInterval) clearInterval(simInterval);
    simInterval = setInterval(() => {
      runStep();
    }, currentSpeed);
  }

  function stopSimLoop() {
    if (simInterval) clearInterval(simInterval);
  }

  function runStep() {
    if (matchState.finished) {
      stopSimLoop();
      handleMatchEnd();
      return;
    }

    // Step simulation
    matchState = window.LiveMatchSim.stepLiveMatch(matchState);

    // Update UI
    updateUI();
  }

  function skipToFinish() {
    stopSimLoop();
    // Simulate synchronously until finished
    while (!matchState.finished) {
      matchState = window.LiveMatchSim.stepLiveMatch(matchState);
    }
    updateUI();
    handleMatchEnd();
  }

  function updateUI() {
    // Scoreboard values
    const scoreHome = document.getElementById("score-home");
    const scoreAway = document.getElementById("score-away");
    
    // Add pulsing visual feedback if score changes
    const prevHome = parseInt(scoreHome.textContent) || 0;
    const prevAway = parseInt(scoreAway.textContent) || 0;
    
    scoreHome.textContent = matchState.homeScore;
    scoreAway.textContent = matchState.awayScore;

    if (matchState.homeScore > prevHome) {
      scoreHome.classList.add("pulse-score");
      setTimeout(() => scoreHome.classList.remove("pulse-score"), 300);
    }
    if (matchState.awayScore > prevAway) {
      scoreAway.classList.add("pulse-score");
      setTimeout(() => scoreAway.classList.remove("pulse-score"), 300);
    }

    // Timer & Quarter
    const qStr = matchState.currentQuarter > 4 ? `OT${matchState.currentQuarter - 4}` : `Q${matchState.currentQuarter}`;
    document.getElementById("live-quarter").textContent = qStr;
    
    const minutes = Math.floor(matchState.quarterTime / 60);
    const seconds = matchState.quarterTime % 60;
    document.getElementById("live-timer").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // Quarter scores bar
    renderQuarterScoresBar();

    // Possession & Court Visuals
    updateCourtView();

    // Live Stats Table
    const activeStatsTeam = document.getElementById("btn-stats-home").classList.contains("active") ? "home" : "away";
    renderStatsTable(activeStatsTeam);

    // Commentary feed
    renderCommentaries();
  }

  function renderQuarterScoresBar() {
    const bar = document.getElementById("quarter-scores-bar");
    if (!bar) return;

    let html = `
      <div class="q-row header">
        <span class="q-col">Équipe</span>
        <span class="q-col">Q1</span>
        <span class="q-col">Q2</span>
        <span class="q-col">Q3</span>
        <span class="q-col">Q4</span>
    `;
    
    // Add Overtime headers if they exist
    const otCount = Math.max(0, matchState.homeQuarters.length - 4);
    for (let i = 0; i < otCount; i++) {
      html += `<span class="q-col">OT${i+1}</span>`;
    }
    html += `<span class="q-col total">Total</span></div>`;

    // Home Team Row
    html += `
      <div class="q-row">
        <span class="q-col team-id">${matchState.homeTeam.id}</span>
        <span class="q-col">${matchState.homeQuarters[0] || 0}</span>
        <span class="q-col">${matchState.homeQuarters[1] || 0}</span>
        <span class="q-col">${matchState.homeQuarters[2] || 0}</span>
        <span class="q-col">${matchState.homeQuarters[3] || 0}</span>
    `;
    for (let i = 0; i < otCount; i++) {
      html += `<span class="q-col">${matchState.homeQuarters[4 + i] || 0}</span>`;
    }
    html += `<span class="q-col total">${matchState.homeScore}</span></div>`;

    // Away Team Row
    html += `
      <div class="q-row">
        <span class="q-col team-id">${matchState.awayTeam.id}</span>
        <span class="q-col">${matchState.awayQuarters[0] || 0}</span>
        <span class="q-col">${matchState.awayQuarters[1] || 0}</span>
        <span class="q-col">${matchState.awayQuarters[2] || 0}</span>
        <span class="q-col">${matchState.awayQuarters[3] || 0}</span>
    `;
    for (let i = 0; i < otCount; i++) {
      html += `<span class="q-col">${matchState.awayQuarters[4 + i] || 0}</span>`;
    }
    html += `<span class="q-col total">${matchState.awayScore}</span></div>`;

    bar.innerHTML = html;
  }

  function updateCourtView() {
    const court = document.getElementById("court-view");
    const actionText = document.getElementById("court-action-text");
    const possessionDot = document.getElementById("possession-dot");
    if (!court || !possessionDot) return;

    if (matchState.finished) {
      actionText.textContent = "MATCH TERMINÉ";
      court.classList.remove("possession-home", "possession-away");
      possessionDot.style.display = "none";
      return;
    }

    const attacker = matchState.possession === "home" ? matchState.homeTeam : matchState.awayTeam;
    actionText.textContent = `ATTATQUE : ${attacker.city.toUpperCase()} ${attacker.name.toUpperCase()}`;

    if (matchState.possession === "home") {
      court.classList.add("possession-home");
      court.classList.remove("possession-away");
      possessionDot.style.display = "block";
      possessionDot.className = "possession-indicator-dot pos-left";
    } else {
      court.classList.add("possession-away");
      court.classList.remove("possession-home");
      possessionDot.style.display = "block";
      possessionDot.className = "possession-indicator-dot pos-right";
    }
  }

  function renderStatsTable(teamType) {
    const tbody = document.getElementById("live-stats-body");
    if (!tbody) return;

    const statsObj = teamType === "home" ? matchState.homeStats : matchState.awayStats;
    const startersList = teamType === "home" ? matchState.activeHomeStarters : matchState.activeAwayStarters;

    tbody.innerHTML = "";

    // Sort players so starters are shown first
    const players = Object.values(statsObj).sort((a, b) => {
      const aStarter = startersList.some(p => p.id === a.id);
      const bStarter = startersList.some(p => p.id === b.id);
      if (aStarter && !bStarter) return -1;
      if (!aStarter && bStarter) return 1;
      return b.pts - a.pts; // then sort by points
    });

    players.forEach(p => {
      const isOnCourt = startersList.some(starter => starter.id === p.id);
      let statusHTML = "";
      if (p.injury) {
        statusHTML = `<span class="badge badge-injured">Blessé</span>`;
      } else if (isOnCourt) {
        statusHTML = `<span class="badge badge-active">Sur le terrain</span>`;
      } else {
        statusHTML = `<span class="badge badge-bench">Banc</span>`;
      }

      const row = document.createElement("tr");
      if (isOnCourt) row.className = "on-court-row";
      row.innerHTML = `
        <td style="font-weight: 500;">${p.name}</td>
        <td>${p.position}</td>
        <td>${Math.round(p.min)}m</td>
        <td style="font-weight: bold; color: var(--accent);">${p.pts}</td>
        <td>${p.reb}</td>
        <td>${p.ast}</td>
        <td>${p.stl}</td>
        <td>${p.blk}</td>
        <td>${statusHTML}</td>
      `;
      tbody.appendChild(row);
    });
  }

  function renderCommentaries() {
    const feed = document.getElementById("live-ticker-feed");
    if (!feed) return;

    feed.innerHTML = "";

    // Show latest commentaries (limit to 30 for performance)
    const logs = matchState.commentaries.slice(-30);

    logs.forEach(c => {
      const item = document.createElement("div");
      item.className = `ticker-item type-${c.type}`;
      
      let badgeHTML = "";
      if (c.type === "score-success") {
        badgeHTML = `<span class="ticker-badge success">SCORE</span>`;
      } else if (c.type === "injury") {
        badgeHTML = `<span class="ticker-badge danger"><i class="fa-solid fa-circle-exclamation"></i> BLESSURE</span>`;
      } else if (c.type === "block" || c.type === "steal") {
        badgeHTML = `<span class="ticker-badge warning">DÉFENSE</span>`;
      } else if (c.type === "quarter-end" || c.type === "news") {
        badgeHTML = `<span class="ticker-badge info">INFO</span>`;
      }

      item.innerHTML = `
        <span class="ticker-time">[Q${c.q} - ${c.time}]</span>
        ${badgeHTML}
        <span class="ticker-text">${c.text}</span>
      `;
      feed.appendChild(item);
    });

    // Auto scroll to bottom
    feed.scrollTop = feed.scrollHeight;
  }

  function handleMatchEnd() {
    // Changement des boutons
    const playPauseBtn = document.getElementById("btn-live-playpause");
    const skipBtn = document.getElementById("btn-live-skip");

    if (playPauseBtn) playPauseBtn.style.display = "none";
    
    if (skipBtn) {
      skipBtn.className = "btn btn-primary btn-finish-match";
      skipBtn.innerHTML = `<i class="fa-solid fa-flag-checkered"></i> Enregistrer le résultat`;
      // Re-bind to complete
      skipBtn.addEventListener("click", () => {
        closeOverlayAndFinish();
      });
    }
  }

  function closeOverlayAndFinish() {
    const overlay = document.getElementById("live-match-overlay");
    if (overlay) {
      overlay.classList.remove("active");
    }
    if (completionCallback) {
      completionCallback(matchState);
    }
  }

})();
