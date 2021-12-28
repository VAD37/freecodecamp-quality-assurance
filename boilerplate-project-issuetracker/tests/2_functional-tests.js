const chaiHttp = require('chai-http');
const {chai,assert,should,expect} = require('chai');
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    // Create an issue with every field: POST request to /api/issues/{project}
    // You can send a POST request to /api/issues/{projectname} with form data containing the required fields issue_title, issue_text, created_by, and optionally assigned_to and status_text.
    test('Create an issue with every field', (done) => {
        chai.request(server).post('/api/issues/test').send({
            issue_title: 'Title',
            issue_text: 'Text',
            created_by: 'Chai and Mocha',
            assigned_to: 'Chai and Mocha',
            status_text: 'In Progress'
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Title');
            assert.equal(res.body.issue_text, 'Text');
            assert.equal(res.body.created_by, 'Chai and Mocha');
            assert.equal(res.body.assigned_to, 'Chai and Mocha');
            assert.equal(res.body.status_text, 'In Progress');
            expect(res.body).to.have.property('created_on');
            expect(res.body).to.have.property('updated_on');
            expect(res.body).to.have.property('open');
            expect(res.body).to.have.property('_id');
            done();
        });
    });

    // Create an issue with only required fields: POST request to /api/issues/{project}. 
    //If you send a POST request to /api/issues/{projectname} without the required fields, returned will be the error { error: 'required field(s) missing' }
    test('Create an issue with only required fields', (done) => {
        chai.request(server).post('/api/issues/test').send({
            issue_title: 'Title',
            issue_text: 'Random Text',
            created_by: 'Chai and Mocha'
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Title');
            assert.equal(res.body.issue_text, 'Text');
            assert.equal(res.body.created_by, 'Chai and Mocha');
            expect(res.body).to.have.property('created_on');
            expect(res.body).to.have.property('updated_on');
            expect(res.body).to.have.property('open');
            expect(res.body).to.have.property('_id');
            done();
        });
    });

    // Create an issue without required fields: POST request to /api/issues/{project}. 
    //If you send a POST request to /api/issues/{projectname} without the required fields, returned will be the error { error: 'required field(s) missing' }
    test('Create an issue without required fields', (done) => {
        chai.request(server).post('/api/issues/test').send({
            issue_text: 'Text',
            created_by: 'Chai and Mocha'
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'required field(s) missing');
            done();
        });
    });

    
    // View issues on a project: GET request to /api/issues/{project}
    // You can send a GET request to /api/issues/{projectname} for an array of all issues for that specific projectname, with all the fields present for each issue.
    test('View issues on a project', (done) => {
        chai.request(server).get('/api/issues/test').end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], '_id');
            done();
        });
    });

    
    // View issues on a project with one filter: GET request to /api/issues/{project}
    // You can send a GET request to /api/issues/{projectname} for an array of all issues for that specific projectname, with all the fields present for each issue.
    // You can filter the issues by setting the query string parameters completed=true or open=false.
    test('View issues on a project with one filter', (done) => {
        chai.request(server).get('/api/issues/test').query({
            open: true
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'open');
            assert.equal(res.body[0].open, true);
            done();
        });
    });


    // View issues on a project with multiple filters: GET request to /api/issues/{project}
    // You can send a GET request to /api/issues/{projectname} and filter the request by also passing along any field and value as a URL query (ie. /api/issues/{project}?open=false). You can pass one or more field/value pairs at once.
    test('View issues on a project with multiple filters', (done) => {
        chai.request(server).get('/api/issues/test').query({
            open: true,
            issue_title: 'Title'
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.equal(res.body[0].issue_title, 'Title');
            assert.equal(res.body[0].open, true);
            done();
        });
    });


    // before test. Create a new issue and cache the _id from POST request to /api/issues/test
    
    
    // Update one field on an issue: PUT request to /api/issues/{project}
    //You can send a PUT request to /api/issues/{projectname} with an _id and one fields to update. On success, the updated_on field should be updated, and returned should be {  result: 'successfully updated', '_id': _id }.
    test('Update one field on an issue', (done) => {
        let id = null;
        before(async () => {
            const res = await chai.request(server).post('/api/issues/test').send({
                issue_title: 'Title ' + Math.random(),
                issue_text: 'Text random something' + Math.random(),
                created_by: 'Me',
            });
            id = res.body._id;
        })

        chai.request(server).put('/api/issues/test').send({
            _id: id,
            issue_title: 'Updated Title'
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, id);
            done();
        });
    });

    // Update multiple fields on an issue: PUT request to /api/issues/{project}
    // You can send a PUT request to /api/issues/{projectname} with an _id and one or more fields to update. On success, the updated_on field should be updated, and returned should be {  result: 'successfully updated', '_id': _id }.
    test('Update multiple fields on an issue', (done) => {
        let id = null;
        before(async () => {
            const res = await chai.request(server).post('/api/issues/test').send({
                issue_title: 'Title ' + Date.now(),
                issue_text: 'Text random something',
                created_by: 'Me',
            });
            id = res.body._id;
        })

        chai.request(server).put('/api/issues/test').send({
            _id: id,
            issue_title: 'Updated Title',
            issue_text: 'Updated Text',
            created_by: 'New Me'
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, id);
            assert.equal(res.body.issue_title, 'Updated Title');
            assert.equal(res.body.issue_text, 'Updated Text');
            assert.equal(res.body.created_by, 'New Me');
            done();
        });
    });
    
    // Update an issue with missing _id: PUT request to /api/issues/{project}
    // When the PUT request sent to /api/issues/{projectname} does not include an _id, the return value is { error: 'missing _id' }.
    test('Update an issue with invalid _id', (done) => {
        chai.request(server).put('/api/issues/test').send({
            issue_title: 'Updated Title',
            issue_text: 'Updated Text'
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'invalid _id');
            done();
        });
    });

    // Update an issue with no fields to update: PUT request to /api/issues/{project}
    // When the PUT request sent to /api/issues/{projectname} does not include update fields, the return value is { error: 'no update field(s) sent', '_id': _id }
    test('Update one field on an issue', (done) => {
        let id = null;
        before(async () => {
            const res = await chai.request(server).post('/api/issues/test').send({
                issue_title: 'Title ' + Math.random(),
                issue_text: 'Text random something' + Math.random(),
                created_by: 'Me',
            });
            id = res.body._id;
        })

        chai.request(server).put('/api/issues/test').send({
            _id: id
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            assert.equal(res.body.error, 'no update field(s) sent');
            done();
        });
    });


    // Update an issue with an invalid _id: PUT request to /api/issues/{project}
    // When the PUT request sent to /api/issues/{projectname} have wrong _id. Return value { error: 'could not update', '_id': _id }.
    test('Update an issue with invalid _id', (done) => {
        let id = Math.random();
        chai.request(server).put('/api/issues/test').send({
            _id:  id,
            issue_title: 'Updated Title',
            issue_text: 'Updated Text',
            created_by: 'New Me'
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            assert.equal(res.body.error, 'could not update');
            done();
        });
    });

    // Delete an issue: DELETE request to /api/issues/{project}
    // You can send a DELETE request to /api/issues/{projectname} with an _id to delete an issue.
    test('Delete an issue', (done) => {
        let id = null;
        before(async () => {
            const res = await chai.request(server).post('/api/issues/test').send({
                issue_title: 'Title ' + Math.random(),
                issue_text: 'Text random something' + Math.random(),
                created_by: 'Me',
            });
            id = res.body._id;
        })

        chai.request(server).delete('/api/issues/test').send({
            _id: id
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully deleted');
            done();
        });
    });

    // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}.
    // If no _id is sent, the return value is { error: 'missing _id' }
    test('Delete an issue with invalid _id', (done) => {
        chai.request(server).delete('/api/issues/test').send({
            _id: null
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'could not delete');
            
            done();
        });
    });

    // Delete an issue with missing _id: DELETE request to /api/issues/{project}
    test('Delete an issue with missing _id', (done) => {
        let id = null;
        chai.request(server).delete('/api/issues/test').send({
            _id: id
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'missing _id');
            done();
        });
    });

});
