firebase.auth().onAuthStateChanged(async function (user) {

  if (user) {
    // Signed in
    console.log('signed in')

    // I wonder if this is necessary
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
    // show user's name in hello message
    let name = firebase.auth().currentUser.displayName
    console.log(name);
    document.querySelector(".welcome-text").insertAdjacentHTML("beforeend", `
      <h1 class="welcome-text text-3xl md:text-5xl p-10 text-grey-darker">Welcome Back ${name}! How do you feel today?</h1>
    `)

    // Listen for the form submit and create/render the index card
    document.querySelector("form").addEventListener("submit", async function (event) {
      event.preventDefault()

      // checkupDate
      // height
      // weight
      // bloodPressure
      // restingHeartRate
      // notes
      // myComments

      // declare variables
      let username = user.displayName
      let currentUserId = firebase.auth().currentUser.uid

      // checkupDate
      let checkupDate = document.querySelector("#checkupDate").value
      console.log(`checkup date is ${checkupDate}`);

      // height
      let height = document.querySelector("#height").value
      console.log(`height is ${height}`);

      // weight
      let weight = document.querySelector("#weight").value
      console.log(`weight is ${weight}`);

      // bloodPressure
      let bloodPressure = document.querySelector("#bloodPressure").value
      console.log(`blood pressure is ${bloodPressure}`);

      // restingHeartRate
      let restingHeartRate = document.querySelector("#restingHeartRate").value
      console.log(`resting heart rate is ${restingHeartRate}`);

      // notes
      let notes = document.querySelector("#notes").value
      console.log(`notes are ${notes}`);

      // myComments
      let myComments = document.querySelector("#myComments").value
      console.log(`My comments are ${myComments}`);

      let response = await fetch("/.netlify/functions/create_healthRecord", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          currentUserId: currentUserId,
          checkupDate: checkupDate,
          height: height,
          weight: weight,
          bloodPressure: bloodPressure,
          restingHeartRate: restingHeartRate,
          notes: notes,
          myComments: myComments,
        })
      }) //end of response from creation


      // printFamilyMemberCard(familyMemberCard) //asks front-end to print the cards when another is added

      let indexCard = await response.json()
      console.log(response);  // repeating back what we just sent to the backend
      console.log(indexCard);

      // clearing form values on frontend
      document.querySelector('#checkupDate').value = ''
      document.querySelector('#height').value = ''
      document.querySelector('#weight ').value = ''
      document.querySelector('#bloodPressure').value = ''
      document.querySelector('#restingHeartRate').value = ''
      document.querySelector('#notes').value = ''
      document.querySelector('#myComments').value = ''
      printIndexCard(indexCard) //asks front-end to print the card we just sent
    }) // end of form submit

    let response = await fetch('/.netlify/functions/get_healthRecords')
    let health = await response.json()
    console.log(health)

    for (let i = 0; i < health.length; i++) {
      healthCard = health[i]
      // check below line for consistency of name variable
      if (healthCard.healthUsername == user.displayName) {
        console.log('it works!')
        let indexCard = healthCard
        console.log(indexCard)
        printindexCard(indexCard)
      }
    }

  } else {
    // Signed out
    console.log('signed out')
    //hiding body elements when signed out
    document.querySelector('.navigation').classList.add('hidden')
    document.querySelector('.header').classList.add('hidden')
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

async function printIndexCard(indexCard) {
  console.log("Succesfully called printVaccineCard");
  let indexCardId = indexCard.id
  document.querySelector(".container-homeCards").insertAdjacentHTML("beforeend",
    `
  <div class="homeCard mx-10 my-2 px-4 py-2 max-w-screen-lg rounded-xl border shadow-lg my-4" id="homeCard-1">
  <h3 class="font-bold text-grey-darker pb-2">Checkup on ${checkupDate}</h3> 
  <div class="header border-t pt-4 border-gray-300">
    <div class="md:flex">
      <div class="home-card-left space-y-2 md:w-1/3 pb-2 md:pb-0">
        <div class="card-feature-height flex">
          <div class="w-1/2 text-grey-darker text-left">Height</div>
          <div class="w-1/2 text-grey-darker text-right pr-4">${height}</div>
        </div>
        <div class="card-feature-weight flex">
          <div class="w-1/2 text-grey-darker text-left">Weight</div>
          <div class="w-1/2 text-grey-darker text-right pr-4">${weight}</div> 
        </div>
        <div class="card-feature-blood-pressure flex">
          <div class="w-1/2 text-grey-darker text-left">Blood Pressure</div>
          <div class="w-1/2 text-grey-darker text-right pr-4">${bloodPressure}</div> 
        </div>
        <div class="card-feature-resting-heart-rate flex">
          <div class="w-1/2 text-grey-darker text-left">Resting Heart Rate</div>
          <div class="w-1/2 text-grey-darker text-right pr-4">${restingHeartRate}</div> 
        </div>
      </div>
      <div
        class="home-card-right space-y-2 pt-2 md:pt-0 md:w-2/3 border-t md:border-t-0 md:border-l border-gray-300 md:px-4">
        <div class="text-grey-darker">Notes:</div>
        <div class="text-grey-darker">${notes}</div>
        <div class="text-grey-darker">My Comments:</div>
        <div class="text-grey-darker">${myComments}</div>
      </div>
    </div>
  </div>
</div>
  `
  )
}