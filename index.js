// Download modules

const fs = require('fs');
const express = require('express');

var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;
var io = require('socket.io')(http);

var sanitizer = require('sanitizer');

var getIP = require('ipware')().get_ip;
const { lookup } = require('geoip-lite');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Google Firestore

const {
	type,
	project_id,
	private_key_id,
	private_key,
	client_email,
	client_id,
	auth_uri,
	token_uri,
	auth_provider_x509_cert_url,
	client_x509_cert_url
} = process.env;

const serviceAccount = {
	type,
	project_id,
	private_key_id,
	private_key,
	client_email,
	client_id,
	auth_uri,
	token_uri,
	auth_provider_x509_cert_url,
	client_x509_cert_url
};

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Application routes

app.get('', function (req, res) {
  const index = __dirname + '/public/static/index.html';

  res.sendFile(index);
});

app.post('/msg', async function (req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const comment = req.body.comment;

  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(",")[0];
  } 

  else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress;
  } 

  else {
    ip = req.ip;
  }

  if (email === "COMMODORE") {
    ip = "COMMODORE";
  }

  const cleaned_username = sanitizer.escape(username);
  const cleaned_email = sanitizer.escape(email);
  const cleaned_comment = sanitizer.escape(comment);
  
  const screenRef = db.collection('telescreen').doc('chatlog');
  const doc = await screenRef.get();

  const recordRef = db.collection('recording').doc('chatlog');
  const rec = await recordRef.get();

  await screenRef.set({
    log : "<br/><div class='glass paragraph rounded boxed'><h3>" + cleaned_username + "</h3><hr/>" + cleaned_comment + "</div>" + doc.data().log
  });

  await recordRef.set({
    log : "{" + ip + ", " + email + "}" + rec.data().log
  });

  res.send("success");
});

app.post('/cmdr', function (req, res) {
  const cmdr_key = req.body.cmdr_key;

  if (cmdr_key === process.env.CMDR) {
    res.send("success");
  }

  else {
    res.send("wrong_code");
  }
});

app.get('/thingy', async function (req, res) {
  const screenRef = db.collection('telescreen').doc('chatlog');
  const doc = await screenRef.get();

  const message = doc.data().log;

  res.send(message);
});

http.listen(port, function(){
  console.log('listening on *:' + port);

  const screenRef = db.collection('telescreen').doc('chatlog');
  const recordRef = db.collection('recording').doc('chatlog');

  async function fixSMS () {
    const doc = await screenRef.get();
    const rec = await recordRef.get();

    if (!doc.exists) {
      const fix_data = {
        log : ""
      }

      await screenRef.set(fix_data);

      console.log("FIXED");
    }

    else {
      console.log("No Fix needed.");
    }

    if (!rec.exists) {
      const fix_data = {
        log : ""
      }

      await recordRef.set(fix_data);

      console.log("FIXED");
    }

    else {
      console.log("No Fix needed.");
    }
  }

  fixSMS();
});