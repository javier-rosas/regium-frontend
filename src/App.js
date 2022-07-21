import { Routes, Route, Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import {useState, useEffect, useCallback} from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login.js'
import Logout from './components/Logout.js'
import MoviesList from "./components/MoviesList"
import AddReview from "./components/AddReview"
import Movie from "./components/Movie"
import React from 'react'
import FavoritesDataService from './services/favorites'
import Favorites from './components/Favorites.js'

import './App.css';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
/*
  - Question to ask TA 
    - How is the navbar persisting
*/

function App() {


  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [doUpdate, setDoUpdate] = useState(false)

  
  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"))
    if (loginData) {
      let loginExp = loginData.exp;
      let now = Date.now() / 1000;
      if (now < loginExp) {
        setUser(loginData)
      } else {
        // Expired
        localStorage.setItem("login", null);
      }
    }
  }, []);


  const retrieveFavorites = useCallback( () => {
    FavoritesDataService.getFavorites(user.googleId)
      .then(response => {
        const data = response.data.favorites
        setFavorites(data)
      })
      .catch(e => {
          console.log(e)
      })
  }, [user])


  const update = useCallback( () => {
    FavoritesDataService.updateFavorites({
      _id : user.googleId, 
      favorites : favorites
    })
    .catch(e => {
      console.log(e)
    })
  }, [favorites, user])


  useEffect( () => {
    if (user && doUpdate) {
      update()
      setDoUpdate(false)
    }
  }, [user, favorites, update, doUpdate])


  useEffect( () => {
    if (user) {
      retrieveFavorites()
    }
  }, [user, retrieveFavorites])


  const addFavorite = (movieId) => {
    if (! (favorites.includes(movieId)) ) {
      setDoUpdate(true)
      setFavorites([ ...favorites, movieId ])
    }
  }
  

  const deleteFavorite = (movieId) => {
    setFavorites(favorites.filter( f => f !== movieId) )
  }


  return (
    <GoogleOAuthProvider clientId={clientId}>
    <div className="App">
      <Navbar bg="primary" expand="lg" sticky="top" variant="dark">
        <Container className="container-fluid">
          <Navbar.Brand className="brand" href="/">
            <img src="/images/movie-logo.png" alt="movies logo" className="moviesLogo"/>
            MOVIE TIME
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav" > 
            <Nav className="ml-auto">
              <Nav.Link as={Link} to={"/movies"}>
                Movies
              </Nav.Link>
              <Nav.Link as={Link} to={"/favorites"}>
                Favorites
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          { user ? (
            <Logout setUser={setUser} />
            ) : (
            <Login setUser={setUser}/>
            )}
        </Container>
      </Navbar>

      <Routes> 
        <Route exact path={"/"} element={
          <MoviesList 
            user={user}
            addFavorite={addFavorite}
            deleteFavorite={deleteFavorite}
            favorites={favorites}
          />} />
        <Route exact path={"/movies"} element={
          <MoviesList
            user={user}
            addFavorite={addFavorite}
            deleteFavorite={deleteFavorite}
            favorites={favorites}
          />} />
        <Route exact path={"/movies/:id/"} element={
          <Movie user={ user }/> } />
        <Route exact path={"/movies/:id/review"} element={
          <AddReview user={ user } /> } />
        <Route exact path={"/favorites"} element={
          <Favorites user={ user } favorites={favorites} setFavorites={setFavorites}/> } />
      </Routes>

    </div>
    </GoogleOAuthProvider>

  )

}

export default App;
