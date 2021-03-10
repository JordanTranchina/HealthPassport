// /.netlify/functions/get_shots
let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  let shotsData = []

  let shotsQuery = await db.collection('shots').get()            // shots from Firestore
  // .orderBy('created')              // ordered by created
  // .get()

  // add the where query here to filter by user id...I think
  let shots = shotsQuery.docs  // the shot documents themselves

  for (let i = 0; i < shots.length; i++) {
    let shotId = shots[i].id                                // the ID for the given shot
    let shotData = shots[i].data()                          // the rest of the shot data

    // add a new Object of our own creation to the shotsData Array
    shotsData.push({
      id: shotId,
      currentUserId: shotData.currentUserId,
      shotUsername: shotData.shotUsername,
      shotName: shotData.shotName,
      dateInitial: shotData.dateInitial,
      dateBooster1: shotData.dateBooster1,
      dateBooster2: shotData.dateBooster2
    })
  }

  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(shotsData)
  }

}