firebase.auth().onAuthStateChanged(async function (user) {

  // let db = firebase.firestore()
  // let querySnapshot = await db.collection('shots').get()
  // console.log(querySnapshot.size)

  // let button = document.querySelector(".button")
  // button.addEventListener("click", function (event) {
  //   event.preventDefault()

  //   let comments = document.querySelector("#comments").value
  //   console.log(`my comments are submitted`);
  // })

  document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault()

    let commentsText = document.querySelector('#comments').value

    if (commentsText.length > 0) {
      document.querySelector('.myComments').insertAdjacentHTML('beforeend', `
        <div class="mx-10 my-4 px-4 py-4 max-w-screen-lg my-4">
          ${commentsText}
        </div>
      `)
      document.querySelector('#comments').value = ''

      let docRef = await db.collection('mycomments').add({
        text: commentsText
      })
    }
  })

  let db = firebase.firestore()
  let querySnapshot = await db.collection('mycomments').get()
  let comments = querySnapshot.docs
  for (let i=0; i<comments.length; i++) {
    let commentsId = comments[i].id 
    let commentsData = comments[i].data()
    let commentsText = commentsData.text
    document.querySelector('.myComments').insertAdjacentHTML('beforeend', `
    <div class="mx-10 my-4 px-4 py-4 max-w-screen-lg my-4">
      ${commentsText}
    </div>
  `)
  }
  

  if (user) {
    // Signed in
    // console.log('signed in')

    // Ensure the signed-in user is in the users collection
    db.collection('users').doc(user.uid).set({
      name: user.displayName,
      email: user.email
    })

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
      signInSuccessUrl: 'index.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})
