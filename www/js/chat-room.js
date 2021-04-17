// const hostname = window.location.hostname;
// const socket = io(`ws://${hostname}`, {path: '/room/socket.io'}); // 服务器部署路径
const socket = io(`ws://127.0.0.1:3000`,);

const { createApp, reactive, toRefs, onMounted, inject, watch, nextTick } = Vue;
const { ElMessage, ElMessageBox } = ElementPlus;

const app = createApp({
    setup (props, ctx) {
        const $message = inject('$message');
        const $prompt = inject('$prompt');
        const state = reactive({
            loading: true,
            content: '',
            nickname: '',
            online: [],
            message: []
        })

        onMounted(() => {
            state.nickname = localStorage.getItem('nickname');
            if (!state.nickname) {
                confirmNickname();
            } else {
                setNickname(state.nickname);
                initSocket();
            }
        })

        watch(state.message, () => {
            nextTick(() => {
                let main = document.querySelector('.main');
                main.scrollTop = main.scrollHeight;
            })
        })

        const confirmNickname = () => {
            $prompt('输入昵称才能愉快的聊天', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: false,
                inputPattern: /^.{1,15}$/,
                inputErrorMessage: '昵称为1-15个字符'
            }).then(({ value }) => {
                $message({
                    type: 'success',
                    message: '请稍后~'
                });
                setNickname(value);
                initSocket();
            }).catch(() => {
                $message({
                    type: 'warning',
                    message: 'Sorry!! 没办法愉快的聊天了'
                });
            });
        }

        const setNickname = (nickname) => {
            localStorage.setItem('nickname', nickname);
            state.nickname = nickname;
            state.loading = false;
        }

        const sendMessage = () => {
            if (state.content === '') {
                return $message({
                    message: '请输入内容',
                    type: 'info'
                });
            }
            socket.emit('message', { content: state.content });
            state.content = '';
        }

        const initSocket = () => {
            socket.emit('online', { nickname: state.nickname });

            socket.on('message', data => {
                state.message.push({
                    type: 'message',
                    time: data.time,
                    nickname: data.nickname,
                    content: data.content
                })
            });

            socket.on('onlineList', data => {
                state.online = data;
            })

            socket.on('online', data => {
                state.message.push({
                    type: 'online',
                    time: data.time,
                    nickname: data.nickname,
                    content: '进入了聊天室'
                });
            })

            socket.on('leave', data => {
                state.message.push({
                    type: 'leave',
                    time: data.time,
                    nickname: data.nickname,
                    content: '离开了聊天室'
                });
            })
        }

        return {
            ...toRefs(state),
            confirmNickname,
            setNickname,
            sendMessage,
            initSocket
        }
    }
})

app.use(ElementPlus);

app.provide('$message', ElMessage);
app.provide('$prompt', ElMessageBox.prompt);

app.mount('#app');
