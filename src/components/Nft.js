import React, { useState, useEffect } from "react";
import NftDataService from "../services/nfts";
import { Link, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import moment from "moment";

import "./Nft.css";

function Nft({ user }) {
  let params = useParams();
  const [nft, setNft] = useState({
    id: null,
    name: "",
    // rated: "",
    reviews: [],
    description: "",
    imageLink: "",
  });

  useEffect(() => {
    const getNft = (id) => {
      // TODO:
      NftDataService.find(id, "id")
        .then((response) => {
          console.log(response);

          let obj = {
            id: id,
            name: response.data.name,
            // rated: response.data.rated,
            reviews: response.data.reviews,
            imageLink: response.data.imageLink,
            description: response.data.description,
          };
          setNft(obj);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getNft(params.id);
  }, [params.id]);

  // const onDeleteReview = (review, index) => {
  //   NftDataService.deleteReview(review)
  //     .then((response) => {
  //       setMovie((prevState) => {
  //         prevState.reviews.splice(index, 1);
  //         return {
  //           ...prevState,
  //         };
  //       });
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <div className="poster">
              <Image
                className="bigPicture"
                src={nft.imageLink}
                onError={(e) => {
                  e.target.onerror = null;
                  console.log(e);
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
                {/* {user && (
                  <Link to={`/movies/${params.id}/review`}>Add Review</Link>
                )} */}
              </Card.Body>
            </Card>
            <h2>Reviews</h2>
            <br></br>
            {/* {movie.reviews.map((review, index) => {
              return (
                <div className="d-flex" key={index}>
                  <div className="flex-shrink-0 reviewsText">
                    <h5>
                      {" "}
                      {review.name + " reviewed on "}{" "}
                      {moment(review.date).format("Do MMMM YYYY")}{" "}
                    </h5>
                    <p className="review"> {review.review} </p>
                    {user && user.googleId === review.user_id && (
                      <Row>
                        <Col>
                          <Link
                            to={{
                              pathname: "/movies/" + params.id + "/review",
                            }}
                            state={{
                              currentReview: review,
                            }}
                          >
                            Edit
                          </Link>
                        </Col>
                        <Col>
                          <Button
                            variant="link"
                            onClick={() => onDeleteReview(review, index)}
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </div>
                </div>
              );
            })} */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Nft;
