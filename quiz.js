document.addEventListener("DOMContentLoaded", start);

function start (){
//causing clicking on submit button to get selected values
let submitButton = document.getElementById('submit');
submitButton.addEventListener('click', showResult);

//getting two selected values
function showResult(e){
  e.preventDefault();
  let diff = document.getElementById('difficulty');
  let chosenDiff = diff.options[diff.selectedIndex].value;

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

  let result = fetch(url).then((answer)=>{
    return answer.json();
  })
  .then((final)=>{
  quizApp(final);
  });
}


function quizApp(e){
  let questions = [...e.results];
  let currentQuestion = 0;
  let correctAnswers = 0;
  let totalQuestions = questions.length;

  if(totalQuestions <10){
    alert('No questions of that specific difficulty and category in the database. Please select different options')
    return false
  }

(function nextQuestion(){
//when the quiz is over
if (currentQuestion===2){
document.querySelector('h1').innerHTML = "Congratulations! You've answered to all the questions!"
let finalMessage = document.createElement('div')
finalMessage.id = 'finalMessage'
finalMessage.innerHTML = `Your final score: ${correctAnswers}/10`
let clearingContainer = document.querySelector('section').firstElementChild
clearingContainer.parentNode.replaceChild(finalMessage, clearingContainer)



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
  nextButton.innerHTML = 'Next question'
  nextButton.id = 'nextButton'
  nextButton.className = 'btn btn-primary'
  nextButton.addEventListener('click', nextQuestion);

  simpleDiv.parentNode.replaceChild(newBody, simpleDiv)
  if(e.target.id === correctOne){
    correctAnswers++;
    coloredResult.innerHTML = 'Correct! :)';
    coloredResult.style.color = 'green';
    newBody.appendChild(nextButton)
  } else {coloredResult.innerHTML = 'Incorrect! :(';
coloredResult.style.color = 'red';
  let whichIsCorrect = document.createElement('div');
  whichIsCorrect.innerHTML = `Correct answer : ${correctOne}`
  newBody.appendChild(whichIsCorrect);
  newBody.appendChild(nextButton)}
}


})();




}


}
