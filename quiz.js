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
  // document.querySelector('section').appendChild(pCat)

//contBody as in the body, main part of the container with future questions
  let contBody = document.querySelector('#choice');
  let newDiv = document.createElement('span');
  contBody.parentNode.replaceChild(pCat, contBody);

  let askQuestion = document.createElement('div')
  askQuestion.id = 'askQuestion'
  askQuestion.innerHTML = riddle;
  document.querySelector('section').appendChild(askQuestion)

  let button = both.map(x=>{let div = document.createElement('div');
    div.innerHTML = x;
    div.id = x;
    div.className = 'answerButton';
    document.querySelector('section').appendChild(div)
  })







//apparently its jQuery
// let rara = document.querySelector('#choice')
// let baba = document.createElement('div');
// rara.replaceWith(baba);


}
