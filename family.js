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

    // Listen for the form submit and create/render the vaccine card
    document.querySelector("form").addEventListener("submit", async function (event) {
      event.preventDefault()

      // declare variables
      let username = user.displayName
      let currentUserId = firebase.auth().currentUser.uid

      // memberName
      let memberName = document.querySelector("#memberName").value
      console.log(`the family member name is ${memberName}`);

      // relationship
      let relationship = document.querySelector("#relationship").value
      console.log(`the relationship is ${relationship}`);

      // age
      let age = document.querySelector("#age").value
      console.log(`the age is ${age}`);

      // healthIssue
      let healthIssue = document.querySelector("#healthIssue").value
      console.log(`the health issue ${healthIssue}`);

      // ageWhenDiagnosed
      let ageWhenDiagnosed = document.querySelector("#ageWhenDiagnosed").value
      console.log(`the age when diagnosed is ${ageWhenDiagnosed}`);

      // issueUnderControl
      let issueUnderControl = document.querySelector("#issueUnderControl").value
      console.log(`the issueUnderControl value is ${issueUnderControl}`);

      // notes
      let notes = document.querySelector("#notes").value
      console.log(`the notes are ${notes}`);

      let response = await fetch("/.netlify/functions/create_familyMember", {
        method: "POST",
        body: JSON.stringify({
          currentUserId: currentUserId,
          username: username,
          memberName: memberName,
          relationship: relationship,
          age: age,
          healthIssue: healthIssue,
          ageWhenDiagnosed: ageWhenDiagnosed,
          issueUnderControl: issueUnderControl,
          notes: notes
        })
      }) //end of response
      let familyMemberCard = await response.json()
      // repeating back what we just sent to the backend
      console.log(response);
      console.log(familyMemberCard);
      // clearing form values on frontend
      document.querySelector('#memberName').value = ''
      document.querySelector('#relationship').value = ''
      document.querySelector('#age').value = ''
      document.querySelector('#healthIssue').value = ''
      document.querySelector('#ageWhenDiagnosed').value = ''
      document.querySelector('#issueUnderControl').value = ''
      document.querySelector('#notes').value = ''

      printFamilyMemberCard(familyMemberCard) //asks front-end to print the cards when another is added

    }) // end of form submit

    let response = await fetch('/.netlify/functions/get_familyMembers')
    let familyMembers = await response.json()
    console.log(familyMembers)

    for (let i = 0; i < familyMembers.length; i++) {
      fam = familyMembers[i]
      console.log(history)
      if (fam.username == user.displayName) {
        console.log('it works!')
        let familyMemberCard = fam
        console.log(familyMemberCard)
        printFamilyMemberCard(familyMemberCard)
      }

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
      signInSuccessUrl: 'family.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})

async function printFamilyMemberCard(familyMemberCard) {
  console.log("Successfully called printFamilyMemberCard");
  let familyMemberId = familyMemberCard.id
  document.querySelector(".container-familyCards").insertAdjacentHTML("beforeend",
    `
    <div class="familyCard mx-10 my-4 px-4 py-2 max-w-screen-lg rounded-xl border shadow-lg my-4">
      <div class="name-and-relationship font-bold text-grey-darker pb-2">${familyMemberCard.memberName} - ${familyMemberCard.relationship}</div>
      <div class="divider-horizontal border-t pt-2 border-gray-300">
        <div class="container-familyData md:flex">
          <div class="card-left space-y-2 md:w-1/3 pb-2 md:pb-0">
            <div class="flex">
              <p class="w-1/2 text-grey-darker text-left">Age</p>
              <p class="w-1/2 text-grey-darker text-right pr-4">${familyMemberCard.age}</p>
            </div>
            <div class="container-healthIssue">
              <div class="healthIssue-row-1 flex">
                <p class="w-1/2 text-grey-darker text-left">Health Issue</p>
                <p class="w-1/2 text-grey-darker text-right pr-4">${familyMemberCard.healthIssue}</p>
              </div>
              <div class="ageWhenDiagnosed flex">
                <p class="w-1/2 pl-2 text-grey-darker text-left">Age when Diagnosed</p>
                <p class="w-1/2 text-grey-darker text-right pr-4">${familyMemberCard.ageWhenDiagnosed}</p>
              </div>
              <div class="issueUnderControl flex">
                <p class="w-1/2 pl-2 text-grey-darker text-left">Issue under Control?</p>
                <p class="w-1/2 text-grey-darker text-right pr-4">${familyMemberCard.issueUnderControl}</p>
              </div>
            </div>
          </div>
          <div class="card-right notes space-y-2 pt-2 md:pt-0 md:w-2/3 border-t md:border-t-0 md:border-l border-gray-300 md:px-4">
            <p class="text-grey-darker text-left">Notes:</p>
            <p class="text-grey-darker text-left">${familyMemberCard.notes}</p>
          </div>
        </div>
      </div>
    </div>
    `
  )
}