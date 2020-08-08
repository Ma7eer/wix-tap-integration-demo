let form = document.querySelector("form");
// customer information
let firstName = document.getElementById("first-name");
let lastName = document.getElementById("last-name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let amount = document.getElementById("amount");
let currency = document.getElementById("currency");
// order item information
let itemId = document.getElementById("itemId");
let itemName = document.getElementById("itemName");
let quantity = document.getElementById("quantity");
let amountPerItem = document.getElementById("amountPerItem");
let description = document.getElementById("description");
let itemAmount = document.getElementById("itemAmount");

quantity.addEventListener("change", () => {
  itemAmount.value = quantity.value * amountPerItem.value;
});
amountPerItem.addEventListener("change", () => {
  itemAmount.value = quantity.value * amountPerItem.value;
});

form.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    let values = await {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      amount: amount.value,
      currency: currency.value,
      itemId: itemId.value,
      itemName: itemName.value,
      quantity: quantity.value,
      amountPerItem: amountPerItem.value,
      description: description.value,
      itemAmount: itemAmount.value,
    };

    await console.log(values);
    await clearFormValues();
  } catch (error) {
    console.log(error);
  }
});

function clearFormValues() {
  // clear form values
  firstName.value = "";
  lastName.value = "";
  email.value = "";
  phone.value = "";
  amount.value = "";
  currency.value = "OMR";
  itemId.value = "1";
  itemName.value = "";
  quantity.value = "1";
  amountPerItem.value = "1";
  description.value = "";
  itemAmount.value = "1";
}
