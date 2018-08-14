module.exports = {
  checkEmptyValue(data, requiredData) {
    for(var i = 0; i < requiredData.length; i++) {
      if(!data.hasOwnProperty(requiredData[i]) || !data[requiredData[i]] || (Array.isArray(data[requiredData[i]]) &&  data[requiredData[i]].length <= 0 ) ) {
        return false;
      }
    }
    return true;
  },
  getDateTimeFromUNIX(timestamp) {
    const
      date      = new Date(timestamp),
      year      =   date.getFullYear(),
      month     =   addZeroToDate(date.getMonth() + 1),
      day       =   addZeroToDate(date.getDate()),
      hours     =   addZeroToDate(date.getHours()),
      minutes   =   addZeroToDate(date.getMinutes()),
      seconds   =   addZeroToDate(date.getSeconds()),
      date_str  = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    return date_str;
  }
};
function addZeroToDate(i) {
  if(i < 10){
    i = '0'+i;
  }
  return i;
}
