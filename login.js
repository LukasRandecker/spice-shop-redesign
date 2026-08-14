document.addEventListener("DOMContentLoaded", function() {
    if(document.cookie!=""){ 
        changeHTMLlogedin(); 
    }
}); 

function changeHTMLlogedin(){
    document.getElementById("reg_Button").style.visibility ="hidden"; 
    document.getElementById("login_Button").innerText ="Ausloggen"
}

//decode cookie it's urlCoded
function decodeCookie(){
    let cookieValue = document.cookie;
    let decodedCookieValue = urlDecode(cookieValue);
    let cookieJSON = decodedCookieValue.replace('user=j:', ''); 
    let afterJSON = JSON.parse(cookieJSON);
    let dataArrayUser = afterJSON[0];   
    return dataArrayUser; 
}

//AI-generated
function urlDecode(urlEncodedString) {
    return decodeURIComponent(urlEncodedString.replace(/\+/g, ' '));
}