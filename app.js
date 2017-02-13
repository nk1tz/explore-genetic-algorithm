var target = "";
var lowestScore = Infinity;
var topPerformerGenome = [];
var mutationRate = 0.009;
var sexNumber = 4;
var sBias = 0.8;
var popSize = 30;
var elites = 0;

// Define character space
const CHAR_SPACE_MIN = 32;
const CHAR_SPACE_MAX = 126;

// Define nodes
var topPerformerNode1 = document.getElementById('top-performer1');
var topPerformerNode2 = document.getElementById('top-performer2');
var topPerformerNode3 = document.getElementById('top-performer3');
var topPerformerNode4 = document.getElementById('top-performer4');
var topPerformerNode5 = document.getElementById('top-performer5');
var topPerformerNode6 = document.getElementById('top-performer6');
var topPerformerNode7 = document.getElementById('top-performer7');
var topPerformerNode8 = document.getElementById('top-performer8');
var topPerformerNode9 = document.getElementById('top-performer9');
var topPerformerNode10 = document.getElementById('top-performer10');

var scoreNode1 = document.getElementById('score1');
var scoreNode2 = document.getElementById('score2');
var scoreNode3 = document.getElementById('score3');
var scoreNode4 = document.getElementById('score4');
var scoreNode5 = document.getElementById('score5');
var scoreNode6 = document.getElementById('score6');
var scoreNode7 = document.getElementById('score7');
var scoreNode8 = document.getElementById('score8');
var scoreNode9 = document.getElementById('score9');
var scoreNode10 = document.getElementById('score10');

var inputNode = document.getElementById('textBox');
var evolveStartNode = document.getElementById('start-evolve');
var mutationRateNode = document.getElementById('mutation-rate');
var sexNumberNode = document.getElementById('sex-number');
var popSizeNode = document.getElementById('pop-size');
var selectionBiasNode = document.getElementById('selection-bias');
var elitesNode = document.getElementById('elites');


// Click Event
evolveStartNode.onclick = () => beginEvolution(inputNode.value);
mutationRateNode.onchange = () => {mutationRate = mutationRateNode.value};
selectionBiasNode.onchange = () => {sBias = selectionBiasNode.value};
sexNumberNode.onchange = () => {sexNumber = sexNumberNode.value};
popSizeNode.onchange = () => {popSize = popSizeNode.value};
elitesNode.onchange = () => {elites = elitesNode.value};

// Set up default display
mutationRateNode.value = mutationRate;
sexNumberNode.value = sexNumber;
popSizeNode.value = popSize;
selectionBiasNode.value = sBias;
elitesNode.value = elites;


function beginEvolution(target) {
  topPerformerNode1.style.color = 'darkorange';
  let targetGenome = getGenomeFromString(target)
  let initialPop = generateRandomPopulationOfSize(targetGenome.length, popSize);
  let initialScores = getScoresForEntirePopulation(initialPop, targetGenome)
  evolution(targetGenome, initialPop, initialScores);
}


function evolution(targetGenome, pop, scores) {
  let [sortedPop, sortedScores] = getSortedPopAndScores(scores, pop);
  pop = generateNewPopulation(sortedPop, sortedScores);
  scores = getScoresForEntirePopulation(pop, targetGenome);
  console.log('generations')

  if(sortedScores[0] > 0) {
    setTimeout(()=>evolution(targetGenome, pop, scores), 0)
    displayData(sortedPop, sortedScores);
  }
  else {
    displayData(sortedPop, sortedScores);
    topPerformerNode1.style.color = 'darkgreen';
    return;
  }
}


function displayData(sortedPop, sortedScores) {
  topPerformerNode1.textContent = getStringFromGenome(sortedPop[0]);
  topPerformerNode2.textContent = getStringFromGenome(sortedPop[1]);
  topPerformerNode3.textContent = getStringFromGenome(sortedPop[2]);
  topPerformerNode4.textContent = getStringFromGenome(sortedPop[3]);
  topPerformerNode5.textContent = getStringFromGenome(sortedPop[4]);
  topPerformerNode6.textContent = getStringFromGenome(sortedPop[5]);
  topPerformerNode7.textContent = getStringFromGenome(sortedPop[6]);
  topPerformerNode8.textContent = getStringFromGenome(sortedPop[7]);
  topPerformerNode9.textContent = getStringFromGenome(sortedPop[8]);
  topPerformerNode10.textContent = getStringFromGenome(sortedPop[9]);
  scoreNode1.textContent = sortedScores[0];
  scoreNode2.textContent = sortedScores[1];
  scoreNode3.textContent = sortedScores[2];
  scoreNode4.textContent = sortedScores[3];
  scoreNode5.textContent = sortedScores[4];
  scoreNode6.textContent = sortedScores[5];
  scoreNode7.textContent = sortedScores[6];
  scoreNode8.textContent = sortedScores[7];
  scoreNode9.textContent = sortedScores[8];
  scoreNode10.textContent = sortedScores[9];
}


