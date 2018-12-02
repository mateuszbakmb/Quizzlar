document.addEventListener("DOMContentLoaded", start);

function start (){
//causing clicking on submit button to get selected values
let submitButton = document.getElementById('submit');
submitButton.addEventListener('click', showResult);

//getting two selected values
//could have added more options to choose from, such as the number of questions or a question type
//decided 10 multiple answer questions is the most optimal option
function showResult(e){
  e.preventDefault();
//variable for a chosen difficulty
  let diff = document.getElementById('difficulty');
  let chosenDiff = diff.options[diff.selectedIndex].value;
//variable for a chosen category
  let cat = document.getElementById('category');
  let chosenCat = cat.options[cat.selectedIndex].value;
  generateUrl(chosenDiff, chosenCat);
}
//generating API url to get 10 random questions from https://opentdb.com/ based on selected options after submitting
function generateUrl(difficulty, category){
  let url = '';
    if (difficulty === '' || category === '') {
        alert('Select options!'); return false;
    } else if (difficulty === 'any' && category == 'any'){
      url = 'https://opentdb.com/api.php?amount=10&type=multiple'
    } else if (difficulty ==='any' && category !== 'any'){
      url = `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`
    } else if (difficulty !== 'any' && category ==='any'){
      url = `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`
    } else {url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`}

//fetching data
  let result = fetch(url).then((answer)=>{
    return answer.json();
  })
  .then((final)=>{
  quizApp(final);
  });
}

//called it a quizApp in a sense that previous code gets questions from the database and sends it here ergo
//quizApp function is the part where all the works is done once the api link is generated and data taken from it
function quizApp(e){
  let questions = [...e.results];
  let currentQuestion = 0;
  let correctAnswers = 0;
  let totalQuestions = questions.length;

//unforotunately some specific combinations of difficulty/category do not provide with an array of 10 questions
//some may have less than 10 or even have no questions at all
//since I wanted to be consistent and didnt want to have a situation when its possible to have less than 10
//questions in a single quizz game, I decided to simply ask users to select different options

  if(totalQuestions <10){
    alert('No questions of that specific difficulty and/or category in the database. Please select different options')
    return false
  }
//function generating next questions
(function nextQuestion(){
//when the quiz is over and theres no more questions left
if (currentQuestion===totalQuestions){
  document.querySelector('h1').innerHTML = "Congratulations! You've managed to get to the end!"
  let finalMessage = document.createElement('div')
  finalMessage.id = 'finalMessage'
  finalMessage.innerHTML = `Your final score: ${correctAnswers}/10`
  let clearingContainer = document.querySelector('section').firstElementChild
  clearingContainer.parentNode.replaceChild(finalMessage, clearingContainer)
  let tryAgain = document.createElement('div')
  tryAgain.innerHTML = 'Would you like to try again?'
  tryAgain.id = 'tryAgain'
  document.querySelector('section').appendChild(tryAgain)

//buttons to click after finishing the game
  let restartButtonYES = document.createElement('button')
  restartButtonYES.id = 'restartButtonYES'
  restartButtonYES.className = 'restartButton'
  restartButtonYES.innerHTML = 'YES :)'
  document.querySelector('section').appendChild(restartButtonYES)
  restartButtonYES.addEventListener('click', reload)
//decided refreshing the page is the easiest way to go
  function reload(){
    window.location.reload();
  }

  let restartButtonNO = document.createElement('button')
  restartButtonNO.id = 'restartButtonNO'
  restartButtonNO.className = 'restartButton'
  restartButtonNO.innerHTML = 'NO :('
  document.querySelector('section').appendChild(restartButtonNO)
  restartButtonNO.addEventListener('click', takeMe)
//clicking 'no' takes users to my github because why not
  function takeMe(){
    window.location = 'https://github.com/mateuszbakmb'
  }
  return false
  }

//info about the current question
  let category = questions[currentQuestion].category;
  let riddle = questions[currentQuestion].question;
  let incorrectOnes = questions[currentQuestion].incorrect_answers;
  let correctOne = questions[currentQuestion].correct_answer;
  let both = incorrectOnes.concat(correctOne).sort();

//contHeader as in header of the main container with future questions
  let contHeader = document.querySelector('h1')
  contHeader.textContent = `Question number ${currentQuestion +1}`
  let pCat = document.createElement('div')
  pCat.textContent = `Category: ${category}`
  pCat.id = 'pCat'


//contBody as in the body, main part of the container with future questions
  let contBody = document.querySelector('#choice').firstElementChild
  contBody.parentNode.replaceChild(pCat, contBody);

  let askQuestion = document.createElement('div')
  askQuestion.id = 'askQuestion'
  askQuestion.innerHTML = riddle;
  document.querySelector('#pCat').appendChild(askQuestion)
  let simpleDiv = document.createElement('div')
  document.querySelector('#pCat').appendChild(simpleDiv)
  simpleDiv.id = 'contQuestions'
//creating answer buttons, mapping over answers array
  let button = both.map(x=>{let div = document.createElement('button');
    div.innerHTML = x;
    div.id = x;
    div.className = 'answerButton btn-block m-0';
    simpleDiv.appendChild(div);
    div.addEventListener('click', checkAnswer);
  })

//checking if chosen answer is correct
function checkAnswer(e){
  currentQuestion++;
  let newBody = document.createElement('div')
  let coloredResult = document.createElement('div')
  coloredResult.id = 'coloredResult'
  newBody.appendChild(coloredResult)

  let nextButton = document.createElement('button')
//button after the final question since it cant say 'next question' anymore
  if (currentQuestion===10){
    nextButton.innerHTML = 'Finish'
  } else {
  nextButton.innerHTML = 'Next question'}

  nextButton.id = 'nextButton'
  nextButton.addEventListener('click', nextQuestion);
  simpleDiv.parentNode.replaceChild(newBody, simpleDiv);

  if(e.target.id === correctOne){
    correctAnswers++;
    coloredResult.innerHTML = 'Correct! :)';
    coloredResult.style.color = 'green';
    newBody.appendChild(nextButton)
  } else {coloredResult.innerHTML = 'Incorrect! :(';
coloredResult.style.color = 'red';
  let whichIsCorrect = document.createElement('div');
  whichIsCorrect.id = 'whichIsCorrect'
  whichIsCorrect.innerHTML = `Correct answer : ${correctOne}`
  newBody.appendChild(whichIsCorrect);
  newBody.appendChild(nextButton)}
}
})();
}
}
