firebase.auth().onAuthStateChanged(async function (user) {

  // let db = firebase.firestore()
  // let querySnapshot = await db.collection('shots').get()
  // console.log(querySnapshot.size)

  if (user) {
    // Signed in
    console.log('signed in')

    let db = firebase.firestore()
    db.collection('users').doc(user.uid).set({
      name: user.displayName,
      email: user.email
      })

    const logout = document.querySelector('#sign-in-or-sign-out');
    logout.addEventListener('click', (event) => {
      event.preventDefault();
      firebase.auth().signOut()
      console.log("logging out!");
      document.location.href = 'index.html'
    })


    
      
    
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
      // clear values
      document.querySelector('#shotName').value = ''
      document.querySelector('#dateInitial').value = ''
      document.querySelector('#dateBooster1 ').value = ''
      document.querySelector('#dateBooster2').value = ''
      printVaccineCard(vaccineCard) //asks front-end to print the cards when another is added





      })

 // end of form submit

    let response = await fetch('/.netlify/functions/get_shots')
    let shots = await response.json()
    console.log(shots)

    for (let i = 0; i < shots.length; i++) {
      shot = shots[i]
      if (shot.shotUsername == user.displayName) {
        console.log('it works!')
        
      }      
    }

    let querySnapshot = await db.collection('shots').where('userId', '==', user.uid).get()
    console.log(`Number to todos in collection: ${querySnapshot.size}`)
    console.log(querySnapshot)

    let butter = querySnapshot.docs
    console.log(butter)
    for (let i=0; i<butter.length; i++) {
      let butterId = butter[i].id
      let buttery = butter[i].data()
      console.log(buttery)
      let butterText = butter.text
    }
    for (let i = 0; i < shots.length; i++) {
      let vaccineCard = shots[i]
      console.log(vaccineCard);
      printVaccineCard(vaccineCard)
    }
    
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

async function printVaccineCard(vaccineCard) {
  console.log("Succesfully called printVaccineCard");
  let shotId = vaccineCard.id
  document.querySelector(".container-vaccineCards").insertAdjacentHTML("beforeend",
    `
    <div class="vaccineCard px-4 py-2 max-w-xs rounded-xl border shadow-lg my-4 mx-10">
      <div class="shot-name font-bold text-xl mb-2">${vaccineCard.shotName}</div>
      <div class="shots space-y-2 border-t pt-4 border-gray-300">
        <div class="shots-row-1 flex">
          <p class="w-1/2 text-grey-darker text-left">Initial</p>
          <p class="w-1/2 text-grey-darker text-right">${vaccineCard.dateInitial}</p>
        </div>
        <div class="shots-row-2 flex">
          <p class="w-1/2 text-grey-darker text-left">Booster 1</p>
          <p class="w-1/2 text-grey-darker text-right">${vaccineCard.dateBooster1}</p>
        </div>
        <div class="shots-row-3 flex">
          <p class="w-1/2 text-grey-darker text-left">Booster 2</p>
          <p class="w-1/2 text-grey-darker text-right">${vaccineCard.dateBooster2}</p>
        </div>
      </div>
    </div>
    `
  )
}