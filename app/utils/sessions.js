import cookie from 'js-cookie';
import { getRequest, postRequest } from './request';

export const needsSave = (files) => !!files.filter((eachFile) => eachFile.isEdited).length;

export const getSession = () => {
  return new Promise(async(resolve) => {
    const existingCookieOrNull = cookie.get('sessionName');
    if (existingCookieOrNull) {
      console.log(`Existing session ${existingCookieOrNull}`);
      await postRequest('/api/ensuresession', { sessionName: existingCookieOrNull });
      resolve(existingCookieOrNull);
    } else {
      const sessionName = await getRequest('/api/session');
      cookie.set('sessionName', sessionName, { expires: 1 / 24 });
      resolve(sessionName);
    }
  });
}

export const saveAllAndAttemptCompiler =  async sessionName => {
  try {
    const response = await postRequest('/api/saveall', {
      sessionName,
    });
  } catch (error) {
    throw new Error(error);
  }
}

export const createNewFile = async (sessionName, fileName, isEntry) => {
  try {
    await postRequest('/api/newfile', {
      sessionName,
      fileName,
      isEntry,
    });
  } catch (error) {
    throw new Error(error);
  }
};