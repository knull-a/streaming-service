const swiper = new Swiper('.swiper', {
  loop: true,

  autoplay: {
    delay: 7000,
  },
  observer: true
});


// titles https://www.omdbapi.com/?s=TaxiDriver&apikey=882bf1bc
// details https://www.omdbapi.com/?i=tt0075314&apikey=882bf1bc

const movieSearchBox = document.querySelector('#movie-search-box');
const searchList = document.querySelector('#search-list');
const result = document.querySelector("#result");

const homeButton = document.querySelector("#nav-home");
const mainButton = document.querySelectorAll(".main__button")

const categoryNew = document.querySelector('.new-category');
const categorySeries = document.querySelector('.series-category')
const categoryCards = document.querySelectorAll('.category__cards')

const mainContainer = document.querySelector('.main')
const container = document.querySelector('.container')


function openCards(item, id) {
  item.addEventListener("click", async () => {
    searchList.classList.add('none')
    movieSearchBox.value = ""
    mainContainer.classList.add('none')
    container.classList.add('none')
    result.classList.remove('none')
    const resultFetch = await fetch (`https://www.omdbapi.com/?i=${id}&apikey=882bf1bc`)
    const movieDetails = await resultFetch.json();
    const trailerResultFetch = await fetch (`https://imdb-api.com/en/API/YouTubeTrailer/k_19okjvyr/${id}`)
    const trailerDetails = await trailerResultFetch.json();
    displayMovieDetails(movieDetails, trailerDetails)
  })
}

fillCards('movies', categoryNew)
fillCards('series', categorySeries)

homeButton.addEventListener("click", returnHome)

async function fillCards(mainURL, categoryName) {
  const URL = `js/${mainURL}.json`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  
  categoryName.innerHTML = ''
  for (let i = 0; i < 100; i++) {
    const resultFetch = await fetch (`https://www.omdbapi.com/?i=${data[i].id}&apikey=882bf1bc`)
    const movieDetails = await resultFetch.json()
    let movieListItem = document.createElement('div')
    movieListItem.classList.add('category__card', 'swiper-slide')
    movieListItem.innerHTML = `
      <div class="swiper-slide">
        <div class="category__info">
          <p class="category__age">${movieDetails.Rated}</p>
          <p class="category__rating">${movieDetails.imdbRating}</p>
          <h3 class="category__card-title">${movieDetails.Title.length > 30 ? `${movieDetails.Title.substring(0, 30)}...` : movieDetails.Title}</h3>
        </div>
      </div>
    `
    movieListItem.style.background = `linear-gradient(180deg, rgba(29, 29, 29, 0) 0%, rgba(29, 29, 29, 0.8) 80.79%), url(${movieDetails.Poster !== "N/A" ? movieDetails.Poster : movieDetails.Poster = "img/not-found.png"})`
    categoryName.appendChild(movieListItem)
    openCards(movieListItem, movieDetails.imdbID)
  }
}

function returnHome() {
  mainContainer.classList.remove('none')
  container.classList.remove('none')
  result.classList.add('none')
}

async function loadMovies(searchTerm) {
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&apikey=882bf1bc`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response === "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = (movieSearchBox.value);
  if (searchTerm.length > 0) {
    searchList.classList.remove('none')
    loadMovies(searchTerm)
  } else {
    searchList.classList.add('none')
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let i = 0; i < movies.length; i++) {
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movies[i].imdbID;
    movieListItem.classList.add('search__list-item')
    if (movies[i].Poster !== "N/A") {
      moviePoster = movies[i].Poster
    } else {
      moviePoster = "img/not-found.png"
    }
    movieListItem.innerHTML = `
    <div class="search__list-item">
      <div class="search__list-img">
        <img src="${moviePoster}" alt="Poster">
      </div>
      <div class="search__list-info">
        <h2>${movies[i].Title}</h2>
        <p>${movies[i].Year}</p>
      </div>
    </div>
    `
    searchList.appendChild(movieListItem)
  }

  loadMovieDetails()
}

function loadMovieDetails() {
  const mainContainer = document.querySelector('.main')
  const container = document.querySelector('.container')
  const searchListMovies = searchList.querySelectorAll('.search__list-item')
  
   searchListMovies.forEach(el => {
    el.addEventListener("click", async () => {
      searchList.classList.add('none')
      movieSearchBox.value = ""
      mainContainer.classList.add('none')
      container.classList.add('none')
      result.classList.remove('none')
      const resultFetch = await fetch (`https://www.omdbapi.com/?i=${el.dataset.id}&apikey=882bf1bc`)
      const movieDetails = await resultFetch.json();
      const trailerResultFetch = await fetch (`https://imdb-api.com/en/API/YouTubeTrailer/k_19okjvyr/${el.dataset.id}`)
      const trailerDetails = await trailerResultFetch.json();
      displayMovieDetails(movieDetails, trailerDetails)
    })
   })
}

function displayMovieDetails(details, trailerDetails) {
  console.log(trailerDetails);
  result.innerHTML = `
  <div class="result__img">
    <iframe class = "result__trailer ${trailerDetails.videoId !== '' ? '' : 'none'}" src="https://www.youtube.com/embed/${trailerDetails.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  </div>
  <div class="result__info">
    <h4 class = "result__title">${details.Title}</h4>
    <ul class = "result__misc-info">
        <li class = "result__year">${details.Year} ·</li>
        <li class = "result__rated">${details.Rated} ·</li>
        <li class = "result__runtime">${details.Runtime}</li>
    </ul>
    <p class = "result__genre"><b>Genre:</b> ${details.Genre}</p>
    <p class = "result__writer"><b>Director: </b>${details.Director}</p>
    <p class = "result__writer"><b>Writer: </b>${details.Writer}</p>
    <p class = "result__actors"><b>Actors: </b>${details.Actors}</p>
    <p class = "result__plot"><b>Plot:</b> ${details.Plot}</p>
    <p class = "result__awards"><b><i class = "fas fa-award"></i></b>${details.Awards}</p>
    
  </div>  
  `
}
