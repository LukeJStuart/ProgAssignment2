// Allowing ++s in for loops
/* eslint no-plusplus: [2, { allowForLoopAfterthoughts: true }] */
// Turning off preference for destructuring of objects as eslint advice breaks GETs
/* eslint prefer-destructuring: ["error", {AssignmentExpression: {array: true}}] */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Pre-made event data
const eventList = [
  {
    id: 1, date: '01/06/19', title: 'Carnival', place: 'Village Green', description: 'A gathering of entertainment professionals from 10:00 to 16:00. £5 entry.',
  },
  {
    id: 2, date: '02/06/19', title: 'Vegetable Competition', place: 'Village Hall', description: 'Competition to find largest vegetables gorwn this year. 13:00 - 15:00',
  },
  {
    id: 3, date: '03/06/19', title: 'Welly Throwing', place: 'Market Square', description: 'Who can throw a welly the furthest? Find out at 13:00. Cash prize.',
  },
];
let nextEventId = 4;

// Pre-made list data
const commentList = [
  {
    id: 1, date: '01/06/19', eventid: 1, commenter: 'Fred Barnes', comment: 'The clown was too scary.',
  },
  {
    id: 2, date: '02/06/19', eventid: 2, commenter: 'Chris Rutherford', comment: 'I\'m glad Fred won the largest cucumber competition.',
  },
  {
    id: 3, date: '03/06/19', eventid: 3, commenter: 'Benjamin Granger', comment: 'The wellies were not of regulation weight.',
  },
];
let nextCommentId = 4;

app.use(express.static('client'));

app.route('/events')
  // This get request will return all events if no id given
  // or a specific event if an id is given - it is useful for
  // my site to be able to access all the events with one get
  .get((req, res) => {
    res.type('json');
    // take id of event from query in url
    const id = req.query.id;

    if (id === undefined) {
      // return all events in undefined order
      res.send(eventList);
    } else {
      // return event of specific id
      let theEvent;
      for (let i = 0; i < eventList.length; i++) {
        if (eventList[i].id === parseInt(id, 10)) {
          theEvent = eventList[i];
        }
      }
      if (theEvent === undefined) {
        // if event doesn't exist, return null
        res.status(404).send({ message: 'No event of this id.' });
      } else {
        // if event does exist, return it
        res.send(theEvent);
      }
    }
  })

  // Post allows addition of a new event
  .post((req, res) => {
    res.type('json');
    // requires access token of ABCD to work
    if (req.body.accesstoken === 'ABCD') {
      // attempt to catch errors in post attempts
      try {
        eventList.push({
          id: nextEventId,
          date: req.body.date,
          title: req.body.title,
          place: req.body.place,
          description: req.body.description,
        });
        nextEventId += 1;
        res.send({ valid: true });
      } catch (err) {
        res.send(err.message);
      }
    } else {
      // if invalid access token send 403 status and error message in JSON
      res.status(403).send({ message: 'Invalid Access Token' });
    }
  });

app.route('/comments')
  // This get request will return all comments if no id given
  // or a specific comment if an id is given - it is useful for
  // my site to be able to access all the comments with one get
  .get((req, res) => {
    res.type('json');
    // take id of comment from query in url
    const id = req.query.id;
    if (id === undefined) {
      // return all events in undefined order
      res.send(commentList);
    } else {
      // return comment of specific id
      let theComment;
      for (let i = 0; i < commentList.length; i++) {
        if (commentList[i].id === parseInt(id, 10)) {
          theComment = commentList[i];
        }
      }
      if (theComment === undefined) {
        // if comment doesn't exist, return null
        res.status(404).send({ message: 'No comment of this id.' });
      } else {
        // if comment does exist, return it
        res.send(theComment);
      }
    }
  })

  // Post allows addition of a new comment
  .post((req, res) => {
    res.type('json');
    // post requires access token EFGH
    if (req.body.accesstoken === 'EFGH') {
      // attempt to catch errors in post attempts
      try {
        commentList.push({
          id: nextCommentId,
          date: req.body.date,
          eventid: req.body.eventid,
          commenter: req.body.commenter,
          comment: req.body.comment,
        });
        nextCommentId += 1;
        res.send({ valid: true });
      } catch (err) {
        res.send(err.message);
      }
    } else {
      // if invalid access token send 403 status and error message in JSON
      res.status(403).send({ message: 'Invalid Access Token' });
    }
  });

// Due to the marking criteria to have a GET returning minimal details
// I have included such a route for comments at /comments/minlist
// this is not required or used by my site
app.route('/comments/minlist')
  .get((req, res) => {
    res.type('json');
    const minlist = [];
    for (let i = 0; i < commentList.length; i++) {
      minlist[i] = { id: commentList[i].id, commenter: commentList[i].commenter };
    }
    res.send(minlist);
  });

// Due to the marking criteria to have a GET returning minimal details
// I have included such a route for events at /events/minlist
// this is not required or used by my site
app.route('/events/minlist')
  .get((req, res) => {
    res.type('json');
    const minlist = [];
    for (let i = 0; i < eventList.length; i++) {
      minlist[i] = { id: eventList[i].id, title: eventList[i].title };
    }
    res.send(minlist);
  });
module.exports = app;
