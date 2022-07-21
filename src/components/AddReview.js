import React, {useState} from 'react'
import MovieDataService from "../services/movies"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"


function AddReview({ user }) {

  const navigate = useNavigate()
  
  let params = useParams()

  let editing = false

  let initialReviewState = ""

  let location = useLocation()

  const [review, setReview] = useState(initialReviewState)

  const onChangeReview = e => {
    const review = e.target.value
    setReview(review)
  }

  const saveReview = () => {

    let data = {
      review : review, 
      name : user.name, 
      user_id : user.googleId, 
      movie_id : params.id, 
    }
    
    if (location.state) {
      editing = true
      data._id = location.state.currentReview._id
    }
  
    if (editing) {
      // TODO: 
      console.log("UPDATING")
      MovieDataService.updateReview(data)
        .then(response => {
          navigate(`/movies/${params.id}`)
        })
        .catch(e => {
          console.log(e)
        })

    } else {
      console.log("CREATING")
      MovieDataService.createReview(data)
        .then(response => {
          navigate(`/movies/${params.id}`)
        })
        .catch(e => {
          console.log(e)
        })
      }
  }



  return (
    <Container className="main-container">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label> {editing ? "Edit" : "Create"} Review </Form.Label>
          <Form.Control 
            as="textarea"
            type="text"
            required
            review={ review }
            onChange={ onChangeReview }
            defaultValue={ editing ? null : "" }
          />
        </Form.Group>
        <Button variant="primary" onClick={ saveReview } >
          Submit
        </Button>
      </Form>
    </Container>
  )
}

export default AddReview