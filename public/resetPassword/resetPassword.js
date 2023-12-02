const apiUrl = `http://localhost:3000`
const password = document.getElementById('password');
const confirmPassword= document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');


submitBtn.addEventListener("click", async ()=>{
    try{
        const urlParams = new URLSearchParams(window.location.search);
        const uuid = urlParams.get('uuid');

        console.log("this is uuid",uuid);

        const error= document.getElementById("error-msg");

        let newPassword = password.value;
        let confirmPassword = confirmPassword.value;

        let obj = {
            password: newPassword,
            uuid:uuid,
        };

        if(newPassword === confirmPassword){
            const sendPassword = await fetch(`${apiUrl}/api/reset/newPassword`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(obj),  
            });
            if(sendPassword.ok){
                const data = await sendPassword.json();
                console.log(data);
            }else{
                error.innerHTML = "Password reset failed, please try again";
            }
        }else{
            error.innerHTML = "Password not matched";
            setTimeout(()=>{
                error.innerHTML = "";
            },2000)
        }
    }catch(error){
        console.log(error);
    }
})