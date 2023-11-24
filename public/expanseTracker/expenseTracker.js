const apiUrl = `http://localhost:3000]`;

const form = document.getElementById("expenseForm");
const expanseList = document.getElementById("expenseList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);

  const expense = {
    name: formData.get("name"),
    quantity: formData.get("quantity"),
    amount: formData.get("amount"),
  };

  try {
    const response = await fetch(`${apiUrl}/api/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

function fetchExpenseList() {
  fetch(`${apiUrl}/api/expenses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const expenses = data.expenses || [];
      expanseList.innerHTML = "";

      expenses.forEach((expanse) => {
        const expenseItem = document.createElement("div");
        expenseItem.innerHTML = `
            <div>
            <span>Name: ${expanse.name} </span>
            <span>Quantity: ${expanse.quantity} </span>
            <span>Amount: ${expanse.amount} </span>
            <button onclick="deleteExpanse(${expanse.id})" >Delete</button>
            `;
        expanseList.appendChild(expenseItem);
      });
    })
    .catch((err) => {
      console.log("Error Occured while fetching data", err);
    });
}

function deleteExpanse(expanseId) {
  fetch(`${apiUrl}/api/expenses/${expanseId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
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

fetchExpenseList();
