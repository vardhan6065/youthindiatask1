import React ,{useCallback, useEffect, useState, useRef} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {

  const InputRef = useRef();  
  const [movies , setMovies] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const fetchMoviesHandler= useCallback(async(event) => {
    event.preventDefault();
    
    const InputVal = InputRef.current.value.toUpperCase(); 
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response= await fetch('https://swapi.py4e.com/api/films/');
      if(!response.ok){
        throw new Error('Something went wrong!');
      }
      const data= await response.json();  
      
    const transformedMovies = data.results.map(moviesData => {
      return {
        id: moviesData.episode_id,
        title : moviesData.title,
        openingText: moviesData.opening_crawl,
        releaseDate: moviesData.release_date,
      }
      });

      const result = transformedMovies.filter(movie=>movie.title.toUpperCase().indexOf(InputVal) > -1);

      setMovies(result);
    } catch(error){
      setError(error.message);
    }
    setIsLoading(false);
    }, []);  

    
  useEffect(()=>{
    fetchMoviesHandler();
  },[fetchMoviesHandler]);

    let content= <p>Enter The Name of Any Star Wars Movie for More Info Like (return of jedi, A New Hope , Attack of the Clones...)<p>Or just click on the button to fetch all parts of the series!!</p></p>;

    if(movies.length > 0){
    content= <MoviesList movies={movies} />;
    } 
      
    if(error){
      content= <p>{error}</p>;
    }

    if(isLoading){
      content= <p>Loading..</p>;
    }
  

  return (
    <div className='container'>
      <section className='Form'>
        <form onSubmit={fetchMoviesHandler}> 
          <input ref={InputRef}/>
          <button type='submit'>Fetch Movies</button>
        </form>
      </section>
      <section className='content'>
       {content}
      </section>
    </div>
  );
}

export default App;
