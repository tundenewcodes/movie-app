import React, {useState, useEffect, useCallback} from 'react'
import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie'

function App() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [Errors, setError] = useState('')
  
  // const dummyMovies = [
  //   {
  //     id: 1,
  //     title: 'Some Dummy Movie',
  //     openingText: 'This is the opening text of the movie',
  //     releaseDate: '2021-05-18',
  //   },
  //   {
  //     id: 2,
  //     title: 'Some Dummy Movie 2',
  //     openingText: 'This is the second opening text of the movie',
  //     releaseDate: '2021-05-19',
  //   },
  // ];

  const fetchMovies = useCallback (async () => {
    
  setIsLoading(false)

    try {
      const response = await fetch('https://react-movies-67bc8-default-rtdb.firebaseio.com/movies.json')
       if (!response.ok) {
         throw new Error("something went wrong.... bad network perhaps")
       }
      const data = await response.json()
  const loadedMovies = []

  for (const key in data) {
    loadedMovies.push({
      id: key,
      title: data[key].title,
      openingText: data[key].openingText,
      releaseDate: data[key].releaseDate,
    })
  }

  setMovies(loadedMovies)
    
    }
    catch (error) {
      setError(error.message)
   }
    setIsLoading(false)
      
     
  },[])
  useEffect(() => {
   fetchMovies() 
  },[fetchMovies])


async function addMovieHandler(movie) {
  const response = await fetch(
    "https://react-movies-67bc8-default-rtdb.firebaseio.com/movies.json",
    {
      method: "POST",
      body: JSON.stringify(movie),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  const data = await response.json()
  console.log(data)
}


  let content = <p>something went wrong</p>
  
  if (isLoading) {
    content = <p>Loading....</p>
  }
  if (movies) {
    content = <MoviesList movies={movies} />
  }

  if (movies.length === 0 && !Errors && !isLoading) {
    content = <p>no movie yet</p>
  }
  if (!isLoading && Errors) {
    content = <p>{Errors}</p>
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovies}>
          submit movies
        </button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  )
}

export default App;
