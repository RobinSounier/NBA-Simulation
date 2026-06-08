// Moteur de simulation de saison NBA local
// Ce fichier gère toute la logique de simulation en pur JavaScript.
// Il s'attache à window.SimulationEngine pour être facilement accessible sans problème de CORS.

(function() {
  const FIRST_NAMES = [
    "DeShawn", "Marcus", "Tyler", "Aleksei", "Luka", "Zach", "Jayson", "Devin", "Derrick", "Brandon", 
    "Malik", "Jamal", "LaMarcus", "Kyrie", "Klay", "Draymond", "Julius", "RJ", "Immanuel", "Obi", 
    "Cole", "Franz", "Wendell", "Jalen", "Cade", "Killian", "Saddiq", "Jerami", "De'Aaron", "Tyrese", 
    "Domantas", "Harrison", "Richaun", "Damian", "Anfernee", "Josh", "Jusuf", "Nassir", "Ja", "Desmond", 
    "Dillon", "Jaren", "Steven", "Karl-Anthony", "D'Angelo", "Anthony", "LeBron", "Russell", "Austin", 
    "Stephen", "Jordan", "Andrew", "Otto", "Gary", "Chris", "Mikal", "Jae", "Deandre", "Reggie", "Paul", 
    "Robert", "Nicolas", "Ivica", "Terance", "Luke", "Kristaps", "Spencer", "Dorian", "Dwight", "Kawhi"
  ];

  const LAST_NAMES = [
    "Morris", "Petrov", "Bell", "Doncic", "Jokic", "Antetokounmpo", "James", "Davis", "Curry", "Thompson", 
    "Green", "Durant", "Irving", "Harden", "Embiid", "Harris", "Maxey", "Thybulle", "Niang", "Milton", 
    "Korkmaz", "Drummond", "Porter", "Wood", "Gordon", "Martin", "Tate", "Sengun", "Christopher", "Brooks", 
    "Melton", "Bane", "Clarke", "Jackson", "Adams", "Jones", "Morant", "Williams", "Towns", "Russell", 
    "Edwards", "Beasley", "McDaniels", "Vanderbilt", "Beverley", "Reid", "Nowell", "Knight", "Layman", "Okogie",
    "George", "Leonard", "Brunson", "Randle", "Barrett", "Quickley", "Toppin", "Bilas", "Sabonis", "Fox"
  ];

  const TEAM_DEFS = [
    { id: "BOS", city: "Boston", name: "Celtics", conf: "East", div: "Atlantic", tier: 1 },
    { id: "BKN", city: "Brooklyn", name: "Nets", conf: "East", div: "Atlantic", tier: 2 },
    { id: "NYK", city: "New York", name: "Knicks", conf: "East", div: "Atlantic", tier: 1 },
    { id: "PHI", city: "Philadelphia", name: "76ers", conf: "East", div: "Atlantic", tier: 1 },
    { id: "TOR", city: "Toronto", name: "Raptors", conf: "East", div: "Atlantic", tier: 3 },
    { id: "CHI", city: "Chicago", name: "Bulls", conf: "East", div: "Central", tier: 2 },
    { id: "CLE", city: "Cleveland", name: "Cavaliers", conf: "East", div: "Central", tier: 1 },
    { id: "DET", city: "Detroit", name: "Pistons", conf: "East", div: "Central", tier: 3 },
    { id: "IND", city: "Indiana", name: "Pacers", conf: "East", div: "Central", tier: 2 },
    { id: "MIL", city: "Milwaukee", name: "Bucks", conf: "East", div: "Central", tier: 1 },
    { id: "ATL", city: "Atlanta", name: "Hawks", conf: "East", div: "Southeast", tier: 2 },
    { id: "CHA", city: "Charlotte", name: "Hornets", conf: "East", div: "Southeast", tier: 3 },
    { id: "MIA", city: "Miami", name: "Heat", conf: "East", div: "Southeast", tier: 2 },
    { id: "ORL", city: "Orlando", name: "Magic", conf: "East", div: "Southeast", tier: 2 },
    { id: "WAS", city: "Washington", name: "Wizards", conf: "East", div: "Southeast", tier: 3 },
    { id: "DEN", city: "Denver", name: "Nuggets", conf: "West", div: "Northwest", tier: 1 },
    { id: "MIN", city: "Minnesota", name: "Timberwolves", conf: "West", div: "Northwest", tier: 1 },
    { id: "OKC", city: "Oklahoma City", name: "Thunder", conf: "West", div: "Northwest", tier: 1 },
    { id: "POR", city: "Portland", name: "Trail Blazers", conf: "West", div: "Northwest", tier: 3 },
    { id: "UTA", city: "Utah", name: "Jazz", conf: "West", div: "Northwest", tier: 3 },
    { id: "GSW", city: "Golden State", name: "Warriors", conf: "West", div: "Pacific", tier: 1 },
    { id: "LAC", city: "Los Angeles", name: "Clippers", conf: "West", div: "Pacific", tier: 2 },
    { id: "LAL", city: "Los Angeles", name: "Lakers", conf: "West", div: "Pacific", tier: 1 },
    { id: "PHX", city: "Phoenix", name: "Suns", conf: "West", div: "Pacific", tier: 1 },
    { id: "SAC", city: "Sacramento", name: "Kings", conf: "West", div: "Pacific", tier: 2 },
    { id: "DAL", city: "Dallas", name: "Mavericks", conf: "West", div: "Southwest", tier: 1 },
    { id: "HOU", city: "Houston", name: "Rockets", conf: "West", div: "Southwest", tier: 2 },
    { id: "MEM", city: "Memphis", name: "Grizzlies", conf: "West", div: "Southwest", tier: 2 },
    { id: "NOP", city: "New Orleans", name: "Pelicans", conf: "West", div: "Southwest", tier: 2 },
    { id: "SAS", city: "San Antonio", name: "Spurs", conf: "West", div: "Southwest", tier: 2 }
  ];

  const INJURY_TYPES = [
    { name: "Entorse de la cheville", severity: "légère", minDays: 1, maxDays: 3 },
    { name: "Contracture musculaire", severity: "légère", minDays: 1, maxDays: 3 },
    { name: "Douleur au genou", severity: "légère", minDays: 2, maxDays: 3 },
    { name: "Élongation aux ischios", severity: "modérée", minDays: 7, maxDays: 14 },
    { name: "Entorse du poignet", severity: "modérée", minDays: 6, maxDays: 10 },
    { name: "Déchirure ligamentaire", severity: "grave", minDays: 28, maxDays: 56 },
    { name: "Fracture de fatigue", severity: "grave", minDays: 30, maxDays: 60 }
  ];

  function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generatePlayerName(usedNames) {
    let name;
    do {
      name = pickRandom(FIRST_NAMES) + " " + pickRandom(LAST_NAMES);
    } while (usedNames.has(name));
    usedNames.add(name);
    return name;
  }

  // Initialisation d'une équipe avec un roster
  function createRoster(teamDef, usedNames) {
    const roster = [];
    const positions = ["PG", "SG", "SF", "PF", "C"];
    
    // Générer 5 titulaires (1 pour chaque poste)
    positions.forEach(pos => {
      let rating;
      if (teamDef.tier === 1) {
        rating = randomRange(80, 96);
      } else if (teamDef.tier === 2) {
        rating = randomRange(76, 88);
      } else {
        rating = randomRange(70, 80);
      }

      // S'assurer d'une vraie star pour les tier 1/2
      if (teamDef.tier === 1 && pos === "SF" && Math.random() > 0.5) rating = randomRange(92, 98);
      if (teamDef.tier === 1 && pos === "PG" && Math.random() > 0.5) rating = randomRange(90, 96);

      roster.push({
        id: teamDef.id + "_" + pos + "_starter",
        name: generatePlayerName(usedNames),
        position: pos,
        age: randomRange(19, 36),
        rating: rating,
        starter: true,
        fatigue: 0,
        moral: 75,
        injury: null,
        stats: { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, gp: 0 }
      });
    });

    // Générer 7 remplaçants
    const benchPositions = ["PG", "SG", "SF", "PF", "C", pickRandom(positions), pickRandom(positions)];
    benchPositions.forEach((pos, idx) => {
      let rating;
      if (teamDef.tier === 1) {
        rating = randomRange(70, 79);
      } else if (teamDef.tier === 2) {
        rating = randomRange(66, 75);
      } else {
        rating = randomRange(60, 70);
      }

      roster.push({
        id: teamDef.id + "_" + pos + "_bench_" + idx,
        name: generatePlayerName(usedNames),
        position: pos,
        age: randomRange(19, 38),
        rating: rating,
        starter: false,
        fatigue: 0,
        moral: 75,
        injury: null,
        stats: { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, gp: 0 }
      });
    });

    return roster;
  }

  // Algorithme de génération de calendrier (82 matchs)
  function generateRegularSeasonSchedule(teams) {
    const schedule = [];
    const teamIds = Object.keys(teams);
    let gameId = 1;

    // Définir les groupes
    const divisionTeams = {};
    const conferenceTeams = { "East": [], "West": [] };

    teamIds.forEach(tId => {
      const t = teams[tId];
      const divKey = t.conference + "_" + t.division;
      if (!divisionTeams[divKey]) divisionTeams[divKey] = [];
      divisionTeams[divKey].push(tId);
      conferenceTeams[t.conference].push(tId);
    });

    // Liste complète de tous les matchs
    const matchups = [];

    // 1. Division : 4 matchs contre les 4 autres équipes de la même division (16 matchs)
    Object.keys(divisionTeams).forEach(div => {
      const list = divisionTeams[div];
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          matchups.push({ home: list[i], away: list[j] });
          matchups.push({ home: list[j], away: list[i] });
          matchups.push({ home: list[i], away: list[j] });
          matchups.push({ home: list[j], away: list[i] });
        }
      }
    });

    // 2. Hors Conférence : 2 matchs contre les 15 équipes de l'autre conférence (30 matchs)
    const eastList = conferenceTeams["East"];
    const westList = conferenceTeams["West"];
    eastList.forEach(eId => {
      westList.forEach(wId => {
        matchups.push({ home: eId, away: wId });
        matchups.push({ home: wId, away: eId });
      });
    });

    // 3. Même Conférence, hors division :
    // Il y a 10 équipes dans les autres divisions de la même conférence.
    // On doit jouer 4 matchs contre 6 équipes (24 matchs) et 3 matchs contre 4 équipes (12 matchs).
    // Pour simplifier et garantir l'équilibre, on va jouer 4 fois contre certaines et 3 fois contre d'autres.
    // Une façon équilibrée :
    const processConfMatchups = (list) => {
      for (let i = 0; i < list.length; i++) {
        const t1 = list[i];
        const t1Obj = teams[t1];
        for (let j = i + 1; j < list.length; j++) {
          const t2 = list[j];
          const t2Obj = teams[t2];
          if (t1Obj.division !== t2Obj.division) {
            // Même conférence, divisions différentes
            // Déterminer s'ils jouent 4 ou 3 matchs (en fonction d'une règle déterministe simple pour équilibrer)
            const sumIds = t1Obj.id.charCodeAt(0) + t2Obj.id.charCodeAt(0);
            const play4 = (sumIds % 10) < 6; // ~60% de chances de jouer 4 matchs, sinon 3

            if (play4) {
              matchups.push({ home: t1, away: t2 });
              matchups.push({ home: t2, away: t1 });
              matchups.push({ home: t1, away: t2 });
              matchups.push({ home: t2, away: t1 });
            } else {
              matchups.push({ home: t1, away: t2 });
              matchups.push({ home: t2, away: t1 });
              // 3ème match, alternance home/away basée sur la somme
              if (sumIds % 2 === 0) {
                matchups.push({ home: t1, away: t2 });
              } else {
                matchups.push({ home: t2, away: t1 });
              }
            }
          }
        }
      }
    };

    processConfMatchups(eastList);
    processConfMatchups(westList);

    // Ajuster le calendrier pour que CHAQUE équipe ait EXACTEMENT 82 matchs
    // C'est un problème d'ajustement. Pour s'assurer que c'est parfaitement 82 pour tout le monde,
    // on compte les matchs programmés par équipe, et on ajoute ou retire des matchs hors division/conférence.
    const gameCounts = {};
    teamIds.forEach(id => gameCounts[id] = 0);
    matchups.forEach(m => {
      gameCounts[m.home]++;
      gameCounts[m.away]++;
    });

    // Si certaines équipes ont plus ou moins de 82, on fait de petits ajustements :
    // Mais en fait, l'algorithme de dispatching ci-dessus donne environ 82 matchs par équipe.
    // Pour être rigoureux et éviter des blocages, on va simplement tronquer ou compléter.
    // Pour simplifier et garantir que chaque équipe a EXACTEMENT 82 matchs :
    // On peut utiliser un algorithme de génération de graphe régulier ou simplifier la règle :
    // Jouons 4 fois contre les 4 de division (16), 4 fois contre 6 conf (24), 3 fois contre 4 conf (12), 2 fois contre 15 hors conf (30).
    // Total = 82. Pour implémenter cela de manière simple, générons des paires de matchs de façon gloutonne :
    // Nous pouvons aussi faire 4 rounds de round-robin intra-conférence (14*4 = 56 games) + 2 rounds hors conférence (15*2 = 30 games) = 86 games.
    // Puis on retire aléatoirement 4 matchs de conférence pour chaque équipe.
    // Faisons cela, c'est extrêmement simple et robuste !
    
    // Générons une liste de matchs simple et équilibrée
    const targetGames = 82;
    const finalMatchups = [];
    const currentCounts = {};
    teamIds.forEach(id => currentCounts[id] = 0);

    // Mélanger les paires possibles
    // Matchs intra-conférence : 4 fois
    const intraConfMatchups = [];
    const extraConfMatchups = [];

    for (let i = 0; i < teamIds.length; i++) {
      const t1 = teamIds[i];
      for (let j = i + 1; j < teamIds.length; j++) {
        const t2 = teamIds[j];
        const isSameConf = teams[t1].conference === teams[t2].conference;
        if (isSameConf) {
          // 4 matchs
          intraConfMatchups.push({ home: t1, away: t2 });
          intraConfMatchups.push({ home: t2, away: t1 });
          intraConfMatchups.push({ home: t1, away: t2 });
          intraConfMatchups.push({ home: t2, away: t1 });
        } else {
          // 2 matchs
          extraConfMatchups.push({ home: t1, away: t2 });
          extraConfMatchups.push({ home: t2, away: t1 });
        }
      }
    }

    // Mélanger
    intraConfMatchups.sort(() => Math.random() - 0.5);
    extraConfMatchups.sort(() => Math.random() - 0.5);

    // On ajoute tous les hors-conférence d'abord (30 matchs par équipe)
    extraConfMatchups.forEach(m => {
      if (currentCounts[m.home] < 30 && currentCounts[m.away] < 30) {
        finalMatchups.push(m);
        currentCounts[m.home]++;
        currentCounts[m.away]++;
      }
    });

    // On ajoute des matchs de conférence jusqu'à atteindre 82
    intraConfMatchups.forEach(m => {
      if (currentCounts[m.home] < targetGames && currentCounts[m.away] < targetGames) {
        finalMatchups.push(m);
        currentCounts[m.home]++;
        currentCounts[m.away]++;
      }
    });

    // Si certaines équipes manquent de matchs suite à des blocages de tirage, on complète de manière gloutonne :
    let attempts = 0;
    while (attempts < 100) {
      let under = teamIds.filter(id => currentCounts[id] < targetGames);
      if (under.length < 2) break;
      
      // Trouver deux équipes sous la limite
      const t1 = under[0];
      const t2 = under[1];
      
      finalMatchups.push({ home: t1, away: t2 });
      currentCounts[t1]++;
      currentCounts[t2]++;
      attempts++;
    }

    // Distribuer finalMatchups en 24 semaines
    const weeks = Array.from({ length: 24 }, () => []);
    
    // Mélanger à nouveau pour répartir
    finalMatchups.sort(() => Math.random() - 0.5);

    for (let game of finalMatchups) {
      let assigned = false;
      for (let limit = 4; limit <= 7; limit++) {
        for (let w = 0; w < 24; w++) {
          const wGames = weeks[w];
          const homeCount = wGames.filter(g => g.home === game.home || g.away === game.home).length;
          const awayCount = wGames.filter(g => g.home === game.away || g.away === game.away).length;
          const alreadyPlayingEachOther = wGames.some(g => (g.home === game.home && g.away === game.away) || (g.home === game.away && g.away === game.home));
          
          if (homeCount < limit && awayCount < limit && !alreadyPlayingEachOther) {
            wGames.push({
              id: gameId++,
              week: w + 1,
              home: game.home,
              away: game.away,
              simulated: false,
              result: null
            });
            assigned = true;
            break;
          }
        }
        if (assigned) break;
      }
    }

    // Aplatir les semaines pour en faire le calendrier linéaire
    const flatSchedule = [];
    weeks.forEach(wGames => {
      flatSchedule.push(...wGames);
    });

    return flatSchedule;
  }

  // Simulation d'un match
  function simulateSingleGame(game, teams, alerts) {
    const homeTeam = teams[game.home];
    const awayTeam = teams[game.away];

    // Récupérer les titulaires
    const homeStarters = homeTeam.roster.filter(p => p.starter && !p.injury);
    const awayStarters = awayTeam.roster.filter(p => p.starter && !p.injury);

    // Si moins de 5 titulaires valides (à cause de blessures), on complète avec les meilleurs remplaçants
    const getActiveStarters = (team) => {
      let starters = team.roster.filter(p => p.starter && !p.injury);
      if (starters.length < 5) {
        const healthyBench = team.roster.filter(p => !p.starter && !p.injury)
          .sort((a, b) => b.rating - a.rating);
        starters = starters.concat(healthyBench.slice(0, 5 - starters.length));
      }
      return starters.slice(0, 5);
    };

    const activeHomeStarters = getActiveStarters(homeTeam);
    const activeAwayStarters = getActiveStarters(awayTeam);

    // Calculer les notes moyennes des titulaires actifs
    const homeStartersRating = activeHomeStarters.reduce((acc, p) => acc + p.rating, 0) / 5;
    const awayStartersRating = activeAwayStarters.reduce((acc, p) => acc + p.rating, 0) / 5;

    // Calculer la fatigue moyenne des titulaires actifs
    const homeStartersFatigue = activeHomeStarters.reduce((acc, p) => acc + p.fatigue, 0) / 5;
    const awayStartersFatigue = activeAwayStarters.reduce((acc, p) => acc + p.fatigue, 0) / 5;

    // Calculer le moral moyen des titulaires actifs
    const homeStartersMoral = activeHomeStarters.reduce((acc, p) => acc + p.moral, 0) / 5;
    const awayStartersMoral = activeAwayStarters.reduce((acc, p) => acc + p.moral, 0) / 5;

    // Formule de score
    // Pondérations : note titulaires * 0.4 + facteur aléatoire * 0.4 + avantage terrain * 0.2
    // Équipe à domicile : +3 pts en moyenne
    const simulateScore = (startersRating, randomFactor, isHome, startersFatigue, startersMoral) => {
      // Contribution des notes (60-99)
      const ratingContribution = startersRating * 0.4;
      // Contribution aléatoire (on génère une valeur entre 70 et 100)
      const randomContribution = randomFactor * 0.4;
      // Avantage terrain (domicile : 85, extérieur : 70)
      const terrainContribution = (isHome ? 85 : 70) * 0.2;

      const scoreFactor = ratingContribution + randomContribution + terrainContribution;

      // Mapper le scoreFactor (entre 68 et 93) vers l'intervalle [95, 130]
      let baseScore = 95 + ((scoreFactor - 68) / (93 - 68)) * (130 - 95);

      // Malus fatigue
      if (startersFatigue > 70) {
        baseScore -= 5;
      }

      // Influence moral (±3 points basés sur le moral moyen par rapport à 50)
      const moralBonus = ((startersMoral - 50) / 50) * 3;
      baseScore += moralBonus;

      return Math.round(baseScore);
    };

    const homeRandom = randomRange(70, 100);
    const awayRandom = randomRange(70, 100);

    let homeScore = simulateScore(homeStartersRating, homeRandom, true, homeStartersFatigue, homeStartersMoral);
    let awayScore = simulateScore(awayStartersRating, awayRandom, false, awayStartersFatigue, awayStartersMoral);

    // Éviter les matchs nuls
    if (homeScore === awayScore) {
      if (Math.random() > 0.5) {
        homeScore += randomRange(2, 6);
      } else {
        awayScore += randomRange(2, 6);
      }
    }

    // Répartir le score sur 4 quart-temps
    const distributeQuarters = (totalScore) => {
      let remaining = totalScore;
      const quarters = [];
      for (let i = 0; i < 3; i++) {
        const q = Math.round(totalScore / 4 + randomRange(-5, 5));
        quarters.push(q);
        remaining -= q;
      }
      quarters.push(remaining);
      return quarters;
    };

    const homeQuarters = distributeQuarters(homeScore);
    const awayQuarters = distributeQuarters(awayScore);

    // Déterminer le vainqueur
    const homeWon = homeScore > awayScore;

    // Mettre à jour les bilans, streaks et les 10 derniers matchs des équipes
    const updateTeamStandings = (team, won, pointsFor, pointsAgainst) => {
      if (won) {
        team.wins++;
        team.streak = team.streak >= 0 ? team.streak + 1 : 1;
        team.lastTen.push("W");
      } else {
        team.losses++;
        team.streak = team.streak <= 0 ? team.streak - 1 : -1;
        team.lastTen.push("L");
      }
      if (team.lastTen.length > 10) team.lastTen.shift();
      team.pointsFor += pointsFor;
      team.pointsAgainst += pointsAgainst;

      // Mettre à jour le moral de l'équipe
      team.roster.forEach(p => {
        if (won) {
          p.moral = Math.min(100, p.moral + 5);
        } else {
          p.moral = Math.max(0, p.moral - 3);
        }
      });
    };

    updateTeamStandings(homeTeam, homeWon, homeScore, awayScore);
    updateTeamStandings(awayTeam, !homeWon, awayScore, homeScore);

    // Simuler les statistiques individuelles et la fatigue/blessure
    const simulateIndividualStats = (team, score, opponentScore, activeStarters) => {
      const playerStats = {};
      const teamRoster = team.roster;

      // Déterminer les minutes de jeu (total 240)
      // Les titulaires actifs jouent ~30-38 minutes, les remplaçants se partagent le reste
      const healthyPlayers = teamRoster.filter(p => !p.injury);
      const activeBench = healthyPlayers.filter(p => !activeStarters.includes(p));

      const minutesAllocation = {};
      let totalAssignedMin = 0;

      activeStarters.forEach(p => {
        const min = randomRange(28, 38);
        minutesAllocation[p.id] = min;
        totalAssignedMin += min;
      });

      const remainingMin = 240 - totalAssignedMin;
      if (activeBench.length > 0) {
        const share = Math.floor(remainingMin / activeBench.length);
        activeBench.forEach((p, idx) => {
          minutesAllocation[p.id] = idx === activeBench.length - 1 ? remainingMin - (share * idx) : share;
        });
      }

      // Calculer les probabilités de contribution aux stats
      // Basé sur le poste et la note
      const statsWeights = teamRoster.map(p => {
        if (p.injury) return { id: p.id, ptsW: 0, rebW: 0, astW: 0, stlW: 0, blkW: 0 };
        const min = minutesAllocation[p.id] || 0;
        if (min === 0) return { id: p.id, ptsW: 0, rebW: 0, astW: 0, stlW: 0, blkW: 0 };

        let ptsMultiplier = 1;
        let rebMultiplier = 1;
        let astMultiplier = 1;

        if (p.position === "PG") { ptsMultiplier = 1.2; rebMultiplier = 0.5; astMultiplier = 2.0; }
        else if (p.position === "SG") { ptsMultiplier = 1.4; rebMultiplier = 0.7; astMultiplier = 1.2; }
        else if (p.position === "SF") { ptsMultiplier = 1.2; rebMultiplier = 1.0; astMultiplier = 1.0; }
        else if (p.position === "PF") { ptsMultiplier = 1.0; rebMultiplier = 1.6; astMultiplier = 0.7; }
        else if (p.position === "C") { ptsMultiplier = 0.9; rebMultiplier = 2.2; astMultiplier = 0.5; }

        const ratingFactor = p.rating / 80;

        return {
          id: p.id,
          ptsW: min * ptsMultiplier * ratingFactor,
          rebW: min * rebMultiplier * ratingFactor,
          astW: min * astMultiplier * ratingFactor,
          stlW: min * ratingFactor,
          blkW: min * (p.position === "C" || p.position === "PF" ? 2.5 : 0.5) * ratingFactor
        };
      });

      // Distribuer les points de l'équipe
      let ptsToDistribute = score;
      const playersPoints = {};
      teamRoster.forEach(p => playersPoints[p.id] = 0);

      const totalPtsW = statsWeights.reduce((acc, w) => acc + w.ptsW, 0);
      if (totalPtsW > 0) {
        statsWeights.forEach(w => {
          const pts = Math.round((w.ptsW / totalPtsW) * score);
          playersPoints[w.id] = pts;
          ptsToDistribute -= pts;
        });
        // Ajuster le reliquat sur le meilleur marqueur
        if (ptsToDistribute !== 0 && activeStarters.length > 0) {
          playersPoints[activeStarters[0].id] += ptsToDistribute;
        }
      }

      // Distribuer Rebonds (Total ~38-48 par match)
      let totalReb = randomRange(36, 48);
      const playersReb = {};
      teamRoster.forEach(p => playersReb[p.id] = 0);
      const totalRebW = statsWeights.reduce((acc, w) => acc + w.rebW, 0);
      if (totalRebW > 0) {
        statsWeights.forEach(w => {
          playersReb[w.id] = Math.round((w.rebW / totalRebW) * totalReb);
        });
      }

      // Distribuer Assists (Total ~18-28 par match)
      let totalAst = randomRange(18, 28);
      const playersAst = {};
      teamRoster.forEach(p => playersAst[p.id] = 0);
      const totalAstW = statsWeights.reduce((acc, w) => acc + w.astW, 0);
      if (totalAstW > 0) {
        statsWeights.forEach(w => {
          playersAst[w.id] = Math.round((w.astW / totalAstW) * totalAst);
        });
      }

      // Interceptions (Total ~5-10)
      let totalStl = randomRange(5, 10);
      const playersStl = {};
      teamRoster.forEach(p => playersStl[p.id] = 0);
      const totalStlW = statsWeights.reduce((acc, w) => acc + w.stlW, 0);
      if (totalStlW > 0) {
        statsWeights.forEach(w => {
          playersStl[w.id] = Math.round((w.stlW / totalStlW) * totalStl);
        });
      }

      // Contres (Total ~3-8)
      let totalBlk = randomRange(3, 8);
      const playersBlk = {};
      teamRoster.forEach(p => playersBlk[p.id] = 0);
      const totalBlkW = statsWeights.reduce((acc, w) => acc + w.blkW, 0);
      if (totalBlkW > 0) {
        statsWeights.forEach(w => {
          playersBlk[w.id] = Math.round((w.blkW / totalBlkW) * totalBlk);
        });
      }

      // Mettre à jour les stats cumulées des joueurs et leur fatigue/blessure
      teamRoster.forEach(p => {
        if (p.injury) return;

        const mins = minutesAllocation[p.id] || 0;
        if (mins > 0) {
          p.stats.gp++;
          p.stats.pts += playersPoints[p.id];
          p.stats.reb += playersReb[p.id];
          p.stats.ast += playersAst[p.id];
          p.stats.stl += playersStl[p.id];
          p.stats.blk += playersBlk[p.id];

          // Enregistrer les stats de ce match
          playerStats[p.id] = {
            name: p.name,
            position: p.position,
            min: mins,
            pts: playersPoints[p.id],
            reb: playersReb[p.id],
            ast: playersAst[p.id],
            stl: playersStl[p.id],
            blk: playersBlk[p.id],
            plusMinus: homeWon === (team === homeTeam) ? randomRange(2, 12) : randomRange(-12, -2)
          };

          // Règle de fatigue : +15 fatigue après chaque match joué
          p.fatigue = Math.min(100, p.fatigue + 15);

          // Règle de blessure :
          // Probabilité : 10% si fatigue > 85, sinon 2% pour les titulaires
          const isStarterActive = activeStarters.includes(p);
          const injuryProb = p.fatigue > 85 ? 0.10 : (isStarterActive ? 0.02 : 0.005);
          
          // Compter le nombre de blessures en cours de l'équipe (max 2)
          const currentInjuriesCount = teamRoster.filter(pl => pl.injury).length;

          if (Math.random() < injuryProb && currentInjuriesCount < 2) {
            const injuryDef = pickRandom(INJURY_TYPES);
            const duration = randomRange(injuryDef.minDays, injuryDef.maxDays);
            
            p.injury = {
              name: injuryDef.name,
              severity: injuryDef.severity,
              daysRemaining: duration,
              totalDays: duration
            };

            alerts.push({
              team: team.city + " " + team.name,
              player: p.name,
              type: "injury",
              detail: `${p.name} est blessé (${injuryDef.name}, sévérité: ${injuryDef.severity}, durée estimée: ${duration} jours)`
            });
          }
        }
      });

      return playerStats;
    };

    const homePlayerStats = simulateIndividualStats(homeTeam, homeScore, awayScore, activeHomeStarters);
    const awayPlayerStats = simulateIndividualStats(awayTeam, awayScore, homeScore, activeAwayStarters);

    // Mettre à jour l'objet game
    game.simulated = true;
    game.result = {
      homeScore: homeScore,
      awayScore: awayScore,
      homeQuarters: homeQuarters,
      awayQuarters: awayQuarters,
      homePlayerStats: homePlayerStats,
      awayPlayerStats: awayPlayerStats
    };

    // Générer une narration en français dans le style commentateur
    // Trouver le meilleur marqueur du match pour la narration
    let topScorer = { name: "", pts: -1, team: "" };
    Object.values(homePlayerStats).forEach(ps => {
      if (ps.pts > topScorer.pts) topScorer = { name: ps.name, pts: ps.pts, team: homeTeam.city + " " + homeTeam.name };
    });
    Object.values(awayPlayerStats).forEach(ps => {
      if (ps.pts > topScorer.pts) topScorer = { name: ps.name, pts: ps.pts, team: awayTeam.city + " " + awayTeam.name };
    });

    const narratives = [
      `Victoire éclatante des ${homeWon ? homeTeam.name : awayTeam.name} face aux ${homeWon ? awayTeam.name : homeTeam.name} sur le score de ${Math.max(homeScore, awayScore)} à ${Math.min(homeScore, awayScore)}.`,
      `Dans une fin de match irrespirable, les ${homeWon ? homeTeam.name : awayTeam.name} s'imposent à l'arraché face aux ${homeWon ? awayTeam.name : homeTeam.name} (${homeScore}-${awayScore}).`,
      `Superbe performance collective des ${homeWon ? homeTeam.name : awayTeam.name} portés par un grand ${topScorer.name} auteur de ${topScorer.pts} points.`
    ];

    let narrative = pickRandom(narratives);
    if (alerts.length > 0) {
      const injuryAlert = alerts.find(a => a.type === "injury" && (a.team.includes(homeTeam.name) || a.team.includes(awayTeam.name)));
      if (injuryAlert) {
        narrative += ` Malheureusement, le match a été assombri par la blessure de ${injuryAlert.player} des ${injuryAlert.team}.`;
      }
    }

    return { narrative, topScorer };
  }

  // Gérer la récupération de la fatigue et la mise à jour des blessures après chaque jour/semaine
  // Un jour de repos : -10 fatigue, et -1 jour sur la durée de blessure
  function updateRestDays(teams, daysCount) {
    Object.values(teams).forEach(team => {
      team.roster.forEach(p => {
        // Récupération de la fatigue
        p.fatigue = Math.max(0, p.fatigue - (10 * daysCount));

        // Mise à jour de la blessure
        if (p.injury) {
          p.injury.daysRemaining -= daysCount;
          if (p.injury.daysRemaining <= 0) {
            p.injury = null; // Rétabli !
          }
        }
      });
    });
  }

  function assignPositionsAndRosters(teams, playersData) {
    const playersByTeam = {};
    playersData.forEach(p => {
      if (!playersByTeam[p.team]) {
        playersByTeam[p.team] = [];
      }
      playersByTeam[p.team].push(p);
    });

    const freeAgents = [];

    Object.keys(teams).forEach(teamName => {
      const teamObj = teams[teamName];
      let rawPlayers = playersByTeam[teamName] || [];

      rawPlayers.sort((a, b) => b.overallAttribute - a.overallAttribute);

      // We take the top 14 players. The rest are Free Agents.
      const rosterPlayers = rawPlayers.slice(0, 14);
      const remainingPlayers = rawPlayers.slice(14);

      remainingPlayers.forEach(p => {
        freeAgents.push({
          id: p.name.replace(/\s+/g, "_") + "_" + Math.floor(Math.random() * 1000),
          name: p.name,
          originalTeam: p.team,
          position: inferPosition(p),
          age: Math.floor(Math.random() * 12) + 19,
          rating: p.overallAttribute,
          starter: false,
          fatigue: 0,
          moral: 70,
          injury: null,
          stats: { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, gp: 0 },
          attributes: p
        });
      });

      const assignedRoster = [];
      const assignedIds = new Set();

      // Find PG
      let pgCandidate = null;
      let maxPgScore = -1;
      rosterPlayers.forEach((p, idx) => {
        const score = (p.passVision || 50) + (p.ballHandle || 50);
        if (score > maxPgScore) {
          maxPgScore = score;
          pgCandidate = idx;
        }
      });
      if (pgCandidate !== null) {
        assignedRoster.push(createPlayerObject(rosterPlayers[pgCandidate], "PG", true, teamObj.id + "_PG"));
        assignedIds.add(pgCandidate);
      }

      // Find C
      let cCandidate = null;
      let maxCScore = -1;
      rosterPlayers.forEach((p, idx) => {
        if (assignedIds.has(idx)) return;
        const score = (p.standingDunk || 30) + (p.defensiveRebound || 50) + (p.block || 30);
        if (score > maxCScore) {
          maxCScore = score;
          cCandidate = idx;
        }
      });
      if (cCandidate !== null) {
        assignedRoster.push(createPlayerObject(rosterPlayers[cCandidate], "C", true, teamObj.id + "_C"));
        assignedIds.add(cCandidate);
      }

      // Find SG
      let sgCandidate = null;
      let maxSgScore = -1;
      rosterPlayers.forEach((p, idx) => {
        if (assignedIds.has(idx)) return;
        const score = (p.threePointShot || 50) + (p.midRangeShot || 50);
        if (score > maxSgScore) {
          maxSgScore = score;
          sgCandidate = idx;
        }
      });
      if (sgCandidate !== null) {
        assignedRoster.push(createPlayerObject(rosterPlayers[sgCandidate], "SG", true, teamObj.id + "_SG"));
        assignedIds.add(sgCandidate);
      }

      // Find PF
      let pfCandidate = null;
      let maxPfScore = -1;
      rosterPlayers.forEach((p, idx) => {
        if (assignedIds.has(idx)) return;
        const score = (p.interiorDefense || 40) + (p.defensiveRebound || 50);
        if (score > maxPfScore) {
          maxPfScore = score;
          pfCandidate = idx;
        }
      });
      if (pfCandidate !== null) {
        assignedRoster.push(createPlayerObject(rosterPlayers[pfCandidate], "PF", true, teamObj.id + "_PF"));
        assignedIds.add(pfCandidate);
      }

      // Find SF
      let sfCandidate = null;
      let maxSfScore = -1;
      rosterPlayers.forEach((p, idx) => {
        if (assignedIds.has(idx)) return;
        if (p.overallAttribute > maxSfScore) {
          maxSfScore = p.overallAttribute;
          sfCandidate = idx;
        }
      });
      if (sfCandidate !== null) {
        assignedRoster.push(createPlayerObject(rosterPlayers[sfCandidate], "SF", true, teamObj.id + "_SF"));
        assignedIds.add(sfCandidate);
      }

      // Bench
      let benchIndex = 0;
      rosterPlayers.forEach((p, idx) => {
        if (assignedIds.has(idx)) return;
        const pos = inferPosition(p);
        assignedRoster.push(createPlayerObject(p, pos, false, teamObj.id + "_bench_" + (benchIndex++)));
      });

      teamObj.roster = assignedRoster;
    });

    return freeAgents;
  }

  function inferPosition(p) {
    const pgScore = (p.passVision || 50) + (p.ballHandle || 50);
    const cScore = (p.standingDunk || 30) + (p.defensiveRebound || 50) + (p.block || 30);
    const sgScore = (p.threePointShot || 50) + (p.midRangeShot || 50);
    const pfScore = (p.interiorDefense || 40) + (p.defensiveRebound || 50);
    
    const max = Math.max(pgScore, cScore, sgScore, pfScore);
    if (max === pgScore) return "PG";
    if (max === cScore) return "C";
    if (max === sgScore) return "SG";
    if (max === pfScore) return "PF";
    return "SF";
  }

  function createPlayerObject(rawPlayer, position, starter, id) {
    return {
      id: id || rawPlayer.name.replace(/\s+/g, "_") + "_" + Math.floor(Math.random() * 1000),
      name: rawPlayer.name,
      position: position,
      age: Math.floor(Math.random() * 12) + 19,
      rating: rawPlayer.overallAttribute,
      starter: starter,
      fatigue: 0,
      moral: 75,
      injury: null,
      stats: { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, gp: 0 },
      attributes: rawPlayer
    };
  }

  function checkPlayerPromises(state, alerts) {
    const userTeamObj = state.teams[state.userTeam];
    if (!userTeamObj) return;

    userTeamObj.roster.forEach(p => {
      if (p.promisedWeeksRemaining !== undefined && p.promisedWeeksRemaining > 0) {
        p.promisedWeeksRemaining--;
        if (p.promisedWeeksRemaining === 0) {
          if (p.starter) {
            p.moral = Math.min(100, p.moral + 10);
            alerts.push({
              team: state.userTeam,
              player: p.name,
              type: "promise_kept",
              detail: `Promesse tenue : ${p.name} est ravi d'avoir été intégré au 5 majeur.`
            });
          } else {
            p.moral = Math.max(0, p.moral - 30);
            alerts.push({
              team: state.userTeam,
              player: p.name,
              type: "promise_broken",
              detail: `Promesse rompue : ${p.name} est déçu de ne pas être titulaire et son moral s'effondre.`
            });
            
            const emailId = "msg_broken_" + state.currentWeek + "_" + Math.floor(Math.random() * 1000);
            state.inbox.push({
              id: emailId,
              sender: p.name,
              senderAvatar: "PL",
              subject: "Promesse non tenue...",
              body: `Coach,\n\nVous m'aviez promis de m'intégrer dans le 5 majeur sous deux semaines. Force est de constater que vous n'avez pas tenu votre engagement.\n\nJe suis profondément déçu par cette attitude. Mon moral et mon implication dans l'équipe en pâtissent.\n\nCordialement,\n${p.name}.`,
              type: "player_demand",
              read: false,
              week: state.currentWeek,
              actionable: false,
              status: "read"
            });
          }
          delete p.promisedWeeksRemaining;
        }
      }
    });
  }

  function generateWeeklyEmails(state, alerts) {
    state.inbox = state.inbox || [];
    
    // 40% de chance d'avoir un email cette semaine
    if (Math.random() > 0.4) return;

    const types = ["trade", "free_agent", "scout", "player_demand"];
    const type = pickRandom(types);

    const userTeamObj = state.teams[state.userTeam];
    const weekNum = state.currentWeek;
    const emailId = "msg_" + weekNum + "_" + Math.floor(Math.random() * 10000);

    if (type === "trade" && userTeamObj.roster.length > 0) {
      const userPlayer = pickRandom(userTeamObj.roster);
      const otherTeamNames = Object.keys(state.teams).filter(t => t !== state.userTeam);
      if (otherTeamNames.length === 0) return;
      const otherTeamName = pickRandom(otherTeamNames);
      const otherTeamObj = state.teams[otherTeamName];

      const matchingPlayers = otherTeamObj.roster.filter(p => 
        Math.abs(p.rating - userPlayer.rating) <= 4 && p.id !== userPlayer.id && !p.starter
      );

      if (matchingPlayers.length > 0) {
        const offeredPlayer = pickRandom(matchingPlayers);
        
        state.inbox.push({
          id: emailId,
          sender: `GM ${otherTeamObj.name} (${otherTeamObj.city})`,
          senderAvatar: otherTeamObj.id,
          subject: `Proposition d'échange : ${userPlayer.name} vs ${offeredPlayer.name}`,
          body: `Bonjour Coach,\n\nNous suivons de près les performances de **${userPlayer.name}** (OVR ${userPlayer.rating}, poste ${userPlayer.position}) et nous pensons qu'il s'intégrerait parfaitement dans notre système.\n\nEn contrepartie, nous sommes prêts à vous céder **${offeredPlayer.name}** (OVR ${offeredPlayer.rating}, poste ${offeredPlayer.position}). C'est un échange équilibré qui aidera nos deux équipes.\n\nQu'en pensez-vous ?\n\nCordialement,\nGM ${otherTeamObj.name}.`,
          type: "trade",
          read: false,
          week: weekNum,
          actionable: true,
          status: "pending",
          actionData: {
            type: "trade",
            userPlayerId: userPlayer.id,
            offeredPlayerId: offeredPlayer.id,
            otherTeam: otherTeamName
          }
        });
      }
    } 
    else if (type === "free_agent" && state.freeAgents && state.freeAgents.length > 0) {
      const fa = pickRandom(state.freeAgents);
      
      state.inbox.push({
        id: emailId,
        sender: `Agent de ${fa.name}`,
        senderAvatar: "FA",
        subject: `Signature possible : ${fa.name} (Agent Libre)`,
        body: `Cher Coach,\n\nMon client, **${fa.name}** (OVR ${fa.rating}, poste ${fa.position}), cherche une équipe ambitieuse pour cette saison.\n\nIl apprécie votre style de jeu et souhaite rejoindre les ${userTeamObj.name}. C'est une excellente opportunité de signer un joueur solide sans contrepartie.\n\nFaites-moi savoir si vous souhaitez l'intégrer à votre effectif.\n\nCordialement.`,
        type: "free_agent",
        read: false,
        week: weekNum,
        actionable: true,
        status: "pending",
        actionData: {
          type: "free_agent",
          faPlayerId: fa.id
        }
      });
    } 
    else if (type === "scout") {
      let targetName = "un joueur de banc";
      let targetInfo = "";
      
      if (state.freeAgents && state.freeAgents.length > 0 && Math.random() > 0.5) {
        const fa = pickRandom(state.freeAgents);
        targetName = fa.name;
        targetInfo = `un Agent Libre au poste de ${fa.position} (OVR ${fa.rating})`;
      } else {
        const otherTeams = Object.keys(state.teams).filter(t => t !== state.userTeam);
        if (otherTeams.length > 0) {
          const ot = state.teams[pickRandom(otherTeams)];
          if (ot.roster.length > 0) {
            const p = pickRandom(ot.roster);
            targetName = p.name;
            targetInfo = `qui joue pour les ${ot.name} (OVR ${p.rating}, poste ${p.position})`;
          }
        }
      }

      state.inbox.push({
        id: emailId,
        sender: "Scout Chef",
        senderAvatar: "SC",
        subject: "Rapport d'observation",
        body: `Coach,\n\nJ'ai observé **${targetName}** récemment, ${targetInfo}.\n\nJe pense qu'il possède des qualités qui pourraient nous être très utiles pour renforcer notre rotation. Sa note générale est intéressante. Si l'occasion se présente pour un transfert ou une signature, je pense qu'il faut foncer.\n\nSportivement,\nLe Staff de Scouting.`,
        type: "scout",
        read: false,
        week: weekNum,
        actionable: false,
        status: "read"
      });
    } 
    else if (type === "player_demand") {
      const benchPlayers = userTeamObj.roster.filter(p => !p.starter && !p.injury && p.rating > 70);
      if (benchPlayers.length > 0) {
        const player = pickRandom(benchPlayers);
        
        state.inbox.push({
          id: emailId,
          sender: player.name,
          senderAvatar: "PL",
          subject: "Temps de jeu insuffisant",
          body: `Coach,\n\nJe voulais vous parler de mon rôle. Je me sens prêt et performant à l'entraînement, et je pense mériter une place de titulaire sur le poste de ${player.position}.\n\nJe vous demande de me faire confiance et de m'intégrer dans le 5 majeur dès les prochains matchs.\n\nMerci,\n${player.name}.`,
          type: "player_demand",
          read: false,
          week: weekNum,
          actionable: true,
          status: "pending",
          actionData: {
            type: "player_demand",
            playerId: player.id
          }
        });
      }
    }
  }

  // --- Moteur d'actions principal ---
  window.SimulationEngine = {
    handleAction: function(action, gameState, params) {
      params = params || {};
      // Cloner l'état pour éviter les effets de bord
      const state = gameState ? JSON.parse(JSON.stringify(gameState)) : {};
      const alerts = [];
      let narrative = "";
      let success = true;
      let data = {};

      try {
        switch (action) {
          case "init_season": {
            const userTeamName = params.userTeam || "Los Angeles Lakers";
            const usedNames = new Set();
            const teams = {};

            TEAM_DEFS.forEach(def => {
              teams[def.city + " " + def.name] = {
                id: def.id,
                city: def.city,
                name: def.name,
                conference: def.conf,
                division: def.div,
                tier: def.tier,
                wins: 0,
                losses: 0,
                streak: 0,
                lastTen: [],
                pointsFor: 0,
                pointsAgainst: 0,
                roster: []
              };
            });

            let freeAgents = [];
            if (params.playersData && Array.isArray(params.playersData)) {
              freeAgents = assignPositionsAndRosters(teams, params.playersData);
            } else {
              // Fallback
              Object.keys(teams).forEach(tName => {
                const teamObj = teams[tName];
                const def = TEAM_DEFS.find(d => (d.city + " " + d.name) === tName);
                teamObj.roster = createRoster(def, usedNames);
              });
            }

            // S'assurer que l'équipe de l'utilisateur existe
            if (!teams[userTeamName]) {
              throw new Error(`L'équipe "${userTeamName}" n'est pas valide.`);
            }

            state.season = 2026;
            state.stage = "regular_season";
            state.currentWeek = 1;
            state.userTeam = userTeamName;
            state.teams = teams;
            state.schedule = generateRegularSeasonSchedule(teams);
            state.history = [];
            state.freeAgents = freeAgents;

            // Initialiser la boîte mail avec l'email de bienvenue
            const owner = userTeamName.includes("Lakers") ? "Jeanie Buss (Propriétaire)" : 
                          userTeamName.includes("Celtics") ? "Wyc Grousbeck (Propriétaire)" : "La Propriété de la Franchise";
            state.inbox = [
              {
                id: "welcome_email",
                sender: owner,
                senderAvatar: "OWN",
                subject: "Bienvenue dans la franchise !",
                body: `Bonjour Coach,\n\nToute l'organisation est ravie de vous accueillir à la tête de notre équipe pour cette saison ${state.season}. L'objectif est clair : construire un groupe compétitif et viser les playoffs.\n\nJe vous laisse prendre contact avec le staff de scouting et le vestiaire. Ils vous enverront régulièrement des rapports d'observation, des requêtes de joueurs, ou des propositions de transferts de la part des autres GMs de la ligue dans cette boîte mail.\n\nBonne chance pour ce premier match !\n\nCordialement,\nLa Présidence.`,
                type: "news",
                read: false,
                week: 1,
                actionable: false,
                status: "read"
              }
            ];

            narrative = `Bienvenue dans la saison NBA ${state.season} ! Vous prenez les rênes des ${userTeamName}. Le calendrier de 82 matchs a été généré avec succès.`;
            data = { userTeam: userTeamName };
            break;
          }

          case "simulate_game": {
            if (state.stage !== "regular_season") {
              throw new Error("L'action simulate_game n'est disponible qu'en saison régulière.");
            }

            // Trouver le match à simuler
            let gameToSimulate;
            if (params && params.gameId) {
              gameToSimulate = state.schedule.find(g => g.id === params.gameId && !g.simulated);
            } else {
              // Simuler le prochain match non simulé de l'utilisateur
              gameToSimulate = state.schedule.find(g => 
                (g.home === state.userTeam || g.away === state.userTeam) && !g.simulated
              );
            }

            if (!gameToSimulate) {
              throw new Error("Aucun match disponible à simuler.");
            }

            // Simuler ce match individuel
            const result = simulateSingleGame(gameToSimulate, state.teams, alerts);
            narrative = result.narrative;
            
            // Appliquer 2 jours de repos aux équipes non programmées de cette journée
            // Pour simplifier le décompte de fatigue en match simple, on applique 1 jour de repos
            updateRestDays(state.teams, 1);

            data = {
              game: gameToSimulate,
              topScorer: result.topScorer
            };
            break;
          }

          case "simulate_week": {
            if (state.stage !== "regular_season") {
              throw new Error("L'action simulate_week n'est disponible qu'en saison régulière.");
            }

            const currentWeek = state.currentWeek;
            const weekGames = state.schedule.filter(g => g.week === currentWeek && !g.simulated);

            if (weekGames.length === 0) {
              // Si tous les matchs de cette semaine sont simulés, passer à la semaine suivante
              state.currentWeek++;
              if (state.currentWeek > 24) {
                state.stage = "playoffs_init";
                narrative = "La saison régulière est terminée ! Les playoffs vont débuter.";
              } else {
                narrative = `La semaine ${currentWeek} est déjà terminée. Passez à la semaine ${state.currentWeek}.`;
              }
              break;
            }

            // Simuler tous les matchs de la semaine en cours
            const weekAlerts = [];
            let lastNarrative = "";
            let gamesCount = 0;
            let userGameResult = null;

            weekGames.forEach(game => {
              const res = simulateSingleGame(game, state.teams, weekAlerts);
              gamesCount++;
              if (game.home === state.userTeam || game.away === state.userTeam) {
                userGameResult = game;
                lastNarrative = res.narrative;
              }
            });

            // Les semaines font 7 jours. Entre chaque semaine, on applique 7 jours de repos/récupération pour la fatigue
            // Mais pendant la semaine, les joueurs ont accumulé de la fatigue (+15 par match).
            // Donc on applique 7 jours de repos (-70 fatigue au total) à TOUT le monde pour équilibrer.
            updateRestDays(state.teams, 7);

            alerts.push(...weekAlerts);

            checkPlayerPromises(state, alerts);

            state.currentWeek++;

            generateWeeklyEmails(state, alerts);

            if (state.currentWeek > 24) {
              state.stage = "playoffs_init";
            }

            narrative = `Semaine ${currentWeek} simulée : ${gamesCount} matchs joués.`;
            if (userGameResult) {
              const uHome = userGameResult.result.homeScore;
              const uAway = userGameResult.result.awayScore;
              const userWon = (userGameResult.home === state.userTeam && uHome > uAway) || 
                              (userGameResult.away === state.userTeam && uAway > uHome);
              narrative += ` Votre équipe a ${userWon ? "gagné" : "perdu"} son match cette semaine : ${userGameResult.home} ${uHome}-${uAway} ${userGameResult.away}.`;
            }

            data = {
              weekSimulated: currentWeek,
              gamesSimulatedCount: gamesCount,
              nextWeek: state.currentWeek,
              stage: state.stage
            };
            break;
          }

          case "set_lineup": {
            const teamName = params.teamName || state.userTeam;
            const lineup = params.lineup; // Array de Player IDs à mettre titulaires

            if (!lineup || lineup.length !== 5) {
              throw new Error("La lineup doit contenir exactement 5 joueurs.");
            }

            const team = state.teams[teamName];
            if (!team) {
              throw new Error(`L'équipe "${teamName}" n'existe pas.`);
            }

            // Valider que tous les joueurs appartiennent à l'équipe et ne sont pas blessés graves
            const rosterIds = team.roster.map(p => p.id);
            lineup.forEach(pId => {
              if (!rosterIds.includes(pId)) {
                throw new Error(`Le joueur "${pId}" n'appartient pas à cette équipe.`);
              }
              const player = team.roster.find(p => p.id === pId);
              if (player.injury && player.injury.severity === "grave") {
                throw new Error(`Le joueur ${player.name} est gravement blessé et ne peut pas être aligné.`);
              }
            });

            // Mettre à jour la lineup
            team.roster.forEach(p => {
              p.starter = lineup.includes(p.id);
            });

            narrative = `La rotation des ${teamName} a été mise à jour avec succès.`;
            data = { teamName, lineup };
            break;
          }

          case "get_standings": {
            // Calculer les classements Est / Ouest
            const standings = { East: [], West: [] };

            Object.values(state.teams).forEach(team => {
              const totalGames = team.wins + team.losses;
              const winPct = totalGames > 0 ? team.wins / totalGames : 0;
              standings[team.conference].push({
                name: team.city + " " + team.name,
                wins: team.wins,
                losses: team.losses,
                pct: winPct,
                streak: team.streak >= 0 ? "W" + team.streak : "L" + Math.abs(team.streak),
                lastTen: team.lastTen.filter(x => x).join("") || "-",
                pointsDiff: team.pointsFor - team.pointsAgainst
              });
            });

            // Trier par pourcentage de victoires
            const sortFn = (a, b) => {
              if (b.pct !== a.pct) return b.pct - a.pct;
              return b.pointsDiff - a.pointsDiff; // Tie breaker
            };

            standings.East.sort(sortFn);
            standings.West.sort(sortFn);

            // Calculer les Games Back (GB)
            const computeGB = (list) => {
              if (list.length === 0) return;
              const leader = list[0];
              list.forEach(team => {
                const gb = ((leader.wins - team.wins) + (team.losses - leader.losses)) / 2;
                team.gb = gb === 0 ? "-" : gb.toFixed(1);
              });
            };

            computeGB(standings.East);
            computeGB(standings.West);

            data = { standings };
            narrative = "Classements Est et Ouest actualisés.";
            break;
          }

          case "get_player_stats": {
            const teamName = params.teamName || state.userTeam;
            const team = state.teams[teamName];
            if (!team) {
              throw new Error(`L'équipe "${teamName}" n'existe pas.`);
            }

            const statsList = team.roster.map(p => {
              const gp = p.stats.gp || 0;
              return {
                id: p.id,
                name: p.name,
                position: p.position,
                age: p.age,
                rating: p.rating,
                starter: p.starter,
                fatigue: p.fatigue,
                moral: p.moral,
                injury: p.injury,
                gp: gp,
                ppg: gp > 0 ? (p.stats.pts / gp).toFixed(1) : "0.0",
                rpg: gp > 0 ? (p.stats.reb / gp).toFixed(1) : "0.0",
                apg: gp > 0 ? (p.stats.ast / gp).toFixed(1) : "0.0",
                spg: gp > 0 ? (p.stats.stl / gp).toFixed(1) : "0.0",
                bpg: gp > 0 ? (p.stats.blk / gp).toFixed(1) : "0.0"
              };
            });

            data = { teamName, playerStats: statsList };
            narrative = `Statistiques individuelles récupérées pour l'équipe ${teamName}.`;
            break;
          }

          case "check_injuries": {
            const injuredPlayers = [];
            Object.values(state.teams).forEach(team => {
              team.roster.forEach(p => {
                if (p.injury) {
                  injuredPlayers.push({
                    team: team.city + " " + team.name,
                    id: p.id,
                    name: p.name,
                    position: p.position,
                    injuryName: p.injury.name,
                    severity: p.injury.severity,
                    daysRemaining: p.injury.daysRemaining
                  });
                }
              });
            });

            data = { injuredPlayers };
            narrative = `Il y a actuellement ${injuredPlayers.length} joueurs blessés dans toute la ligue.`;
            break;
          }

          case "resolve_email": {
            const emailId = params.emailId;
            const accept = params.accept; // boolean
            
            if (!state.inbox) state.inbox = [];
            const email = state.inbox.find(e => e.id === emailId);
            if (!email) {
              throw new Error(`Email "${emailId}" introuvable.`);
            }

            if (email.status !== "pending") {
              throw new Error("Cet email a déjà été traité.");
            }

            const userTeamObj = state.teams[state.userTeam];

            if (accept) {
              email.status = "accepted";
              
              if (email.type === "trade") {
                const { userPlayerId, offeredPlayerId, otherTeam } = email.actionData;
                const otherTeamObj = state.teams[otherTeam];
                
                const userPlayerIdx = userTeamObj.roster.findIndex(p => p.id === userPlayerId);
                const offeredPlayerIdx = otherTeamObj.roster.findIndex(p => p.id === offeredPlayerId);

                if (userPlayerIdx === -1 || offeredPlayerIdx === -1) {
                  throw new Error("Les joueurs concernés par l'échange sont introuvables.");
                }

                const userPlayer = userTeamObj.roster[userPlayerIdx];
                const offeredPlayer = otherTeamObj.roster[offeredPlayerIdx];

                // Perform the trade
                userTeamObj.roster[userPlayerIdx] = offeredPlayer;
                otherTeamObj.roster[offeredPlayerIdx] = userPlayer;

                // Adjust starter status
                offeredPlayer.starter = userPlayer.starter; // Offeree takes the starter spot if applicable
                userPlayer.starter = false; // Traded player is no longer starter in the new team

                // Boost moral of the acquired player
                offeredPlayer.moral = Math.min(100, offeredPlayer.moral + 10);

                alerts.push({
                  team: state.userTeam,
                  type: "trade_confirmed",
                  detail: `ÉCHANGE CONFIRMÉ : ${offeredPlayer.name} (OVR ${offeredPlayer.rating}) rejoint les ${userTeamObj.name}. ${userPlayer.name} part chez les ${otherTeamObj.name}.`
                });

                narrative = `Échange finalisé : vous avez accueilli ${offeredPlayer.name} en échange de ${userPlayer.name}.`;
                
                // Add confirmation follow-up message to inbox
                state.inbox.push({
                  id: "trade_confirm_" + emailId,
                  sender: email.sender,
                  senderAvatar: email.senderAvatar,
                  subject: `Re: ${email.subject} - ÉCHANGE CONFIRMÉ`,
                  body: `Coach,\n\nC'est signé ! L'échange est officiel. **${offeredPlayer.name}** a fait ses valises et intègre notre effectif dès aujourd'hui.\n\nBonne continuation avec votre nouveau joueur.\n\nCordialement,\nLe Secrétariat de la Ligue.`,
                  type: "news",
                  read: false,
                  week: state.currentWeek,
                  actionable: false,
                  status: "read"
                });

              } 
              else if (email.type === "free_agent") {
                const { faPlayerId } = email.actionData;
                const faIdx = state.freeAgents.findIndex(p => p.id === faPlayerId);
                if (faIdx === -1) {
                  throw new Error("L'agent libre proposé n'est plus disponible.");
                }

                const faPlayer = state.freeAgents[faIdx];
                
                // Roster limit check
                let cutAlertText = "";
                if (userTeamObj.roster.length >= 15) {
                  // Cut the lowest bench player (who is not a starter and not injured/only bench)
                  const benchPlayers = userTeamObj.roster.filter(p => !p.starter);
                  benchPlayers.sort((a, b) => a.rating - b.rating);
                  const playerToCut = benchPlayers[0];
                  
                  // Remove from user roster and push back to Free Agents
                  const cutIdx = userTeamObj.roster.findIndex(p => p.id === playerToCut.id);
                  userTeamObj.roster.splice(cutIdx, 1);
                  
                  // Reset statistics and put in free agents
                  playerToCut.starter = false;
                  state.freeAgents.push(playerToCut);
                  
                  cutAlertText = ` Pour faire de la place, **${playerToCut.name}** (OVR ${playerToCut.rating}) a été libéré de son contrat.`;
                  
                  alerts.push({
                    team: state.userTeam,
                    type: "player_cut",
                    detail: `CONTRAT LIBÉRÉ : ${playerToCut.name} a été coupé pour libérer une place dans l'effectif.`
                  });
                }

                // Add FA to roster
                state.freeAgents.splice(faIdx, 1);
                userTeamObj.roster.push(faPlayer);
                faPlayer.moral = 85; // He is happy to be signed

                alerts.push({
                  team: state.userTeam,
                  type: "fa_signed",
                  detail: `SIGNATURE CONTRAT : L'agent libre ${faPlayer.name} (OVR ${faPlayer.rating}) signe chez les ${userTeamObj.name}.${cutAlertText}`
                });

                narrative = `Contrat signé : ${faPlayer.name} a rejoint votre équipe.${cutAlertText}`;

                // Add follow-up email
                state.inbox.push({
                  id: "fa_confirm_" + emailId,
                  sender: email.sender,
                  senderAvatar: "FA",
                  subject: `Re: ${email.subject} - CONTRAT SIGNÉ`,
                  body: `Cher Coach,\n\nMon client **${faPlayer.name}** se joint à moi pour vous remercier. Il est impatient de rejoindre le vestiaire et d'apporter son maximum.\n\nSon contrat standard a été enregistré.${cutAlertText ? ` Nous prenons note du départ de ${playerToCut.name}.` : ''}\n\nSportivement.`,
                  type: "news",
                  read: false,
                  week: state.currentWeek,
                  actionable: false,
                  status: "read"
                });
              } 
              else if (email.type === "player_demand") {
                const { playerId } = email.actionData;
                const player = userTeamObj.roster.find(p => p.id === playerId);
                if (player) {
                  player.promisedWeeksRemaining = 2; // Coach has 2 weeks to titularize him
                  player.moral = Math.min(100, player.moral + 15);
                  narrative = `Promesse faite à ${player.name} : vous avez promis de l'intégrer au 5 majeur d'ici 2 semaines. Son moral augmente.`;
                  
                  alerts.push({
                    team: state.userTeam,
                    type: "promise_made",
                    detail: `PROMESSE : Vous avez promis de titulariser ${player.name} sous 2 semaines.`
                  });

                  state.inbox.push({
                    id: "demand_confirm_" + emailId,
                    sender: player.name,
                    senderAvatar: "PL",
                    subject: "Re: Temps de jeu insuffisant - Merci !",
                    body: `Coach,\n\nJe te remercie pour ton écoute et ta promesse. J'ai hâte de démarrer et je vais prouver que j'ai ma place dans le 5.\n\nMerci pour ta confiance.`,
                    type: "news",
                    read: false,
                    week: state.currentWeek,
                    actionable: false,
                    status: "read"
                  });
                }
              }

            } else {
              email.status = "declined";
              narrative = "Vous avez refusé la proposition.";
              
              if (email.type === "player_demand") {
                const { playerId } = email.actionData;
                const player = userTeamObj.roster.find(p => p.id === playerId);
                if (player) {
                  player.moral = Math.max(0, player.moral - 15);
                  narrative = `Vous avez refusé la demande de titularisation de ${player.name}. Son moral baisse.`;
                  
                  alerts.push({
                    team: state.userTeam,
                    type: "promise_declined",
                    detail: `DEMANDE REFUSÉE : ${player.name} reste remplaçant, son moral baisse.`
                  });

                  state.inbox.push({
                    id: "demand_decline_" + emailId,
                    sender: player.name,
                    senderAvatar: "PL",
                    subject: "Re: Temps de jeu insuffisant - Déçu...",
                    body: `Coach,\n\nJe prends note de votre refus. Je continuerai à travailler mais c'est une déception pour moi. J'espère que les choses changeront.`,
                    type: "news",
                    read: false,
                    week: state.currentWeek,
                    actionable: false,
                    status: "read"
                  });
                }
              }
            }

            break;
          }

          case "read_email": {
            const emailId = params.emailId;
            if (state.inbox) {
              const email = state.inbox.find(e => e.id === emailId);
              if (email) {
                email.read = true;
              }
            }
            break;
          }

          case "get_free_agents": {
            data = { freeAgents: state.freeAgents || [] };
            narrative = "Liste des agents libres récupérée.";
            break;
          }

          case "release_player": {
            const { playerId } = params;
            if (!playerId) {
              throw new Error("L'identifiant du joueur à libérer est requis.");
            }

            const userTeamObj = state.teams[state.userTeam];
            if (!userTeamObj) {
              throw new Error("Équipe de l'utilisateur introuvable.");
            }

            const playerIdx = userTeamObj.roster.findIndex(p => p.id === playerId);
            if (playerIdx === -1) {
              throw new Error("Ce joueur ne fait pas partie de votre effectif.");
            }

            if (userTeamObj.roster.length <= 10) {
              throw new Error("Votre effectif doit comporter au moins 10 joueurs. Recrutez d'abord d'autres agents libres !");
            }

            const player = userTeamObj.roster[playerIdx];

            // Remove from roster
            userTeamObj.roster.splice(playerIdx, 1);

            // Put back to free agents
            player.starter = false;
            state.freeAgents = state.freeAgents || [];
            state.freeAgents.push(player);

            alerts.push({
              team: state.userTeam,
              type: "player_cut",
              detail: `CONTRAT LIBÉRÉ : Vous avez libéré ${player.name} (OVR ${player.rating}) qui rejoint la liste des agents libres.`
            });

            narrative = `${player.name} (OVR ${player.rating}) a été libéré de son contrat et est désormais agent libre.`;
            data = { success: true };
            break;
          }

          case "advance_playoffs": {
            // Si regular_season n'est pas terminée
            if (state.stage === "regular_season") {
              const remaining = state.schedule.filter(g => !g.simulated).length;
              if (remaining > 0) {
                throw new Error(`Impossible de lancer les playoffs : il reste ${remaining} matchs de saison régulière.`);
              }
            }

            // Initialiser les playoffs si besoin
            if (state.stage === "playoffs_init") {
              // Récupérer les 8 premiers de chaque conférence
              const standings = { East: [], West: [] };
              Object.values(state.teams).forEach(team => {
                const pct = team.wins + team.losses > 0 ? team.wins / (team.wins + team.losses) : 0;
                standings[team.conference].push({
                  name: team.city + " " + team.name,
                  pct: pct,
                  pointsDiff: team.pointsFor - team.pointsAgainst
                });
              });

              const sortFn = (a, b) => b.pct !== a.pct ? b.pct - a.pct : b.pointsDiff - a.pointsDiff;
              standings.East.sort(sortFn);
              standings.West.sort(sortFn);

              const eastQualifiers = standings.East.slice(0, 8).map(t => t.name);
              const westQualifiers = standings.West.slice(0, 8).map(t => t.name);

              state.playoffs = {
                round: 1, // 1: 1st Round, 2: Conference Semis, 3: Conference Finals, 4: NBA Finals
                series: {
                  East: [
                    { t1: eastQualifiers[0], t2: eastQualifiers[7], w1: 0, w2: 0, games: [] }, // 1 vs 8
                    { t1: eastQualifiers[3], t2: eastQualifiers[4], w1: 0, w2: 0, games: [] }, // 4 vs 5
                    { t1: eastQualifiers[1], t2: eastQualifiers[6], w1: 0, w2: 0, games: [] }, // 2 vs 7
                    { t1: eastQualifiers[2], t2: eastQualifiers[5], w1: 0, w2: 0, games: [] }  // 3 vs 6
                  ],
                  West: [
                    { t1: westQualifiers[0], t2: westQualifiers[7], w1: 0, w2: 0, games: [] },
                    { t1: westQualifiers[3], t2: westQualifiers[4], w1: 0, w2: 0, games: [] },
                    { t1: westQualifiers[1], t2: westQualifiers[6], w1: 0, w2: 0, games: [] },
                    { t1: westQualifiers[2], t2: westQualifiers[5], w1: 0, w2: 0, games: [] }
                  ]
                }
              };

              state.stage = "playoffs";
              narrative = "Les Playoffs NBA commencent ! Les 16 meilleures équipes se disputent le titre suprême.";
              data = { playoffs: state.playoffs };
              break;
            }

            if (state.stage !== "playoffs") {
              throw new Error("L'action advance_playoffs n'est disponible qu'en phase de playoffs.");
            }

            // Simuler la suite des playoffs
            // On va simuler un match pour CHAQUE série en cours jusqu'à ce qu'une équipe atteigne 4 victoires
            const playoffs = state.playoffs;
            const currentRound = playoffs.round;
            let activeSeriesList = [];

            if (currentRound <= 3) {
              activeSeriesList = [...playoffs.series.East, ...playoffs.series.West];
            } else if (currentRound === 4) {
              activeSeriesList = playoffs.series.Finals || [];
            }

            // Vérifier si toutes les séries de ce round sont déjà terminées (quelqu'un a 4 victoires)
            const roundFinished = activeSeriesList.every(s => s.w1 === 4 || s.w2 === 4);

            if (roundFinished) {
              // Passer au round suivant
              if (currentRound === 1) {
                // Créer demi-finales de conférence (4 séries deviennent 2)
                playoffs.round = 2;
                playoffs.series.East = [
                  { t1: getWinner(playoffs.series.East[0]), t2: getWinner(playoffs.series.East[1]), w1: 0, w2: 0, games: [] },
                  { t1: getWinner(playoffs.series.East[2]), t2: getWinner(playoffs.series.East[3]), w1: 0, w2: 0, games: [] }
                ];
                playoffs.series.West = [
                  { t1: getWinner(playoffs.series.West[0]), t2: getWinner(playoffs.series.West[1]), w1: 0, w2: 0, games: [] },
                  { t1: getWinner(playoffs.series.West[2]), t2: getWinner(playoffs.series.West[3]), w1: 0, w2: 0, games: [] }
                ];
                narrative = "Demi-finales de conférence lancées.";
              } else if (currentRound === 2) {
                // Créer finales de conférence (2 séries deviennent 1)
                playoffs.round = 3;
                playoffs.series.East = [
                  { t1: getWinner(playoffs.series.East[0]), t2: getWinner(playoffs.series.East[1]), w1: 0, w2: 0, games: [] }
                ];
                playoffs.series.West = [
                  { t1: getWinner(playoffs.series.West[0]), t2: getWinner(playoffs.series.West[1]), w1: 0, w2: 0, games: [] }
                ];
                narrative = "Finales de conférence lancées.";
              } else if (currentRound === 3) {
                // Créer NBA Finals (Vainqueur Est vs Vainqueur Ouest)
                playoffs.round = 4;
                playoffs.series.Finals = [
                  { t1: getWinner(playoffs.series.East[0]), t2: getWinner(playoffs.series.West[0]), w1: 0, w2: 0, games: [] }
                ];
                narrative = "Finales NBA lancées ! Le titre se joue maintenant.";
              } else if (currentRound === 4) {
                // Fin des playoffs, champion couronné
                state.stage = "ended";
                const champion = getWinner(playoffs.series.Finals[0]);
                narrative = `Les Playoffs sont terminés ! Les ${champion} sont sacrés CHAMPIONS NBA !`;
                data = { champion };
                break;
              }
              data = { playoffs };
              break;
            }

            // Simuler un round de match pour chaque série non terminée
            let gamesSimulatedThisStep = 0;
            let userGameSimulated = null;

            activeSeriesList.forEach(series => {
              if (series.w1 < 4 && series.w2 < 4) {
                // Simuler ce match de playoffs
                // Qui reçoit ? Format de playoffs NBA classique: 2-2-1-1-1 (t1 a le home court avantage)
                const gameIndex = series.w1 + series.w2;
                const isHomeT1 = [0, 1, 4, 6].includes(gameIndex);
                
                const gameObj = {
                  home: isHomeT1 ? series.t1 : series.t2,
                  away: isHomeT1 ? series.t2 : series.t1
                };

                const weekAlerts = [];
                const res = simulateSingleGame(gameObj, state.teams, weekAlerts);
                alerts.push(...weekAlerts);
                gamesSimulatedThisStep++;

                // Enregistrer le score dans la série
                const wonT1 = (gameObj.home === series.t1 && gameObj.result.homeScore > gameObj.result.awayScore) ||
                              (gameObj.away === series.t1 && gameObj.result.awayScore > gameObj.result.homeScore);

                if (wonT1) {
                  series.w1++;
                } else {
                  series.w2++;
                }

                const gameRecord = {
                  gameNumber: gameIndex + 1,
                  home: gameObj.home,
                  away: gameObj.away,
                  homeScore: gameObj.result.homeScore,
                  awayScore: gameObj.result.awayScore,
                  winner: wonT1 ? series.t1 : series.t2
                };

                series.games.push(gameRecord);

                if (series.t1 === state.userTeam || series.t2 === state.userTeam) {
                  userGameSimulated = gameRecord;
                  narrative = res.narrative + ` (Série : ${series.t1} ${series.w1} - ${series.w2} ${series.t2})`;
                }
              }
            });

            // Fatigue et blessures récupèrent légèrement
            updateRestDays(state.teams, 2);

            if (!userGameSimulated) {
              narrative = `Playoffs - Matchs de séries simulés (${gamesSimulatedThisStep} matchs joués).`;
            }

            data = { playoffs };
            break;
          }

          case "save_live_game_result": {
            const { gameId, isPlayoff, result, alerts: liveAlerts } = params;
            
            let homeTeamName, awayTeamName;
            let gameObj = null;
            if (isPlayoff) {
              const playoffs = state.playoffs;
              const currentRound = playoffs.round;
              let activeSeriesList = [];
              if (currentRound <= 3) {
                activeSeriesList = [...playoffs.series.East, ...playoffs.series.West];
              } else if (currentRound === 4) {
                activeSeriesList = playoffs.series.Finals || [];
              }
              const series = activeSeriesList.find(s => s.t1 === state.userTeam || s.t2 === state.userTeam);
              if (!series) throw new Error("Série de playoffs introuvable pour l'utilisateur.");
              
              homeTeamName = series.t1;
              awayTeamName = series.t2;
              
              const wonT1 = result.homeScore > result.awayScore;
              if (wonT1) {
                series.w1++;
              } else {
                series.w2++;
              }
              
              const gameRecord = {
                gameNumber: series.w1 + series.w2,
                home: homeTeamName,
                away: awayTeamName,
                homeScore: result.homeScore,
                awayScore: result.awayScore,
                winner: wonT1 ? homeTeamName : awayTeamName
              };
              series.games.push(gameRecord);
            } else {
              gameObj = state.schedule.find(g => g.id === gameId);
              if (!gameObj) throw new Error("Match de saison régulière introuvable.");
              homeTeamName = gameObj.home;
              awayTeamName = gameObj.away;
              
              gameObj.simulated = true;
              gameObj.result = result;
            }

            const homeTeam = state.teams[homeTeamName];
            const awayTeam = state.teams[awayTeamName];
            const homeWon = result.homeScore > result.awayScore;

            const updateStandings = (team, won, pointsFor, pointsAgainst) => {
              if (won) {
                team.wins++;
                team.streak = team.streak >= 0 ? team.streak + 1 : 1;
                team.lastTen.push("W");
              } else {
                team.losses++;
                team.streak = team.streak <= 0 ? team.streak - 1 : -1;
                team.lastTen.push("L");
              }
              if (team.lastTen.length > 10) team.lastTen.shift();
              team.pointsFor += pointsFor;
              team.pointsAgainst += pointsAgainst;

              team.roster.forEach(p => {
                if (won) {
                  p.moral = Math.min(100, p.moral + 5);
                } else {
                  p.moral = Math.max(0, p.moral - 3);
                }
              });
            };

            updateStandings(homeTeam, homeWon, result.homeScore, result.awayScore);
            updateStandings(awayTeam, !homeWon, result.awayScore, result.homeScore);

            const updatePlayers = (team, playerStats) => {
              team.roster.forEach(p => {
                const ps = playerStats[p.id];
                if (ps) {
                  p.stats.gp++;
                  p.stats.pts += ps.pts;
                  p.stats.reb += ps.reb;
                  p.stats.ast += ps.ast;
                  p.stats.stl += ps.stl;
                  p.stats.blk += ps.blk;
                  p.fatigue = Math.min(100, p.fatigue + 15);
                }
              });
            };

            updatePlayers(homeTeam, result.homePlayerStats);
            updatePlayers(awayTeam, result.awayPlayerStats);

            liveAlerts.forEach(la => {
              const team = state.teams[la.team];
              if (team) {
                const player = team.roster.find(p => p.name === la.player);
                if (player) {
                  const severity = la.detail.includes("sévérité: Légère") ? "Légère" : (la.detail.includes("sévérité: Grave") ? "Grave" : "Moyenne");
                  let days = 7;
                  const daysMatch = la.detail.match(/durée.* (\d+) jours/);
                  if (daysMatch) days = parseInt(daysMatch[1]);
                  
                  player.injury = {
                    name: la.detail.split("(")[1].split(",")[0],
                    severity: severity,
                    daysRemaining: days,
                    totalDays: days
                  };
                  alerts.push(la);
                }
              }
            });

            updateRestDays(state.teams, 1);

            narrative = `Match terminé. ${homeWon ? homeTeamName : awayTeamName} s'impose face à ${homeWon ? awayTeamName : homeTeamName} (${result.homeScore}-${result.awayScore}).`;
            data = { success: true };
            break;
          }

          case "advance_other_playoffs": {
            const playoffs = state.playoffs;
            const currentRound = playoffs.round;
            let activeSeriesList = [];
            if (currentRound <= 3) {
              activeSeriesList = [...playoffs.series.East, ...playoffs.series.West];
            } else if (currentRound === 4) {
              activeSeriesList = playoffs.series.Finals || [];
            }
            
            activeSeriesList.forEach(series => {
              if (series.t1 === state.userTeam || series.t2 === state.userTeam) {
                return;
              }
              
              if (series.w1 < 4 && series.w2 < 4) {
                const gameIndex = series.w1 + series.w2;
                const isHomeT1 = [0, 1, 4, 6].includes(gameIndex);
                const gameObj = {
                  home: isHomeT1 ? series.t1 : series.t2,
                  away: isHomeT1 ? series.t2 : series.t1
                };
                const weekAlerts = [];
                const res = simulateSingleGame(gameObj, state.teams, weekAlerts);
                alerts.push(...weekAlerts);
                
                const wonT1 = (gameObj.home === series.t1 && gameObj.result.homeScore > gameObj.result.awayScore) ||
                              (gameObj.away === series.t1 && gameObj.result.awayScore > gameObj.result.homeScore);
                if (wonT1) {
                  series.w1++;
                } else {
                  series.w2++;
                }
                series.games.push({
                  gameNumber: gameIndex + 1,
                  home: gameObj.home,
                  away: gameObj.away,
                  homeScore: gameObj.result.homeScore,
                  awayScore: gameObj.result.awayScore,
                  winner: wonT1 ? series.t1 : series.t2
                });
              }
            });
            
            updateRestDays(state.teams, 2);
            narrative = "Les autres matchs de playoffs ont été simulés.";
            data = { playoffs };
            break;
          }

          default:
            throw new Error(`Action non reconnue : ${action}`);
        }
      } catch (err) {
        success = false;
        data = { error: err.message };
        narrative = `Erreur lors de l'exécution de l'action : ${err.message}`;
      }

      return {
        success: success,
        action: action,
        data: data,
        gameState: state,
        narrative: narrative,
        alerts: alerts
      };
    }
  };

  // Helper pour trouver le gagnant d'une série
  function getWinner(series) {
    if (series.w1 === 4) return series.t1;
    if (series.w2 === 4) return series.t2;
    return null;
  }

})();
