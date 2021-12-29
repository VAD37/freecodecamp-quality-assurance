'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

var uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true });

// Each project will be a new collection in the database
// It is simple this way because we can search issue by ID using database API and not custom JS array.
// It was too difficult to create multiple filter with subdocuments.
// The mongoose doc only support search ID for DocumentArray and no filter function.
const IssueSchema = new mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: String,
  status_text: String,
  open: Boolean,
  created_on: Date,
  updated_on: Date,
});

function GetProjectIssueModel(project_name) {
  const collection_name = project_name + "_issues";
  return mongoose.model(collection_name, IssueSchema);
}

async function PostNewIssue(req, res) {
  let projectName = req.params.project;
  // Get project from mongoose database. If not exist then create one  
  const IssueModel = GetProjectIssueModel(projectName);

  // If missing title or text or created by then send error
  if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
    res.json({
      "error": "required field(s) missing"
    });
    return;
  }

  let current_time = Date.now();
  const newIssue = new IssueModel({
    assigned_to: req.body.assigned_to || "",
    status_text: req.body.status_text || "",
    open: true,
    issue_title: req.body.issue_title,
    issue_text: req.body.issue_text,
    created_by: req.body.created_by,
    created_on: current_time,
    updated_on: current_time,
  });

  await newIssue.save();
  res.send(newIssue);
}

async function GetIssues(req, res) {
  let projectName = req.params.project;
  const IssueModel = GetProjectIssueModel(projectName);

  // Find issues based on query object values
  let filter = req.query;
  let result = await IssueModel.find(filter);
  res.send(result);
}


module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(GetIssues)
    .post(PostNewIssue)
    .put(UpdateIssue)
    .delete(DeleteIssue);
};

function UpdateIssue(req, res) {
  let projectName = req.params.project;

  let _id = req.body._id;
  if (_id === undefined) {
    res.json({
      "error": "missing _id"
    });
    return;
  }
  else if (Object.keys(req.body).length <= 1) {
    res.json({
      _id: _id,
      "error": "no update field(s) sent"
    });
    return;
  }
  req.body.updated_on = Date.now();
  const IssueModel = GetProjectIssueModel(projectName);
  IssueModel.findByIdAndUpdate(_id, req.body, (err, issue) => {
    if (err || issue === null) {
      res.json({
        _id: _id,
        "error": "could not update"
      });
    }
    else {
      res.json({
        _id: _id,
        "result": "successfully updated"
      });
    }
  });
}


async function DeleteIssue(req, res) {
  let projectName = req.params.project;
  let _id = req.body._id;
  if (_id === undefined) {
    res.json({
      "error": "missing _id"
    });
    return;
  }

  const IssueModel = GetProjectIssueModel(projectName);
  // delete issue from array
  IssueModel.findByIdAndDelete(_id, (err, issue) => {    
    if (err || issue === null) {
      res.json({
        _id: _id,
        "error": "could not delete"
      });
    }
    else {
      res.json({
        _id: _id,
        "result": "successfully deleted"
      });
    }
  });
}