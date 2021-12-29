const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');

chai.use(chaiHttp);
describe('Functional Tests', function () {

    describe("Create new issues", () => {
        // Create an issue with every field: POST request to /api/issues/{project}
        // You can send a POST request to /api/issues/{projectname} with form data containing the required fields issue_title, issue_text, created_by, and optionally assigned_to and status_text.
        it('Create an issue with every field', (done) => {
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
                assert.exists(res.body.created_on);
                assert.exists(res.body.updated_on);
                assert.exists(res.body.open);
                assert.exists(res.body._id);
                done();
            });
        });

        // Create an issue with only required fields: POST request to /api/issues/{project}. 
        //If you send a POST request to /api/issues/{projectname} without the required fields, returned will be the error { error: 'required field(s) missing' }
        it('Create an issue with only required fields', (done) => {
            chai.request(server).post('/api/issues/test').send({
                issue_title: 'Title',
                issue_text: 'Random Text',
                created_by: 'Chai and Mocha'
            }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'Title');
                assert.equal(res.body.issue_text, 'Random Text');
                assert.equal(res.body.created_by, 'Chai and Mocha');
                done();
            });
        });

        // Create an issue without required fields: POST request to /api/issues/{project}. 
        //If you send a POST request to /api/issues/{projectname} without the required fields, returned will be the error { error: 'required field(s) missing' }
        it('Create an issue without required fields', (done) => {
            chai.request(server).post('/api/issues/test').send({
                issue_text: 'Text',
                created_by: 'Chai and Mocha'
            }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'required field(s) missing');
                done();
            });
        });
    })


    describe("View issues", () => {
        const issue_randomText = Math.random().toString(36).substring(7);
        const issue_randomTitle = 'Title ' + issue_randomText;
        let created_id = null;
        before(async () => {
            let res = await chai.request(server).post('/api/issues/test').send({
                issue_title: issue_randomTitle,
                issue_text: issue_randomText,
                created_by: 'Mocha and Chai1',
            });
            await chai.request(server).post('/api/issues/test').send({
                issue_title: issue_randomTitle,
                issue_text: issue_randomText,
                created_by: 'Mocha and Chai2',
            });
            await chai.request(server).post('/api/issues/test').send({
                issue_title: issue_randomTitle,
                issue_text: issue_randomText + " extra random tx",
                created_by: 'Mocha and Chai3',
            });
            created_id = res.body._id;
        })

        // View issues on a project: GET request to /api/issues/{project}
        // You can send a GET request to /api/issues/{projectname} for an array of all issues for that specific projectname, with all the fields present for each issue.
        it('View issues on a project', (done) => {
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
        it('View issues on a project with one filter', (done) => {
            chai.request(server).get('/api/issues/test').query({
                _id: created_id
            }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                const array = res.body;
                assert.equal(array.length == 1, true);
                assert.equal(res.body[0]._id, created_id);
                done();
            });
        });

        // View issues on a project with multiple filters: GET request to /api/issues/{project}
        // You can send a GET request to /api/issues/{projectname} and filter the request by also passing along any field and value as a URL query (ie. /api/issues/{project}?open=false). You can pass one or more field/value pairs at once.
        it('View issues on a project with multiple filters', (done) => {
            chai.request(server).get('/api/issues/test').query({
                issue_title: issue_randomTitle,
                issue_text: issue_randomText
            }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                const array = res.body;
                assert.equal(array.length > 1, true);
                assert.equal(array.every(x => x.issue_title == issue_randomTitle), true);
                assert.equal(array.every(x => x.issue_text == issue_randomText), true);
                done();
            });
        });
    })



    before(async () => {
        const randomString = Math.random().toString(36).substring(7);
        const title = 'Title ' + randomString;
        const assigned_to = 'Randomer ' + randomString;
        await chai.request(server).post('/api/issues/test').send({
            issue_title: title,
            issue_text: randomString,
            created_by: 'Mocha and Chai',
            assigned_to: assigned_to,
        });
        await chai.request(server).post('/api/issues/test').send({
            issue_title: title,
            issue_text: randomString,
            created_by: 'Mocha and Chai',
            assigned_to: assigned_to,
        });
        await chai.request(server).post('/api/issues/test').send({
            issue_title: title,
            issue_text: randomString,
            created_by: 'Mocha and Chai',
            assigned_to: "Randomer none",
        });
    })


    describe("Interact with an issue", () => {
        let test_issue_id = null;
        before(async () => {
            const res = await chai.request(server).post('/api/issues/test').send({
                issue_title: 'Title ' + Math.random(),
                issue_text: 'Text random something' + Math.random(),
                created_by: 'Me',
            });
            test_issue_id = res.body._id;
        });

        // Update one field on an issue: PUT request to /api/issues/{project}
        //You can send a PUT request to /api/issues/{projectname} with an _id and one fields to update. On success, the updated_on field should be updated, and returned should be {  result: 'successfully updated', '_id': _id }.
        it('Update one field on an issue', (done) => {
            chai.request(server).put('/api/issues/test').send({
                _id: test_issue_id,
                issue_title: 'Updated Title'
            }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, test_issue_id);

                chai.request(server).get('/api/issues/test').query({
                    _id: test_issue_id
                }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body[0]._id, test_issue_id);
                    assert.equal(res.body[0].issue_title, 'Updated Title');
                    assert.isAbove(Date.parse(res.body[0].updated_on), Date.parse(res.body[0].created_on));
                    done();
                });
            });
        });

        // Update multiple fields on an issue: PUT request to /api/issues/{project}
        // You can send a PUT request to /api/issues/{projectname} with an _id and one or more fields to update. On success, the updated_on field should be updated, and returned should be {  result: 'successfully updated', '_id': _id }.
        it('Update multiple fields on an issue and success', (done) => {
            chai.request(server).put('/api/issues/test').send({
                _id: test_issue_id,
                issue_title: 'Updated Title',
                issue_text: 'Updated Text',
                created_by: 'New Me',
                status_text: "new status"
            }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, test_issue_id);
                chai.request(server).get('/api/issues/test').query({
                    _id: test_issue_id
                }).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body[0].issue_title, 'Updated Title');
                    assert.equal(res.body[0].issue_text, 'Updated Text');
                    assert.equal(res.body[0].created_by, 'New Me');
                    assert.equal(res.body[0].status_text, "new status");                    
                    assert.isAbove(Date.parse(res.body[0].updated_on), Date.parse(res.body[0].created_on));
                    done();
                });
            });
        });

        // Update an issue with missing _id: PUT request to /api/issues/{project}
        // When the PUT request sent to /api/issues/{projectname} does not include an _id, the return value is { error: 'missing _id' }.
        it('Update an issue with missing _id', (done) => {
            chai.request(server).put('/api/issues/test').send({
                issue_title: 'Updated Title',
                issue_text: 'Updated Text'
            }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
        });

        // Update an issue with no fields to update: PUT request to /api/issues/{project}
        // When the PUT request sent to /api/issues/{projectname} does not include update fields, the return value is { error: 'no update field(s) sent', '_id': _id }
        it('Update with missing field on an issue', (done) => {
            chai.request(server).put('/api/issues/test').send({
                _id: test_issue_id
            }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body._id, test_issue_id);
                assert.equal(res.body.error, 'no update field(s) sent');
                done();
            });
        });


        // Update an issue with an invalid _id: PUT request to /api/issues/{project}
        // When the PUT request sent to /api/issues/{projectname} have wrong _id. Return value { error: 'could not update', '_id': _id }.
        it('Update an issue with invalid _id', (done) => {
            let id = Math.random();
            chai.request(server).put('/api/issues/test').send({
                _id: id,
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
        it('Delete an issue', (done) => {
            chai.request(server).delete('/api/issues/test').send({
                _id: test_issue_id
            }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully deleted');
                done();
            });
        });

        // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}.
        it('Delete an issue with invalid _id', (done) => {
            chai.request(server).delete('/api/issues/test').send({
                _id: null
            }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not delete');

                done();
            });
        });

        // Delete an issue with missing _id: DELETE request to /api/issues/{project}        
        // If no _id is sent, the return value is { error: 'missing _id' }
        it('Delete an issue with missing _id', (done) => {
            chai.request(server).delete('/api/issues/test').send({

            }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
        });
    });
});
