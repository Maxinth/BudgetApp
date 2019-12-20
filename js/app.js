class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
    this.balanceBox = document.querySelector(".balanceBox");
  }

  // globals - functions that I need to call in different parts of the code
  totalExpense() {
    let total = 0;
    // if there is at least one item in the array
    if (this.itemList.length > 0) {
      total = this.itemList.reduce((acc, curr) => {
        acc += curr.amount;

        return acc;
      }, 0);
    }

    this.expenseAmount.textContent = total;
    return total;
  }

  // show balance
  showBalance() {
    const expense = this.totalExpense();
    const Total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = Total;
    if (Total < 0) {
      this.balance.classList.remove("showGreen", "showBlack");
      this.balance.classList.add("showRed");
      this.balanceBox.classList.add("bg-danger"); 
      this.balanceBox.classList.add("text-white");
      this.BudgetFeedBack(); // call for a feedback to help the user decide on increasing the budget when the expense exceeds the budget
      this.budgetFeedback.innerHTML = `<p>This entry/expense will need you to increase your budget! </p>`;
    } else if (Total > 0) {
      this.balance.classList.remove("showRed", "showBlack");
      this.balance.classList.add("showGreen");
      this.balanceBox.classList.remove("bg-danger");
      this.balanceBox.classList.add("bg-success");
      this.balanceBox.classList.add("text-white");
    } else if (Total === 0) {
      this.balance.classList.remove("showRed", "showGreen");
      this.balance.classList.add("showBlack");
    }
  }

  BudgetFeedBack() {
    this.budgetFeedback.classList.add("showItem"); //  initially show feedback

    setTimeout(() => {
      this.budgetFeedback.classList.remove("showItem");
    }, 4000); // see comments

    // to redirect users to enter the required data
    this.budgetInput.value = ""; // clear the field so user can try again
    this.budgetInput.focus(); // redirect the user's attention to the said field
  }
  // end of globals

  // edit expense
  editExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    // to remove from DOM
    this.expenseList.removeChild(parent);
    // remove from the list
    let expense = this.itemList.filter(item => {
      return item.id === id;
    });

    // show value
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;
    // remove from the list
    let tempList = this.itemList.filter(item => {
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }

  // To delete expense entry
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    // to remove from DOM
    this.expenseList.removeChild(parent);
    // remove from the list

    let tempList = this.itemList.filter(item => {
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }

  //1 - submitting budget form
  submitBudgetForm() {
    const value = this.budgetInput.value;

    // declaring a function to clear the feedback after 4seconds
    // const BudgetFeedBack = () => {
    //   this.budgetFeedback.classList.add("showItem"); //  initially show feedback

    //   setTimeout(() => {
    //     this.budgetFeedback.classList.remove("showItem");
    //   }, 4000); // see comments

    //   // to redirect users to enter the required data
    //   this.budgetInput.value = ""; // clear the field so user can try again
    //   this.budgetInput.focus(); // redirect the user's attention to the said field
    // };

    // evaluating what was entered as a budget
    if (value === "") {
      this.budgetFeedback.innerHTML = `<p>Field cannot be empty </p>`;
      this.BudgetFeedBack(); // clear the feedback after 4s
    } else if (value < 0) {
      this.budgetFeedback.innerHTML = `<p>A budget with less than nothing? Level up and try again</p>`;
      this.BudgetFeedBack(); // clear the feedback after 4s
    } else if (value === "0") {
      this.budgetFeedback.innerHTML = `<p>With nothing , I doubt if you will be able to do anything. </p>`;
      this.BudgetFeedBack(); // clear the feedback after 4s
    } else {
      // all conditions are met and user can proceed
      this.budgetAmount.textContent = value; // display value entered under amount section
      this.budgetInput.value = ""; // Clear the budget field
      this.expenseInput.focus(); // and focus on the expense input field

      this.showBalance();
    }
  } // end of submitBudget

  // 2 - submitting the expenses === UI.submitExpenseForm
  submitExpenseForm() {
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;

    // function to clear the feedback after 4s
    const ExpenseFeedback = () => {
      setTimeout(() => {
        this.expenseFeedback.classList.remove("showItem");
      }, 4000);

      // to redirect users attention to the field that needs it
      this.amountInput.value = ""; // clear the field
      this.amountInput.focus(); // give it focus
    };

    // general condition to test if the expense field is empty or amount field is empty OR amount entered is < 0 OR amount entered is Zero
    if (
      expenseValue === "" ||
      amountValue === "" ||
      amountValue < 0 ||
      amountValue === "0"
    ) {
      this.expenseFeedback.classList.add("showItem");
      ExpenseFeedback(); // Expense feedback is called on ALL of the nested if and else if
      // if within the general if to toggle feedback based on each condition above
      if (expenseValue === "") {
        this.expenseFeedback.innerHTML = `<p>The expense name field cannot be empty, fill up to continue</p>`;
        this.expenseInput.focus();
        this.amountInput.value = amountValue; // let what was entered, if there is one be retained - this overrides line 140
      } else if (amountValue === "") {
        this.expenseFeedback.innerHTML = `<p>You need to enter a value for your expenses amount also to continue</p>`;
      } else if (amountValue < 0) {
        this.expenseFeedback.innerHTML = `<p>Expenses cannot be negative!</p>`;
      } else if (amountValue === "0") {
        this.expenseFeedback.innerHTML = `<p>Zero expenses would suggest you don't wish to spend? Enter a value greater than zero to continue
    </p>`;
        this.amountInput.value = ""; // clear the value of zero
        this.amountInput.focus(); // zero in /  focus on the amount field so a new value can be entered
      }
    } else {
      // all goes well and users enter the right/expected set of inputs
      let amount = parseInt(amountValue);
      this.expenseInput.value = ""; // clear the expense name field so something else can be entered
      this.expenseInput.focus(); // focus on the expense input field when the add expense button is clicked
      this.amountInput.value = ""; // clear the amount field so something else can be entered

      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount
      };
      this.itemID++; // initially set to zero, increase the value so each item has an id
      this.itemList.push(expense); // add each expense to the itemList array
      this.addExpense(expense);
      this.totalExpense();
      this.showBalance(); // show balance
    }
  }
  //add expense
  addExpense(expense) {
    const div = document.createElement("div");
    div.classList.add("expense");
    // div.classList.add('bg-white')
    div.innerHTML = ` <div class="expense-item d-flex justify-content-between align-items-baseline m-1">

                        <h6 class="expense-title mb-0 text-uppercase list-item bg-white p-1 ">- ${expense.title}</h6>
                        <h5 class="expense-amount mb-0 list-item bg-white p-3">${expense.amount}</h5>

                        <div class="expense-icons list-item ">

                          <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
                            <i class="fas fa-edit"></i>
                          </a>
                          <a href="#" class="delete-icon" data-id="${expense.id}">
                            <i class="fas fa-trash"></i>
                          </a>
                        </div>
                  </div> `;
    this.expenseList.appendChild(div);
  }
  // totalExpense() {
  //   let total = 0;
  //   // if there is at least one item in the array
  //   if (this.itemList.length > 0) {
  //     console.log(this.itemList);
  //   }

  //   this.expenseAmount.textContent = total;
  //   return total;
  // }
}

// all event listeners
function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  // creating a new instance of the UI Class
  const ui = new UI();

  // on submiting the budget form
  budgetForm.addEventListener("submit", e => {
    e.preventDefault();
    ui.submitBudgetForm();
  });

  // on submitting the expense form
  expenseForm.addEventListener("submit", e => {
    e.preventDefault();
    ui.submitExpenseForm();
  });

  // on clicking the expense list
  expenseList.addEventListener("click", e => {
    if (e.target.parentElement.classList.contains("edit-icon")) {
      ui.editExpense(event.target.parentElement);
    } else if (e.target.parentElement.classList.contains("delete-icon")) {
      ui.deleteExpense(event.target.parentElement);
    }
  });
}

// calling the function when the page and all  its resources has loaded
document.addEventListener("DOMContentLoaded", function() {
  eventListeners();
});

// COMMENTS

/*inside the clearFeedBack function. setTimeout function has been declared as an arrow function so because it binds
  'this' to the UI class and not the global window object */
