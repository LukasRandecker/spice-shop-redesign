
//Popup management
document.addEventListener("DOMContentLoaded", function() {

  document.getElementById("reg_Button").onclick =function(){
    openRegPopup(); 
  };

  document.getElementById("login_Button").onclick =function(){
    if(document.getElementById("login_Button").innerText=="Login"){
      openLogPopup(); 
    }
    else 
      deleteCookie();
  }; 
});  

//DOM 
function buildRegPopup(){
  let mainContainer=document.getElementById("regPopup"); 
  mainContainer.innerText=""; 
  let newContent=document.createElement("div");
  newContent.innerHTML = `<span class="close" onclick="closePopup()">&times;</span>
  <div class="formHeader">
      <h1>Registration</h1>
      <button  onclick="openLogPopup()" class="popupButton"><h2> zum Login</h2></button>
  </div> 
  <form action="index.html" method="post">
      <input type="hidden" name="formType" value="formReg">
      <select name="anrede" required>
          <option value="Herr">Herr</option>
          <option value="Frau">Frau</option>
          <option value="Divers">Divers</option>
      </select>
      <input type="text" name="first_name" placeholder="Vorname" required>
      <input type="text" name="last_name" placeholder="Nachname" required>
      <input type="text" name="street" placeholder="Straße" required>
      <input type="number" name="house_number" placeholder="Hausnummer" required>
      <input type="text" name="plz" placeholder="PLZ" required>
      <input type="text" name="city" placeholder="Stadt" required>
      <input type="email" name="email" placeholder="E-Mail" required>
      <input type="password" name="password" placeholder="Passwort" required>
      <input type="submit" value="Registrieren">
  </form>`
  mainContainer.appendChild(newContent); 
}

function buildLoginPopup(){
  let mainContainer=document.getElementById("loginPopup"); 
  mainContainer.innerText=""; 
  let newContent=document.createElement("div");
  newContent.innerHTML = `
  <span class="close" onclick="closePopup()">&times;</span>
  <div class="formHeader">
      <h1>Login</h1>
      <button onclick="openRegPopup()" class="popupButton"><h2> zum Registrieren</h2></button>
  </div> 
  <form action="index.html" method="post">
      <input type="hidden" name="formType" value="formLogin">
      <input type="email" name="mail" placeholder="E-Mail" required>
      <input type="password" name="password" placeholder="Passwort" required>
      <input type="submit" value="Login" >
  </form>`
  mainContainer.appendChild(newContent); 
}

function openRegPopup(){
  buildRegPopup(); 
  closePopup(); 
  addfilter(); 
  document.getElementById("regPopup").style.visibility= "visible";
}

function openLogPopup(){
  buildLoginPopup(); 
  closePopup(); 
  addfilter(); 
  document.getElementById("loginPopup").style.visibility ="visible" ; 
}

function closePopup(){
  removefilter(); 
  document.getElementById("regPopup").style.visibility ="hidden" ; 
  document.getElementById("loginPopup").style.visibility ="hidden" ;
  if(document.getElementById("orderPopup"))
    document.getElementById("orderPopup").style.visibility ="hidden" ;
  document.getElementById("hostPopup").style.visibility ="hidden" ;
  document.getElementById("hostPopup").innerHTML=""; 
}


//some Parts of the function addfilter and removefilter are Ai generated
function addfilter(){
  const overlay = document.getElementById('overlay');
  const body = document.querySelector('body');
  overlay.style.display = 'block';
  body.classList.add('overlayed'); 
}

function removefilter(){
  const overlay = document.getElementById('overlay');
  const body = document.querySelector('body'); 
  overlay.style.display = 'none';
  body.classList.remove('overlayed'); 
}

function deleteCookie(){
  //set cookie in the past to delete it
  document.cookie = "user" + '=; expires=Thu, 01 Jan 1969 00:00:01 GMT;';
  //change the style and value back to normal
  document.getElementById("reg_Button").style.visibility ="visible" ; 
  document.getElementById("login_Button").innerText ="Login"
  if(document.getElementsByClassName("hostLoginButton")){
    elements=document.getElementsByClassName("hostLoginButton"); 
    for( let i of elements){
      i.style.visibility ="hidden" ; 
    }
  }
}


