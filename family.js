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
          issueUnderControl: issueUnderControl
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
      printfamilyMemberCard(family) //asks front-end to print the cards when another is added

    }) // end of form submit

    let response = await fetch('/.netlify/functions/get_familyMembers')
    let familyMembers = await response.json()
    for (let i = 0; i < familyMembers.length; i++) {
      let familyMemberCard = familyMembers[i]
      console.log(familyMemberCard);
      printFamilyMemberCard(familyMemberCard)
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

async function printFamilyMemberCard(familyMemberCard) {
  console.log("Succesfully called printFamilyMemberCard");
  let familyMemberId = familyMemberCard.id
  document.querySelector(".container-vaccineCard").insertAdjacentHTML("beforeend",
    `
    <div class="vaccineCard px-4 py-4 max-w-xs rounded-xl border shadow-lg my-4 mx-10">
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