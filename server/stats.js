const users = require('./firebase').users;
const sessions = require('./sessions').sessions;

const filterSessions = () => {
  return Object.keys(sessions).map(eachSession => {
    return {
      [eachSession]: {
        config: sessions[eachSession].config,
      }
    };
  });
};

module.exports = {
  displayStats(req, res) {
    const sessionsData = filterSessions();
    res.send(JSON.stringify({
      users,
      sessions: sessionsData,
    }, null, 2)).status(200);
  }
};
