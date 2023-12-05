const apiUrl = "http://localhost:3000";

document.addEventListener("DOMContentLoaded" , function(){
   
    const loginBtn = document.getElementById('loginButton');

    const signupBtn = document.getElementById('signupButton');

    loginBtn.addEventListener("click" , function(event) {
        event.preventDefault();
        
        window.location.href = `${apiUrl}/api/redirecting/loginPage`;
    })

    signupBtn.addEventListener("click" , function(event){
        event.preventDefault();
        
        window.location.href = `${apiUrl}/api/redirecting/signupPage`;
    });
});