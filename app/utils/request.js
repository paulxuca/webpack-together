import axios from 'axios';

export const postRequest = (url, body = {}) => new Promise(async (resolve, reject) => {
  try {
      const result = await axios(url, {
        method: 'POST',
        data: body,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });
      resolve(result);
    } catch (error) {
      reject(error);
    }
});

export const getRequest = (url, params = {}) => new Promise(async(resolve, reject) => {
  try {
    const result = await axios.get(url, { params });
    resolve(result.data);
  } catch (error) {
    reject(error);
  }
});