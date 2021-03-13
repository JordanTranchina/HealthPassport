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
    })
    // show user's name in hello message
    let name = firebase.auth().currentUser.displayName
    console.log(name);
    document.querySelector(".welcome-text").insertAdjacentHTML("beforeend", `
      <h1 class="welcome-text text-3xl md:text-5xl p-10 text-grey-darker">Welcome Back ${name}! How do you feel today?</h1>
    `)

    // Listen for the form submit and create/render the vaccine card
    document.querySelector("form").addEventListener("submit", async function (event) {
      event.preventDefault()

      checkupDate
      height
      weight
      bloodPressure
      restingHeartRate
      notes
      myComments

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
      }) //end of response

      // let familyMemberCard = await response.json()
      // // repeating back what we just sent to the backend
      // console.log(response);
      // console.log(familyMemberCard);
      // // clearing form values on frontend
      // document.querySelector('#memberName').value = ''
      // document.querySelector('#relationship').value = ''
      // document.querySelector('#age').value = ''
      // document.querySelector('#healthIssue').value = ''
      // document.querySelector('#ageWhenDiagnosed').value = ''
      // document.querySelector('#issueUnderControl').value = ''
      // document.querySelector('#notes').value = ''

      // printFamilyMemberCard(familyMemberCard) //asks front-end to print the cards when another is added

    }) // end of form submit


  } else {
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
