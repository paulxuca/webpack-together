const sessions = {};

module.exports = {
  addSession: (sessionName, firebaseRef) => {
    sessions[sessionName] = {
      name: sessionName,
      firebase: firebaseRef,
    };
    return sessions[sessionName];
  },
  getSession: (sessionName) => sessions[sessionName],
};
