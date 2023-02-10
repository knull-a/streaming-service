// titles http://www.omdbapi.com/?s=TaxiDriver&apikey=882bf1bc
// details http://www.omdbapi.com/?i=tt0075314&apikey=882bf1bc

const moviesItem = document.querySelector(".movies-item");

async function loadMovies(searchTerm) {
  const URL = `http://www.omdbapi.com/?s=${searchTerm}&apikey=882bf1bc`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response === "True") console.log(data.Search);
}