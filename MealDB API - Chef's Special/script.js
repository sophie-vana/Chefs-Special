async function fetchMealsByIngredient(ingredient) {
    const ingredientFormatted = ingredient.toLowerCase().replace(/ /g, '_');
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientFormatted}`);
    const data = await response.json(); // Get response in json format
    return data.meals; // Array of meals
  }
  
  // Function to select a random meal
  function selectRandomMeal(meals) {
    return meals[Math.floor(Math.random() * meals.length)];
  }
  
  // Function to get order number using session storage
  function getNextOrderNumber() {
    let lastOrderNumber = sessionStorage.getItem("lastOrderNumber");
    if (!lastOrderNumber) lastOrderNumber = 0;
    return parseInt(lastOrderNumber) + 1;
  }

  // Use session storage to store the order and push to an array
  function storeOrder(order) {
    const orders = JSON.parse(sessionStorage.getItem("orders")) || [];
    orders.push(order);
    sessionStorage.setItem("orders", JSON.stringify(orders));
    sessionStorage.setItem("lastOrderNumber", order.orderNumber);
  }
  
  // Function to display incomplete orders
  function displayIncompleteOrders() {
    const orders = JSON.parse(sessionStorage.getItem("orders")) || [];
    const incompleteOrders = orders.filter(
        (order) => order.completionStatus === "incomplete"
    );
  
    // Create logic for if there are no incomplete orders
    if (incompleteOrders.length === 0) {
        alert("No incomplete orders found.");
        return;
    }
    let orderList = "Incomplete Orders:\n\n";
    incompleteOrders.forEach((order) => {
        orderList += `Order Number: ${order.orderNumber}\nDescription: ${order.description}\n\n`;
    });
  
    return orderList;
  }
  
  // Function to mark orders as complete according to order number
  function completeOrder(orderNumber) {
    const orders = JSON.parse(sessionStorage.getItem("orders")) || [];
    const orderIndex = orders.findIndex(
        (order) => order.orderNumber === orderNumber
    );
  
    // Create logic for invalid order numbers
    if (orderIndex === -1) {
        alert("Order number not found.");
        return;
    }

    orders[orderIndex].completionStatus = "completed";
    sessionStorage.setItem("orders", JSON.stringify(orders));
    alert(`Order ${orderNumber} marked as completed.`); // Display alert to confirm order was completed
  }
  
  async function takeOrder() {

    // Create prompt to allow user to enter main ingredient
    const mainIngredient = prompt(
        "Welcome! Please enter the main ingredient for your meal:"
    );
    const meals = await fetchMealsByIngredient(mainIngredient);
  
    if (!meals || meals.length === 0) {
        alert("Sorry, no meals found with that main ingredient."); // Display message if no matching meal is found
        takeOrder(); // Prompt again if no meals found
        return;
    }
  
    const selectedMeal = selectRandomMeal(meals); // Select random meal from meals array
    const order = {
        description: selectedMeal.strMeal,
        orderNumber: getNextOrderNumber(),
        completionStatus: "incomplete",
    };
  
    storeOrder(order); // Use session storage to store order
  
    // Create alert to display meal and confirm that the order has been placed
    alert(
        `Your order has been placed!\n\nDescription: ${order.description}\nOrder Number: ${order.orderNumber}\nCompletion Status: ${order.completionStatus}`
    );
  }
  
  async function main() {
    await takeOrder();
    const incompleteOrders = displayIncompleteOrders();
    const orderNumberToComplete = parseInt(
        prompt(
            `${incompleteOrders}\nEnter the order number to mark as complete (or enter 0 to exit):`
        )
    );
  
    if (orderNumberToComplete !== 0) {
        completeOrder(orderNumberToComplete);
        main();
    } else {
        alert("Thank you for using our service!");
    }
  }
  
  // Trigger main function on click of the order button
  const orderButton = document.getElementById("order");
  orderButton.addEventListener("click", function() {
      main();
  });
  
