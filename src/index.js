const theatreId = 699;
//  As a user, when the page loads I should see a list of movie showings fetched from a remote API.


const allMovies = document.querySelector(".ui-cards-showings")
allMovies.classList.add("ui-card-showings")
// const movieTitle = document.createElement("#header-id")
// const movieRuntime = document.createElement(".meta")
// const movieTickets = document.createElement(".description")

function getMovies(){
  fetch('https://evening-plateau-54365.herokuapp.com/theatres/699')
  .then(function(response){
    return response.json()
  })
  .then(function(json){
//i know my css is messed up, i essentially have to add a class to each of the divs that I created in order to get the design aspect of the app
   json.showings.forEach(function(showing){
     const showingsDiv = document.createElement("div")
     showingsDiv.classList.add("showings")
     const cardDiv = document.createElement("div")
     cardDiv.classList.add("card")
     const cardContent = document.createElement("div")
     cardContent.classList.add("content")
     //movie title
      const movieHeader = document.createElement("div")
      movieHeader.classList.add("header")
      movieHeader.innerText = showing.film.title
      cardContent.appendChild(movieHeader)
//movie time
      const movieRuntime = document.createElement("div")
      movieRuntime.classList.add("meta")
      movieRuntime.innerText = showing.film.runtime
      cardContent.appendChild(movieRuntime)
      //movie tickets
      const movieNumTickets = document.createElement("div")
      movieNumTickets.innerText = ((showing.capacity) - (showing.tickets_sold ))

      cardContent.appendChild(movieNumTickets)


      const movieShowtime = document.createElement("div")
      movieShowtime.innerText = showing.showtime
      cardContent.appendChild(movieShowtime)

      const movieExtraContent = document.createElement("div")
      // movieExtraContent.classList.add("extra content")
      const movieButton = document.createElement("button")
      movieButton.classList.add("btn")
      movieButton.innerText = "Buy Ticket"
      movieButton.dataset.id = showing.id
      // console.log(movieButton.dataset.id )
      cardContent.appendChild(movieButton)
      movieButton.addEventListener("click", function(e){
        if (movieNumTickets.innerText > 0){
          fetch(`https://evening-plateau-54365.herokuapp.com/tickets`, {
            method: "POST",
            headers: {
              'Content-Type':'application/json',
              'Accept' : 'application/json'
            },
            body: JSON.stringify({
              showing_id: movieButton.dataset.id
            })
          })
          .then(function(response){
           return response.json()
          })
          .then(function(json){
          console.log(json)
        })
        } else
        {
          movieButton.innerText = "Sold Out",
          showingsDiv.querySelector(".btn").disabled = true;

      }
      }) //end of event listener

      cardDiv.appendChild(cardContent)
      showingsDiv.appendChild(cardDiv)
      allMovies.appendChild(showingsDiv)
    })
})
} //end

getMovies()


//* As a user, clicking on the 'Buy Ticket' button should purchase a ticket and decrement the remaining tickets by one. This information should be persisted in the remote API.

 //
