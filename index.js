firebase.auth().onAuthStateChanged(async function (user) {


  if (user) {
    // Signed in
    console.log('signed in')

    const logout = document.querySelector('#sign-in-or-sign-out');
    logout.addEventListener('click', (event) => {
      event.preventDefault();
      firebase.auth().signOut()
      console.log("logging out!");
      document.location.href = 'index.html'
      //   })


      // ORIGINAL FIREBASE AUTH LOGOUT
      // document.querySelector('.sign-out').addEventListener('click', function (event) {
      //   event.preventDefault()
      //   firebase.auth().signOut()
      //   console.log("logging out!");
      //   document.location.href = 'index.html'



      // document.querySelector('.sign-in-or-sign-out-button').addEventListener('click', function (event) {
      //   event.preventDefault()
      //   firebase.auth().signOut()
      //   document.location.href = 'index.html'
    })

    // show user's name in hello message
    let name = firebase.auth().currentUser.displayName
    console.log(name);
    document.querySelector(".welcome-text").insertAdjacentHTML("beforeend", `
      <h1 class="welcome-text text-3xl md:text-5xl p-10 text-grey-darker">Welcome Back ${name}! How do you feel today?</h1>
    `)



  } else {
    //need to hide the rest of this form
    document.querySelector('form').classList.add('hidden')
    document.querySelector('.container-homeCards').classList.add('hidden')
    document.querySelector('.healthRecordInputForm').classList.add('hidden')

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'index.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})
