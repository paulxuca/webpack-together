import cookie from 'js-cookie';
import { getRequest, postRequest } from './request';

export const needsSave = (files) => !!files.filter((eachFile) => eachFile.isEdited).length;

export const getSession = () => {
  return new Promise(async(resolve) => {
    await postRequest('/api/session');
    const sessionCookie = cookie.get('sessionName');
    resolve(sessionCookie);
  });
}

export const getIndex = sessionName => new Promise(async (res, rej) => {
  await getRequest('api/sandbox', {
    headers: {
      'x-session-name': sessionName,
    },
  });
});

export const saveAllAndAttemptCompiler =  async sessionName => {
  try {
    const response = await postRequest('/api/session', {
      sessionName,
    });
  } catch (error) {
    throw new Error(error);
  }
}

export const createNewFile = async (sessionName, fileName, isEntry) => {
  try {
    await postRequest('/api/session', {
      sessionName,
      intent: 1, // add file intent
      fileName,
      isEntry,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteFile = async(sessionName, fileHash) => {
  try {
    await postRequest('/api/session', {
      sessionName,
      fileHash,
      intent: 2, // Remove file intent
    });
  } catch (error) {
    throw new Error(error);
  }
}