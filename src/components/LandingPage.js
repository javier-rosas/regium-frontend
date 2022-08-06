import React, { useState, useEffect } from "react";
import NftDataService from "../services/nfts";
import { Link, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import "./LandingPage.css";

const LandingPage = ({ user }) => {
  const [nfts, setNfts] = useState([]);
  const [nftOfTheDay, setNftOfTheDay] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    //console.log("getting most liked");
    NftDataService.getMostLiked()
      .then((response) => {
        //console.log(response);
        setNfts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    // console.log("got most liked");
  }, []);

  useEffect(() => {
    NftDataService.getRandomNfts(1)
      .then((response) => {
        setNftOfTheDay(response.data[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <Container className="landingPage">
      <Row className="landingPageRow">
        <Col>
          <h1>Uniq</h1>
          <h3>Explore, buy and sell exquisite NFTs</h3>
        </Col>
        <Col>
          <h4>Featured NFT</h4>
          {nftOfTheDay && (
            <Card
              className="nftOfTheDayCard"
              onClick={() => navigate("/nfts/" + nftOfTheDay._id)}
            >
              <div className="nftImageDiv">
                <Card.Img
                  className="smallPoster"
                  src={nftOfTheDay.imageLink}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "/images/stand-in.jpeg";
                  }}
                />
              </div>
              <Card.Body className="bd">
                <Card.Title className="ct"> {nftOfTheDay.name} </Card.Title>
                {/* <Card.Text className="gen">Genre: {nftOfTheDay.genre}</Card.Text> */}
                <Card.Title className="pr">
                  {nftOfTheDay.price + " ETH"}
                </Card.Title>
                {/* <Link to={"/nfts/" + nftOfTheDay._id}>View Reviews</Link> */}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <Row className="landingPageRow howToRow">
        <Col>
          <h2>Explore NFTs</h2>
          <p>
            Click on Explore to browse some of the most beautiful NFTs on the
            internet.
          </p>
        </Col>
        <Col>
          <h2>Buy NFTs</h2>
          <p>
            Once an NFT catches your eye simply open it and click on the Buy
            button to buy it for the price listed.
          </p>
        </Col>
        <Col>
          <h2>Sell NFTs</h2>
          <p>
            Open any NFT you own and click on the Sell button to put the NFT up
            for sale for a fixed price. Auctions coming soon!
          </p>
        </Col>
      </Row>
      <Row className="landingPageRow">
        <h2>Most liked NFTs of all time</h2>
        <Row className="movieRow">
          {nfts &&
            nfts.map((nft) => {
              return (
                <Col key={nft._id}>
                  <Card
                    className="topLikedCard"
                    onClick={() => navigate("/nfts/" + nft._id)}
                  >
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
                      <Card.Text>
                        Liked <span className="likesSpan">{nft.likes}</span>{" "}
                        times
                      </Card.Text>
                      <Card.Text className="topLikedPrice">
                        {nft.price + " ETH"}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Row>
    </Container>
  );
};

export default LandingPage;
