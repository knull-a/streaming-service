const swiper = new Swiper('.swiper', {
  loop: true,

  autoplay: {
    delay: 5000,
  },

  pagination: {
    el: '.swiper-pagination',
  },
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

// titles http://www.omdbapi.com/?s=TaxiDriver&apikey=882bf1bc
// details http://www.omdbapi.com/?i=tt0075314&apikey=882bf1bc

const movieSearchBox = document.querySelector('#movie-search-box');
const searchList = document.querySelector('#search-list');
const result = document.querySelector("#result");




async function loadMovies(searchTerm) {
  const URL = `http://www.omdbapi.com/?s=${searchTerm}&apikey=882bf1bc`;
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
      moviePoster = "/img/not-found.png"
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
      // console.log(el.dataset.id);
      searchList.classList.add('none')
      movieSearchBox.value = ""
      mainContainer.classList.add('none')
      container.classList.add('none')
      location.replace("./search-result.html")
      result.classList.remove('none')
      const resultFetch = await fetch (`http://www.omdbapi.com/?i=${el.dataset.id}&apikey=882bf1bc`)
      const movieDetails = await resultFetch.json();
      displayMovieDetails(movieDetails)
    })
   })
}

function displayMovieDetails(details) {
  result.innerHTML = `
  <div class="result__img">
    <img src="${details.Poster !== "N/>A" ? details.Poster : "img/not-found.png"}" alt="Result">
  </div>
  <div class="result__info">
    <h4 class = "result__title">${details.Title}</h4>
    <ul class = "result__misc-info">
        <li class = "result__year">${details.Year}</li>
        <li class = "result__rated">${details.Rated}</li>
        <li class = "result__released">${details.Released}</li>
    </ul>
    <p class = "result__genre"><b>Genre:</b> ${details.Genre}</p>
    <p class = "result__writer"><b>Writer:</b>${details.Writer}</p>
    <p class = "result__actors"><b>Actors: </b>${details.Actors}</p>
    <p class = "result__plot"><b>Plot:</b> ${details.Plot}</p>
    <p class = "result__language"><b>Language:</b> ${details.Language}</p>
    <p class = "result__awards"><b><i class = "fas fa-award"></i></b>${details.Awards}</p>
  </div>  
  `
}

console.log('test');