import axios from 'axios'

const API_URL = '/service/user'

// Configure axios defaults
axios.defaults.withCredentials = true 

// signup user (sends activation email)
const signup = async (userData) => {
    const response = await axios.post(API_URL + "/signup", userData)
    return response.data
}

// activate email
const activateEmail = async (activation_token) => {
    const response = await axios.post(API_URL + "/activate", { activation_token })
    return response.data
}

// signin user  
const signin = async (userData) => {
    const response = await axios.post(API_URL + "/signin", userData)
    if (response.data) {
        // Store the user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
}

// logout user
const logout = async () => {
    const response = await axios.post(API_URL + "/logout")
    localStorage.removeItem('user')
    return response.data
}

const authService = {
    signup,
    activateEmail,
    signin,
    logout
}

export default authService