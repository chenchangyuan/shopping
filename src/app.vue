<template>
    <div>
        <template v-if="show">
            <div class="header">
                <router-link to="/list"
                             class="header-title">电商网站首页</router-link>
                <div class="header-menu">
                    <router-link to="/cart"
                                 class="header-menu-cart">
                        购物车
                        <span v-if="cartList.length">{{cartList.length}}</span>
                    </router-link>
                </div>
                <div class="header-menu">
                        {{user}}
                </div>
                <div class="header-menu">
                    <router-link to="/login/logout"
                                 class="header-menu-cart">
                        退出登录
                    </router-link>
                </div>
            </div>
        </template>
        <!-- 挂载所有路由 -->
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                user: this.$store.state.username
            }
        },
        computed: {
            cartList(){
                return this.$store.state.cartList;
            },
            show(){
                return this.$store.state.loginStatus;
            }
        }
    }
</script>

<style scoped>

</style>