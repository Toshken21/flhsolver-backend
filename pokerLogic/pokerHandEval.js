// import express and create a router.


const pokerEvaluator = require("poker-evaluator");


// function that generates deck.

function generateDeck() {
    const suits = ['h', 'd', 'c', 's'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const deck = [];
  
    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push(rank + suit);
      }
    }
  
    return deck;
  }

// function that shuffles deck.

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

// function that deals cards.

function deal(deck, numOfCards) {
    return deck.splice(0, numOfCards);
  }

  // TODO: create a function where any number of hands can get dealt.

  function simulateGame(playersHandsArray, board, deck) {
    // Create a copy of deck and shuffle it
    let remainingCards = [...deck];
    shuffleDeck(remainingCards);

    // Fill the board
    while(board.length < 5){
        const card = deal(remainingCards, 1);
        let cardIsInHand = false;
        
        // Check if the card is not in one of the player's hand.
        playersHandsArray.forEach(hand => {
            const foundCard = hand.find((handCard) =>  handCard === card);
            if(foundCard != undefined){
                cardIsInHand = true;
            }
        });

        // This snippet of code will remove the card if it matches a card in someone's hand. If it doesn't it will add the card to the board.

        if(cardIsInHand === true){
            remainingCards = remainingCards.filter(cardInDeck => cardInDeck !== card);
        } else {
            board.push(card);
        }
    }

    // creates an array that will store the hand values and add the evaluations of each hand to the array.

    let handValueArray = [];

    playersHandsArray.forEach(hand => {
        const evaluatedHand = pokerEvaluator.evalHand(hand);
        handValueArray.push(evaluatedHand);
    });
    
    
    // creates a variable that will hold the greatest handRank and will get updated every time a hand is greater.

    let greatesHandType = 0;
    
    handValueArray.forEach(evaluatedHand => {
        const evalHandType = evaluatedHand.handType;
        if(evalHandType > greatesHandType){
            greatesHandType = evalHandType;
        }
    });

    // creates a variable that will hold the greatest handValue and will get updated every time a hand is greater

    let greatestHandValue = 0;

    handValueArray.forEach(evaluatedHand => {
        if(evaluatedHand.handType === greatesHandType){
            const evalHandValue = evaluatedHand.handValue;
            if(evalHandValue > greatestHandValue){
                greatestHandValue = evalHandValue;
            }
        }
    })

    // finds the winner

    // resultsArray is the way we record the result. If the hero wins a hand, ++resultsarray[0], if the hero ties, ++resultsArray[1], if the hero loses ++resultsArray[2]
    let resultsArray = [0, 0, 0];

    let numberOfWinners = 0;

    let heroHandValue = handValueArray[0];

    handValueArray.forEach((playerHand) => {
      if(playerHand.handRank === greatesHandType && playerHand.handRank === greatestHandValue){
        ++numberOfWinners;

      }
      
    });

    if(heroHandValue.handType === greatesHandType && heroHandValue.handValue === greatestHandValue ){
      if(numberOfWinners === 1){
        ++resultsArray[0];
      } else {
        ++resultsArray[1];
      }
    } else {
      ++resultsArray[2];
    }


    // return the resultsArray, that we will aggregate in a new function.

    return resultsArray;




}


// This function will iterate over the simulateGame function as many times as the simNumber parameter and return  

function monteCarloMethod (playersHandsArray, board, deck, simNumber){

  // create an array that will hold the outcomes for the simulations and a counter for the number of sims

  let outcomeArray = [0, 0, 0];

  let simCounter = 0;

  // runs the simulation a desired number of time and updates the outcome array;
  while(simCounter < simNumber){
    const simIterationArray = simulateGame(playersHandsArray, board, deck);

    outcomeArray[0] += simIterationArray[0];
    outcomeArray[1] += simIterationArray[1];
    outcomeArray[2] += simIterationArray[2];

    simCounter += 1;

  }

  // we now calculate the win, draw and lose percentage

  /*const winPercentage = outcomeArray[0] / simNumber * 100;
  const drawPercentage = outcomeArray[1] / simNumber * 100;
  const losePercentage = outcomeArray[2] / simNumber * 100;
  winPercentage.toFixed(2);
  drawPercentage.toFixed(2);
  losePercentage.toFixed(2);

  // return the function in the form of an array

  const simResultsArray = [winPercentage, drawPercentage, losePercentage];

  return simResultsArray;*/

  return outcomeArray;

}


// This function gets all combinations of possible hands based on their ranges

function getAllCombinations (rangeHolderArray, currentCombination = [], index = 0, results = []) {

  if(index === rangeHolderArray.length){
    results.push([...currentCombination]);
    return;
  }

  const currentArray = rangeHolderArray[index];

  for(let i = 0; i < currentArray.length; i++){
    currentCombination[index] = currentArray[i];
    simulateWithRanges(rangeHolderArray, currentCombination, index + 1, results);
  }

  return results;




}

function calculateAllCombinations(combinationsArray, board, deck, iterations){
  const outcomeHolder = [0, 0, 0];
  combinationsArray.forEach((combination) => {
    const iteratedOutcomeArray = monteCarloMethod(combination, board, deck, iterations);
    outcomeHolder[0] += iteratedOutcomeArray[0];
    outcomeHolder[1] += iteratedOutcomeArray[1];
    outcomeHolder[2] += iteratedOutcomeArray[2];

  });

  // now we calculate the total number of runs and the percentage

  const totalRuns = outcomeHolder[0] + outcomeHolder[1] + outcomeHolder[2];

  const winPercentage = outcomeHolder[0] / totalRuns * 100;
  const drawPercentage = outcomeHolder[1] / totalRuns * 100;
  const losePercentage = outcomeHolder[2] / totalRuns * 100;

  winPercentage.toFixed(2);
  drawPercentage.toFixed(2);
  losePercentage.toFixed(2);

  // create an array that holds the percentages and return it

  const percentageHolderArray = [winPercentage, drawPercentage, losePercentage];

  return percentageHolderArray;

}


//testing
const testingArray = [["Kc", "Ac"], []];