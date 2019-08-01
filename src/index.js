const theatreId = 700;


// Not sure why cards not displaying.




// As a user, when the page loads I should see a list of 
// movie showings fetched from a remote API.



// As a user I should not be able to purchase a ticket 
// for a sold out showing. The 'Buy Ticket' button should 
// be disabled on sold out showings, and the text should
//  change to "sold out".

// https://evening-plateau-54365.herokuapp.com/

//const showingsDiv = document.getElementsByClassName("ui cards showings")
const showingsDiv = document.getElementById("allCards")

console.log(showingsDiv)

function getShowings(){
    fetch(`https://evening-plateau-54365.herokuapp.com/theatres/${theatreId}`)
    .then( function(res){
        return res.json()
    }).then( function(res){
        console.log(res["showings"])
        res["showings"].forEach(element => {
            createListing(element)
        })
    })
}

function createListing(movie){
    let cardDiv = document.createElement("DIV")

    let cardContent = document.createElement("DIV")
    cardContent.classList.add("content")
    let cardHeader = document.createElement("DIV")
    cardHeader.classList.add("content")
    let cardRuntime = document.createElement("DIV")
    cardRuntime.classList.add("meta")
    let cardDescription = document.createElement("DIV")
    cardDescription.classList.add("description")
    cardDescription.id = `tixrem${movie["id"]}`
    let cardUiLabel = document.createElement("SPAN")
    cardUiLabel.classList.add("uilabel")

    let cardExtraContent = document.createElement("DIV")
    cardExtraContent.classList.add("extracontent")
    let cardBuyButtonDiv = document.createElement("DIV")
    cardBuyButtonDiv.classList.add("uibluebutton")
    cardBuyButtonDiv.innerText = "Buy Ticket"


    cardHeader.innerText = movie["film"]["title"]
    cardRuntime.innerText = movie["film"]["runtime"] + " minutes"
    cardUiLabel.innerText = movie["showtime"]


    cardDiv.id = `filmId${movie["id"]}`
    cardExtraContent.dataset.capacity = movie["capacity"]
    // console.log ("cpa ln 62 -- ", movie["capacity"] )  OK 
    cardExtraContent.dataset.sold = movie["tickets_sold"]
    
    cardBuyButtonDiv.id = `buyId${movie["id"]}`
    let cap1 = cardExtraContent.dataset.capacity
    let soldT1 = cardExtraContent.dataset.sold
    let avail1 = (cap1 - soldT1)                    //OK 
    // console.log("AVIAL here", avail1)            //OK 
    cardDescription.innerText =  avail1 + " Tickets Remaining"

    cardDiv.appendChild(cardContent);
    cardDiv.appendChild(cardExtraContent);

    cardContent.appendChild(cardHeader)
    cardContent.appendChild(cardRuntime)
    cardContent.appendChild(cardDescription)
    cardContent.appendChild(cardUiLabel)

    cardExtraContent.appendChild(cardBuyButtonDiv)

    showingsDiv.appendChild(cardDiv)
    addInitListeners(cardBuyButtonDiv)
}


function addInitListeners(cardBuyButtonDiv){
    cardBuyButtonDiv.addEventListener("click", function(e){
        console.log ("e.targer is ", e.target)
        
        
        
        
        //let movieId = cardBuyButtonDiv.parentElement//.id.slice(5)
        let movieId = e.target.id.slice(5)
        let buyBtnDiv = document.getElementById(`buyId${movieId}`)

        let cap = cardBuyButtonDiv.parentElement.dataset.capacity
        let soldT = parseInt(cardBuyButtonDiv.parentElement.dataset.sold) // getting wrong sold # after click btn
        // DATA TYPE ISSUES??? ^^^ 
        console.log("soldT  here .. ", soldT )             //OK 

        let newSold = soldT + 1
        console.log("new sold--- ", newSold)

        let avail = (cap - soldT)
        console.log(" ln 95 avail tix: ", avail)
        if(avail < 1){
            alert("Sold out!")
            buyBtnDiv.innerText = "Sold OUT"
        } else {
            // persist sale to DB  POST 

            //  
            sellTicket(movieId)
            cardBuyButtonDiv.parentElement.dataset.sold = newSold
            console.log("soldT line 103", soldT)                     //OK 
        }
    })
}


function sellTicket(movieId){
    console.log(movieId)
    let buyBtnDiv = document.getElementById(`buyId${movieId}`)
    // console.log("buyBtnDiv-- ", buyBtnDiv)
    let tixRem = document.getElementById(`tixrem${movieId}`);
    // console.log (" tixRem", tixRem)

    let capac = buyBtnDiv.parentElement.dataset.capacity
    console.log(capac) // OK
    let soldTix = buyBtnDiv.parentElement.dataset.sold
    console.log(soldTix)  // OK
    let availT = capac - soldTix
    // if(availT == 0 ){
    //     buyBtnDiv.innerText = "Sold Out!"
    // }

    fetch(`https://evening-plateau-54365.herokuapp.com/tickets`, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json'
          },
        method: 'POST',

        body: JSON.stringify({
            showing_id: movieId
          })

    }).then( function(res){
        return res.json()
    }).then( function(res){
        console.log(res)
        if(res["error"]){
            // DID NOT TEST aLL THIS 
            console.log("ERROR MSG")
            buyBtnDiv.parentElement.dataset.sold = buyBtnDiv.parentElement.dataset.capacity
            tixRem.innerText = "No Tickets!"  
            buyBtnDiv.removeEventListener()
            buyBtnDiv.innerText = "Sold Out"  
        } else {
            tixRem.innerText =  (availT-1) + " Tickets Remaining"
            console.log("Cap", buyBtnDiv.parentElement.dataset.capacity) 
            console.log("Sold", buyBtnDiv.parentElement.dataset.sold)  // Keep getting 81, 61.. 
                            // Is wrong after button clicked. 
        }

    }) 
}




// As a user, clicking on the 'Buy Ticket' button 
// should purchase a ticket and decrement the remaining tickets
//  by one. This information should be persisted in the remote
//  API.



/* <div class="card">

  <div class="content">  x

    <div class="header">   x
      (Film Title)
    </div>

    <div class="meta">
      (Runtime) minutes
    </div>

    <div class="description">
      (Num Tickets) remaining tickets
    </div>

    <span class="ui label">
      (Showtime)
    </span>

  </div>

  <div class="extra content">
    <div class="ui blue button">Buy Ticket</div>
  </div>

</div> */



getShowings();