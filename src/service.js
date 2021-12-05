const fetchExchangeRates = async () => {
  const response = await fetch("https://api.exchangerate.host/latest?base=INR");

  return response.json();
};
export default fetchExchangeRates;
