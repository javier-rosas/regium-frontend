import './Favorites.css'
import update from 'immutability-helper'
import { React, useCallback, useState, useEffect } from 'react'
import {FavoriteCard}  from './FavoriteCard.js'
import MovieDataService from '../services/movies'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import FavoritesDataService from '../services/favorites'
import Container from 'react-bootstrap/Container'


const Favorites = ({user, favorites}) => {

  const [movies, setMovies] = useState([])

  /**
   * Definition for an API call that gets the movie object by id from the database.
   * @param {string} id The id of the movie. 
   * @return {object} The movie object corresponding to the id.
   */
  const getMoviebyId = useCallback( async (id) => {
    const response = await MovieDataService.find(id, "id")
    let movie = {
      id : id, 
      title : response.data.title,
      rated : response.data.rated,
      reviews : response.data.reviews,
      poster : response.data.poster,
      plot : response.data.plot
    }
    return movie
  }, [])


  /**
   * Converts "favorites" array to a list of movie objects from the database
   * by calling getMoviebyId
   */
  const fillMoviesArray = useCallback( async () => {
    let newArr = []
    for (const movieId of favorites) {
      const newMovie = await getMoviebyId( movieId )
      newArr.push(newMovie)
    }
    setMovies(newArr)
  }, [favorites, getMoviebyId])


  /**
   * useEffect calls fillMoviesArray anytime "favorites" dependency changes
   */
  useEffect( () => {
    fillMoviesArray()
  }, [favorites, fillMoviesArray])


  /**
   * Updates the ordering of the favorites in state.
   */
     const moveCard = useCallback((dragIndex, hoverIndex) => {
      setMovies((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        }),
      )
    }, [])


  /**
   * Updates the ordering of favorites in the database. Does this 
   * by converting the "movies" object array to an array of 
   * ids for updateFavorites 
   */
  const updateFavoritesOrdering = useCallback( () => {
    if (user) {
      let favoriteIdsArray = movies.map(movie => movie.id)
      FavoritesDataService.updateFavorites({
        _id : user.googleId, 
        favorites : favoriteIdsArray
      })
      .catch(e => {
        console.log(e)
      })
      }
  }, [movies, user])


  /**
   * This useEffect simply calls updateFavoritesOrdering function everytime 
   * the movies dependency changes
   */
  useEffect( () => {
    updateFavoritesOrdering()
  }, [movies, updateFavoritesOrdering])


  /**
   * Renders the FavoritesCard
   */
  const renderCard = useCallback((movie, index) => {
    return (
      <FavoriteCard
        key={movie.id}
        index={index}
        id={movie.id}
        title={movie.title}
        poster={movie.poster}
        moveCard={moveCard}
      />
    )
  }, [moveCard])


  return (
      <div>
      { user && (
      <DndProvider backend={HTML5Backend}>
        <Container className="favoritesContainer">
          <Container className="favoritesPanel"> Drag your favorites to rank them </Container>
            <Container>
              {movies.map((movie, i) => renderCard(movie, i))}
            </Container>
        </Container>
      </DndProvider>)
      }
      </div>
    )
}

export default Favorites