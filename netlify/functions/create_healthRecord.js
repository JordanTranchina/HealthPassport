// /.netlify/functions/create_healthRecords
let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)

  let currentUserId = body.currentUserId
  let username = body.username
  let checkupDate = body.checkupDate
  let height = body.height
  let weight = body.weight
  let bloodPressure = body.bloodPressure
  let restingHeartRate = body.restingHeartRate
  let notes = body.notes
  let myComments = body.myComments

  // let createdTimestamp = firebase.firstore.FieldValue.serverTimestamp()

  console.log("Successful call of create_healthRecord.js");
  console.log(`currentUserId is ${currentUserId}`);
  console.log(`weight is ${weight}`);


  let healthRecord = {
    userId: currentUserId,
    username: username,
    checkupDate: checkupDate,
    height: height,
    weight: weight,
    bloodPressure: bloodPressure,
    restingHeartRate: restingHeartRate,
    notes: notes,
    myComments: myComments
    // created: createdTimestamp
  }

  // pushing and defining the new post from the database at same time 
  let newHealthRecord = await db.collection("healthRecords").add(healthRecord)
  console.log(newHealthRecord);

  // asking newHealthRecord what it's id is
  console.log(newHealthRecord.id);

  // setting id of API healthRecord to id of healthRecord in firestore
  healthRecord.id = newHealthRecord.id

  return {
    statusCode: 200,
    body: JSON.stringify(healthRecord)
  }
}