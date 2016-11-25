import axios from 'axios';
import cookie from 'js-cookie';

export const getSession = () => {
  return new Promise(async(resolve, reject) => {
    const existingCookieOrNull = cookie.get('sessionName');
    if (existingCookieOrNull) {
      console.log(`Existing session ${existingCookieOrNull}`);
      resolve(cookie.get('sessionName'));
    } else {
      const sessionData = await axios.get('/api/session');
      cookie.set('sessionName', sessionData.data);
      resolve(sessionData.data);
    }
  });
}