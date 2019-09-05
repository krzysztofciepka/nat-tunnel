const http = require('http');
const connManager = require('./lib/ConnectionManager')

module.exports = {
  register: (rhost, rport, lhost, lport) => {
    http.get({
      hostname: rhost,
      port: rport,
      path: '/api/register/my-server',
      agent: false  // Create a new agent just for this one request
    }, (res) => {
      let body = '';
      res.on('data', (data) => {
        body += data;
      });

      res.on('end', () => {
        const response = JSON.parse(body);
        connManager.connect(rhost, response.port, lhost, lport);

      })
    });
  }
}


