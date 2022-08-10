import React, { useState, useEffect, useCallback } from "react";
import NftDataService from "../services/nfts";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import {RevolvingDot} from 'react-loader-spinner';


import "./NftList.css";

function NftList({ user, favorites, addFavorite, deleteFavorite }) {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [genres, setGenres] = useState(["All Genres"]);
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState("");

  const navigate = useNavigate();

  const retrieveGenres = useCallback(() => {
    NftDataService.getGenres()
      .then((response) => {
        setGenres(["All Genres"].concat(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const retrieveNfts = useCallback(() => {
    setCurrentSearchMode("");
    NftDataService.getAll(currentPage)
      .then((response) => {
        setNfts(response.data.nfts);
        setCurrentPage(response.data.page);
        setEntriesPerPage(response.data.entries_per_page);
        setLoading(false)
      })
      .catch((e) => {
        console.log(e);
      });
  }, [currentPage]);

  const find = useCallback(
    (query, by) => {
      NftDataService.find(query, by, currentPage)
        .then((response) => {
          setNfts(response.data.nfts);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    [currentPage]
  );

  const findByName = useCallback(() => {
    setCurrentSearchMode("findByName");
    find(searchName, "name");
  }, [find, searchName]);

  const findByGenre = useCallback(() => {
    setCurrentSearchMode("findByGenre");
    if (searchGenre === "All Genres") {
      retrieveNfts();
    } else {
      find(searchGenre, "genre");
    }
  }, [find, searchGenre, retrieveNfts]);

  const retrieveNextPage = useCallback(() => {
    if (currentSearchMode === "findByName") {
      findByName();
    } else if (currentSearchMode === "findByGenre") {
      findByGenre();
    } else {
      retrieveNfts();
    }
  }, [currentSearchMode, findByName, findByGenre, retrieveNfts]);

  useEffect(() => {
    retrieveGenres();
  }, [retrieveGenres]);

  useEffect(() => {
    setCurrentPage(0);
  }, [currentSearchMode]);

  useEffect(() => {
    retrieveNextPage();
  }, [currentPage, retrieveNextPage]);

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchGenre = (e) => {
    const searchGenre = e.target.value;
    setSearchGenre(searchGenre);
  };

  const updateLikes = (id, increaseFlag) => {
    var data = {
      _id: id,
      increaseFlag: increaseFlag,
    };
    NftDataService.updateLikes(data).catch((e) => {
      console.log(e);
    });
  };

  return (
    <div className="App">
      <Container className="main-container">
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by name"
                  value={searchName}
                  onChange={onChangeSearchName}
                />
              </Form.Group>
              <Button variant="primary" type="button" onClick={findByName}>
                Search
              </Button>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Control as="select" onChange={onChangeSearchGenre}>
                  {genres.map((genre, i) => {
                    return (
                      <option value={genre} key={i}>
                        {genre}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="button" onClick={findByGenre}>
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <Row className="movieRow">
          {loading ? 
          <RevolvingDot className="revolving-dot"/> 
          :
          nfts.map((nft) => {
            return (
              <Col key={nft._id}>
                <Card
                  className="moviesListCard"
                  onClick={() => navigate("/nfts/" + nft._id)}
                >
                  {user &&
                    (favorites.includes(nft._id) ? (
                      <BsSuitHeartFill
                        className="heart heartFill"
                        onClick={() => {
                          deleteFavorite(nft._id);
                          updateLikes(nft._id, false);
                        }}
                      />
                    ) : (
                      <BsSuitHeart
                        className="heart heartEmpty"
                        onClick={() => {
                          addFavorite(nft._id);
                          updateLikes(nft._id, true);
                        }}
                      />
                    ))}
                  <div className="nftImageDiv">
                    <Card.Img
                      className="smallPoster"
                      src={nft.imageLink}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "/images/stand-in.jpeg";
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title> {nft.name} </Card.Title>
                    <Card.Text>{nft.description}</Card.Text>
                    <Card.Text>Genre: {nft.genre}</Card.Text>
                    <Card.Text className="topLikedPrice">
                      {nft.price + " ETH"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
        <br />
        Showing page: {currentPage + 1}
        <Button
          variant="link"
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        >
          Get next {entriesPerPage} results
        </Button>
      </Container>
    </div>
  );
}

export default NftList;
