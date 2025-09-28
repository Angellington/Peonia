import axios from 'axios';

const postFetch = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND + "/posts",
  headers: {
    "Content-Type": "application/json"
  }
});

export default postFetch;
