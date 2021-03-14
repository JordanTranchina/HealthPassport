// /.netlify/functions/get_shots
let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  let healthRecordsData = []

  let healthRecordsQuery = await db.collection('healthRecords').get()            // healthRecords from Firestore
  // .orderBy('created')              // ordered by created
  // .get()

  // add the where query here to filter by user id...I think
  let healthRecords = healthRecordsQuery.docs  // the family members documents themselves

  for (let i = 0; i < healthRecords.length; i++) {
    let healthRecordId = healthRecords[i].id                                // the ID for the given family member
    let healthRecordData = healthRecords[i].data()                          // the rest of the family member data

    console.log("called get_healthRecords.js");
    // add a new Object of our own creation to the healthRecordsData Array
    healthRecordsData.push({
      id: healthRecordId,
      userId: healthRecordData.currentUserId,
      username: healthRecordData.username,
      currentUserId: healthRecordData.currentUserId,
      checkupDate: healthRecordData.checkupDate,
      height: healthRecordData.height,
      weight: healthRecordData.weight,
      bloodPressure: healthRecordData.bloodPressure,
      restingHeartRate: healthRecordData.restingHeartRate,
      notes: healthRecordData.notes,
      myComments: healthRecordData.myComments,
    })
  }

  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(healthRecordsData)
  }

}