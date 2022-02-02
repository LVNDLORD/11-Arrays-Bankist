'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) { // better practice to pass data into a function, rather that make func work with global var
  containerMovements.innerHTML = ''; // replacing existing html to nothing. Removing prewritten html code

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; // to sort the copy of the array, without mutating the original one. a-b because we display values from the bottom up 'afterbegin'

  movs.forEach(function (mov, i) {  // using movs instead of movements now it supports sorting option by adding a second paramether in displayMovements
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);  //method to add html template to the webpage container div.movements
    // 2 args as strings. 1st - position in which we wanna attach html https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
    // 2nd arg - string containing html we wanna insert
    // beforeend - the order of elements will be inverted. Each new element would be added after the previous one. At the end of the container
  });
};

// calculating balance per account
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} EUR`;
};

// calculating total incomes, withdraws and interest from the account
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`

  const out = acc.movements.filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`

  const interest = acc.movements.filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100) // deposit * 1,2% (bank pays 1.2% of the value of each transaction)
    .filter((int, i, arr) => { // filtering out transaction from which the interest will be less than 1€ (e.g. new rule from the bank)
      return int >= 1;
    })
    .reduce((acc, int) => acc + int); // total interest value for all transactions
  labelSumInterest.textContent = `${interest.toFixed(2)}€`
};
// best practice - not to overuse chaining. Can cause issues with huge arrays.
// bad practice to chain methods that mutate the original array. Eg.splice() / reverse. Avoid mutating arrays.

//creating username property inside each object
const createUsernames = function (accs) {
  accs.forEach(function (acc) { // creating initials without returning anything
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name.at(0)) //callback f in map method always need a return value that will be in a new array
      .join('');
  })
};
createUsernames(accounts);

const updateUI = function (currAcc) {
  //display movements
  displayMovements(currAcc.movements);
  //display balance
  calcDisplayBalance(currAcc);
  //display summary
  calcDisplaySummary(currAcc);
}

// Event handlers
// default behav of HTML in submit forms is after clicking the button to reload the page. We gotta change it
let currentAccount;

//FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const minutes = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;



btnLogin.addEventListener('click', function (event) {
  event.preventDefault(); // prevent form from submitting the form and refreshing the page

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);  // another var that points to the same/original object in the memory heap! One of the objects in the account array
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {  //! optional chaining. Checking pin only if the current account exist
    //display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`; // splitting name and surname. From resulting array taking the first el/word in this case
    containerApp.style.opacity = 100;
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // !! field looses it's focus

    updateUI(currentAccount);
  }
});


btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value); // looking for an account in accounts array that has the credentials corresponding to once that we have entered

  inputTransferAmount.value = inputTransferTo.value = '';
  // check if amount is positive and if the amount is not bigger than balance of the acc itself
  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    //doing transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  };
})

// request a loan
// loan is granted if there is at least 1 deposit with at least 10% of the requested loan amount
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    // add a movement
    currentAccount.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});


btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index);

    // DEL account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = "Log in to get started";
});

//sorting transactions
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted); // sorted-true/false is second "sort parameter"
  sorted = !sorted; // allows to toggle boolean value
});

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€', ''))); //8) [div.movements__value, ..., div.movements__value]
  //placing the callback f as a second argument in Array.from
  console.log(movementsUI);   //[1300, 70, -130, -650, 3000, -400, 450, 200]
  //works cause we use array.from as movementsUI. And it's a real array already. But if we used simply doc.querySelectorAll... directly, map method wouldnt work on NodeList

  const movementsUI2 = [...document.querySelectorAll('.movements__value')]
});

// we used Array.from to create an array from the result of querySelectorAll, which is a nodelist, but not really an array, but an arraylike structure which can easily be convirted to an array using array.from
// as a second step we included mapping function which then transfroms that initial array to an array exactly as we want it. Converting raw el to it's text content and replacing € sign with nothing.
// in the end we end up with the array of numbers


// //// EXAMPLE - returning node list. Using spread create new array

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   })
// });





































/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

///////////////////