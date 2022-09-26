function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g," ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
  return str;
}
function scrapeCommentsWithoutReplies(){
var ss = SpreadsheetApp.getActiveSpreadsheet();
var result=[['Comment','tag']];
var vid = 'qAQHz2zPFFQ';
var nextPageToken=undefined;

var buon = ['buồn','bùn','pùn','khóc','chết','trầm cảm','chán nản',
           'thất vọng','buồn phiền','nhụt chí',
           'chán ghét','phẫn nộ','thất vọng','nản lòng','nản chí','tối tăm',
           'u ám','u sầu','tan vỡ','buồn rầu','ảm đạm','tang tóc','thê lương',
           'không vui','buồn bực','khổ','yếu lòng','nước mắt'];

var hoiBuon = ['nhớ','lo lắng','bối rối','căng thẳng','tổn thương','da diết','quá khứ',
               'cảm xúc','sầu','miss','người iu cũ','ngiucu','bồi hồi','phiền lòng','ngã lòng','phiền muộn'
               ,'xa rồi','xa khuất','rời xa','xa xăm','xa xôi','heo hút','héo','khô','mưa','mây buồn','bão','lạnh'
              ,'giá','rét','nhiều mây'];

var bth = ['nhẹ nhàng','hoài niệm','kí ức','ký ức','bình yên','ấm','lãng mạn','chill','hài lòng'
           ,'hứng thú','tuyệt nhiên','tuyệt vời','sâu lắng','lá vàng','gay gắt','hạ đỏ','hạ buồn',
          'chill','thanh thản'];

var hoiVui =['hạ','xanh ngắt','xanh','thu hút','hấp dẫn','phấn khởi','lạc quan','tự hào','thư giãn','thoải mái'
             ,'biển xanh','hào hứng','đa cảm','hài hóa','thú vị','say đắm','đắm chìm','hào phóng','táo bạo'];

var vui = ['tươi','vui','zui','yêu cuộc đời','say đắm','yêu đời','xuân','hoa nở','cánh én','ngọt ngào','si mê',
          'hạnh phúc','thỏa mãn','hân hoan','sung sướng','sôi nổi','đầy sức sống','đầy không khí','hy vọng','hòa bình',
           'happy','yêu say đắm','sướng','mê'];

var word = [buon,hoiBuon,bth,hoiVui,vui];

while (1) {
  var data = YouTube.CommentThreads.list("snippet", {
    videoId: vid,
    maxResults: 100,
    pageToken: nextPageToken,
  });
  nextPageToken = data.nextPageToken;
  //console.log(nextPageToken);
  for (var row = 0; row < data.items.length; row++) {
    var text = data.items[row].snippet.topLevelComment.snippet.textDisplay
      .trim()
      .toLowerCase();
    var tag = "";
    for (emo in word) {
      let kt = false;
      for (x of word[emo]) {
        if (text.includes(x)) {
          if (emo == 0) tag = "buon";
          else if (emo == 1) tag = "hoiBuon";
          else if (emo == 2) tag = "bth";
          else if (emo == 3) tag = "hoiVui";
          else if (emo == 4) tag = "Vui";
          result.push([text, tag]);
          kt = true;
          break;
        }
      }
      if (kt === true) break;
    }
  }
  if (nextPageToken == "" || typeof nextPageToken === "undefined") {
    break;
  }
}
var newSheet=ss.insertSheet(ss.getNumSheets())
newSheet.getRange(1, 1,result.length,2).setValues(result)

}