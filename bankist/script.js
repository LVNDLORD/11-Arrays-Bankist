'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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

const displayMovements = function (movements) { // better practice to pass data into a function, rather that make func work with global var
  containerMovements.innerHTML = ''; // replacing existing html to nothing. Removing prewritten html code

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);  //method to add html template to the webpage container div.movements
    // 2 args as strings. 1st - position in which we wanna attach html https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
    // 2nd arg - string containing html we wanna insert
    // beforeend - the order of elements will be inverted. Each new element would be added after the previous one. At the end of the container
  });

};


// calculating balance per account
const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance} EUR`;
};

// calculating total incomes, withdraws and interest from the account
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`

  const out = acc.movements.filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`

  const interest = acc.movements.filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100) // deposit * 1,2% (bank pays 1.2% of the value of each transaction)
    .filter((int, i, arr) => { // filtering out transaction from which the interest will be less than 1€ (e.g. new rule from the bank)
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int); // total interest value for all transactions
  labelSumInterest.textContent = `${interest}€`
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


// Event handlers
// default behav of HTML in submit forms is after clicking the button to reload the page. We gotta change it
let currentAccount;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault(); // prevent form from submitting

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value));  //! optional chaining. Checking pin only if the current account exist
  //display UI and welcome message
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`; // splitting name and surname. From resulting array taking the first el/word in this case
  containerApp.style.opacity = 100;
  // clear input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur(); // !! field looses it's focus

  //display movements
  displayMovements(currentAccount.movements);
  //display balance
  calcDisplayBalance(currentAccount.movements);
  //display summary
  calcDisplaySummary(currentAccount);
});

































/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
