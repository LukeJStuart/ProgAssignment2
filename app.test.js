'use strict';

const request = require('supertest');
const app = require('./app');

function checkCarnival(res)
{

    const jContent = res.body;
    if(typeof jContent != 'object'){
	throw new Error('not an object');
    }

    if(jContent['title'] != 'Carnival'){
	console.log(jContent);
	throw new Error('title should be Carnival');
    }

    if(jContent['place'] != 'Village Green'){
	throw new Error('place should be Village Green');
    }
    
    if(jContent['date'] != '01/06/19'){
	throw new Error('date should be 01/06/19');
    }
    
    if(jContent['description'] != 'A gathering of entertainment professionals from 10:00 to 16:00. £5 entry.'){
	throw new Error('description should be A gathering of entertainment professionals from 10:00 to 16:00. £5 entry.');
    }
}

function checkFred(res)
{

    const jContent = res.body;
    if(typeof jContent != 'object'){
	throw new Error(typeof jContent);
    }

    if(jContent['date'] != '01/06/19'){
	console.log(jContent);
	throw new Error('date should be 01/06/19');
    }

    if(jContent['eventid'] != 1){
	throw new Error('eventid should be 1');
    }
    
    if(jContent['commenter'] != 'Fred Barnes'){
	throw new Error('commenter should be Fred Barnes');
    }
    
    if(jContent['comment'] != 'The clown was too scary.'){
	throw new Error('commenter should be The clown was too scary.');
    }
}

// Note that due to the choice to have the list of all entities
// returned by my GETs when no parameters are given, I cannot test
// missing parameters as an error case as it is not an error case.

describe('Test the events service', () => {
    test('GET /events/? succeeds', () => {
        return request(app)
	    .get('/events/?')
	    .expect(200);
    });

    test('GET /events/? returns JSON', () => {
        return request(app)
	    .get('/events/?')
	    .expect('Content-type', /json/);
    });
    
    // Testing multiple ids
    
    test('GET /events/?id=1 succeeds', () => {
        return request(app)
	    .get('/events/?id=1')
	    .expect(200);
    });
    
    test('GET /events/?id=2 succeeds', () => {
        return request(app)
	    .get('/events/?id=2')
	    .expect(200);
    });
    
    // Testing an id that doesn't exist
    test('GET /events/?id=6 fails - no such event', () => {
        return request(app)
	    .get('/events/?id=6')
	    .expect(404);
    });

    test('GET /events/?id=1 returns JSON', () => {
        return request(app)
	    .get('/events/?id=1')
	    .expect('Content-type', /json/);
    });
    
    test('GET /events/?id=2 returns JSON', () => {
        return request(app)
	    .get('/events/?id=2')
	    .expect('Content-type', /json/);
    });

    test('GET /events/?id=1 includes event details', () => {
        return request(app)
	    .get('/events/?id=1')
	    .expect(checkCarnival);
    });

    // Testing the minimal list get method I have
    // included to satisfy the requirement
    test('GET /events/minlist succeeds', () => {
        return request(app)
	    .get('/events/minlist')
	    .expect(200);
    });

    test('POST /events needs access_token', () => {
        return request(app)
	    .post('/events')
	    .expect(403);
    });
});

describe('Test the comments service', () => {
    test('GET /comments/? succeeds', () => {
        return request(app)
	    .get('/comments/?')
	    .expect(200);
    });

    test('GET /comments/? returns JSON', () => {
        return request(app)
	    .get('/comments/?')
	    .expect('Content-type', /json/);
    });
    
    // Testing multiple ids
    
    test('GET /comments/?id=1 succeeds', () => {
        return request(app)
	    .get('/comments/?id=1')
	    .expect(200);
    });
    
    test('GET /comments/?id=2 succeeds', () => {
        return request(app)
	    .get('/comments/?id=2')
	    .expect(200);
    });
    
    // Testing an id that doesn't exist
    test('GET /comments/?id=6 fails - no such comment', () => {
        return request(app)
	    .get('/comments/?id=6')
	    .expect(404);
    });
    
    test('GET /comments/?id=1 returns JSON', () => {
        return request(app)
	    .get('/comments/?id=1')
	    .expect('Content-type', /json/);
    });
    
    test('GET /comments/?id=2 returns JSON', () => {
        return request(app)
	    .get('/comments/?id=2')
	    .expect('Content-type', /json/);
    });

    test('GET /comments/?id=1 includes comment details', () => {
        return request(app)
	    .get('/comments/?id=1')
	    .expect(checkFred);
    });

    // Testing the minimal list get method I have
    // included to satisfy the requirement
    test('GET /comments/minlist succeeds', () => {
        return request(app)
	    .get('/comments/minlist')
	    .expect(200);
    });
    
    test('POST /comments needs access_token', () => {
        return request(app)
	    .post('/comments')
	    .expect(403);
    });
});