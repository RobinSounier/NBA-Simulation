(function () {
  const COMMENTARY_TEMPLATES = {
    three_pointer_made: [
      "{player} est absolument seul derrière l'arc... et c'est dedans ! Trois points !",
      "Tir lointain de {player}... FICELLE ! Quelle précision !",
      "{player} tente sa chance à longue distance... PANIER ! Magnifique shoot !",
      "Shoot à trois points déclenché par {player}... Réussi ! Quel sniper !",
    ],
    three_pointer_missed: [
      "{player} tente un tir difficile à trois points... mais ça tape l'arceau !",
      "Shoot à longue distance de {player}... court ! Rebond à disputer.",
      "{player} force un peu son tir derrière l'arc... Raté !",
      "Tentative à trois points pour {player}... C'est à côté !",
    ],
    two_pointer_made: [
      "{player} s'infiltre dans la raquette et score avec un lay-up facile.",
      "Joli tir mi-distance de {player} qui trouve le filet !",
      "{player} prend le dessus sur son défenseur et marque à deux points !",
      "Panier en puissance de {player} sous le cercle !",
    ],
    two_pointer_missed: [
      "{player} tente un lay-up contesté... ça roule sur le cercle et ressort !",
      "Tir mi-distance de {player}... trop long ! C'est raté.",
      "{player} cherche le contact mais rate son tir sous le panier !",
      "Shoot mi-distance de {player}... manqué !",
    ],
    dunk_made: [
      "{player} s'envole et écrase un DUNK monstrueux ! Quel poster !",
      "Contre-attaque éclair conclue par un dunk rageur de {player} !",
      "{player} récupère la balle et claque un énorme dunk à deux mains !",
    ],
    assist: [
      " (Superbe passe décisive de {passer} !)",
      " (Bien servi par {passer}.)",
      " (Sur un service parfait de {passer}.)",
      " (Grâce à une belle lecture de jeu de {passer}.)",
    ],
    def_rebound: [
      "{player} s'impose dans les airs et capte le rebond défensif.",
      "Rebond sécurisé en défense par {player}.",
      "{player} récupère le ballon après ce tir manqué.",
      "Bonne boîte sur le tireur et rebond tranquille pour {player}.",
    ],
    off_rebound: [
      "{player} surgit de nulle part et arrache le rebond offensif !",
      "Rebond offensif capté par {player} qui offre une seconde chance !",
      "Deuxième chance pour l'attaque suite au rebond offensif de {player}.",
    ],
    block: [
      "Contre énorme de {player} qui renvoie le ballon en tribunes ! NON NON NON !",
      "La tentative de tir est rejetée avec autorité par {player} !",
      "{player} lit parfaitement le geste et bâche son adversaire !",
    ],
    steal: [
      "Interception de {player} qui lit parfaitement la passe !",
      "{player} chipe le ballon dans les mains de son vis-à-vis !",
      "Mauvaise passe interceptée proprement par {player}.",
    ],
    turnover: [
      "Perte de balle de {player} qui commet une erreur de manipulation.",
      "Mauvaise passe de {player} qui sort directement des limites du terrain.",
      "{player} se fait sanctionner pour marcher (marcher).",
    ],
    foul: [
      "Faute sifflée contre {player} pour un contact excessif.",
      "Faute défensive de {player} qui coupe l'action.",
      "{player} commet une faute sur le drive de l'attaquant.",
    ],
    free_throw_made: [
      "{player} se présente sur la ligne... et convertit le premier lancer franc.",
      "{player} ajuste la mire et marque son lancer franc.",
      "Lancer franc réussi par {player}.",
    ],
    free_throw_missed: [
      "{player} rate sa tentative sur la ligne des lancers.",
      "Le lancer franc de {player} rebondit sur l'arceau et ressort.",
      "Échec de {player} sur ce lancer franc.",
    ],
    injury: [
      "OH NON ! {player} grimace et semble s'être blessé sur cette action !",
      "Alerte médicale : {player} se tient le genou et doit quitter le terrain !",
      "Coup dur pour l'équipe, {player} sort sur blessure accompagné par les soigneurs.",
    ],
    ot_start: [
      "Fin du temps réglementaire ! Égalité parfaite ! Nous partons en PROLONGATION (OT) !",
      "Incroyable suspense ! Les deux équipes n'ont pas pu se départager. Place aux prolongations !",
    ],
    end_quarter: [
      "Fin du quart-temps {q} ! Score actuel : {homeScore} - {awayScore}.",
    ],
  };

  const INJURY_TYPES = [
    {
      name: "Entorse de la cheville",
      severity: "Moyenne",
      minDays: 5,
      maxDays: 14,
    },
    { name: "Douleur au genou", severity: "Légère", minDays: 2, maxDays: 6 },
    {
      name: "Contracture musculaire",
      severity: "Légère",
      minDays: 3,
      maxDays: 8,
    },
    {
      name: "Déchirure des ligaments",
      severity: "Grave",
      minDays: 30,
      maxDays: 90,
    },
    {
      name: "Fracture du doigt",
      severity: "Moyenne",
      minDays: 12,
      maxDays: 24,
    },
  ];

  window.LiveMatchSim = {
    initLiveMatch: function (homeTeam, awayTeam, stage) {
      const getActiveStarters = (team) => {
        let starters = team.roster.filter((p) => p.starter && !p.injury);
        if (starters.length < 5) {
          const healthyBench = team.roster
            .filter((p) => !p.starter && !p.injury)
            .sort((a, b) => b.rating - a.rating);
          starters = starters.concat(
            healthyBench.slice(0, 5 - starters.length),
          );
        }
        return starters.slice(0, 5);
      };

      const activeHomeStarters = getActiveStarters(homeTeam);
      const activeAwayStarters = getActiveStarters(awayTeam);

      // Initialiser les stats des joueurs pour le match en direct
      const initPlayerStats = (team) => {
        const stats = {};
        team.roster.forEach((p) => {
          stats[p.id] = {
            id: p.id,
            name: p.name,
            position: p.position,
            min: 0,
            pts: 0,
            reb: 0,
            ast: 0,
            stl: 0,
            blk: 0,
            fouls: 0,
            injury: p.injury ? true : false,
          };
        });
        return stats;
      };

      const matchState = {
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        stage: stage,
        homeScore: 0,
        awayScore: 0,
        homeQuarters: [0, 0, 0, 0],
        awayQuarters: [0, 0, 0, 0],
        currentQuarter: 1,
        quarterTime: 720, // 12 minutes in seconds
        possession: Math.random() > 0.5 ? "home" : "away",
        activeHomeStarters: activeHomeStarters,
        activeAwayStarters: activeAwayStarters,
        homeStats: initPlayerStats(homeTeam),
        awayStats: initPlayerStats(awayTeam),
        commentaries: [],
        finished: false,
        alerts: [],
      };

      // Welcome commentary
      matchState.commentaries.push({
        text: `Bienvenue à l'arène ! Coup d'envoi imminent entre les ${homeTeam.name} et les ${awayTeam.name}.`,
        type: "news",
        time: "12:00",
        q: 1,
      });

      return matchState;
    },

    stepLiveMatch: function (matchState) {
      if (matchState.finished) return matchState;

      // 1. Gérer le temps
      const timeRemaining = matchState.quarterTime;
      const possessionTime = Math.min(
        timeRemaining,
        Math.floor(Math.random() * 8) + 10,
      ); // 10 à 18 secondes (moyenne 14s)
      matchState.quarterTime -= possessionTime;

      const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
      };

      const clockStr = formatTime(matchState.quarterTime);
      const q = matchState.currentQuarter;

      // Substitutions automatiques basées sur le temps de jeu du quart-temps
      const getSubstitutes = (team, activeOnCourt) => {
        const roster = team.roster;
        const qTime = matchState.quarterTime;
        const qNum = matchState.currentQuarter;
        let useBench = false;

        // Plus de substitutions au cours du match
        if (qNum <= 4) {
          if (qNum === 1) {
            if (qTime <= 300)
              useBench = true; // 0-5 min: titulaires
            else if (qTime <= 600) useBench = false; // 5-10 min: remplaçants
          } else if (qNum === 2 || qNum === 3) {
            if (qTime <= 300)
              useBench = true; // début du quart: remplaçants
            else if (qTime <= 600) useBench = false; // milieu: titulaires reviennent
          } else if (qNum === 4) {
            if (qTime <= 300)
              useBench = false; // Q4 début: titulaires
            else if (qTime <= 600) useBench = true; // Q4 fin: remplaçants
          }
        } else {
          // Overtime: rotation plus fréquente
          useBench = Math.random() > 0.5;
        }

        const healthyStarters = roster.filter((p) => p.starter && !p.injury);
        const healthyBench = roster.filter((p) => !p.starter && !p.injury);

        if (useBench && healthyBench.length > 0) {
          const court = [];
          const usedBenchIds = new Set();

          healthyStarters.forEach((starter) => {
            let backup = healthyBench.find(
              (b) => b.position === starter.position && !usedBenchIds.has(b.id),
            );
            if (!backup) {
              const avail = healthyBench.filter((b) => !usedBenchIds.has(b.id));
              avail.sort((a, b) => b.rating - a.rating);
              if (avail.length > 0) {
                backup = avail[0];
              }
            }
            if (backup) {
              court.push(backup);
              usedBenchIds.add(backup.id);
            } else {
              court.push(starter);
            }
          });

          while (
            court.length < 5 &&
            healthyStarters.some((s) => !court.includes(s))
          ) {
            const nextStarter = healthyStarters.find((s) => !court.includes(s));
            court.push(nextStarter);
          }
          return court.slice(0, 5);
        } else {
          let court = [...healthyStarters];
          if (court.length < 5) {
            const healthyBenchSorted = healthyBench.sort(
              (a, b) => b.rating - a.rating,
            );
            court = court.concat(healthyBenchSorted.slice(0, 5 - court.length));
          }
          return court.slice(0, 5);
        }
      };

      const getNamesList = (players) =>
        players
          .map((p) => p.name)
          .sort()
          .join(", ");
      const prevHomeNames = getNamesList(matchState.activeHomeStarters);
      const prevAwayNames = getNamesList(matchState.activeAwayStarters);

      const nextHomeStarters = getSubstitutes(
        matchState.homeTeam,
        matchState.activeHomeStarters,
      );
      const nextAwayStarters = getSubstitutes(
        matchState.awayTeam,
        matchState.activeAwayStarters,
      );

      const nextHomeNames = getNamesList(nextHomeStarters);
      const nextAwayNames = getNamesList(nextAwayStarters);

      if (prevHomeNames !== nextHomeNames && matchState.quarterTime < 720) {
        matchState.commentaries.push({
          text: `Changement tactique pour les ${matchState.homeTeam.name}. Les remplaçants entrent en jeu.`,
          type: "news",
          time: clockStr,
          q: q,
        });
      }
      if (prevAwayNames !== nextAwayNames && matchState.quarterTime < 720) {
        matchState.commentaries.push({
          text: `Changement tactique pour les ${matchState.awayTeam.name}. Les remplaçants entrent en jeu.`,
          type: "news",
          time: clockStr,
          q: q,
        });
      }

      matchState.activeHomeStarters = nextHomeStarters;
      matchState.activeAwayStarters = nextAwayStarters;

      // Incrémenter les minutes jouées des 5 joueurs sur le terrain
      const addMinutes = (stats, starters, secs) => {
        starters.forEach((p) => {
          if (stats[p.id]) {
            stats[p.id].min += secs / 60;
          }
        });
      };

      addMinutes(
        matchState.homeStats,
        matchState.activeHomeStarters,
        possessionTime,
      );
      addMinutes(
        matchState.awayStats,
        matchState.activeAwayStarters,
        possessionTime,
      );

      const attackingTeam =
        matchState.possession === "home"
          ? matchState.homeTeam
          : matchState.awayTeam;
      const defendingTeam =
        matchState.possession === "home"
          ? matchState.awayTeam
          : matchState.homeTeam;
      const attackingStats =
        matchState.possession === "home"
          ? matchState.homeStats
          : matchState.awayStats;
      const defendingStats =
        matchState.possession === "home"
          ? matchState.awayStats
          : matchState.homeStats;
      const attackingStarters =
        matchState.possession === "home"
          ? matchState.activeHomeStarters
          : matchState.activeAwayStarters;
      const defendingStarters =
        matchState.possession === "home"
          ? matchState.activeAwayStarters
          : matchState.activeHomeStarters;

      // Moyennes des ratings
      const avgAttRating =
        attackingStarters.reduce((acc, p) => acc + p.rating, 0) / 5;
      const avgDefRating =
        defendingStarters.reduce((acc, p) => acc + p.rating, 0) / 5;

      // Blessure aléatoire extrêmement rare (0.04% chance par possession)
      if (Math.random() < 0.0004) {
        const teamObj =
          Math.random() > 0.5 ? matchState.homeTeam : matchState.awayTeam;
        const roster = teamObj.roster;
        const healthyOnCourt =
          teamObj === matchState.homeTeam
            ? matchState.activeHomeStarters
            : matchState.activeAwayStarters;

        if (healthyOnCourt.length > 0) {
          const injuredPlayer =
            healthyOnCourt[Math.floor(Math.random() * healthyOnCourt.length)];
          const injuryDef =
            INJURY_TYPES[Math.floor(Math.random() * INJURY_TYPES.length)];
          const duration =
            Math.floor(
              Math.random() * (injuryDef.maxDays - injuryDef.minDays + 1),
            ) + injuryDef.minDays;

          injuredPlayer.injury = {
            name: injuryDef.name,
            severity: injuryDef.severity,
            daysRemaining: duration,
            totalDays: duration,
          };

          // Remplacer le blessé par le meilleur joueur du banc sain
          const bench = roster
            .filter(
              (p) => !p.starter && !p.injury && !healthyOnCourt.includes(p),
            )
            .sort((a, b) => b.rating - a.rating);

          if (teamObj === matchState.homeTeam) {
            matchState.activeHomeStarters =
              matchState.activeHomeStarters.filter(
                (p) => p.id !== injuredPlayer.id,
              );
            if (bench.length > 0) matchState.activeHomeStarters.push(bench[0]);
            matchState.homeStats[injuredPlayer.id].injury = true;
          } else {
            matchState.activeAwayStarters =
              matchState.activeAwayStarters.filter(
                (p) => p.id !== injuredPlayer.id,
              );
            if (bench.length > 0) matchState.activeAwayStarters.push(bench[0]);
            matchState.awayStats[injuredPlayer.id].injury = true;
          }

          matchState.alerts.push({
            team: teamObj.city + " " + teamObj.name,
            player: injuredPlayer.name,
            type: "injury",
            detail: `${injuredPlayer.name} est blessé (${injuryDef.name}, sévérité: ${injuryDef.severity}, durée: ${duration} jours)`,
          });

          const template =
            COMMENTARY_TEMPLATES.injury[
              Math.floor(Math.random() * COMMENTARY_TEMPLATES.injury.length)
            ];
          matchState.commentaries.push({
            text: template.replace("{player}", injuredPlayer.name),
            type: "injury",
            time: clockStr,
            q: q,
          });

          // Changer de possession par précaution
          matchState.possession =
            matchState.possession === "home" ? "away" : "home";
          return matchState;
        }
      }

      // Sélectionner l'attaquant principal
      const attWeights = attackingStarters.map((p) => ({
        player: p,
        weight:
          p.rating * (p.position === "PG" || p.position === "SG" ? 1.3 : 1.0),
      }));
      const totalW = attWeights.reduce((acc, w) => acc + w.weight, 0);
      let rand = Math.random() * totalW;
      let selectedAttacker = attackingStarters[0];
      for (let w of attWeights) {
        rand -= w.weight;
        if (rand <= 0) {
          selectedAttacker = w.player;
          break;
        }
      }

      // Sélectionner un défenseur pour blocks/steals/fouls
      const selectedDefender =
        defendingStarters[Math.floor(Math.random() * defendingStarters.length)];

      // Déterminer l'issue de la possession
      const playRoll = Math.random();

      if (playRoll < 0.08) {
        // PERTE DE BALLE / INTERCEPTION (Turnover)
        const turnoverRoll = Math.random();
        if (turnoverRoll < 0.4) {
          // Interception
          defendingStats[selectedDefender.id].stl++;
          const txt = getStealString(selectedDefender.name);
          matchState.commentaries.push({
            text: txt,
            type: "steal",
            time: clockStr,
            q: q,
          });
        } else {
          // Perte de balle simple
          const txt = getTurnoverString(selectedAttacker.name);
          matchState.commentaries.push({
            text: txt,
            type: "turnover",
            time: clockStr,
            q: q,
          });
        }
        matchState.possession =
          matchState.possession === "home" ? "away" : "home";
      } else if (playRoll < 0.15) {
        // LANCERS FRANCS (Faute au tir)
        defendingStats[selectedDefender.id].fouls++;
        const foulTxt = getFoulString(selectedDefender.name);
        matchState.commentaries.push({
          text: foulTxt,
          type: "foul",
          time: clockStr,
          q: q,
        });

        const ftPct = 0.7 + (selectedAttacker.rating - 75) * 0.005;
        const ftCount = 2;
        let ftMade = 0;

        for (let i = 0; i < ftCount; i++) {
          const ftRoll = Math.random() < ftPct;
          if (ftRoll) {
            ftMade++;
            addPoints(matchState, 1);
            attackingStats[selectedAttacker.id].pts += 1;
            const ftTxt =
              getFreeThrowMadeString(selectedAttacker.name) +
              ` (${i + 1}/${ftCount})`;
            matchState.commentaries.push({
              text: ftTxt,
              type: "score-success",
              time: clockStr,
              q: q,
            });
          } else {
            const ftTxt =
              getFreeThrowMissedString(selectedAttacker.name) +
              ` (${i + 1}/${ftCount})`;
            matchState.commentaries.push({
              text: ftTxt,
              type: "miss",
              time: clockStr,
              q: q,
            });
          }
        }

        // Rebond si le dernier LF est raté
        if (ftMade < ftCount && Math.random() > 0.5) {
          handleRebound(
            matchState,
            defendingStarters,
            attackingStarters,
            defendingStats,
            attackingStats,
            clockStr,
            q,
          );
        } else {
          matchState.possession =
            matchState.possession === "home" ? "away" : "home";
        }
      } else if (playRoll < 0.46) {
        // TIR À 3 POINTS
        const threeProb =
          0.33 +
          (selectedAttacker.rating - 75) * 0.006 +
          (avgAttRating - avgDefRating) * 0.003;
        const isMade = Math.random() < threeProb;

        if (isMade) {
          addPoints(matchState, 3);
          attackingStats[selectedAttacker.id].pts += 3;

          const passer = getPasser(attackingStarters, selectedAttacker);
          let assistStr = "";
          if (passer) {
            attackingStats[passer.id].ast++;
            assistStr = getAssistString(passer.name);
          }

          const txt =
            getThreePointerMadeString(selectedAttacker.name) + assistStr;
          matchState.commentaries.push({
            text: txt,
            type: "score-success",
            time: clockStr,
            q: q,
          });
          matchState.possession =
            matchState.possession === "home" ? "away" : "home";
        } else {
          const txt = getThreePointerMissedString(selectedAttacker.name);
          matchState.commentaries.push({
            text: txt,
            type: "miss",
            time: clockStr,
            q: q,
          });
          handleRebound(
            matchState,
            defendingStarters,
            attackingStarters,
            defendingStats,
            attackingStats,
            clockStr,
            q,
          );
        }
      } else {
        // TIR À 2 POINTS (layup / dunk / mi-distance)
        const blockProb = 0.05 + (selectedDefender.rating - 75) * 0.002;
        const isBlocked =
          (selectedDefender.position === "C" ||
            selectedDefender.position === "PF") &&
          Math.random() < blockProb;

        if (isBlocked) {
          defendingStats[selectedDefender.id].blk++;
          const blockTxt = getBlockString(selectedDefender.name);
          matchState.commentaries.push({
            text: blockTxt,
            type: "block",
            time: clockStr,
            q: q,
          });
          handleRebound(
            matchState,
            defendingStarters,
            attackingStarters,
            defendingStats,
            attackingStats,
            clockStr,
            q,
          );
        } else {
          const twoProb =
            0.45 +
            (selectedAttacker.rating - 75) * 0.006 +
            (avgAttRating - avgDefRating) * 0.003;
          const isMade = Math.random() < twoProb;

          if (isMade) {
            const isDunk = Math.random() < 0.25;
            addPoints(matchState, 2);
            attackingStats[selectedAttacker.id].pts += 2;

            const passer = getPasser(attackingStarters, selectedAttacker);
            let assistStr = "";
            if (passer) {
              attackingStats[passer.id].ast++;
              assistStr = getAssistString(passer.name);
            }

            const txt =
              (isDunk
                ? getDunkMadeString(selectedAttacker.name)
                : getTwoPointerMadeString(selectedAttacker.name)) + assistStr;
            matchState.commentaries.push({
              text: txt,
              type: "score-success",
              time: clockStr,
              q: q,
            });
            matchState.possession =
              matchState.possession === "home" ? "away" : "home";
          } else {
            const txt = getTwoPointerMissedString(selectedAttacker.name);
            matchState.commentaries.push({
              text: txt,
              type: "miss",
              time: clockStr,
              q: q,
            });
            handleRebound(
              matchState,
              defendingStarters,
              attackingStarters,
              defendingStats,
              attackingStats,
              clockStr,
              q,
            );
          }
        }
      }

      // 3. Vérifier la fin du quart-temps
      if (matchState.quarterTime <= 0) {
        // Fin du quart-temps en cours
        const quarterEndText = COMMENTARY_TEMPLATES.end_quarter[0]
          .replace("{q}", q)
          .replace("{homeScore}", matchState.homeScore)
          .replace("{awayScore}", matchState.awayScore);

        matchState.commentaries.push({
          text: quarterEndText,
          type: "quarter-end",
          time: "0:00",
          q: q,
        });

        if (q < 4) {
          matchState.currentQuarter++;
          matchState.quarterTime = 720; // 12 minutes
          matchState.possession = Math.random() > 0.5 ? "home" : "away";
        } else {
          // Fin du match réglementaire
          if (matchState.homeScore === matchState.awayScore) {
            // Prolongations !
            matchState.currentQuarter++;
            matchState.quarterTime = 300; // 5 minutes en prolongation
            matchState.possession = Math.random() > 0.5 ? "home" : "away";
            matchState.commentaries.push({
              text: COMMENTARY_TEMPLATES.ot_start[
                Math.floor(Math.random() * COMMENTARY_TEMPLATES.ot_start.length)
              ],
              type: "news",
              time: "5:00",
              q: matchState.currentQuarter,
            });
          } else {
            // Match fini !
            matchState.finished = true;
            matchState.commentaries.push({
              text: `Fin du match ! Victoire finale de ${matchState.homeScore > matchState.awayScore ? matchState.homeTeam.name : matchState.awayTeam.name} (${matchState.homeScore}-${matchState.awayScore}) !`,
              type: "news",
              time: "0:00",
              q: q,
            });
            compileBoxScore(matchState);
          }
        }
      }

      return matchState;
    },
  };

  // Helper local pour ajouter les points
  function addPoints(matchState, points) {
    if (matchState.possession === "home") {
      matchState.homeScore += points;
      const idx = Math.min(matchState.currentQuarter - 1, 3);
      if (matchState.homeQuarters[idx] !== undefined) {
        matchState.homeQuarters[idx] += points;
      } else {
        matchState.homeQuarters.push(points); // OT
      }
    } else {
      matchState.awayScore += points;
      const idx = Math.min(matchState.currentQuarter - 1, 3);
      if (matchState.awayQuarters[idx] !== undefined) {
        matchState.awayQuarters[idx] += points;
      } else {
        matchState.awayQuarters.push(points); // OT
      }
    }
  }

  // Rebondeur
  function handleRebound(
    matchState,
    defStarters,
    attStarters,
    defStats,
    attStats,
    clockStr,
    q,
  ) {
    // 75% rebond défensif, 25% offensif
    const isDef = Math.random() < 0.75;
    const startersList = isDef ? defStarters : attStarters;
    const statsObj = isDef ? defStats : attStats;

    const rebWeights = startersList.map((p) => {
      let w = 1.0;
      if (p.position === "C") w = 3.5;
      else if (p.position === "PF") w = 2.5;
      else if (p.position === "SF") w = 1.5;
      return { player: p, w: w * p.rating };
    });

    const totalRebW = rebWeights.reduce((acc, rw) => acc + rw.w, 0);
    let r = Math.random() * totalRebW;
    let selectedRebounder = startersList[0];
    for (let rw of rebWeights) {
      r -= rw.w;
      if (r <= 0) {
        selectedRebounder = rw.player;
        break;
      }
    }

    statsObj[selectedRebounder.id].reb++;

    if (isDef) {
      const txt = getDefReboundString(selectedRebounder.name);
      matchState.commentaries.push({
        text: txt,
        type: "rebound",
        time: clockStr,
        q: q,
      });
      matchState.possession =
        matchState.possession === "home" ? "away" : "home";
    } else {
      const txt = getOffReboundString(selectedRebounder.name);
      matchState.commentaries.push({
        text: txt,
        type: "rebound",
        time: clockStr,
        q: q,
      });
      // Possession reste la même
    }
  }

  // Passeur
  function getPasser(starters, scorer) {
    if (Math.random() > 0.6) return null; // 60% passes décisives
    const otherStarters = starters.filter((p) => p.id !== scorer.id);
    if (otherStarters.length === 0) return null;

    const astWeights = otherStarters.map((p) => {
      let w = 1.0;
      if (p.position === "PG") w = 3.0;
      else if (p.position === "SG") w = 1.8;
      else if (p.position === "SF") w = 1.2;
      return { player: p, w: w * p.rating };
    });

    const totalAstW = astWeights.reduce((acc, aw) => acc + aw.w, 0);
    let r = Math.random() * totalAstW;
    let selected = otherStarters[0];
    for (let aw of astWeights) {
      r -= aw.w;
      if (r <= 0) {
        selected = aw.player;
        break;
      }
    }
    return selected;
  }

  // Compiler le box score final dans le format attendu par le SimulationEngine
  function compileBoxScore(matchState) {
    const buildPlayerStatsFormat = (stats, team) => {
      const compiled = {};
      Object.keys(stats).forEach((id) => {
        const ps = stats[id];
        // Arrondir les minutes
        const mins = Math.max(1, Math.round(ps.min));
        const plusMinus =
          matchState.homeScore > matchState.awayScore
            ? team === matchState.homeTeam
              ? Math.floor(Math.random() * 10) + 2
              : -Math.floor(Math.random() * 10) - 2
            : team === matchState.awayTeam
              ? Math.floor(Math.random() * 10) + 2
              : -Math.floor(Math.random() * 10) - 2;

        compiled[id] = {
          name: ps.name,
          position: ps.position,
          min: mins,
          pts: ps.pts,
          reb: ps.reb,
          ast: ps.ast,
          stl: ps.stl,
          blk: ps.blk,
          plusMinus: plusMinus,
        };
      });
      return compiled;
    };

    matchState.result = {
      homeScore: matchState.homeScore,
      awayScore: matchState.awayScore,
      homeQuarters: matchState.homeQuarters,
      awayQuarters: matchState.awayQuarters,
      homePlayerStats: buildPlayerStatsFormat(
        matchState.homeStats,
        matchState.homeTeam,
      ),
      awayPlayerStats: buildPlayerStatsFormat(
        matchState.awayStats,
        matchState.awayTeam,
      ),
    };
  }

  // Tiers de templates
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  function getThreePointerMadeString(name) {
    return pick(COMMENTARY_TEMPLATES.three_pointer_made).replace(
      "{player}",
      name,
    );
  }
  function getThreePointerMissedString(name) {
    return pick(COMMENTARY_TEMPLATES.three_pointer_missed).replace(
      "{player}",
      name,
    );
  }
  function getTwoPointerMadeString(name) {
    return pick(COMMENTARY_TEMPLATES.two_pointer_made).replace(
      "{player}",
      name,
    );
  }
  function getTwoPointerMissedString(name) {
    return pick(COMMENTARY_TEMPLATES.two_pointer_missed).replace(
      "{player}",
      name,
    );
  }
  function getDunkMadeString(name) {
    return pick(COMMENTARY_TEMPLATES.dunk_made).replace("{player}", name);
  }
  function getAssistString(name) {
    return pick(COMMENTARY_TEMPLATES.assist).replace("{passer}", name);
  }
  function getDefReboundString(name) {
    return pick(COMMENTARY_TEMPLATES.def_rebound).replace("{player}", name);
  }
  function getOffReboundString(name) {
    return pick(COMMENTARY_TEMPLATES.off_rebound).replace("{player}", name);
  }
  function getBlockString(name) {
    return pick(COMMENTARY_TEMPLATES.block).replace("{player}", name);
  }
  function getStealString(name) {
    return pick(COMMENTARY_TEMPLATES.steal).replace("{player}", name);
  }
  function getTurnoverString(name) {
    return pick(COMMENTARY_TEMPLATES.turnover).replace("{player}", name);
  }
  function getFoulString(name) {
    return pick(COMMENTARY_TEMPLATES.foul).replace("{player}", name);
  }
  function getFreeThrowMadeString(name) {
    return pick(COMMENTARY_TEMPLATES.free_throw_made).replace("{player}", name);
  }
  function getFreeThrowMissedString(name) {
    return pick(COMMENTARY_TEMPLATES.free_throw_missed).replace(
      "{player}",
      name,
    );
  }
})();
