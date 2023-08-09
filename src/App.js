/*
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/


import { useEffect, useState } from 'react' // Hooks

import './App.css';

//Se importan los componentes principales de la app
import Header from './Components/Header'
import CardPrincipal from './Components/CardPrincipal';
import Card from './Components/Card'
import Convert from './Components/Convert'
import TableCoins from './Components/TableCoins'
import Footer from './Components/Footer'

function App() {
  /* 3 estados principales. setCoins en donde almacena el valor de todas las monedas en el consumo de la api.
  setCurrency, almacena el valor de todas las divisas que entrega el cosnumo de la api.
  setSelCur, almacena el valor de la divisa seleccionada. */

  const [coins, setCoins] = useState();
  const [currency, setCurrency] = useState();
  const [selCur, setSelCur] = useState("usd");

// Se realiza el cosnumo de la api por metodo async await y usando fetch
// Se define la variable getData que contiene el llamado de la api.

  const getData = async () => {

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${selCur}&order=market_cap_desc&per_page=4&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C30d%2C90d%2C1y`
    );
/* 
      Cuando hacemos el llamado de la API el valor que nos retorna es un arreglo de objetos tipo json, este valor se almacena en una variable y lo vamos a leer por medio del método json()
    */
    const json = await response.json();

// ULR que permite acceder a diferentes divisas y se almacena en una variable
    const response_cur = await fetch(
      `https://api.coingecko.com/api/v3/simple/supported_vs_currencies`
    );


    const cur = await response_cur.json();

// Almacena toda la info de de las monedas en ese estado.
    setCoins(json);

// Almacena el valor de las divisas en ese estado.
    setCurrency(cur);
  };

// Estado que carga la información cuando el componente esta listo.
  useEffect(() => {
    getData();// eslint-disable-next-line
  },[]); // eslint-disable-next-line

// Estado que que carga la información cuando seleccionamos otra divisa.
  useEffect(() => {
    getData();// eslint-disable-next-line
  }, [selCur]); // eslint-disable-next-line


  return !coins ? 
    ("Cargando...")
   : 
    <div className="App">
      <Header currencys={currency} fun={setSelCur} cur={selCur} />
      <main>
        <CardPrincipal json={coins[0]} cur={selCur} />

        (<div className="cards_con">
          {coins.map(
            (
              {
                id,
                symbol,
                image,
                current_price,
                price_change_percentage_30d_in_currency,
              },
              index // eslint-disable-next-line
            ) => {
              if (index !== 0) {
                return (
                  <Card
                    key={index}
                    price={`${symbol} - ${current_price} ${selCur} `}
                    porcentaje={deleteDec(
                      price_change_percentage_30d_in_currency,
                      2
                    )}
                    img={image}
                    coinId={id}
                    cur={selCur}
                  />
                );
              }
            }
          )}
        </div>)
      </main>
      <Convert />
      <TableCoins coins={coins} />
      <Footer />
    </div>
  ;
}

export default App;

// La función para formatear los decimales 
export function deleteDec(val, decimal) {
  return val.toFixed(decimal);
}

// Función para asignar color de acuerdo al valor numerico.
export function colorDec(num) {
  return num > 0 ? "green" : "red";
}

// Función para separar los valores en miles. 
export const numberF = Intl.NumberFormat("es-ES");