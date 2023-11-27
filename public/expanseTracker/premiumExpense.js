const apiUrl = `http://localhost:3000`;
const isPremium = localStorage.getItem("isPremium");
const premiumBtn = document.getElementById('premiumBtn');

const token1 = localStorage.getItem("token");

const header = {
    "Content-Type" : "application/json",
    "Authorization" : token1,
}

premiumBtn.addEventListener("click", async(e) =>{
    
    try{
        let response = await fetch(`${apiUrl}/api/premium/takepremium`,{
            method:"GET",
            headers: header,
        })
        if(!response.ok){
            console.log("failed to fetch order details");
            alert("Error occured while fetching order details");
            return;
        }

        const { key_id , order_id } = await response.json();

        const rzp = Razorpay({
            key : key_id,
            order_id: order_id,
            handler : async function(response) {
                try{
                    const paymentResponse = await fetch(`${apiUrl}/api/premium/updatetransactionstatus`,{
                        method: "POST",
                        headers: header,
                        body: JSON.stringify({
                            order_id :order_id,
                            payment_id : response.razorpay_payment_id,
                        })
                    })
                    if(paymentResponse.ok){
                        rzp.close();
                        alert("Payment Succesfull , you are premium user now");
                        localStorage.setItem("isPremium","true");
                        const paragraph = document.getElementById("premiumStatus");

                        paragraph.innerHTML="Premium User";
                        return paymentResponse.json();
                    }else{
                        console.log(error);
                        alert("error occured while confirming payment");
                    }
                }catch(err){
                    console.log(err);
                    alert("error occured while confirming payment");
                }
            }
        })
        rzp.open();
        e.preventDefault();
    }catch(err){
        console.log(err);
        alert("error occured while processing paymrnt");
    }
})