const net = require('net');
const debug = require('debug')('nat-tunnel:conn-mgr');

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

    if (this.local && this.local.destroyed) {
      // might be local port timeout - try to reconnect
      connect(rhost, rport, lhost, lport);
    }
  });

  this.remote.once('connect', () => {
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
    });

    this.local.once('connect', () => {
      debug('local connected');
      this.remote.pipe(this.local).pipe(this.remote);
    });
  });
}

module.exports = {
  connect,
};
