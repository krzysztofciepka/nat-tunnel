const http = require('http');
const net = require('net');
const express = require('express')
const path = require('path')

  const app = express();

  app.get('/test', (req, res) => {
      console.log('request received!');

      res.send('OK');
  })

  app.post('/test2', (req, res) => {
    console.log('request received!');

    res.send('OK2');
})

app.get('/test3', (req, res) => {
    res.download(path.join(__dirname, 'package.json'))
})

  app.listen(8080, () => {
      console.log('server listen 8080')
  })

  http.get({
    hostname: 'localhost',
    port: 3000,
    path: '/api/register/my-server',
    agent: false  // Create a new agent just for this one request
  }, (res) => {
      let body = '';
      res.on('data', (data) => {
        body += data;
      });

      res.on('end', () => {
          const response = JSON.parse(body);

          const remote = net.connect({
              host: '127.0.0.1',
              port: response.port
          });

          remote.once('error', (err) => {
              console.log('remote: ',err)
          })

          remote.on('data', (data) => {
              console.log(data)
          })

          remote.once('connect', () => {
              const local = net.connect({
                  host: '127.0.0.1',
                  port: 8080
              })

              local.once('error', (err) => {
                console.log('local: ',err)
            })

            local.on('data', (data) => {
                console.log(data)
            })

              local.once('connect', () => {

                remote.pipe(local);

                console.log(response.url)
                http.get({
                    hostname: 'localhost',
                    port: 3000,
                    path: response.url + '/test',
                    agent: false  // Create a new agent just for this one request
                  }, (res) => {
                      let bb = '';
                      res.on('data', (data) => {
                        bb += data;
                      });
                
                      res.on('end', () => {
                          console.log(bb)
                
                          
                      })
                    // Do stuff with response
                  });
             })
          })
      })
    // Do stuff with response
  });
