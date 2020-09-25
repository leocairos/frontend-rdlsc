import axios from 'axios';

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const apiGLPI = axios.create({
  baseURL: process.env.REACT_APP_GLPI_API_URL,
});

const apiXiloliteCQ = axios.create({
  baseURL: process.env.REACT_APP_API_CQ_URL,
  headers: {
    'x-access-key': process.env.REACT_APP_API_CQ_TOKEN,
  },
});

export { api, apiGLPI, apiXiloliteCQ };
