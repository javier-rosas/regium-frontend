import React from "react";
import Container from "react-bootstrap/Container";
import { useForm } from "react-hook-form";
import NftDataService from "../services/nfts";
import { useNavigate } from "react-router-dom";

import "./Mint.css";

const Mint = ({ user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  function create_blob(file, callback) {
    var reader = new FileReader();
    reader.onload = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(file[0]);
  }

  const onSubmit = (data) => {
    console.log(data);
    create_blob(data.image, function (blob_string) {
      data.image = blob_string;
      NftDataService.mintNft(data)
        .then((response) => {
          navigate("/nfts");
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };

  return (
    <div className="mint-page">
      <Container className="main-container">
        <h1 className="heading1">Ever wanted to mint your own NFTs?</h1>
        <h2 className="heading2">Here's your chance!</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>NFT Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: true })}
          />
          {errors.image && (
            <span className="error">This field is required</span>
          )}

          <label>NFT Name</label>
          <input
            placeholder="Spacemonkey #26"
            {...register("name", { required: true })}
          />
          {errors.name && <span className="error">This field is required</span>}

          <label>NFT Description</label>
          <input
            placeholder="A cool NFT"
            {...register("description", { required: true })}
          />
          {errors.description && (
            <span className="error">This field is required</span>
          )}

          <label>NFT Price (ETH)</label>
          <input
            placeholder="0.05"
            type="number"
            step="0.01"
            min="0"
            {...register("price", { required: true })}
          />
          {errors.price && (
            <span className="error">This field is required</span>
          )}
          <input type="submit" />
        </form>
      </Container>
    </div>
  );
};

export default Mint;
