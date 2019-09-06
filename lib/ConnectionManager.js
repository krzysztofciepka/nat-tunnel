const net = require('net');
const debug = require('debug')('nat-tunnel:conn-mgr');

const MAX_RETRIES = 3;

let remoteReconnCount = 0;

function connect(rhost, rport, lhost, lport) {
  this.remote = net.connect({
    host: rhost,
    port: rport,
  });

  this.remote.setKeepAlive(true);

  this.remote.once('error', (err) => {
    debug('remote: ', err);
  });

  this.remote.once('close', () => {
    debug('remote closed');
    if (this.local && this.local.destroyed && remoteReconnCount < MAX_RETRIES) {
      // might be because of local port timeout - try to reconnect
      console.log('Connection closed. Trying to reconnect...');
      remoteReconnCount++;
      connect(rhost, rport, lhost, lport);
    }
  });

  this.remote.once('connect', () => {
    remoteReconnCount = 0;
    debug('remote connected');
    this.local = net.connect({
      host: lhost,
      port: lport,
    });

    this.local.once('error', (err) => {
      debug('local: ', err);
    });

    this.local.once('close', () => {
      debug('local closed');
      if (this.remote && this.remote.destroyed) {
        // connection closed by remote - try to reconnect
        connect(rhost, rport, lhost, lport);
      }
    });

    this.local.once('connect', () => {
      console.log(`Connection established: ${lhost}:${lport} <==> ${rhost}:${rport}`);
      this.remote.pipe(this.local).pipe(this.remote);
    });
  });
}

module.exports = {
  connect,
};
