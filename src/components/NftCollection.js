import React from 'react'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import UserDataService from "../services/users"
import NftDataService from "../services/nfts" 

import { useState, useCallback, useEffect } from 'react'

import "./NftList.css"

const NftCollection = ({user}) => {
  
  const [nftIds, setNftIds] = useState([])
  const [nfts, setNfts] = useState([])

  /*
  Helper method to make DB Get requests for individual nfts
  */
  const getNftById = async (id) => {
    const res = await NftDataService.find(id, "id");
    const nft = {
      id: id,
      name: res.data.name,
      imageLink: res.data.imageLink,
    };
    return nft;
  };

  /*
  Retrieve cards with nft information 
  when page loads or when nftIds changes 
  (props load slowly, so we add the nftIds dependency)
  */
  useEffect(() => {
    async function fetchData() {
      let updatedArr = [];
      for (const id of nftIds) {
        updatedArr.push(await getNftById(id));
      }
      setNfts(() => updatedArr);
    }
    fetchData()
  }, [nftIds])


  const getNftIds = useCallback(() => {
    UserDataService.getUserNfts(user.googleId).
    then((response) => {
      setNftIds(response.data)
    })
    .catch((e) => {
      console.log(e)
    })
  }, [user])

  
  useEffect(() => {
    getNftIds()
  }, [getNftIds])



  
  return (
    <Container className="Container">
      <Row className="movieRow">
        {nfts.map((nft) => {
          return (
            <Col key={nft._id}>
              <Card className="moviesListCard">
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
                 </Card.Body>
              </Card>
            </Col>
          )
        })} 
        </Row>
    </Container>
  )
}

export default NftCollection