(function() {
  window.PlayoffSimView = {
    render: function(gameState) {
      const playoffsBracket = document.getElementById("playoffs-bracket");
      const simPlayoffsStepBtn = document.getElementById("sim-playoffs-step-btn");
      if (!playoffsBracket) return;

      playoffsBracket.innerHTML = "";

      if (!gameState.playoffs) {
        playoffsBracket.innerHTML = `<p class="empty-narrative">Les playoffs n'ont pas encore commencé. Jouez la saison régulière jusqu'au bout !</p>`;
        if (simPlayoffsStepBtn) simPlayoffsStepBtn.style.display = "none";
        return;
      }

      if (simPlayoffsStepBtn) {
        simPlayoffsStepBtn.style.display = "inline-flex";
        if (gameState.stage === "ended") {
          simPlayoffsStepBtn.style.display = "none";
        }
      }

      const pl = gameState.playoffs;

      // Créer la division Est
      const eastSection = document.createElement("div");
      eastSection.className = "bracket-conf";
      eastSection.innerHTML = `<div class="bracket-conf-title">Conférence Est</div>`;
      
      const eastRounds = document.createElement("div");
      eastRounds.className = "bracket-rounds";
      
      // Rendre les rounds de l'Est
      const r1East = renderPlayoffRoundHTML(pl.series.East, 1, pl.round);
      eastRounds.appendChild(r1East);

      if (pl.round >= 2) {
        const r2East = renderPlayoffRoundHTML(pl.series.East, 2, pl.round);
        eastRounds.appendChild(r2East);
      }
      if (pl.round >= 3) {
        const r3East = renderPlayoffRoundHTML(pl.series.East, 3, pl.round);
        eastRounds.appendChild(r3East);
      }
      eastSection.appendChild(eastRounds);

      // Créer les Finales au centre
      const finalsSection = document.createElement("div");
      finalsSection.className = "bracket-finals";
      
      if (pl.series.Finals && pl.series.Finals.length > 0) {
        const fSeries = pl.series.Finals[0];
        const gameIndex = fSeries.w1 + fSeries.w2;
        const finished = fSeries.w1 === 4 || fSeries.w2 === 4;

        finalsSection.innerHTML = `
          <div class="finals-badge">
            <i class="fa-solid fa-trophy"></i>
            <span class="finals-title">Finales NBA</span>
          </div>
          <div class="bracket-matchup" style="width: 180px; padding: 15px;">
            <div class="bracket-team-row ${fSeries.w1 === 4 ? 'winner' : ''}">
              <span class="bracket-team-name">${fSeries.t1}</span>
              <span class="bracket-team-score">${fSeries.w1}</span>
            </div>
            <div class="bracket-team-row ${fSeries.w2 === 4 ? 'winner' : ''}">
              <span class="bracket-team-name">${fSeries.t2}</span>
              <span class="bracket-team-score">${fSeries.w2}</span>
            </div>
          </div>
        `;

        if (finished) {
          const champName = fSeries.w1 === 4 ? fSeries.t1 : fSeries.t2;
          finalsSection.innerHTML += `
            <div class="text-success" style="margin-top: 15px; font-weight: 800; text-align: center;">
              <p>CHAMPION NBA</p>
              <p style="font-family: var(--font-title); font-size: 1.3rem;">${champName}</p>
            </div>
          `;
        } else {
          finalsSection.innerHTML += `<p class="text-muted" style="font-size: 0.8rem">Match ${gameIndex+1}</p>`;
        }
      } else {
        finalsSection.innerHTML = `
          <div class="finals-badge" style="opacity: 0.3">
            <i class="fa-solid fa-trophy"></i>
            <span class="finals-title">Finales NBA</span>
          </div>
        `;
      }

      // Créer la division Ouest
      const westSection = document.createElement("div");
      westSection.className = "bracket-conf";
      westSection.innerHTML = `<div class="bracket-conf-title">Conférence Ouest</div>`;
      
      const westRounds = document.createElement("div");
      westRounds.className = "bracket-rounds";

      const r1West = renderPlayoffRoundHTML(pl.series.West, 1, pl.round);
      westRounds.appendChild(r1West);

      if (pl.round >= 2) {
        const r2West = renderPlayoffRoundHTML(pl.series.West, 2, pl.round);
        westRounds.appendChild(r2West);
      }
      if (pl.round >= 3) {
        const r3West = renderPlayoffRoundHTML(pl.series.West, 3, pl.round);
        westRounds.appendChild(r3West);
      }
      westSection.appendChild(westRounds);

      // Ajouter les sections au DOM
      playoffsBracket.appendChild(eastSection);
      playoffsBracket.appendChild(finalsSection);
      playoffsBracket.appendChild(westSection);
    }
  };

  function renderPlayoffRoundHTML(seriesList, roundToShow, activeRound) {
    const roundDiv = document.createElement("div");
    roundDiv.className = "bracket-round";

    if (roundToShow === activeRound) {
      seriesList.forEach(series => {
        const matchDiv = document.createElement("div");
        matchDiv.className = "bracket-matchup";

        const t1Winner = series.w1 === 4;
        const t2Winner = series.w2 === 4;

        matchDiv.innerHTML = `
          <div class="bracket-team-row ${t1Winner ? 'winner' : ''}">
            <span class="bracket-team-name" title="${series.t1}">${series.t1}</span>
            <span class="bracket-team-score">${series.w1}</span>
          </div>
          <div class="bracket-team-row ${t2Winner ? 'winner' : ''}">
            <span class="bracket-team-name" title="${series.t2}">${series.t2}</span>
            <span class="bracket-team-score">${series.w2}</span>
          </div>
        `;
        roundDiv.appendChild(matchDiv);
      });
    } else {
      const count = roundToShow === 1 ? 4 : (roundToShow === 2 ? 2 : 1);
      for (let i = 0; i < count; i++) {
        const dummy = document.createElement("div");
        dummy.className = "bracket-matchup";
        dummy.style.opacity = "0.2";
        dummy.style.borderStyle = "dashed";
        dummy.innerHTML = `
          <div class="bracket-team-row"><span>--</span></div>
          <div class="bracket-team-row"><span>--</span></div>
        `;
        roundDiv.appendChild(dummy);
      }
    }

    return roundDiv;
  }
})();
