firebase.auth().onAuthStateChanged(async function (user) {

  let db = firebase.firestore()
  let querySnapshot = await db.collection('shots').get()
  console.log(querySnapshot.size)

  let button = document.querySelector(".button")
  button.addEventListener("click", function (event) {
    event.preventDefault()

    // listen for values

    // shotname
    let shotName = document.querySelector("#shotName").value
    console.log(`the Shot Name is ${shotName}`);

    // dateInitial
    let dateInitial = document.querySelector("#dateInitial").value
    console.log(`the Initial shot date is ${dateInitial}`);

    // dateBooster1
    let dateBooster1 = document.querySelector("#dateBooster1").value
    console.log(`the Booster 1 shot date is ${dateBooster1}`);

    // dateBooster1
    let dateBooster2 = document.querySelector("#dateBooster2").value
    console.log(`the Booster 1 shot date is ${dateBooster2}`);
  })

  if (user) {
    // Signed in
    console.log('signed in')
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
