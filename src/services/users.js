import axios from "axios";
 
class UserDataService {

  updateUser(userData) {
    return axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/nfts/user`, userData
      )
  }

  
  getUserNfts(userId) {
    return axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/nfts/user/${userId}`
    )
  }

}

export default new UserDataService()