function generateNewPopulation(sortedPop, sortedScores) {
  let newGeneration = [];
  let p = 0;
  while(p < popSize) {
    if(p < elites) {
      newGeneration.push(sortedPop[p])
    }
    else {
      newGeneration.push(
        mateGenomesGetNewGenome(
          ...selectNindividuals(sortedPop, sortedScores)
        )
      )
    }
    p++;
  }
  return newGeneration;
}


function getSortedPopAndScores(scoresArray, popArray) {
  //1) combine the arrays:
  var list = [];
  for (var j in scoresArray)
      list.push({'genome': popArray[j], 'score': scoresArray[j]});
  //2) sort:
  list.sort(function(a, b) {
      return ((a.score < b.score) ? -1 : ((a.score == b.score) ? 0 : 1));
  });
  //3) separate them back out:
  for (var k = 0; k < list.length; k++) {
      popArray[k] = list[k].genome;
      scoresArray[k] = list[k].score;
  }
  return [popArray, scoresArray];
}


function selectNindividuals(popArray, scoresArray) {
  let weightsArray = getWeights(scoresArray);
  let selectedIndividuals = [];
  let s = 0;
  while (s < sexNumber) {
    selectedIndividuals.push(popArray[weightedRandSelection(weightsArray)]);
    s++;
  }
  return selectedIndividuals;
}


function weightedRandSelection(weights) {
  var sumOfWeights = weights.reduce((a,b)=>a+b);
  var i, sum = 0, r = Math.random()*sumOfWeights;
  for (i in weights) {
    sum += weights[i];
    if (r <= sum) return i;
  }
}


function getWeights(scores) {
  return scores.map(s => 1/(s^sBias));
}


function mutateGenome(genome) {
  return genome.map(n => {
    if(getRandomInt(0, 100) <= mutationRate*100) {
      let coin = Math.random();
      if(coin < 0.3) {
        return n + 1;
      }
      else if(coin >= 0.3 && coin < 0.6) {
        return n - 1;
      }
      else if(coin >= 0.6 && coin < 0.75) {
        return n + 2;
      }
      else if(coin >= 0.75 && coin < 0.9) {
        return n - 2;
      }
      else {
        return getRandomInt(CHAR_SPACE_MIN, CHAR_SPACE_MAX);
      }
    }
    return n
  })
}


function mateGenomesGetNewGenome(...args) {
  let n = args.length;
  let chunk = Math.floor(args[0].length / n);
  let m = 0;
  let newGenome = [];
  while (m < n){
    if(m === n-1){
      newGenome = newGenome.concat(args[m].slice(m*chunk, args[0].length));
    }
    else {
      newGenome = newGenome.concat(args[m].slice(m*chunk, (m+1)*chunk));
    }
    m++;
  }
  return mutateGenome(newGenome);
}


function getScoresForEntirePopulation(population, targetGenome) {
  let newScores = [];
  let j = 0;
  while (j < population.length) {
    newScores.push(compare2Genomes(population[j], targetGenome));
    j++;
  }
  return newScores;
}


function generateRandomPopulationOfSize(individualLength) {
  let randPopulation = [];
  let n = 0;
  let randGenome;
  while (n < popSize) {
    randPopulation.push(generateRandomGenomeOfLength(individualLength));
    n++;
  }
  return randPopulation;
}


function generateRandomGenomeOfLength(length) {
  let newGenome = [];
  let i = 0;
  while (i < length) {
    newGenome.push(getRandomInt(CHAR_SPACE_MIN, CHAR_SPACE_MAX));
    i++;
  }
  return newGenome;
}


function getGenomeFromString(str) {
  return str.split("").map(char => char.charCodeAt(0))
}


function getStringFromGenome(genome) {
  return String.fromCharCode(...genome);
}


function compare2Genomes(g1, g2) {
  return g1.reduce((acc, curr, i) => acc + Math.abs(curr - g2[i]), 0);
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
