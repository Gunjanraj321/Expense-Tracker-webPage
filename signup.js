async function signup (e) {
    try{
        e.preventDefault();

        const signupData = {
            name : document.getElementById('name'),
            email: document.getElementById('email'),
            password: document.getElementById('password'),
        }

        const response = await axios.post('')
    }catch(err){
        
    }
}