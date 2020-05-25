exports.formatDate = (date) => {

  if(date instanceof Date) {
    date = date.getTime();
  }

  if (!isNaN(date)) {
    var time = new Date(parseInt(date))
    var y = time.getFullYear();
    var m = time.getMonth() + 1 < 10 ? `0${time.getMonth() + 1}` : time.getMonth() + 1;
    var d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    var h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    var mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    var s = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
  }
  return ''
}
