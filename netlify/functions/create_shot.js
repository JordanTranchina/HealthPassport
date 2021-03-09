// /.netlify/functions/create_shot
let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  let currentUserId = body.currentUserId
  let shotUsername = body.shotUsername
  let shotName = body.shotName
  let dateInitial = body.dateInitial
  let dateBooster1 = body.dateBooster1
  let dateBooster2 = body.dateBooster2
  // let createdTimestamp = firebase.firstore.FieldValue.serverTimestamp()

  console.log(`currentUserId is ${currentUserId}`);
  console.log(`shotName is ${shotName}`);

  let shot = {
    userId: currentUserId,
    shotUsername: shotUsername,
    shotName: shotName,
    dateInitial: dateInitial,
    dateBooster1: dateBooster1,
    dateBooster2: dateBooster2,
    // created: createdTimestamp
  }

  // pushing and defining the new post from the database at same time 
  let newShot = await db.collection("shots").add(shot)
  console.log(newShot);

  // asking newShot what it's id is
  console.log(newShot.id);

  // setting id of API shot to id of shot in firestore
  shot.id = newShot.id

  return {
    statusCode: 200,
    body: JSON.stringify(shot)
  }
}