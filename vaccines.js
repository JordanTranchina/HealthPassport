firebase.auth().onAuthStateChanged(async function (user) {

  // let db = firebase.firestore()
  // let querySnapshot = await db.collection('shots').get()
  // console.log(querySnapshot.size)

  if (user) {
    // Signed in
    console.log('signed in')

    // Listen for the form submit and create/render the vaccine card
    document.querySelector("form").addEventListener("submit", async function (event) {
      event.preventDefault()

      // declare variables
      let shotUsername = user.displayName
      let currentUserId = firebase.auth().currentUser.uid
      // shotname
      let shotName = document.querySelector("#shotName").value
      console.log(`the Shot Name is ${shotName}`);

      // dateInitial
      let dateInitial = document.querySelector("#dateInitial").value
      console.log(`the Initial shot date is ${dateInitial}`);

      // dateBooster1
      let dateBooster1 = document.querySelector("#dateBooster1").value
      console.log(`the Booster 1 shot date is ${dateBooster1}`);

      // dateBooster2
      let dateBooster2 = document.querySelector("#dateBooster2").value
      console.log(`the Booster 2 shot date is ${dateBooster2}`);

      let response = await fetch("/.netlify/functions/create_shot", {
        method: "POST",
        body: JSON.stringify({
          currentUserId: currentUserId,
          shotUsername: shotUsername,
          shotName: shotName,
          dateInitial: dateInitial,
          dateBooster1: dateBooster1,
          dateBooster2: dateBooster2
        })
      }) //end of response

      let vaccineCard = await response.json()
      console.log(response);
      console.log(vaccineCard);

    }) // end of sign in

  } else {
    // Signed out
    console.log('signed out')

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'vaccines.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})
