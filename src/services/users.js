import axios from "axios";
 
class UserDataService {

  updateUser(userData) {
    return axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/nfts/user`, userData
      )
  }

  /*
  getUser(userId) {
    return axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/nfts/users/${userId}`
    )
  }*/

}

export default new UserDataService()