import React from 'react'
import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import UserDataService from "../services/users"
import NftDataService from "../services/nfts" 
import './NftCollection.css'
import { useNavigate } from "react-router-dom";


import { useState, useCallback, useEffect } from 'react'

import "./NftList.css"

const NftCollection = ({user}) => {
  
  const [nftIds, setNftIds] = useState([])
  const [nfts, setNfts] = useState([])
  const navigate = useNavigate();
  
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
    if (user && user.googleId) {
      console.log("getNftIds in Nftcollection", user)
      UserDataService.getUser(user.googleId)
      .then((response) => {
        setNftIds(response.data.nfts_owned)
      })
      .catch((e) => {
        console.log(e)
      })
    }
  }, [user])

  
  useEffect(() => {
    getNftIds()
  }, [])


  return (
    <Container className="Container">
      <Row className="movieRow">
        {nfts.length === 0 ? 
        <div>
          <h1> No NFTs in your collection </h1>
        </div>
        :
        nfts.map((nft, i) => {
          return (
            <Col key={nft.id}>
              <Card className="moviesListCard" onClick={() => navigate("/nfts/" + nft.id)}>
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