<template>
    <div class="product">
        <router-link :to="'/product/' + info.id"
                     class="product-main">
            <!-- 依次显示商品图片、名称、销量、颜色、单价，加入购物车 -->
            <img :src="info.image">
            <h4>{{info.name}}</h4>
            <h4>销量{{info.sales}}</h4>
            <div class="product-color"
                 :style="{background: colors[info.color]}"></div>
            <div class="product-cost">￥ {{info.cost}}</div>
            <!-- 阻止冒泡，否则点击按钮的同时也会触发a标签进入详情页 -->
            <div class="product-add-cart"
                 @click.prevent="handleAddCart">加入购物车</div>
        </router-link>
    </div>
</template>

<script>
    export default {
        props: {
            info: Object
        },
        data () {
            return {
                colors: {
                    '白色': '#ffffff',
                    '金色': '#dac272',
                    '蓝色': '#233472',
                    '红色': '#f2352e'
                }
            }
        },
        methods: {
            handleAddCart(){
                this.$store.commit('addCart', this.info.id);
            }
        }
    }
</script>
<!-- scoped属性表示只对当前组件有效，不影响其他组件 -->
<style scoped>
    .product{
        width: 25%;
        float: left;
    }
    .product-main{
        display: block;
        margin: 16px;
        padding: 16px;
        border: 1px solid #dddee1;
        border-radius: 6px;
        overflow: hidden;
        background: #fff;
        text-align: center;
        position: relative;
    }
    .product-main img{
        width: 100%;
    }
    h4{
        color: #222;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .product-main:hover h4{
        color: #0070c9;
    }
    .product-color{
        display: block;
        width: 16px;
        height: 16px;
        border: 1px solid #dddee1;
        border-radius: 50%;
        margin: 6px auto;
    }
    .product-cost{
        color: #de4037;
        margin-top: 6px;
    }
    .product-add-cart{
        display: none;
        padding: 4px 8px;
        background: #2d8cf0;
        color: #fff;
        font-size: 12px;
        border-radius: 3px;
        cursor: pointer;
        position: absolute;
        top: 5px;
        right: 5px;
    }
    .product-main:hover .product-add-cart{
        display: inline-block;
    }
</style>