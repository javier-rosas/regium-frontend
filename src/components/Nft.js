import React, { useState, useEffect, useCallback } from "react";
import NftDataService from "../services/nfts";
import UserDataService from "../services/users";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { useWindowSize } from "@react-hook/window-size";
import Confetti from "react-confetti";

import "./Nft.css";

function Nft({ user, setUser }) {
  const { width, height } = useWindowSize();
  const [isShowingConfetti, setIsShowingConfetti] = useState(false);

  let params = useParams();

  const [nft, setNft] = useState({
    id: null,
    name: "",
    price: "",
    owner: "",
    reviews: [],
    description: "",
    imageLink: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getUser = useCallback((user) => {
    if (user && user.googleId) {
      UserDataService.getUser(user.googleId)
        .then((response) => {
          localStorage.setItem("login", JSON.stringify(response.data));
          setUser(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  const sellNft = (nftId, data) => {
    if (nftId && data) {
      NftDataService.sellNft({
        nftId: nftId,
        price: parseFloat(data.price),
      })
        .then(() => {
          setIsShowingConfetti(true);
          setTimeout(() => {
            setIsShowingConfetti(false);
          }, 4000);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const buyNft = (nftId, userId) => {
    console.log("userid in Nft js", nftId);
    if (nftId && userId) {
      NftDataService.buyNft({
        nftId: nftId,
        userId: userId,
      })
        .then((res) => {
          getUser(userId);
          setIsShowingConfetti(true);
          setTimeout(() => {
            setIsShowingConfetti(false);
          }, 4000);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    const getNft = (id) => {
      NftDataService.find(id, "id")
        .then((response) => {
          let obj = {
            id: id,
            name: response.data.name,
            owner: response.data.owner,
            price: response.data.price,
            reviews: response.data.reviews,
            upForSale: response.data.upForSale,
            imageLink: response.data.imageLink,
            description: response.data.description,
          };
          // might cause bugs
          setNft(obj);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getNft(params.id);
  }, [params.id]);

  console.log("NFT JS nft owner", nft, "   GOOGLE ID  ", user);
  return (
    <div>
      <Container className="nftPage">
        {isShowingConfetti && (
          <Confetti width={width} height={height} run={true} />
        )}

        <Row>
          <Col>
            <div className="poster">
              <Image
                className="bigPicture"
                src={nft.imageLink}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/stand-in.jpeg";
                }}
                fluid
              />
            </div>
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5"> {nft.name} </Card.Header>
              <Card.Body>
                <Card.Text>{nft.description}</Card.Text>
                {nft && <Card.Text> Price: {nft.price} ETH </Card.Text>}
                {user && <Card.Text> Balance: {user.balance} ETH </Card.Text>}
              </Card.Body>
            </Card>
            <br></br>
            <br></br>
            {user && nft.owner === user.googleId ? (
              <form
                onSubmit={handleSubmit((data, e) => {
                  try {
                    sellNft(nft.id, data);
                  } catch (e) {
                    console.log(e);
                  }
                })}
              >
                <input
                  key={nft.id}
                  placeholder="0.05"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price", { required: true })}
                />
                {errors.price && <span className="error">Required</span>}
                <input type="submit" value="Put up for sale" />
              </form>
            ) : (
              <Button
                className="buyBtn"
                onClick={() => {
                  user.googleId &&
                    nft &&
                    nft.upForSale &&
                    buyNft(nft.id, user.googleId);
                }}
              >
                {" "}
                Buy{" "}
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Nft;
