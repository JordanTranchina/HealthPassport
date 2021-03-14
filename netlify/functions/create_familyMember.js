// /.netlify/functions/create_familyMembers
let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)

  let currentUserId = body.currentUserId
  let username = body.username

  let memberName = body.memberName
  let relationship = body.relationship
  let age = body.age
  let healthIssue = body.healthIssue
  let ageWhenDiagnosed = body.ageWhenDiagnosed
  let issueUnderControl = body.issueUnderControl
  let notes = body.notes
  // let createdTimestamp = firebase.firstore.FieldValue.serverTimestamp()

  console.log("Successfully called create_familyMember.js");
  console.log(`currentUserId is ${currentUserId}`);
  console.log(`memberName is ${memberName}`);

  let familyMember = {
    userId: currentUserId,
    username: username,
    memberName: memberName,
    relationship: relationship,
    age: age,
    healthIssue: healthIssue,
    ageWhenDiagnosed: ageWhenDiagnosed,
    issueUnderControl: issueUnderControl,
    notes: notes
    // created: createdTimestamp
  }

  // pushing and defining the new post from the database at same time 
  let newFamilyMember = await db.collection("familyMembers").add(familyMember)
  console.log(newFamilyMember);

  // asking newFamilyMember what it's id is
  console.log(newFamilyMember.id);

  // setting id of API shot to id of shot in firestore
  familyMember.id = newFamilyMember.id

  return {
    statusCode: 200,
    body: JSON.stringify(familyMember)
  }
}