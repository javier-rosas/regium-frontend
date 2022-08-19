import React from "react";
import Container from "react-bootstrap/Container";
import DnDContainer from "./DNDContainer";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./Favorites.css";

const Favorites = ({ user, favorites }) => {
  return (
    <div>
      <div className="favoritesContainer container">
        <div className="favoritesPanel favBox">
          {favorites.length > 0
            ? "Drag your wishlist items to rank them"
            : "There's nothing on your wishlist yet"}
        </div>
        <div className="favBox">
          <DndProvider backend={HTML5Backend}>
            <DnDContainer user={user} favorites={favorites} />
          </DndProvider>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
