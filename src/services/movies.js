import axios from "axios"


class MovieDataService {

    getAll(page=0) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies?page=${page}`)
    }

    find(query, by="title", page=0) {
        if (by === "title"){
            return axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies?title=${query}&page=${page}`
            )
        } else if (by === "id") {
            return axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/id/${query}`
            )
        } else if (by === "rated") {
            return axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies?rated=${query}&page=${page}`
            )
        }
    }

    getRatings() {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/ratings`)
    }

    createReview(data) {
        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`, data)
    }

    updateReview(data) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`, data)
    }

    deleteReview(data) {
        return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`, { data: data })
    }

}

export default new MovieDataService