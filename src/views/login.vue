<template>
    <div class="login-info">
        <template v-if="login">
            <form class="login-info-form">
                <p>登陆界面</p><br>
                <span>用户账号: </span><input type="text" v-model="username" placeholder=""/><br>
                <span>用户密码: </span><input type="password" v-model="password"/><br><br>
                <input class="submit" type="button" @click="goHome" value="提交">
                <input class="submit" type="button" @click="changeLogin(false, true)" value="前往注册">
            </form>
        </template>
        <template v-if="register">
            <form class="login-info-form">
                <p>注册界面</p><br>
                <span>用户账号: </span><input type="text" v-model="username" placeholder=""/><br>
                <span>用户密码: </span><input type="password" v-model="password"/><br>
                <span>确认密码: </span><input type="password" v-model="confirmPassword"/><br><br>
                <input class="submit" type="button" @click="goLogin" value="提交">
                <input class="submit" type="button" @click="changeLogin(true, false)" value="已有账号">
            </form>
        </template>
    </div>
</template>

<script>
    import util from '../util';
    export default {
        name: "login",
        data(){
            return {
                login: false,
                register: true,
                username: '',
                password: '',
                confirmPassword: '',
            }
        },
        methods: {
            goLogin(){
                console.log('username',util.trim(this.username))
                if(!util.trim(this.username) || !util.trim(this.username) ){
                    window.alert('账号或密码不能为空');
                    return;
                }
                if(this.password !== this.confirmPassword){
                    window.alert('密码不一致，请重新输入');
                    this.password = '';
                    this.confirmPassword = '';
                }else{
                    window.localStorage.setItem('username', this.username);
                    window.localStorage.setItem('password', this.password);
                    this.register = false;
                    window.localStorage.setItem('loginStatus', 'login');
                    this.$store.commit('getUser', this.username);
                    window.alert('注册成功，确定进入网站首页');
                    window.location.href = '/list';
                }
            },
            changeLogin(b1, b2){
                this.login = b1;
                this.register = b2;
            },
            goHome(){
                let username = window.localStorage.getItem('username');
                let password = window.localStorage.getItem('password');
                if(!util.trim(this.username) || !util.trim(this.username) ){
                    window.alert('账号或密码不能为空');
                    return;
                }
                if(username === this.username && password === this.password){
                    this.login = false;
                    window.localStorage.setItem('loginStatus', 'login');
                    this.$store.commit('getUser', this.username);
                    window.alert('登陆成功，确定进入网站首页');
                    window.location.href = '/list';
                }else{
                    window.alert('账号或密码错误');
                }
            },
        },
        created(){
            //获取路由中的参数
            if(this.$route.params.loginStatus === 'logout'){
                window.localStorage.clear();
                this.$store.commit('getLoginStatus', false);
                return;
            }
            const loginStatus = this.$store.state.loginStatus;
            if(loginStatus){
                this.login = false;
                this.register = false;
                window.alert('您已经是登录状态')
                window.location.href = '/list'
            }
        }
    }
</script>

<style scoped>
    .login-info{
        height:100%;
        width:100%;
        text-align: center;
    }
    .login-info-form{
        position: relative;
        top: 100px;
    }
    p{
         font-size: 26px;
         color: #5c6b77;
     }
    .submit{
        font-size: 18px;
    }
    span{
        font-size: 16px;
        color: #5c6b77;
    }
</style>