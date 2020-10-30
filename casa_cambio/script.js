window.onload = () => {
    setupEventHandlers();
    apagarTabela();
  }
  
  const setupEventHandlers = () => {
    const searchButton = document.querySelector('#search-button');
    searchButton.addEventListener('click', handleSearchEvent);
    document.addEventListener('keypress', function(enter){
      if(enter.which == 13) { // para apertar enter
        handleSearchEvent();
      }
   }, false);
  }
  
  const handleSearchEvent = () => {
    const currency = document.querySelector('#currency-input').value;
    const currencyUpperCased = currency.toUpperCase();
  
    cleanList();
    
    if (currency === '') {
      showAlert('A moeda deve ser informada');
    } else {
      // fetchCurrency(currencyUpperCased);
      fetchCurrencyAwaitAsync(currencyUpperCased);
    }
  }
  
  const showAlert = (message) => {
    window.alert(message);
  }
  
   const fetchCurrency = () => {
     // rquisição para o btc
     const endpoint = `https://api.coindesk.com/v1/bpi/currentprice.json`;
     fetch(endpoint)
     .then((response) => response.json())
       .then((object) => {
         if (object.error) {
           throw new Error(object.error)
         } else {
           // se tiver a resposta eu tranformo o objeto em array
           // e com a resposta eu jogo na funçao de colcoar na lista
           const btcEntrada = Object.entries(object.bpi)
           console.log(btcEntrada)
           btcEntrada.sort().map(([moeda, valor]) => {
             renderRate([moeda, valor.rate])
           })
         }
       })
       .catch((error) => showAlert(error));
   }
  
  
  const fetchCurrencyAwaitAsync = async (currency) => {
    if (currency.toUpperCase() === 'BTC') fetchCurrency();

    else {
      const endpoint = `https://api.ratesapi.io/api/latest?base=${currency}`;
  
    try {
      const response = await fetch(endpoint);
      const object = await response.json();
  
      if (object.error) {
        throw new Error(object.error);
      } else {
        handleRates(object.rates);
      }
    } catch (error) {
      showAlert(error);
    }
  }
  }
  
  const handleRates = (rates) => {
    const ratesEntries = Object.entries(rates);
    ratesEntries.sort().forEach(renderRate) // ordem alfabetica da lista
    ratesEntries.forEach((entry) => renderRate(entry));
  }
  
  const renderRate = ([ currency, value ]) => {
    const ul = document.querySelector('#currency-list');
    const li = document.createElement("li");
    li.innerHTML = `${currency}: ${value}`
    ul.appendChild(li)
  }
  
  const cleanList = () => {
    const ul = document.querySelector('#currency-list');
    ul.innerHTML = '';
  }

  const apagarTabela = () => {
    const botaoApagar = document.querySelector('#limpar');
    botaoApagar.addEventListener('click', cleanList);
  }