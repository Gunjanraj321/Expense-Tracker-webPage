const apiUrl = 'http://localhost:3000';

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const formData = new FormData(loginForm);
    const userData = {
        email : formData.email,
        password : formData.password,
    }
    if(!userData.email || !userData.password){
        // alert({message:"all data mandatory"})
        return;
    }
    try{
        const response = await fetch(`${apiUrl}/login`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body : JSON.stringify(userData)
        })
        if(response.ok){
            loginForm.reset();
            response.status(201).json("user logged in");
            console.log('user logged in')
            // alert('logged in succesfully');
        }
    }catch(error){
        console.log(error);
    }

})