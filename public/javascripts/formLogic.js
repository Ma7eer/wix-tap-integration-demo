let form = document.querySelector("form");
// customer information
let firstName = document.getElementById("first-name");
let lastName = document.getElementById("last-name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let totalAmount = document.getElementById("amount");
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
  amount.value = itemAmount.value;
});
amountPerItem.addEventListener("change", () => {
  itemAmount.value = quantity.value * amountPerItem.value;
  amount.value = itemAmount.value;
});

form.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    let customerInfo = await {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      totalAmount: totalAmount.value,
      currency: currency.value,
    };

    let itemInfo = await {
      itemId: itemId.value,
      itemName: itemName.value,
      quantity: quantity.value,
      amountPerItem: amountPerItem.value,
      description: description.value,
      itemAmount: itemAmount.value,
    };

    // await localStorage.setItem("customerInfo", customerInfo);
    // await localStorage.setItem("itemInfo", itemInfo);

    await setupTapConfig(customerInfo, itemInfo);

    await goSell.openLightBox();
    await clearFormValues();
  } catch (error) {
    console.log(error);
  }
});

function setupTapConfig(customerInfo, itemInfo) {
  goSell.config({
    containerID: "root",
    gateway: {
      publicKey: "pk_test_KcwngMANEhlXumLbyxBqsGWt",
      language: "en",
      contactInfo: true,
      supportedCurrencies: "all",
      supportedPaymentMethods: "all",
      saveCardOption: false,
      customerCards: true,
      notifications: "standard",
      callback: (response) => {
        console.log("response", response);
      },
      onClose: () => {
        console.log("onClose Event");
      },
      backgroundImg: {
        url: "imgURL",
        opacity: "0.5",
      },
      labels: {
        cardNumber: "Card Number",
        expirationDate: "MM/YY",
        cvv: "CVV",
        cardHolder: "Name on Card",
        actionButton: "Pay",
      },
      style: {
        base: {
          color: "#535353",
          lineHeight: "18px",
          fontFamily: "sans-serif",
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "rgba(0, 0, 0, 0.26)",
            fontSize: "15px",
          },
        },
        invalid: {
          color: "red",
          iconColor: "#fa755a ",
        },
      },
    },
    customer: {
      first_name: customerInfo.firstName,
      last_name: customerInfo.lastName,
      email: customerInfo.email,
      phone: {
        country_code: "968",
        number: customerInfo.phone,
      },
    },
    order: {
      amount: customerInfo.totalAmount,
      currency: "OMR",
      items: [
        {
          id: 1,
          name: itemInfo.itemName,
          description: itemInfo.description,
          quantity: itemInfo.quantity,
          amount_per_unit: itemInfo.amountPerItem,
          discount: {
            type: "P",
            value: "0%",
          },
          total_amount: itemInfo.itemAmount,
        },
        {
          id: 2,
          name: "item2",
          description: "item2 desc",
          quantity: "2",
          amount_per_unit: "00.000",
          discount: {
            type: "P",
            value: "0%",
          },
          total_amount: "000.000",
        },
        {
          id: 3,
          name: "item3",
          description: "item3 desc",
          quantity: "1",
          amount_per_unit: "00.000",
          discount: {
            type: "P",
            value: "0%",
          },
          total_amount: "000.000",
        },
      ],
      shipping: null,
      taxes: null,
    },
    transaction: {
      mode: "charge",
      charge: {
        saveCard: false,
        threeDSecure: true,
        description: "Test Description",
        statement_descriptor: "Sample",
        reference: {
          transaction: "txn_0001",
          order: "ord_0001",
        },
        metadata: {},
        receipt: {
          email: false,
          sms: true,
        },
        redirect: "https://cryptic-dusk-38095.herokuapp.com?success=yup",
        post: null,
      },
    },
  });
}

function clearFormValues() {
  // clear form values
  firstName.value = "";
  lastName.value = "";
  email.value = "";
  phone.value = "";
  totalAmount.value = "1";
  currency.value = "OMR";
  itemId.value = "1";
  itemName.value = "";
  quantity.value = "1";
  amountPerItem.value = "1";
  description.value = "";
  itemAmount.value = "1";
}
