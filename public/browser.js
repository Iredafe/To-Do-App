
document.addEventListener("click", function(e){

//delete feature
if (e.target.classList.contains("delete-me")){

    if(confirm("Do you really want to permanently delete this item?")){
        axios.post('/delete-item', {id:e.target.getAttribute("data-id")}).then(function(){
            e.target.parentElement.parentElement.remove()
                   }).catch(function(){
            
                    console.log("Please try again later")
                   })
    
    }
}

    //update feature
 if (e.target.classList.contains("edit-me")){

       let userInput = prompt("Enter your desired new text", 
/*make the previous user input come up when the edit button is clicked */
       e.target.parentElement.parentElement.querySelector(".item-text").innerHTML )

 /*send quick post request to the server using axios API
*NOTE: use if statement to make sure that a request is only sent 
*if there is a user input */

if (userInput){
        axios.post('/update-item', {text : userInput, id:e.target.getAttribute("data-id")}).then(function(){
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML =userInput
                   }).catch(function(){
            
                    console.log("Please try again later")
                   })
    }

    }
})