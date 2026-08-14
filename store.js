let oldWidth = window.innerWidth; 

window.onload = store(); 
window.addEventListener('resize', function(){

    if(window.innerWidth <= 750 && oldWidth>750){
        resetStore(); 
        store(); 
    } 
    else if(window.innerWidth > 750 && oldWidth <= 750){
        resetStore(); 
        store(); 
    } 
    
    oldWidth=window.innerWidth;     
}); 

function resetStore(){
    document.getElementById("shop").innerHTML="";
}

function store(){
    let amount=0; 
    let box=0;
    fetch("spices.json")
        .then(response => response.json())
        .then(jsonData => {
            amount = jsonData.arrayAmount[0].amount;   
            //build store with the data of the database

            for(let i=0; i<amount; i++){ 
                let howMuchToBuild=0; 
                if(window.innerWidth <=750)
                    howMuchToBuild = 2; 
                else
                    howMuchToBuild =4; 

                if((i%howMuchToBuild)==0){
                    box++; 
                    linebreak(box); 
                }  
                buildStoreBox(jsonData.arraySpices[i].name,jsonData.arraySpices[i].origin, jsonData.arraySpices[i].price_per_100g, jsonData.arraySpices[i].rating, jsonData.arraySpices[i].num_ratings, jsonData.arraySpices[i].available,box,i);
                
            }
        })
        .catch(error => {
            console.error('Fehler:', error);
    }); 
}

//code must executed after x inputs 
function linebreak(box){
    let mainContainer=document.getElementById("shop"); //connect to the shop 
    let newContent=document.createElement("div"); //create a div what is gona be used for a new row of spices 
    newContent.id="shop_container"+box; 
    newContent.className="shop_cont";
    mainContainer.appendChild(newContent); //add new row 
}


//designe changes according to availability 
function available_check(available, i){
    if(available==1)
        return "<div><span class='availability' style='color: green'>Lieferbar</span></div> <div id='shopBoxLastLine"+i+"' class='shopBoxLastLine'><button class='in_shop_button_g'  onclick='addToShoppingCart("+i+")'> "; 
    else
        return "<div><span class='availability' style='color: red'>nicht Lieferbar</span></div> <div id='shopBoxLastLine"+i+"' class='shopBoxLastLine'><button class='in_shop_button_r' onclick='errorAlert(`Momentan nicht auf Lager, aber bald wieder für Sie verfügbar`)'>"; 

}

//draw stars according to rating
function addStars(rating){
    let string=""; 
    if((rating%1)==0){
        for(let i=0; i<rating; i++)
            string=string+"<img src='img/star.png' alt='voller Stern'>"; 
    }
    else{
        for(let i=0; i<(Math.floor(rating / 1)); i++) //Math.floor generated with AI (Chat GPT)
            string=string+"<img src='img/star.png' alt='voller Stern'>"; 
        string=string+"<img src='img/half_star.png' alt='halb voller Stern'>"
    }
    return "<div class='shop_productinfo_stars'>"+string+"</div>"; 
}

//write innnerHTML code to add new box/card of a spice
function buildStoreBox(name, origin, price, rating, num_ratings, available, box,i){ 
    let mainContainer=document.getElementById("shop_container"+box); 
    let newContent=document.createElement("div"); 
    newContent.className="shop_box"; 
    newContent.innerHTML= 
    `<div class="shop_porductpicture"><img src="img/Produktfotos/`+name+`.png" alt="Produktfoto: Dill"></div>
    <div class="shop_productinfo">
        <div class="shop_productinfo_header">
            <div class="shop_productinfo_origin" > 
            <h3> `+name+`</h3>
                <p>`+origin+`</p>
            </div>
            <div class="shop_productinfo_evaluation" > 
                `+addStars(rating)+`
                <div><p>aus `+num_ratings+` Bewertungen</p></div> 
            </div>
        </div>
        <div class="shop_productinfo_footer">   
            <div class="shop_productinfo_price">
                <h1>`+price+`€</h1>
                <p class="shop_productinfo_price_100">pro 100g</p>
            </div>
            <div>
                `+available_check(available,i)+`
                        <div class="innertext_button">hinzufügen</div> 
                        <div><img class="shoppingcart" src="img/shopping-cart-svgrepo-com.svg" alt="Warenkorb"></div> 
                    </button>
                </div>
            </div>
        </div>    
    </div>`; 
  

    mainContainer.appendChild(newContent); 
    checkHostLogin(i); 
}; 


function addToShoppingCart(i){
    alert("zum Warenkorb hinzugefügt"); 
    fetch("spices.json")
        .then(response => response.json())
        .then(jsonData => {
            let spice = [jsonData.arraySpices[i].name, jsonData.arraySpices[i].price_per_100g, jsonData.arraySpices[i].origin ];   
            let amount = jsonData.arrayAmount[0].amount; 
            sessionStorage.setItem("spice"+i,spice);
            sessionStorage.setItem("amount", amount);  
        })
        .catch(error => {
            console.error('Fehler:', error);
    }); 
}

function errorAlert(string){
    alert(string); 
}




