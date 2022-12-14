import React, { useState } from "react";
import MovieDataService from "../services/movies";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

const AddReview = ({ user }) => {
  const navigate = useNavigate();
  let params = useParams();
  let location = useLocation();
  let editing = location.state ? true : false;
  let initialReviewState = editing ? location.state.currentReview.review : "";

  const [review, setReview] = useState(initialReviewState);

  const onChangeReview = (e) => {
    const review = e.target.value;
    setReview(review);
  };

  const saveReview = () => {
    if (editing) {
      // handle case where an existing review is being updated
      var data = {
        review: review,
        user_id: user.googleId,
        review_id: location.state.currentReview._id,
      };
      MovieDataService.updateReview(data)
        .then((response) => {
          navigate("/movies/" + params.id);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      var data = {
        review: review,
        name: user.name,
        user_id: user.googleId,
        movie_id: params.id, // get movie id from url
      };
      MovieDataService.createReview(data)
        .then((response) => {
          navigate("/movies/" + params.id);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <Container className="main-container">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>{editing ? "Edit" : "Create"} Review</Form.Label>
          <Form.Control
            as="textarea"
            type="text"
            required
            review={review}
            onChange={onChangeReview}
            defaultValue={initialReviewState}
          />
        </Form.Group>
        <Button variant="primary" onClick={saveReview}>
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default AddReview;
