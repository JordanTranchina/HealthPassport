// /.netlify/functions/get_shots
let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  let familyMembersData = []

  let familyMembersQuery = await db.collection('familyMembers').get()            // familyMembers from Firestore
  // .orderBy('created')              // ordered by created
  // .get()

  // add the where query here to filter by user id...I think
  let familyMembers = familyMembersQuery.docs  // the family members documents themselves

  for (let i = 0; i < familyMembers.length; i++) {
    let familyMemberId = familyMembers[i].id                                // the ID for the given family member
    let familyMemberData = familyMembers[i].data()                          // the rest of the family member data

    console.log("called get_familyMembers.js");
    // add a new Object of our own creation to the familyMembersData Array
    familyMembersData.push({
      id: familyMemberId,
      userId: familyMemberData.currentUserId,
      username: familyMemberData.username,
      memberName: familyMemberData.memberName,
      relationship: familyMemberData.relationship,
      age: familyMemberData.age,
      healthIssue: familyMemberData.healthIssue,
      ageWhenDiagnosed: familyMemberData.ageWhenDiagnosed,
      issueUnderControl: familyMemberData.issueUnderControl,
      note: familyMemberData.notes
    })
  }

  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(familyMembersData)
  }

}