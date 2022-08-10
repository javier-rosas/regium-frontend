import React, { useState, useEffect } from "react";
import NftDataService from "../services/nfts";
import { Link, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { BsSuitHeartFill } from "react-icons/bs";
import {RevolvingDot} from 'react-loader-spinner';


import "./LandingPage.css";

const LandingPage = ({ user }) => {
  const [nfts, setNfts] = useState([]);
  const [nftOfTheDay, setNftOfTheDay] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false)
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div className="landingPage">
      <Container>
        <Row className="landingPageRow">
          <Col>
            <h1>Uniq</h1>
            <h3>Explore, buy and sell exquisite NFTs</h3>
          </Col>
          <Col>
            <h4>Featured NFT</h4>
            {loading ? 
            <RevolvingDot/> 
            :nftOfTheDay && (
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
      </Container>
      <div className="landingPageRow howToRow">
        <div className="howToItem">
          <h2>Browse</h2>
          <p>
            Click on Explore to browse some of the most extraordinary NFTs on
            the internet.
          </p>
        </div>
        <div className="howToItem">
          <h2>Buy</h2>
          <p>
            Once an NFT catches your eye simply open it and click on the Buy
            button to buy it for the price listed.
          </p>
        </div>
        <div className="howToItem">
          <h2>Sell</h2>
          <p>
            Open any NFT you own and click on the Sell button to put the NFT up
            for sale for a fixed price. Auctions coming soon!
          </p>
        </div>
      </div>
      <Container>
        <Row className="landingPageRow">
          <h2>Most liked NFTs of all time</h2>
          <Row className="movieRow">
            {nfts &&
              nfts.map((nft, index) => {
                return (
                  <Col key={nft._id}>
                    <div
                      className="topLikedCard"
                      onClick={() => navigate("/nfts/" + nft._id)}
                    >
                      <span className="index">{index + 1}</span>
                      <div className="nftImageDiv topLikedImgDiv">
                        <Image
                          className="smallPoster vsmallPoster"
                          src={nft.imageLink}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = "/images/stand-in.jpeg";
                          }}
                        />
                      </div>
                      <div className="topLikedBody">
                        <h5 className="topLikedName"> {nft.name} </h5>

                        <div className="info">
                          <BsSuitHeartFill className="topLikedHeart " />
                          <span className="likesSpan">{nft.likes}</span>

                          <Image
                            className="ethImg "
                            src="/images/eth-gold.svg"
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null;
                              currentTarget.src = "/images/stand-in.jpeg";
                            }}
                          />
                          <span className="topLikedPrice">
                            {nft.price + " ETH"}
                          </span>
                        </div>
                      </div>
                    </div>
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
