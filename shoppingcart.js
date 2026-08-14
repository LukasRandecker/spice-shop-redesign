
let gespreis=0;

window.onload = function () {
    sessionStorage.removeItem("totalprice"); 
    gespreis=0; 
    for (let i = 0; i <= sessionStorage.getItem("amount"); i++) {
        if (sessionStorage.getItem("spice" + i) != null) {
            buildShoppingCart(1, i);
            buildShoppingCart(2, i);
            buildShoppingCart(3, i);
            buildShoppingCart(4, i);
        }       
    }    
    updateTotalPrice(); 
}

function buildShoppingCart(number, i) {
    const spice = sessionStorage.getItem("spice" + i).split(",");
    let newContent = document.createElement("div");
    newContent.className = "scInnerContent";
    switch (number) {
        case 1:
            var mainContainer = document.getElementById("scProduct");
            newContent.innerHTML = "<div><img class='scProductPicture' src='img/Produktfotos/" + spice[0] + ".png' alt='Bild von " + spice[0] + "'></div><div><h2>" + spice[0] + "</h2><p>Lecker " + spice[0] + " aus " + spice[3] + "<br>Lieferzeit ca.:1-3 Werktage</p></div>"
            mainContainer.appendChild(newContent);
            break;
        case 2:
            var mainContainer = document.getElementById("scPrice"); 
            newContent.innerHTML = spice[1] + "€";
            mainContainer.appendChild(newContent);
            break;
        case 3:
            var mainContainer = document.getElementById("scAmount");
            newContent.innerHTML = "<button onclick='increment(" + i + ")'>+</button><div id='counter" + i + "' class='counter'>1</div><button onclick='decrement(" + i + ")'>-</button>";
            mainContainer.appendChild(newContent);
            break;
        case 4:
            var mainContainer = document.getElementById("scTotal");
            var totalPriceofSpice = parseInt(document.getElementById("counter" + i).innerHTML);
            newContent.id = "scInnerContentTotal" + i;
            parseFloat(totalPriceofSpice);
            totalPriceofSpice = (totalPriceofSpice * spice[1]).toFixed(2); //toFixed -> always 2 numbers behind .  
            newContent.innerHTML = totalPriceofSpice + "€";
            mainContainer.appendChild(newContent);
            break;
    }

}


//JS for the button to add mor of the same spice in the shoppingcart
function increment(i) {
    let count = parseInt((document.getElementById('counter' + i).innerHTML));
    count++;
    updateCounter(i, count);
}

function decrement(i) {
    let count = parseInt((document.getElementById('counter' + i).innerHTML));
    if (count != 0)
        count--;
    updateCounter(i, count);
}

function updateCounter(i, count) {
    document.getElementById('counter' + i).innerHTML = count;
    updatePrice(i);
    updateTotalPrice();  
}


//function to update the total price of on spice
function updatePrice(i) {
    const spice = sessionStorage.getItem("spice" + i).split(",");
    document.getElementById("scInnerContentTotal" + i).textContent = (parseInt((document.getElementById('counter' + i).innerHTML)) * (spice[1])).toFixed(2) + "€";
    sessionStorage.setItem("spice"+i+"Amount",document.getElementById('counter' + i).innerHTML); 
}

 
//calculating total price 
function updateTotalPrice() {
    gespreis=0; 
    for (let i = 1; i <= sessionStorage.getItem("amount"); i++) {
        if (sessionStorage.getItem("spice" + i) != null) {
            gespreis=gespreis+ parseFloat(document.getElementById("scInnerContentTotal" + i).innerHTML); 
        }
    }  
    document.getElementById("scFooter").innerHTML ="<div ><h2>Gesammtsumme: "+gespreis.toFixed(2)+"€</h2></div> <div><button onclick='checkOut()'class='header_button'>Bestellen</button></div>"
}

function checkOut(){
    if(document.cookie!=""){
        addfilter(); 
        let newContent = document.createElement("div");
        let cookie = decodeCookie(); 
        var mainContainer = document.getElementById("orderPopup");
        newContent.innerHTML =  "<span class='close' onclick='closePopup()'>&times;</span><div><h2>Danke "+cookie.first_name+" für deine Bestellung</h2><p>Deine Bestellung wird an folgende Adresse geschickt:</p><div class='userAdress'>"+cookie.first_name+" "+cookie.last_name+" <br>"+cookie.street+" "+cookie.house_number+" <br>"+cookie.city+" "+cookie.postal_code+"</div></div>";
        document.getElementById("orderPopup").style.visibility= "visible"; 
        mainContainer.appendChild(newContent);
    }else{
        alert("Um zu bestellen musst du angemeldet sein, bitte melde dich an. Falls du dich noch nicht angemeldet hast, bitte regestrien")
    }
}


       
