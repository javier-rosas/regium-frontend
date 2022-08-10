import React from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Footer from './Footer'

import "./Mint.css"

const Mint = ({user}) => {

  


  return (
    <Container className="main-container">
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>NFT Name</Form.Label>
          <Form.Control type="text" placeholder="Enter NFT name" />
          <br/>
          <Form.Label>NFT Description</Form.Label>
          <Form.Control type="text" placeholder="Enter NFT description" />
          <Form.Text className="text-muted">
            Name your NFT and upload an image!
          </Form.Text>
      </Form.Group>
      </Form>
    </Container>
  )
}

export default Mint