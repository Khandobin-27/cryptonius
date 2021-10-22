import axios from 'axios'
import moment from 'moment';

//there is a need to format the given array response(API) 
//so it fitsd both x and y values of the chart
//y component refers to the proce
//x component refers to the time

const formatSparkline = (numbers) => {
  const sevenDaysAgo = moment().subtract(7, 'days').unix();
  let formattedSparkline = numbers.map((item, index) => {
    return {
      x: sevenDaysAgo + (index + 1) * 3600,
      y: item,
    }
  })

  return formattedSparkline;
}

  //from the data API file, here we are putting the actual API data on the line wiht the above function
  //to format it with the x and y axis
const formatMarketData = (data) => {
    let formattedData = [];
  
    data.forEach(item => {
      const formattedSparkline = formatSparkline(item.sparkline_in_7d.price)
  
      const formattedItem = {
        ...item,
        sparkline_in_7d: {
          price: formattedSparkline
        }
      }
  
      formattedData.push(formattedItem);
    });
  
    return formattedData;
  }

export const getMarketData = async () => {
    const URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=7d'
    try {
        const response = await axios.get(URL)
        const data = response.data
        const formattedResponse = formatMarketData(data)
        return formattedResponse
    } catch (error) {
        console.error(error.message)
    }
}