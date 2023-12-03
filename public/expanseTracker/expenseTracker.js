const apiUrl1 = `http://localhost:3000`;

const form = document.getElementById("expenseForm");
const submitButton = document.getElementById("submitButton");
const expanseList = document.getElementById("expenseList");

const token = localStorage.getItem("token");

const headers = {
  "Content-Type": "application/json",
  "Authorization" :`Bearer ${token}`,
}

const logout = () =>{
  localStorage.removeItem("token");
  localStorage.removeItem("isPremium");
  window.location.href = `${apiUrl1}/api/welcome`;
}
document.getElementById('logoutBtn').addEventListener("click" , logout);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);

  const expense = {
    name: formData.get("name"),
    quantity: formData.get("quantity"),
    amount: formData.get("amount"),
  };

  try {
    const response = await fetch(`${apiUrl1}/expenses`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(expense),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    form.reset();
    fetchExpenseList();
  } catch (err) {
    console.log("Error Occured while adding expanse :", err);
  }
});

async function fetchExpenseList() {
  try {
    const response = await fetch(`${apiUrl1}/expenses`,{
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log('Data:', data);

    expanseList.innerHTML = "";

    data.forEach((expanse) => {
      const expenseItem = document.createElement("div");
      expenseItem.innerHTML = `
        <div>
          <span>Name: ${expanse.name} </span>
          <span>Quantity: ${expanse.quantity} </span>
          <span>Amount: ${expanse.amount} </span>
          <button onclick="deleteExpanse(${expanse.id})" >Delete</button>
        </div>
      `;
      expanseList.appendChild(expenseItem);
    });
  } catch (err) {
    console.log("Error Occurred while fetching data", err);
  }
}


function deleteExpanse(expanseId) {
  fetch(`${apiUrl1}/expenses/${expanseId}`, {
    method: "DELETE",
    headers: headers,
  })
    .then((res) => {
      if (res.ok) {
        fetchExpenseList();
      } else {
        console.log("error occured while deleting expanse", res.statusText);
      }
    })
    .catch((err) => {
      console.error("error occured while delting expanse", err);
    });
}
document.addEventListener("DOMContentLoaded", function() {
  fetchExpenseList();
});
