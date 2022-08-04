import axios from "axios";

class FavoritesDataService {
  updateFavorites(data) {
    return axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/nfts/favorites`,
      data
    );
  }

  getAllFavorites(userId) {
    return axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/nfts/favorites/${userId}`
    );
  }
}

export default new FavoritesDataService();
