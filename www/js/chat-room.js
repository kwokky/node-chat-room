const socket = io().connect('http://127.0.0.1');

new Vue({
  el: '#app',

  mounted() {
    this.nickname = localStorage.getItem('nickname');
    if (!this.nickname) {
      this.confirmNickname();
    } else {
      this.setNickname(this.nickname);
      this.initSocket();
    }
  },

  data() {
    return {
      loading: true,
      content: '',
      nickname: '',
      online: [],
      message: []
    }
  },

  methods: {
    sendMessage() {
      if(this.content === '') {
        return this.$message({
          message: '请输入内容',
          type: 'info'
        });
      }
      socket.emit('message', {content: this.content});
      this.content = '';
    },

    confirmNickname() {
      this.$prompt('输入昵称才能愉快的聊天', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: false,
        inputPattern: /^.{1,15}$/,
        inputErrorMessage: '昵称为1-15个字符'
      }).then(({value}) => {
        this.$message({
          type: 'success',
          message: '请稍后~'
        });
        this.setNickname(value);
        this.initSocket();
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: 'Sorry!! 没办法愉快的聊天了'
        });
      });
    },

    setNickname(nickname) {
      localStorage.setItem('nickname', nickname);
      this.nickname = nickname;
      this.loading = false;
    },

    initSocket() {

      socket.emit('online', {nickname: this.nickname});

      socket.on('message', data => {
        this.message.push({
          type: 'message',
          time: data.time,
          nickname: data.nickname,
          content: data.content
        })
      });

      socket.on('onlineList', data => {
        this.online = data;
      })

      socket.on('online', data => {
        this.message.push({
            type: 'online',
            time: data.time,
            nickname: data.nickname,
            content: '进入了聊天室'
          });
      })

      socket.on('leave', data => {
        console.log('sdf');
        this.message.push({
            type: 'leave',
            time: data.time,
            nickname: data.nickname,
            content: '离开了聊天室'
          });
      })
    }
  },

  updated() {
    let main = document.querySelector('.main');
    main.scrollTop = main.scrollHeight;
  }
})
