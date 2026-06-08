// NBA Season Simulator - App Logic

document.addEventListener("DOMContentLoaded", () => {
  let gameState = null;
  let activeTab = "dashboard-tab";
  let activeStandingsConf = "East";
  let calendarFilter = "all"; // "all" ou "user"
  let playersData = null;
  let selectedEmailId = null;

  // Sélecteurs DOM
  const selectionScreen = document.getElementById("selection-screen");
  const appScreen = document.getElementById("app-screen");
  const teamsSelectionGrid = document.getElementById("teams-selection-grid");
  const userTeamBanner = document.getElementById("user-team-banner");
  const currentStageBadge = document.getElementById("current-stage-badge");

  const sidebarWeekNum = document.getElementById("sidebar-week-num");
  const sidebarRecord = document.getElementById("sidebar-record");
  const sidebarStreak = document.getElementById("sidebar-streak");

  const navItems = document.querySelectorAll(".nav-item");
  const tabContents = document.querySelectorAll(".tab-content");
  const navPlayoffsBtn = document.getElementById("nav-playoffs-btn");

  // Dashboard
  const nextMatchupPreview = document.getElementById("next-matchup-preview");
  const simGameBtn = document.getElementById("sim-game-btn");
  const simWeekBtn = document.getElementById("sim-week-btn");
  const narrativeBox = document.getElementById("narrative-box");
  const alertsBox = document.getElementById("alerts-box");
  const quickFatigue = document.getElementById("quick-fatigue");
  const quickFatigueBar = document.getElementById("quick-fatigue-bar");
  const quickMoral = document.getElementById("quick-moral");
  const quickMoralBar = document.getElementById("quick-moral-bar");
  const quickInjuries = document.getElementById("quick-injuries");

  // Calendar
  const calendarGamesList = document.getElementById("calendar-games-list");
  const calFilterAll = document.getElementById("cal-filter-all");
  const calFilterUser = document.getElementById("cal-filter-user");

  // Standings
  const standingsTableBody = document.getElementById("standings-table-body");
  const standingsConfBtns = document.querySelectorAll(
    ".conference-tabs .btn-tab",
  );

  // Roster
  const rosterTableBody = document.getElementById("roster-table-body");
  const saveRotationBtn = document.getElementById("save-rotation-btn");
  const rotationMessage = document.getElementById("rotation-message");

  // Playoffs
  const playoffsBracket = document.getElementById("playoffs-bracket");
  const simPlayoffsStepBtn = document.getElementById("sim-playoffs-step-btn");

  // Mailbox
  const navMessagesBtn = document.getElementById("nav-messages-btn");
  const messagesBadge = document.getElementById("messages-badge");
  const unreadCountText = document.getElementById("unread-count-text");
  const emailListItems = document.getElementById("email-list-items");
  const emailDetailView = document.getElementById("email-detail-view");

  // Controls
  const resetBtn = document.getElementById("reset-btn");
  const simOverlay = document.getElementById("simulation-overlay");
  const overlayText = document.getElementById("overlay-text");

  // Custom Confirm Modal
  const confirmModal = document.getElementById("confirm-modal");
  const confirmCancelBtn = document.getElementById("confirm-cancel-btn");
  const confirmOkBtn = document.getElementById("confirm-ok-btn");

  // Liste des équipes pour l'accueil
  const LOCAL_TEAMS_LIST = [
    {
      id: "BOS",
      city: "Boston",
      name: "Celtics",
      conf: "East",
      div: "Atlantic",
      tier: 1,
    },
    {
      id: "BKN",
      city: "Brooklyn",
      name: "Nets",
      conf: "East",
      div: "Atlantic",
      tier: 2,
    },
    {
      id: "NYK",
      city: "New York",
      name: "Knicks",
      conf: "East",
      div: "Atlantic",
      tier: 1,
    },
    {
      id: "PHI",
      city: "Philadelphia",
      name: "76ers",
      conf: "East",
      div: "Atlantic",
      tier: 1,
    },
    {
      id: "TOR",
      city: "Toronto",
      name: "Raptors",
      conf: "East",
      div: "Atlantic",
      tier: 3,
    },
    {
      id: "CHI",
      city: "Chicago",
      name: "Bulls",
      conf: "East",
      div: "Central",
      tier: 2,
    },
    {
      id: "CLE",
      city: "Cleveland",
      name: "Cavaliers",
      conf: "East",
      div: "Central",
      tier: 1,
    },
    {
      id: "DET",
      city: "Detroit",
      name: "Pistons",
      conf: "East",
      div: "Central",
      tier: 3,
    },
    {
      id: "IND",
      city: "Indiana",
      name: "Pacers",
      conf: "East",
      div: "Central",
      tier: 2,
    },
    {
      id: "MIL",
      city: "Milwaukee",
      name: "Bucks",
      conf: "East",
      div: "Central",
      tier: 1,
    },
    {
      id: "ATL",
      city: "Atlanta",
      name: "Hawks",
      conf: "East",
      div: "Southeast",
      tier: 2,
    },
    {
      id: "CHA",
      city: "Charlotte",
      name: "Hornets",
      conf: "East",
      div: "Southeast",
      tier: 3,
    },
    {
      id: "MIA",
      city: "Miami",
      name: "Heat",
      conf: "East",
      div: "Southeast",
      tier: 2,
    },
    {
      id: "ORL",
      city: "Orlando",
      name: "Magic",
      conf: "East",
      div: "Southeast",
      tier: 2,
    },
    {
      id: "WAS",
      city: "Washington",
      name: "Wizards",
      conf: "East",
      div: "Southeast",
      tier: 3,
    },
    {
      id: "DEN",
      city: "Denver",
      name: "Nuggets",
      conf: "West",
      div: "Northwest",
      tier: 1,
    },
    {
      id: "MIN",
      city: "Minnesota",
      name: "Timberwolves",
      conf: "West",
      div: "Northwest",
      tier: 1,
    },
    {
      id: "OKC",
      city: "Oklahoma City",
      name: "Thunder",
      conf: "West",
      div: "Northwest",
      tier: 1,
    },
    {
      id: "POR",
      city: "Portland",
      name: "Trail Blazers",
      conf: "West",
      div: "Northwest",
      tier: 3,
    },
    {
      id: "UTA",
      city: "Utah",
      name: "Jazz",
      conf: "West",
      div: "Northwest",
      tier: 3,
    },
    {
      id: "GSW",
      city: "Golden State",
      name: "Warriors",
      conf: "West",
      div: "Pacific",
      tier: 1,
    },
    {
      id: "LAC",
      city: "Los Angeles",
      name: "Clippers",
      conf: "West",
      div: "Pacific",
      tier: 2,
    },
    {
      id: "LAL",
      city: "Los Angeles",
      name: "Lakers",
      conf: "West",
      div: "Pacific",
      tier: 1,
    },
    {
      id: "PHX",
      city: "Phoenix",
      name: "Suns",
      conf: "West",
      div: "Pacific",
      tier: 1,
    },
    {
      id: "SAC",
      city: "Sacramento",
      name: "Kings",
      conf: "West",
      div: "Pacific",
      tier: 2,
    },
    {
      id: "DAL",
      city: "Dallas",
      name: "Mavericks",
      conf: "West",
      div: "Southwest",
      tier: 1,
    },
    {
      id: "HOU",
      city: "Houston",
      name: "Rockets",
      conf: "West",
      div: "Southwest",
      tier: 2,
    },
    {
      id: "MEM",
      city: "Memphis",
      name: "Grizzlies",
      conf: "West",
      div: "Southwest",
      tier: 2,
    },
    {
      id: "NOP",
      city: "New Orleans",
      name: "Pelicans",
      conf: "West",
      div: "Southwest",
      tier: 2,
    },
    {
      id: "SAS",
      city: "San Antonio",
      name: "Spurs",
      conf: "West",
      div: "Southwest",
      tier: 2,
    },
  ];

  // --- INITIALISATION ---
  async function init() {
    try {
      const res = await fetch("team.json");
      if (res.ok) {
        playersData = await res.json();
      }
    } catch (e) {
      console.error("Erreur de chargement de team.json", e);
    }

    const savedState = localStorage.getItem("nba_sim_state");
    if (savedState) {
      gameState = JSON.parse(savedState);
      showAppScreen();
    } else {
      showSelectionScreen();
    }
  }

  // --- TRANSITIONS D'ÉCRAN ---
  function showSelectionScreen() {
    selectionScreen.classList.add("active");
    appScreen.classList.remove("active");

    // Générer la grille d'équipes
    teamsSelectionGrid.innerHTML = "";
    LOCAL_TEAMS_LIST.forEach((team) => {
      const card = document.createElement("div");
      card.className = `team-select-card tier-${team.tier}`;

      let tierStars = "";
      for (let i = 0; i < 4 - team.tier; i++) {
        tierStars += '<i class="fa-solid fa-star"></i>';
      }

      card.innerHTML = `
        <div class="team-card-header">
          <span class="team-abbr">${team.id}</span>
          <span class="team-tier">${tierStars}</span>
        </div>
        <h3>${team.name}</h3>
        <span class="team-city">${team.city}</span>
        <div class="team-meta">
          <span>${team.conf}ern Conf.</span>
          <span>${team.div} Div.</span>
        </div>
      `;

      card.addEventListener("click", () => {
        const fullTeamName = team.city + " " + team.name;
        startNewSeason(fullTeamName);
      });

      teamsSelectionGrid.appendChild(card);
    });
  }

  function showAppScreen() {
    selectionScreen.classList.remove("active");
    appScreen.classList.add("active");

    // Configurer le menu actif
    setupTabs();
    updateAppView();
  }

  // --- ACTIONS DU MOTEUR ---
  function startNewSeason(teamName) {
    const response = window.SimulationEngine.handleAction("init_season", null, {
      userTeam: teamName,
      playersData: playersData,
    });
    if (response.success) {
      gameState = response.gameState;
      localStorage.setItem("nba_sim_state", JSON.stringify(gameState));
      showAppScreen();
      addNarrativeLog(response.narrative);
    } else {
      alert("Erreur lors du lancement de la saison: " + response.data.error);
    }
  }

  // --- NAVIGATION ---
  function setupTabs() {
    navItems.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabId = btn.getAttribute("data-tab");
        switchTab(tabId);
      });
    });
  }

  function switchTab(tabId) {
    activeTab = tabId;
    navItems.forEach((b) => {
      if (b.getAttribute("data-tab") === tabId) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    tabContents.forEach((content) => {
      if (content.id === tabId) {
        content.classList.add("active");
      } else {
        content.classList.remove("active");
      }
    });

    updateTabContent(tabId);
  }

  // --- RENDERING PAR TABS ---
  function updateAppView() {
    // Header & Sidebar
    const userTeam = gameState.teams[gameState.userTeam];
    userTeamBanner.innerHTML = `
      <div class="team-logo-small">${userTeam.id}</div>
      <span class="header-team-name">${gameState.userTeam}</span>
    `;

    // Stage badge
    if (gameState.stage === "regular_season") {
      currentStageBadge.textContent = "Saison Régulière";
      currentStageBadge.className = "stage-badge";
      navPlayoffsBtn.style.display = "none";
    } else if (
      gameState.stage === "playoffs" ||
      gameState.stage === "playoffs_init"
    ) {
      currentStageBadge.textContent = "Playoffs NBA";
      currentStageBadge.className =
        "stage-badge" + (gameState.stage === "playoffs" ? " text-warning" : "");
      navPlayoffsBtn.style.display = "block";
    } else if (gameState.stage === "ended") {
      currentStageBadge.textContent = "Saison Terminée";
      currentStageBadge.className = "stage-badge text-success";
      navPlayoffsBtn.style.display = "block";
    }

    sidebarWeekNum.textContent = `${gameState.currentWeek} / 24`;
    sidebarRecord.textContent = `${userTeam.wins} - ${userTeam.losses}`;

    let streakText = "-";
    let streakClass = "streak-neutral";
    if (userTeam.streak > 0) {
      streakText = `V${userTeam.streak}`;
      streakClass = "streak-win";
    } else if (userTeam.streak < 0) {
      streakText = `D${Math.abs(userTeam.streak)}`;
      streakClass = "streak-loss";
    }
    sidebarStreak.textContent = streakText;
    sidebarStreak.className = streakClass;

    // Mettre à jour le badge de messages
    if (gameState.inbox) {
      const unreadCount = gameState.inbox.filter((e) => !e.read).length;
      if (unreadCount > 0) {
        messagesBadge.textContent = unreadCount;
        messagesBadge.style.display = "inline-flex";
      } else {
        messagesBadge.style.display = "none";
      }
    } else {
      messagesBadge.style.display = "none";
    }

    // Rendre l'onglet actif
    updateTabContent(activeTab);
  }

  function updateTabContent(tabId) {
    if (!gameState) return;

    switch (tabId) {
      case "dashboard-tab":
        renderDashboard();
        break;
      case "calendar-tab":
        renderCalendar();
        break;
      case "standings-tab":
        renderStandings();
        break;
      case "roster-tab":
        renderRoster();
        break;
      case "free-agents-tab":
        renderFreeAgents();
        break;
      case "playoffs-tab":
        renderPlayoffs();
        break;
      case "messages-tab":
        renderMailbox();
        break;
    }
  }

  // --- RENDER : DASHBOARD ---
  function renderDashboard() {
    const userTeam = gameState.teams[gameState.userTeam];

    // Calculer les stats de l'équipe
    const healthyPlayers = userTeam.roster.filter((p) => !p.injury);
    const avgFatigue = Math.round(
      healthyPlayers.reduce((acc, p) => acc + p.fatigue, 0) /
        healthyPlayers.length || 0,
    );
    const avgMoral = Math.round(
      userTeam.roster.reduce((acc, p) => acc + p.moral, 0) /
        userTeam.roster.length || 0,
    );
    const injuredCount = userTeam.roster.filter((p) => p.injury).length;

    quickFatigue.textContent = `${avgFatigue}%`;
    quickFatigueBar.style.width = `${avgFatigue}%`;
    quickMoral.textContent = `${avgMoral}%`;
    quickMoralBar.style.width = `${avgMoral}%`;

    if (injuredCount > 0) {
      quickInjuries.textContent = `${injuredCount} joueur(s)`;
      quickInjuries.className = "stat-val text-danger";
    } else {
      quickInjuries.textContent = "Aucun";
      quickInjuries.className = "stat-val text-success";
    }

    // Afficher le prochain match
    nextMatchupPreview.innerHTML = "";

    if (gameState.stage === "regular_season") {
      const nextGame = gameState.schedule.find(
        (g) =>
          (g.home === gameState.userTeam || g.away === gameState.userTeam) &&
          !g.simulated,
      );

      if (nextGame) {
        const homeTeamObj = gameState.teams[nextGame.home];
        const awayTeamObj = gameState.teams[nextGame.away];
        const isUserHome = nextGame.home === gameState.userTeam;

        nextMatchupPreview.innerHTML = `
          <div class="matchup-team ${isUserHome ? "user" : ""}">
            <div class="matchup-team-logo">${homeTeamObj.id}</div>
            <span class="matchup-team-name">${nextGame.home}</span>
            <span class="matchup-team-record">${homeTeamObj.wins}V - ${homeTeamObj.losses}D</span>
          </div>
          <div class="matchup-versus">VS</div>
          <div class="matchup-team ${!isUserHome ? "user" : ""}">
            <div class="matchup-team-logo">${awayTeamObj.id}</div>
            <span class="matchup-team-name">${nextGame.away}</span>
            <span class="matchup-team-record">${awayTeamObj.wins}V - ${awayTeamObj.losses}D</span>
          </div>
        `;

        simGameBtn.style.display = "inline-flex";
        simWeekBtn.style.display = "inline-flex";
      } else {
        nextMatchupPreview.innerHTML = `
          <div class="text-center" style="width: 100%">
            <p style="font-family: var(--font-title); font-size: 1.2rem; font-weight: 700;">Saison régulière terminée !</p>
            <p class="text-muted" style="margin-top: 5px;">Cliquez sur simuler ou allez dans l'onglet Playoffs.</p>
          </div>
        `;
        simGameBtn.style.display = "none";
        simWeekBtn.style.display = "none";

        // Activer la transition playoffs
        if (gameState.stage === "playoffs_init") {
          const btn = document.createElement("button");
          btn.className = "btn btn-primary btn-large";
          btn.innerHTML = `<i class="fa-solid fa-trophy"></i> Lancer les Playoffs`;
          btn.addEventListener("click", () => {
            triggerOverlay("Initialisation des Playoffs...", 1000, () => {
              const res = window.SimulationEngine.handleAction(
                "advance_playoffs",
                gameState,
              );
              if (res.success) {
                gameState = res.gameState;
                localStorage.setItem(
                  "nba_sim_state",
                  JSON.stringify(gameState),
                );
                showAppScreen();
                switchTab("playoffs-tab");
                addNarrativeLog(res.narrative);
              }
            });
          });
          nextMatchupPreview.appendChild(btn);
        }
      }
    } else {
      // Playoffs en cours
      nextMatchupPreview.innerHTML = `
        <div class="text-center" style="width: 100%">
          <p style="font-family: var(--font-title); font-size: 1.2rem; font-weight: 700; color: var(--accent-gold);">
            <i class="fa-solid fa-trophy"></i> Playoffs en cours
          </p>
          <p class="text-muted" style="margin-top: 5px;">Suivez les séries et simulez les matchs dans l'onglet dédié.</p>
          <button class="btn btn-primary" style="margin-top: 15px;" onclick="document.getElementById('nav-playoffs-btn').click();">
            Aller aux Playoffs <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      `;
      simGameBtn.style.display = "none";
      simWeekBtn.style.display = "none";
    }
  }

  // Helper to generate the 7-day schedule for the user team
  function getUserWeekSchedule(weekNum) {
    const userTeam = gameState.userTeam;
    const weekGames = gameState.schedule.filter(
      (g) => g.week === weekNum && (g.home === userTeam || g.away === userTeam),
    );

    let gameDays = [];
    if (weekGames.length === 1) {
      gameDays = [4]; // Jeudi
    } else if (weekGames.length === 2) {
      gameDays = [2, 5]; // Mardi, Vendredi
    } else if (weekGames.length === 3) {
      gameDays = [1, 3, 5]; // Lundi, Mercredi, Vendredi
    } else if (weekGames.length >= 4) {
      gameDays = [1, 3, 5, 7]; // Lundi, Mercredi, Vendredi, Dimanche
    }

    const dayNames = [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ];
    const weekSchedule = [];

    const getNonGameActivity = (w, d) => {
      const activities = [
        {
          name: "Repos complet",
          desc: "Récupération physique des joueurs",
          type: "rest",
        },
        {
          name: "Entraînement collectif",
          desc: "Travail tactique des systèmes de jeu",
          type: "training",
        },
        {
          name: "Séance vidéo tactique",
          desc: "Analyse des forces et faiblesses de l'adversaire",
          type: "video",
        },
        {
          name: "Journée Média",
          desc: "Interviews et obligations presse",
          type: "media",
        },
        {
          name: "Entraînement physique",
          desc: "Musculation et conditionnement physique",
          type: "fitness",
        },
        {
          name: "Soirée d'équipe",
          desc: "Repas de cohésion pour booster le moral",
          type: "team_dinner",
        },
      ];
      const index = (w * 7 + d) % activities.length;
      return activities[index];
    };

    let gameIdx = 0;
    for (let d = 1; d <= 7; d++) {
      const isGameDay = gameDays.includes(d) && gameIdx < weekGames.length;
      if (isGameDay) {
        weekSchedule.push({
          dayNum: d,
          dayName: dayNames[d - 1],
          type: "game",
          game: weekGames[gameIdx++],
        });
      } else {
        const act = getNonGameActivity(weekNum, d);
        weekSchedule.push({
          dayNum: d,
          dayName: dayNames[d - 1],
          type: "activity",
          activity: act,
        });
      }
    }

    return weekSchedule;
  }

  // --- RENDER : CALENDAR ---
  function renderCalendar() {
    calendarGamesList.innerHTML = "";

    if (calendarFilter === "user") {
      const currentWeek = gameState.currentWeek;

      for (let w = 1; w <= 24; w++) {
        const weekSection = document.createElement("div");
        weekSection.className = "cal-week-section";
        if (w === currentWeek) {
          weekSection.style.borderColor = "var(--primary)";
          weekSection.style.boxShadow = "0 0 15px rgba(245, 158, 11, 0.15)";
        }

        const currentWeekLabel =
          w === currentWeek
            ? " <span class='badge' style='background: var(--primary); color: var(--bg-dark); border-radius: 4px; padding: 2px 6px; font-size: 0.65rem; margin-left: 10px; width: auto; height: auto; display: inline-block;'>SEMAINE COURANTE</span>"
            : "";
        weekSection.innerHTML = `
          <h3>Semaine ${w}${currentWeekLabel}</h3>
          <div class="cal-week-days-grid"></div>
        `;

        const grid = weekSection.querySelector(".cal-week-days-grid");
        const scheduleDays = getUserWeekSchedule(w);

        scheduleDays.forEach((day) => {
          const card = document.createElement("div");
          card.className = "cal-day-card";

          if (day.type === "game") {
            const game = day.game;
            const isHome = game.home === gameState.userTeam;
            const opponent = isHome ? game.away : game.home;
            const prefix = isHome ? "vs" : "@";

            let statusText = "Match à venir";
            let descText = `${prefix} ${opponent}`;
            let scoreText = "";

            if (game.simulated) {
              const uScore = isHome
                ? game.result.homeScore
                : game.result.awayScore;
              const oppScore = isHome
                ? game.result.awayScore
                : game.result.homeScore;
              const won = uScore > oppScore;
              statusText = won ? "Victoire" : "Défaite";
              scoreText = `${statusText} ${uScore}-${oppScore}`;
              descText = `${won ? "✅" : "❌"} ${scoreText} (${prefix} ${opponent})`;
            }

            card.innerHTML = `
              <div>
                <div class="cal-day-name">${day.dayName}</div>
                <div class="cal-day-type game">Match</div>
              </div>
              <div>
                <div class="cal-day-title">${prefix} ${opponent}</div>
                <div class="cal-day-desc">${descText}</div>
              </div>
            `;
            if (game.simulated) {
              card.querySelector(".cal-day-title").style.color =
                (game.result.homeScore > game.result.awayScore && isHome) ||
                (game.result.awayScore > game.result.homeScore && !isHome)
                  ? "var(--success)"
                  : "var(--danger)";
            }
          } else {
            const act = day.activity;
            card.innerHTML = `
              <div>
                <div class="cal-day-name">${day.dayName}</div>
                <div class="cal-day-type ${act.type}">${act.name}</div>
              </div>
              <div>
                <div class="cal-day-title" style="font-size: 0.8rem; color: #fff;">${act.name}</div>
                <div class="cal-day-desc">${act.desc}</div>
              </div>
            `;
          }

          grid.appendChild(card);
        });

        calendarGamesList.appendChild(weekSection);
      }
    } else {
      let games = gameState.schedule;
      const currentWeek = gameState.currentWeek;

      let filteredGames = games.filter(
        (g) => g.week >= currentWeek - 1 && g.week <= currentWeek + 1,
      );

      const note = document.createElement("div");
      note.style.gridColumn = "span 3";
      note.style.textAlign = "center";
      note.style.color = "var(--text-muted)";
      note.style.fontSize = "0.85rem";
      note.style.marginBottom = "10px";
      note.textContent = `Affichage des matchs des semaines ${Math.max(1, currentWeek - 1)} à ${Math.min(24, currentWeek + 1)}. Filtrer par "mon équipe" pour voir le calendrier complet de vos entraînements, repos et matchs.`;
      calendarGamesList.appendChild(note);

      filteredGames.forEach((game) => {
        const card = document.createElement("div");
        card.className = "calendar-item";

        const hWon =
          game.simulated && game.result.homeScore > game.result.awayScore;
        const aWon =
          game.simulated && game.result.awayScore > game.result.homeScore;

        card.innerHTML = `
          <span class="cal-week-badge">Semaine ${game.week}</span>
          <div class="cal-matchup">
            <div class="cal-team ${hWon ? "winner" : ""}">${game.home}</div>
            <div class="cal-score ${hWon ? "winner" : ""}">${game.simulated ? game.result.homeScore : ""}</div>
          </div>
          <div class="cal-matchup">
            <div class="cal-team ${aWon ? "winner" : ""}">${game.away}</div>
            <div class="cal-score ${aWon ? "winner" : ""}">${game.simulated ? game.result.awayScore : ""}</div>
          </div>
          <div class="cal-status ${game.simulated ? "simulated" : ""}">
            ${game.simulated ? '<i class="fa-solid fa-circle-check"></i> Terminé' : '<i class="fa-regular fa-clock"></i> À venir'}
          </div>
        `;
        calendarGamesList.appendChild(card);
      });
    }
  }

  // --- RENDER : STANDINGS ---
  function renderStandings() {
    standingsTableBody.innerHTML = "";

    const response = window.SimulationEngine.handleAction(
      "get_standings",
      gameState,
    );
    if (!response.success) return;

    const list = response.data.standings[activeStandingsConf];

    list.forEach((team, idx) => {
      const tr = document.createElement("tr");
      if (team.name === gameState.userTeam) {
        tr.className = "user-row";
      }

      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
        <td style="font-weight: 600;">${team.name}</td>
        <td style="text-align: center">${team.wins}</td>
        <td style="text-align: center">${team.losses}</td>
        <td style="text-align: center; font-family: var(--font-title); font-weight: 600;">${team.pct.toFixed(3)}</td>
        <td style="text-align: center">${team.gb}</td>
        <td style="text-align: center">${team.streak}</td>
        <td style="text-align: center; color: var(--text-muted); font-size: 0.85rem">${team.lastTen}</td>
        <td style="text-align: center; font-weight: 600;" class="${team.pointsDiff >= 0 ? "text-success" : "text-danger"}">
          ${team.pointsDiff >= 0 ? "+" : ""}${team.pointsDiff}
        </td>
      `;

      standingsTableBody.appendChild(tr);
    });
  }

  // --- RENDER : ROSTER ---
  function renderRoster() {
    rosterTableBody.innerHTML = "";

    const response = window.SimulationEngine.handleAction(
      "get_player_stats",
      gameState,
    );
    if (!response.success) return;

    const roster = response.data.playerStats;

    roster.forEach((p) => {
      const tr = document.createElement("tr");

      // Barre de fatigue
      let fatigueColor = "var(--success)";
      if (p.fatigue > 85) fatigueColor = "var(--danger)";
      else if (p.fatigue > 60) fatigueColor = "var(--warning)";

      // Barre de moral
      let moralColor = "var(--danger)";
      if (p.moral > 70) moralColor = "var(--success)";
      else if (p.moral > 40) moralColor = "var(--warning)";

      // Affichage blessure
      let nameHTML = p.name;
      let checkboxDisabled = "";

      if (p.injury) {
        let injuryClass =
          p.injury.severity === "grave" ? "text-danger" : "text-warning";
        nameHTML += ` <span class="${injuryClass}" style="font-size: 0.75rem; font-weight: 700;" title="${p.injury.name}">
          (${p.injury.severity === "grave" ? "OUT" : "DTD"} - ${p.injury.daysRemaining}j)
        </span>`;

        if (p.injury.severity === "grave") {
          checkboxDisabled = "disabled";
        }
      }

      tr.innerHTML = `
        <td>
          <label class="cb-container">
            <input type="checkbox" class="starter-checkbox" data-id="${p.id}" ${p.starter ? "checked" : ""} ${checkboxDisabled}>
            <span class="checkmark"></span>
          </label>
        </td>
        <td style="font-weight: 600;">${nameHTML}</td>
        <td style="text-align: center; font-weight: 700; color: var(--text-muted);">${p.position}</td>
        <td style="text-align: center">${p.age}</td>
        <td style="text-align: center; font-weight: 700;">${p.rating}</td>
        <td>
          <div class="table-bar-container">
            <span class="table-bar-val">${p.fatigue}</span>
            <div class="table-bar">
              <div class="table-bar-fill" style="width: ${p.fatigue}%; background-color: ${fatigueColor}"></div>
            </div>
          </div>
        </td>
        <td>
          <div class="table-bar-container">
            <span class="table-bar-val">${p.moral}</span>
            <div class="table-bar">
              <div class="table-bar-fill" style="width: ${p.moral}%; background-color: ${moralColor}"></div>
            </div>
          </div>
        </td>
        <td style="text-align: center">${p.gp}</td>
        <td style="text-align: center; font-weight: 600;">${p.ppg}</td>
        <td style="text-align: center">${p.rpg}</td>
        <td style="text-align: center">${p.apg}</td>
        <td style="text-align: center">${p.spg}</td>
        <td style="text-align: center">${p.bpg}</td>
        <td style="text-align: center">
          <button class="release-btn" data-id="${p.id}" title="Libérer le joueur en Agent Libre">
            <i class="fa-solid fa-user-minus"></i> Libérer
          </button>
        </td>
      `;

      rosterTableBody.appendChild(tr);
    });

    // Ajouter des écouteurs sur les boutons "Libérer"
    const releaseButtons = rosterTableBody.querySelectorAll(".release-btn");
    releaseButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const playerId = btn.getAttribute("data-id");
        if (
          confirm(
            "Voulez-vous vraiment libérer ce joueur de votre effectif ? Il rejoindra les agents libres.",
          )
        ) {
          const response = window.SimulationEngine.handleAction(
            "release_player",
            gameState,
            { playerId },
          );
          if (response.success) {
            gameState = response.gameState;
            localStorage.setItem("nba_sim_state", JSON.stringify(gameState));
            updateAppView();
            addNarrativeLog(response.narrative);
            renderAlerts(response.alerts);
          } else {
            alert(
              response.data.error || "Erreur lors de la libération du joueur.",
            );
          }
        }
      });
    });

    // Ajouter des écouteurs sur les checkboxes pour validation du majeur
    const checkBoxes = document.querySelectorAll(".starter-checkbox");
    checkBoxes.forEach((cb) => {
      cb.addEventListener("change", validateLineupSelection);
    });

    validateLineupSelection();
  }

  function validateLineupSelection() {
    const checked = document.querySelectorAll(".starter-checkbox:checked");
    const count = checked.length;

    rotationMessage.className = "rotation-info-msg";

    if (count === 5) {
      saveRotationBtn.disabled = false;
      rotationMessage.textContent =
        "5 titulaires sélectionnés. Prêt à enregistrer.";
      rotationMessage.classList.add("text-success");
    } else {
      saveRotationBtn.disabled = true;
      rotationMessage.textContent = `Sélectionnez exactement 5 titulaires (actuellement : ${count}).`;
      rotationMessage.classList.add("text-danger");
    }
  }

  saveRotationBtn.addEventListener("click", () => {
    const checked = document.querySelectorAll(".starter-checkbox:checked");
    const lineup = Array.from(checked).map((cb) => cb.getAttribute("data-id"));

    const response = window.SimulationEngine.handleAction(
      "set_lineup",
      gameState,
      { lineup },
    );
    if (response.success) {
      gameState = response.gameState;
      localStorage.setItem("nba_sim_state", JSON.stringify(gameState));
      updateAppView();

      rotationMessage.textContent = "Rotation enregistrée avec succès !";
      rotationMessage.className = "rotation-info-msg text-success";
      setTimeout(() => {
        if (activeTab === "roster-tab") validateLineupSelection();
      }, 2000);
    } else {
      alert("Erreur de rotation : " + response.data.error);
    }
  });

  // --- RENDER : PLAYOFFS BRACKET ---
  function renderPlayoffs() {
    window.PlayoffSimView.render(gameState);
  }

  // --- RENDER : FREE AGENTS ---
  function renderFreeAgents() {
    const userTeam = gameState.teams[gameState.userTeam];
    const freeAgents = gameState.freeAgents || [];

    // Update salary info
    const availableSalary = userTeam.salary_cap - userTeam.used_salary;
    document.getElementById("available-salary").textContent =
      (availableSalary / 1000000).toFixed(1) + "M$";
    document.getElementById("used-salary").textContent =
      (userTeam.used_salary / 1000000).toFixed(1) + "M$";
    document.getElementById("free-agents-count").textContent =
      freeAgents.length;

    const tableBody = document.getElementById("free-agents-table-body");
    tableBody.innerHTML = "";

    if (freeAgents.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="7" style="text-align: center; padding: 30px; color: var(--text-muted);">Aucun agent libre disponible pour le moment.</td>`;
      tableBody.appendChild(row);
      return;
    }

    freeAgents.forEach((player) => {
      const row = document.createElement("tr");
      // Calculate salary if it doesn't exist (backward compatibility)
      const playerSalary =
        player.salary ||
        window.SimulationEngine.calculateSalaryForDisplay(
          player.rating,
          player.starter || false,
        );
      const canSign = playerSalary <= availableSalary;
      const signButtonClass = canSign ? "btn-sign" : "btn-sign unavailable";
      const signButtonText = canSign ? "Signer" : "Pas d'espace";
      const signButtonDisabled = canSign ? "" : "disabled";

      row.innerHTML = `
        <td>${player.name}</td>
        <td style="text-align: center">${player.position}</td>
        <td style="text-align: center">${player.age}</td>
        <td style="text-align: center">${player.rating}</td>
        <td style="text-align: center"><span class="salary-badge">${(playerSalary / 1000000).toFixed(1)}M$</span></td>
        <td style="text-align: center">${player.originalTeam}</td>
        <td style="text-align: center">
          <button class="${signButtonClass}" ${signButtonDisabled} onclick="signFreeAgent('${player.id}')">
            ${signButtonText}
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  window.signFreeAgent = function (faPlayerId) {
    if (!gameState) return;

    const res = window.SimulationEngine.handleAction(
      "sign_free_agent",
      gameState,
      { faPlayerId },
    );
    if (res.success) {
      gameState = res.gameState;
      localStorage.setItem("nba_sim_state", JSON.stringify(gameState));
      renderFreeAgents();
      updateAppView();
      addNarrativeLog(res.narrative);

      if (res.alerts && res.alerts.length > 0) {
        displayAlerts(res.alerts);
      }
    } else {
      alert("Erreur: " + res.data.error);
    }
  };

  // --- MAILBOX RENDERING & ACTIONS ---
  function renderMailbox() {
    const inbox = gameState.inbox || [];
    const unreadCount = inbox.filter((e) => !e.read).length;
    unreadCountText.textContent = `${unreadCount} non lu(s)`;

    emailListItems.innerHTML = "";

    if (inbox.length === 0) {
      emailListItems.innerHTML = `
        <div class="empty-mailbox">
          <i class="fa-regular fa-folder-open"></i>
          <p>Aucun message reçu.</p>
        </div>
      `;
      renderEmailDetail(null);
      return;
    }

    // Sort: newest first
    const sortedInbox = [...inbox].reverse();

    // Default select first email if nothing selected or currently selected doesn't exist
    if (!selectedEmailId && sortedInbox.length > 0) {
      selectedEmailId = sortedInbox[0].id;
    }

    sortedInbox.forEach((email) => {
      const item = document.createElement("div");
      item.className = `email-item ${!email.read ? "unread" : ""} ${email.id === selectedEmailId ? "active" : ""}`;

      let avatarContent = "";
      let avatarClass = "";
      if (email.senderAvatar === "OWN") {
        avatarContent = `<i class="fa-solid fa-crown" style="font-size: 0.8rem;"></i>`;
        avatarClass = "own-type";
      } else if (email.senderAvatar === "FA") {
        avatarContent = `<i class="fa-solid fa-user-plus" style="font-size: 0.8rem;"></i>`;
        avatarClass = "fa-type";
      } else if (email.senderAvatar === "PL") {
        avatarContent = `<i class="fa-solid fa-user" style="font-size: 0.8rem;"></i>`;
        avatarClass = "pl-type";
      } else if (email.senderAvatar === "SC") {
        avatarContent = `<i class="fa-solid fa-magnifying-glass" style="font-size: 0.8rem;"></i>`;
        avatarClass = "";
      } else {
        avatarContent = email.senderAvatar || "GM";
        avatarClass = "";
      }

      item.innerHTML = `
        <div class="email-avatar ${avatarClass}">${avatarContent}</div>
        <div class="email-item-content">
          <div class="email-item-meta">
            <span class="email-sender">${email.sender}</span>
            <span class="email-week">Sem. ${email.week}</span>
          </div>
          <p class="email-subject">${email.subject}${!email.read ? '<span class="unread-dot"></span>' : ""}</p>
        </div>
      `;

      item.addEventListener("click", () => {
        selectedEmailId = email.id;

        // Mark as read
        const res = window.SimulationEngine.handleAction(
          "read_email",
          gameState,
          { emailId: email.id },
        );
        if (res.success) {
          gameState = res.gameState;
          localStorage.setItem("nba_sim_state", JSON.stringify(gameState));

          // Re-render
          renderMailbox();
          // Update sidebar badge
          const newUnread = gameState.inbox.filter((e) => !e.read).length;
          if (newUnread > 0) {
            messagesBadge.textContent = newUnread;
            messagesBadge.style.display = "inline-flex";
          } else {
            messagesBadge.style.display = "none";
          }
        }
      });

      emailListItems.appendChild(item);
    });

    // Render detail pane
    const selectedEmail = inbox.find((e) => e.id === selectedEmailId);
    renderEmailDetail(selectedEmail);
  }

  function renderEmailDetail(email) {
    if (!email) {
      emailDetailView.innerHTML = `
        <div class="empty-email-detail">
          <i class="fa-solid fa-envelope-open-text"></i>
          <p>Sélectionnez un message dans la liste pour l'afficher.</p>
        </div>
      `;
      return;
    }

    let avatarContent = "";
    let avatarClass = "";
    if (email.senderAvatar === "OWN") {
      avatarContent = `<i class="fa-solid fa-crown" style="font-size: 1rem;"></i>`;
      avatarClass = "own-type";
    } else if (email.senderAvatar === "FA") {
      avatarContent = `<i class="fa-solid fa-user-plus" style="font-size: 1rem;"></i>`;
      avatarClass = "fa-type";
    } else if (email.senderAvatar === "PL") {
      avatarContent = `<i class="fa-solid fa-user" style="font-size: 1rem;"></i>`;
      avatarClass = "pl-type";
    } else if (email.senderAvatar === "SC") {
      avatarContent = `<i class="fa-solid fa-magnifying-glass" style="font-size: 1rem;"></i>`;
      avatarClass = "";
    } else {
      avatarContent = email.senderAvatar || "GM";
      avatarClass = "";
    }

    let actionsHTML = "";
    if (email.actionable) {
      if (email.status === "pending") {
        actionsHTML = `
          <button class="btn btn-primary" id="email-action-accept">
            <i class="fa-solid fa-check"></i> Accepter la proposition
          </button>
          <button class="btn btn-danger-outline" id="email-action-decline">
            <i class="fa-solid fa-xmark"></i> Décliner
          </button>
        `;
      } else if (email.status === "accepted") {
        actionsHTML = `<span class="text-success" style="font-weight: 600;"><i class="fa-solid fa-circle-check"></i> Proposition acceptée</span>`;
      } else if (email.status === "declined") {
        actionsHTML = `<span class="text-danger" style="font-weight: 600;"><i class="fa-solid fa-circle-xmark"></i> Proposition déclinée</span>`;
      }
    }

    emailDetailView.innerHTML = `
      <div class="email-detail-header">
        <div class="email-avatar ${avatarClass}" style="width: 50px; height: 50px; font-size: 1.1rem;">${avatarContent}</div>
        <div class="email-detail-header-info">
          <div class="email-detail-sender-line">
            <span class="email-detail-sender">${email.sender}</span>
            <span class="email-detail-date">Reçu : Semaine ${email.week}</span>
          </div>
          <h2 class="email-detail-subject">${email.subject}</h2>
        </div>
      </div>
      <div class="email-detail-body">
        ${email.body.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}
      </div>
      <div class="email-detail-actions" id="email-actions-container">
        ${actionsHTML}
      </div>
    `;

    // Bind action buttons
    const acceptBtn = document.getElementById("email-action-accept");
    const declineBtn = document.getElementById("email-action-decline");

    if (acceptBtn && declineBtn) {
      acceptBtn.addEventListener("click", () => {
        resolveEmailProposal(email.id, true);
      });
      declineBtn.addEventListener("click", () => {
        resolveEmailProposal(email.id, false);
      });
    }
  }

  function resolveEmailProposal(emailId, accept) {
    triggerOverlay("Traitement de l'action en cours...", 800, () => {
      const response = window.SimulationEngine.handleAction(
        "resolve_email",
        gameState,
        {
          emailId: emailId,
          accept: accept,
        },
      );

      if (response.success) {
        gameState = response.gameState;
        localStorage.setItem("nba_sim_state", JSON.stringify(gameState));

        // Refresh the view
        updateAppView();

        // Log narratif
        addNarrativeLog(response.narrative);

        // Alertes
        renderAlerts(response.alerts);
      } else {
        alert("Erreur de traitement : " + response.data.error);
      }
    });
  }

  // --- ACTIONS DE SIMULATION BOUTONS ---

  simGameBtn.addEventListener("click", () => {
    const nextGame = gameState.schedule.find(
      (g) =>
        (g.home === gameState.userTeam || g.away === gameState.userTeam) &&
        !g.simulated,
    );
    if (nextGame) {
      const homeTeam = gameState.teams[nextGame.home];
      const awayTeam = gameState.teams[nextGame.away];
      window.LiveMatchUI.openLiveMatchOverlay(
        homeTeam,
        awayTeam,
        gameState.stage,
        (simResult) => {
          const response = window.SimulationEngine.handleAction(
            "save_live_game_result",
            gameState,
            {
              gameId: nextGame.id,
              result: simResult.result,
              alerts: simResult.alerts,
            },
          );
          if (response.success) {
            gameState = response.gameState;
            localStorage.setItem("nba_sim_state", JSON.stringify(gameState));
            updateAppView();
            addNarrativeLog(response.narrative);
            renderAlerts(response.alerts);
          } else {
            alert("Erreur d'enregistrement du match : " + response.data.error);
          }
        },
      );
    } else {
      triggerOverlay("Simulation du match en cours...", 600, () => {
        const response = window.SimulationEngine.handleAction(
          "simulate_game",
          gameState,
        );
        if (response.success) {
          gameState = response.gameState;
          localStorage.setItem("nba_sim_state", JSON.stringify(gameState));
          updateAppView();
          addNarrativeLog(response.narrative);
          renderAlerts(response.alerts);
        } else {
          alert("Erreur de simulation : " + response.data.error);
        }
      });
    }
  });

  simWeekBtn.addEventListener("click", () => {
    triggerOverlay("Simulation de la semaine NBA...", 1200, () => {
      const response = window.SimulationEngine.handleAction(
        "simulate_week",
        gameState,
      );
      if (response.success) {
        gameState = response.gameState;
        localStorage.setItem("nba_sim_state", JSON.stringify(gameState));
        updateAppView();

        addNarrativeLog(response.narrative);
        renderAlerts(response.alerts);

        if (gameState.stage === "playoffs_init") {
          switchTab("dashboard-tab");
        }
      } else {
        alert("Erreur de simulation : " + response.data.error);
      }
    });
  });

  simPlayoffsStepBtn.addEventListener("click", () => {
    const pl = gameState.playoffs;
    if (!pl) return;

    const currentRound = pl.round;
    let activeSeriesList = [];
    if (currentRound <= 3) {
      activeSeriesList = [...pl.series.East, ...pl.series.West];
    } else if (currentRound === 4) {
      activeSeriesList = pl.series.Finals || [];
    }

    const userSeries = activeSeriesList.find(
      (s) => s.t1 === gameState.userTeam || s.t2 === gameState.userTeam,
    );
    const userSeriesFinished = userSeries
      ? userSeries.w1 === 4 || userSeries.w2 === 4
      : true;

    if (userSeries && !userSeriesFinished) {
      const gameIndex = userSeries.w1 + userSeries.w2;
      const isHomeT1 = [0, 1, 4, 6].includes(gameIndex);
      const homeTeamName = isHomeT1 ? userSeries.t1 : userSeries.t2;
      const awayTeamName = isHomeT1 ? userSeries.t2 : userSeries.t1;

      const homeTeam = gameState.teams[homeTeamName];
      const awayTeam = gameState.teams[awayTeamName];

      window.LiveMatchUI.openLiveMatchOverlay(
        homeTeam,
        awayTeam,
        gameState.stage,
        (simResult) => {
          const response1 = window.SimulationEngine.handleAction(
            "save_live_game_result",
            gameState,
            {
              isPlayoff: true,
              result: simResult.result,
              alerts: simResult.alerts,
            },
          );

          if (response1.success) {
            gameState = response1.gameState;

            const response2 = window.SimulationEngine.handleAction(
              "advance_other_playoffs",
              gameState,
            );
            if (response2.success) {
              gameState = response2.gameState;
              localStorage.setItem("nba_sim_state", JSON.stringify(gameState));
              updateAppView();
              addNarrativeLog(response1.narrative + " " + response2.narrative);
              renderAlerts([...response1.alerts, ...response2.alerts]);
            } else {
              alert(
                "Erreur de simulation des autres matchs: " +
                  response2.data.error,
              );
            }
          } else {
            alert(
              "Erreur d'enregistrement du match de playoff: " +
                response1.data.error,
            );
          }
        },
      );
    } else {
      triggerOverlay("Simulation des Playoffs...", 800, () => {
        const response = window.SimulationEngine.handleAction(
          "advance_playoffs",
          gameState,
        );
        if (response.success) {
          gameState = response.gameState;
          localStorage.setItem("nba_sim_state", JSON.stringify(gameState));
          updateAppView();
          addNarrativeLog(response.narrative);
          renderAlerts(response.alerts);
        } else {
          alert("Erreur de playoffs : " + response.data.error);
        }
      });
    }
  });

  // --- LOG NARRATIF ---
  function addNarrativeLog(text) {
    if (!text) return;

    // Supprimer le message vide par défaut
    const emptyMsg = narrativeBox.querySelector(".empty-narrative");
    if (emptyMsg) emptyMsg.remove();

    const timestamp = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const p = document.createElement("p");
    p.className = "narrative-log-item";
    p.innerHTML = `<span class="narrative-time">[${timestamp}]</span> ${text}`;

    narrativeBox.insertBefore(p, narrativeBox.firstChild);
  }

  function renderAlerts(alerts) {
    if (!alerts || alerts.length === 0) return;

    alerts.forEach((alertItem) => {
      const div = document.createElement("div");
      div.className = "alert-item";

      let icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
      if (alertItem.type === "injury") {
        icon = '<i class="fa-solid fa-kit-medical"></i>';
      }

      div.innerHTML = `${icon} <span><strong>${alertItem.team} :</strong> ${alertItem.detail}</span>`;

      alertsBox.insertBefore(div, alertsBox.firstChild);
    });
  }

  // --- FILTRES & TABS CLASSEMENT ---
  calFilterAll.addEventListener("click", () => {
    calendarFilter = "all";
    calFilterAll.classList.add("active");
    calFilterUser.classList.remove("active");
    renderCalendar();
  });

  calFilterUser.addEventListener("click", () => {
    calendarFilter = "user";
    calFilterUser.classList.add("active");
    calFilterAll.classList.remove("active");
    renderCalendar();
  });

  standingsConfBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      standingsConfBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeStandingsConf = btn.getAttribute("data-conf");
      renderStandings();
    });
  });

  // --- SPINNER OVERLAY ---
  function triggerOverlay(text, ms, callback) {
    overlayText.textContent = text;
    simOverlay.classList.add("active");

    setTimeout(() => {
      simOverlay.classList.remove("active");
      if (callback) callback();
    }, ms);
  }

  // --- RESET ---
  resetBtn.addEventListener("click", () => {
    confirmModal.classList.add("active");
  });

  confirmCancelBtn.addEventListener("click", () => {
    confirmModal.classList.remove("active");
  });

  confirmOkBtn.addEventListener("click", () => {
    confirmModal.classList.remove("active");
    localStorage.removeItem("nba_sim_state");
    gameState = null;
    narrativeBox.innerHTML =
      '<p class="empty-narrative">Bienvenue coach ! Lancez le premier match pour débuter l\'aventure.</p>';
    alertsBox.innerHTML = "";
    showSelectionScreen();
  });

  // Lancement de l'application
  init();
});
