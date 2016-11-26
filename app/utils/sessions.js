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
      // Cookie expires in one day, length of active session runnning
      cookie.set('sessionName', sessionData.data, { expires: 1 / 24 });
      resolve(sessionData.data);
    }
  });
}