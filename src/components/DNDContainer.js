import update from "immutability-helper";
import { useCallback, useEffect, useState } from "react";
import { DnDCard } from "./DNDCard";
import NftDataService from "../services/nfts";
import FavoritesDataService from "../services/favorites";


const DnDContainer = ({ user, favorites }) => {
  {
    const [cards, setCards] = useState([]);

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
    when page loads or when favorites changes 
    (props load slowly, so we add the favorites dependency)
    */
    useEffect(() => {
      async function fetchData() {
        let updatedArr = [];
        for (const id of favorites) {
          updatedArr.push(await getNftById(id));
        }
        setCards(() => updatedArr);
      }
      fetchData();
    }, [favorites]);

    /*
    Update the order of the favorites in the database. 
    Makes a DB call whenever cards changes.
    */
    useEffect(() => {
      if (cards.length !== 0) {
        let ids = cards.map((card) => card.id);
        FavoritesDataService.updateFavorites({
          _id: user.googleId,
          favorites: ids,
        }).catch((e) => {
          console.log(e);
        });
      }
    }, [cards]);

    const moveCard = useCallback((dragIndex, hoverIndex) => {
      setCards((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })
      );
    }, []);

    const renderCard = useCallback((card, index) => {
      return (
        <DnDCard
          key={index}
          id={card.id}
          name={card.name}
          imageLink={card.imageLink}
          index={index}
          moveCard={moveCard}
        />
      );
    }, []);

    return (
      <>
        <div>{cards.map((card, i) => renderCard(card, i))}</div>
      </>
    );
  }
};

export default DnDContainer;
