getAllquotes()



// ********************** Grab Elements from DOM ****************

const quoteList = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")


// ******************** Add Event Listeners **************
newQuoteForm.addEventListener("submit", gatherFormData)
quoteList.addEventListener('click', handleClickEvent)
// quoteList.addEventListener('click', getIdToDeleteQuote)
// quoteList.addEventListener('click', getIdToLikeQuote)



// ***************** Network Request to DB **************
function getAllquotes(){
  fetch("http://localhost:3000/quotes?_embed=likes")
  .then(res => res.json())
  .then(addQuoatesToDom)
}

function createQuote(quoteObj){
  fetch("http://localhost:3000/quotes/", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(quoteObj)
  })
  .then(res => res.json())
  .then(addSingleQuoteToDom)
}

function deleteQuote(quoteId){
  fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: "DELETE"
  })
}

function createLike(quoteId){
  fetch('http://localhost:3000/likes', {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(quoteId)
  })
}




// ****************** DOM manipulation & logic ***************************
function addQuoatesToDom(allQuotes){
  allQuotes.forEach(quote => {
    quoteList.innerHTML += `
    <li class='quote-card'>
      <blockquote class="blockquote" data-id=${quote.id} >
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span class="likes-span">${quote.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    </li>
    `
  }) 
}

function addSingleQuoteToDom(singleQuote) {
  quoteList.innerHTML += `
  <li class='quote-card'>
    <blockquote class="blockquote" data-id=${singleQuote.id}>
      <p class="mb-0">${singleQuote.quote}</p>
      <footer class="blockquote-footer">${singleQuote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span class="likes-span">${0}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  </li>
  `
}


function gatherFormData(e){
  e.preventDefault()
  
  const quote = e.target.quote.value
  const author = e.target.author.value

  // const quotObj = {quote, author}
  const quotObj = {
    quote: quote, 
    author: author
  }
  
  createQuote(quotObj)
}


function handleClickEvent(e){
  // e.target.matches("button.btn-danger")
  if (e.target.className === "btn-danger"){
    getIdToDeleteQuote(e)
  }else if ((e.target.className === "btn-success")){
    getIdToLikeQuote(e)
  }
  
}

function getIdToDeleteQuote(e) {
  const quoteId = e.target.parentElement.dataset.id
  e.target.parentElement.parentElement.remove()
  deleteQuote(quoteId)
}

function getIdToLikeQuote(e){
  const quoteId = parseInt(e.target.parentElement.dataset.id)

  likeObj = {quoteId: quoteId}

  increaseLikes(e)
  createLike(likeObj)
}


function increaseLikes(e){
  let currentLikes = parseInt(e.target.querySelector(".likes-span").innerText)
  currentLikes++
  e.target.querySelector(".likes-span").innerText = currentLikes
}