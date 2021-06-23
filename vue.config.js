module.exports = {
  devServer: { //개발 서버 설정
    proxy: { //프록시 설정
      '/api':{
        //프록시 요청을 보낼 서버의 주소
        target: 'http://localhost:8080'
      }
    }
  }
};
