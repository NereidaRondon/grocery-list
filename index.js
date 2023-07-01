// firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"



// my playground link
const appSettings = {
  databaseURL: "https://realtimedb-96dcf-default-rtdb.firebaseio.com/"
}

// connects project with database
const app = initializeApp(appSettings);
//used to validate communicatioin
//console.log(app);

const database = getDatabase(app);
//need to create a reference to a location in the database (endpoint)
// arguments(which DB?, name of ref )
const listInDB = ref(database, 'list');


const inputFieldEl = document.getElementById("input-field")
const addBtn = document.getElementById("add-btn")
const list = document.getElementById('list');


//retrieves data from DB
//arguments (where to get the data, function that contains the snapshot)
onValue(listInDB, function(snapshot){

  if (snapshot.exists()) {
    //console.log(snapshot);
    //convert snapshot object to array of values
    let itemsArray = Object.entries(snapshot.val());
    
    clearList();

    for (let i = 0; i < itemsArray.length; i++){
      let currentItem = itemsArray[i];
      // let currentItemId = currentItem[0];
      // let currentItemValue = currentItem[1];
      
      addItemToList(currentItem);
    }
  } else{
    list.innerHTML = 'No items here... yet'
  }  
     
});

// adds items entry to list
addBtn.addEventListener("click", function() {
  let inputValue = inputFieldEl.value
  
  // adds data to DB, arguments(ref, value/String)
  push(listInDB, inputValue);
  console.log(`${inputValue} added to database`);
  
  clearInput();
}); 


function clearInput(){
  inputFieldEl.value = '';
}

function clearList(){
  list.textContent = '';
}

function addItemToList(item){
  let itemId = item[0];
  let itemValue = item[1];

  let li = document.createElement('li');
  li.textContent = itemValue;

  //add li to parent ul element
  list.append(li);
  
  //deletes item from DB when clicked
  li.addEventListener('click', function(){
    console.log("li clicked " + itemId);
      
    let myRef = `list/${itemId}`;
    let deleteItemFromDB = ref(database, myRef);
    //import remove function from firebase
    remove(deleteItemFromDB);
  })
}
