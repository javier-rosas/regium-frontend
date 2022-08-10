import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState, useEffect, useCallback } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/Login.js";
import Logout from "./components/Logout.js";
import NftList from "./components/NftList";
import Footer from "./components/Footer";
// import AddReview from "./components/AddReview";
import Nft from "./components/Nft";
import React from "react";
import FavoritesDataService from "./services/favorites";
import Favorites from "./components/Favorites.js";
import LandingPage from "./components/LandingPage.js";
import NftCollection from "./components/NftCollection";
import Mint from "./components/Mint"

import "./App.css";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (movieId) => {
    setFavorites([...favorites, movieId]);
  };

  const deleteFavorite = (movieId) => {
    setFavorites(favorites.filter((f) => f !== movieId));
  };

  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      let loginExp = loginData.exp;
      let now = Date.now() / 1000;
      if (now < loginExp) {
        setUser(loginData);
      } else {
        // Expired
        localStorage.setItem("login", null);
      }
    }
  }, []);

  const retrieveFavorites = useCallback((user) => {
    FavoritesDataService.getAllFavorites(user.googleId)
      .then((response) => {
        setFavorites(response.data.favorites);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    if (user) {
      retrieveFavorites(user);
    }
  }, [user]);

  const updateFavorites = useCallback(() => {
    var data = {
      _id: user.googleId,
      favorites: favorites,
    };
    FavoritesDataService.updateFavorites(data).catch((e) => {
      console.log(e);
    });
  }, [favorites]);

  useEffect(() => {
    if (user) {
      updateFavorites();
    }
  }, [favorites]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="App">
        <Navbar className="navbar" bg="dark" expand="lg" sticky="top" variant="dark">
          <Container className="container-fluid">
            <Navbar.Brand className="brand" href="/">
              <img
                src="/images/uniq-logo.png"
                alt="movies logo"
                className="moviesLogo"
              />
              <h1 className="uniq-text">UNIQ</h1>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link className="nfts-text" as={Link} to={"/nfts"}>
                  NFTs
                </Nav.Link>
                {user && (
                  <>
                  <Nav.Link className="wishlist-text" as={Link} to={"/favorites"}>
                    Wishlist
                  </Nav.Link>
                
                  <Nav.Link className="collection-text" as={Link} to={"/collection"}>
                    My Collection
                  </Nav.Link>

                  <Nav.Link className="collection-text" as={Link} to={"/mint"}>
                    Mint NFT
                  </Nav.Link>

                  </>
                )}
              </Nav>
            </Navbar.Collapse>
            {user ? <Logout setUser={setUser} /> : <Login setUser={setUser} />}
          </Container>
        </Navbar>

        <Routes>
          <Route exact path={"/"} element={<LandingPage user={user} />} />
          <Route
            exact
            path={"/nfts"}
            element={
              <NftList
                user={user}
                addFavorite={addFavorite}
                deleteFavorite={deleteFavorite}
                favorites={favorites}
              />
            }
          />
          <Route exact path={"/nfts/:id/"} element={<Nft user={user} />} />
          {/* <Route
            exact
            path={"/nfts/:id/review"}
            element={<AddReview user={user} />}
          /> */}
          <Route
            exact
            path={"/favorites"}
            element={
              <Favorites
                user={user}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            }
          />
          <Route
            exact
            path={"/collection"}
            element={<NftCollection user={user} />}
          />
          <Route
            exact 
            path={"/mint"}
            element={<Mint user={user} />}
          />
        </Routes>
        
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
