import axios from 'axios';

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const apiGLPI = axios.create({
  baseURL: process.env.REACT_APP_GLPI_API_URL,
});

const apiMyLIMs = axios.create({
  baseURL: process.env.REACT_APP_MYLIMS_URL,
  headers: {
    'x-access-key': process.env.REACT_APP_MYLIMS_TOKEN,
  },
  validateStatus: status => {
    return status >= 200 && status < 300; // default
  },
});

const apiXiloliteCQ = axios.create({
  baseURL: process.env.REACT_APP_API_CQ_URL,
  headers: {
    'x-access-key': process.env.REACT_APP_API_CQ_TOKEN,
  },
});

export { api, apiGLPI, apiMyLIMs, apiXiloliteCQ };
