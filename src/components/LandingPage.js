import React, { useState, useEffect } from "react";
import NftDataService from "../services/nfts";
import { Link, useParams } from "react-router-dom";
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
    <div className="landingPage">
      <Container>
        <Row>
          <Col>
            <h1>Uniq</h1>
            <h3>Explore, buy and sell exquisite NFTs</h3>
          </Col>
          <Col>
            <h4>NFT of the day</h4>
            {nftOfTheDay && (
              <Card className="moviesListCard">
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
                <Card.Body>
                  <Card.Title> {nftOfTheDay.name} </Card.Title>
                  <Card.Text>Rating: {nftOfTheDay.rated}</Card.Text>
                  <Card.Text>{nftOfTheDay.description}</Card.Text>
                  <Link to={"/nfts/" + nftOfTheDay._id}>View Reviews</Link>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
        <Row className="landingPageRow">
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
              Open any NFT you own and click on the Sell button to put the NFT
              up for sale for a fixed price. Auctions coming soon!
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
                    <Card className="topLikedCard">
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
                        <Card.Text>Rating: {nft.rated}</Card.Text>
                        <Card.Text>{nft.description}</Card.Text>
                        <Link to={"/nfts/" + nft._id}>View Reviews</Link>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
