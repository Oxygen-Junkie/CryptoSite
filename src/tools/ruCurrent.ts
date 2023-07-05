import axios from 'redaxios'

export default (await axios.get('https://www.bitsv.com/api/rate?q=usd_to_rub'))
  .data.value
