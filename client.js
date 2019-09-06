const http = require('http');
const connManager = require('./lib/ConnectionManager')

module.exports = {
  register: (name, rhost, rport, lhost, lport) => {
    http.get({
      hostname: rhost,
      port: rport,
      path: `/api/register/${name}`,
      agent: false
    }, (res) => {
      const { statusCode } = res;
      let payload = '';
      res.on('data', (data) => {
        payload += data;
      });

      res.on('end', () => {
        if(!(statusCode > 199 && statusCode < 400)){
          throw new Error(payload);
        }
        const body = JSON.parse(payload);
        connManager.connect(rhost, body.port, lhost, lport);
      });
    });
  }
}
