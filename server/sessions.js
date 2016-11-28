const sessions = {};

module.exports = {
  addSession: (sessionName, firebaseRef) => {
    sessions[sessionName] = {
      name: sessionName,
    };
    return sessions[sessionName];
  },
  getSession: (sessionName) => sessions[sessionName],
};
