# nat-tunnel

## Description

CLI tool for **nat-tunnel-server**. Allows to publish locally running service to the world under:

    nat-tunnel.tk/{name}

## Usage

        nat-tunnel <name> <local host> <local port>

For example:

     nat-tunnel my-service 127.0.0.1 3000

will publish a service running at 127.0.0.1:3000 under:

    http://nat-tunnel.tk/my-service/

## How it works

Connection is based on TCP sockets.

Nat-tunnel client requests a dedicated TCP socket on nat-tunnel server and binds it to the locally running service via a duplex stream

Nat-tunnel service creates a dedicated subdomain for client and streams all HTTP requests on that domain to the socket

When the local service responds, a HTTP response is sent back to the original requester

Connection stays active as long as nat-tunnel client is running
