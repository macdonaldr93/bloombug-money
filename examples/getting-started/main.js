const { CAD, USD, Mint } = require('@bloombug/money');
const currencies = require('@bloombug/money/iso-currencies.json');

const { Money, exchange } = new Mint({
  currencies,
  defaultCurrency: USD,
});

exchange.addRate(USD, CAD, 1.26);
exchange.addRate(CAD, USD, 0.74);

const wallet = Money();
console.log(`My wallet has ${wallet.toLocaleString()}`);

const payment1 = Money(1000);
wallet.add(payment1);
console.log(`+ Received payment of ${payment1.toLocaleString()}`);
console.log(`My wallet has ${wallet.toLocaleString()}`);

const payment2 = Money(2000, CAD);
wallet.add(payment2);
console.log(`+ Received payment of ${payment2.toLocaleString()}`);
console.log(
  `Coverting to USD: ${payment2} -> ${exchange.exchangeWith(payment2, USD)}`
);
console.log(`My wallet has ${wallet.toLocaleString()}`);

const spending = Money(1000, CAD);
console.log(`- Spending ${spending.toLocaleString()}`);
console.log(
  `Coverting to USD: ${spending.toLocaleString()} -> ${exchange.exchangeWith(
    spending,
    USD
  )}`
);
wallet.subtract(Money(1000, CAD));
console.log(`My wallet has ${wallet.toLocaleString()}`);