//DOM manipulation for host popup
function setInnerHTMLEdit(i){

  document.getElementById("hostPopup").innerHTML=""; 

  fetch("spices.json")
      .then(response => response.json())
      .then(jsonData => {
  let mainContainer=document.getElementById("hostPopup"); 
  let newContent=document.createElement("div"); 
  newContent.innerHTML=`
  <span class='close' onclick='closePopup()'>&times;</span>
  <div class='formHeader'>
      <h1>Bearbeiten</h1></br>
  </div> 
  <form  action="store.html" method="post">
      <input type="hidden" name="formType" value="hostedit">
      <input type="hidden" name="oldname" value="`+jsonData.arraySpices[i].name+`">
      <input type="text" name="name" placeholder="`+jsonData.arraySpices[i].name+`">
      <input type="text" name="origin" placeholder="`+jsonData.arraySpices[i].origin+`">
      <input type="number" step="0.10" name="price_per_100g" placeholder="`+jsonData.arraySpices[i].price_per_100g+`">
      <input type="number" min="0" max="5" step="0.5" name="rating" placeholder="`+jsonData.arraySpices[i].rating+`">
      <input type="number" name="num_ratings" placeholder="`+jsonData.arraySpices[i].num_ratings+`">
      <select name="available">
          <option value="1">Verfügbar</option>
          <option value="0">Nicht Verfügbar</option>
      </select>
      <input type="submit" value="Bearbeiten">
  </form>`; 
  mainContainer.appendChild(newContent); 
  }); 
}
function setInnerHTMLDel(i){

  document.getElementById("hostPopup").innerHTML="";

  fetch("spices.json")
      .then(response => response.json())
      .then(jsonData => {
  let mainContainer=document.getElementById("hostPopup"); 
  let newContent=document.createElement("div"); 
  newContent.innerHTML=`
  <span class='close' onclick='closePopup()'>&times;</span>
  <div class='formHeader'>
      <h1 style='color: red;'>Löschen</h1></br>
  </div> 
  <form  action="store.html" method="post">
      <input type="hidden" name="formType" value="hostdel">
      <input type="hidden" name="name" value="`+jsonData.arraySpices[i].name+`">
      <h3>`+jsonData.arraySpices[i].name+`</h3>
      <input type="submit" value="Löschen">
  </form>`; 
  mainContainer.appendChild(newContent); 
  }); 
}
function setInnerHTMLAdd(){

  document.getElementById("hostPopup").innerHTML=""; 

  let mainContainer=document.getElementById("hostPopup"); 
  let newContent=document.createElement("div"); 
  newContent.innerHTML=`
  <span class='close' onclick='closePopup()'>&times;</span>
  <div class='formHeader'>
      <h1 style='color: green;'>Neues Gewürz</h1></br>
  </div> 
  <form  action="store.html" method="post" enctype="multipart/form-data">
      <input type="hidden" name="formType" value="hostadd">
      <label for="picture" >Bild auswählen:
          <br><input type="file" name="picture" accept="image/*" required>
      </label>
      <input type="text" name="name" placeholder="Name" required>
      <input type="text" name="origin" placeholder="Herkunftsland" required>
      <input type="number" step="0.10" name="price_per_100g" placeholder="Preis pro 100g" required>
      <input type="number" min="0" max="5" step="0.5" name="rating" placeholder="Bewertung" required>
      <input type="number" name="num_ratings" placeholder="Anzahl der Bewertungen" required>
      <select name="available" required>
          <option value="1">Verfügbar</option>
          <option value="0">Nicht Verfügbar</option>
      </select>
      <input type="submit" value="Hinzufügen">
  </form>`; 
  mainContainer.appendChild(newContent);  
}

function hostPopup(i){
  let mainContainer=document.getElementById("hostPopup"); 
  let newContent=document.createElement("div"); 
  newContent.innerHTML=`
  <span class='close' onclick='closePopup()'>&times;</span>
  <div class='formHeader' style='flex-direction: column;'">
      <button onclick="setInnerHTMLAdd()"><h1>Neu Hinzufügen</h1></button>
      <button onclick="setInnerHTMLEdit(`+i+`)"><h1>Bearbeiten</h1></button>
      <button onclick="setInnerHTMLDel(`+i+`)"><h1>Löschen</h1></button>
  </div>`; 
  mainContainer.appendChild(newContent); 
  addfilter(); 
  document.getElementById("hostPopup").style.visibility ="visible" ;
}; 

function checkHostLogin(i){
  if(document.cookie!=""){
      let cookie = decodeCookie()
      if(cookie.first_name=="root"&&cookie.last_name=="host"){
          var mainContainer = document.getElementById("shopBoxLastLine"+i); 
          let newContent = document.createElement("button");
          newContent.onclick= function() {hostPopup(i); };
          newContent.className="hostLoginButton";
          newContent.innerHTML = "<img src='img/icons8-einstellungen-50.png' alt='Host-Icon'>";
          mainContainer.appendChild(newContent);  
      }
  }
}