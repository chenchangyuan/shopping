# Vue实现电商网站项目
`vue` + `vue-router` + `vuex`实现电商网站

## 效果展示

![](https://user-gold-cdn.xitu.io/2019/3/18/16990d6fd5380b63?w=991&h=606&f=gif&s=709516)

## install
+ 下载代码: `git clone https://github.com/chenchangyuan/shopping.git`
+ 安装依赖: `npm install`
+ 启动项目: `npm run dev`
> 运行环境: [node v9.11.1](https://nodejs.org/zh-cn/download/ 'Node.js') *npm 5.6.0*

## 需求分析
1. 登录页面、商品列表页（网站首页）、购物车页（实现结算）、商品详情页
2. 可按颜色、品牌对商品进行筛选，单击选中，再次点击取消
3. 根据价格进行升序降序、销量降序排列
4. 商品列表显示图片、名称、销量、颜色、单价
5. 实时显示购物车数量（商品类别数）
6. 购物车页面实现商品总价、总数进行结算，优惠券打折

## 数据存储 & 数据处理
* `product.js`存放商品数据（生产环境需通过接口调用获取数据）

```javascript
{
	id: 1,
	name: 'AirPods',
	brand: 'Apple',
	image: '/src/images/airPods.jpg',
	imageDetail: '/src/images/airPods_detail.jpg',
	sales: 10000,
	cost: 1288,
	color: '白色'
},
```

* `window.localStorage`实现数据存储与验证

```javascript
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
```

**数据过滤与排序处理**
```javascript
filteredAndOrderedList(){
	//拷贝原数组
	let list = [...this.list];
	//品牌过滤
	if(this.filterBrand !== ''){
		list = list.filter(item => item.brand === this.filterBrand);
	}
	//颜色过滤
	if(this.filterColor !== ''){
		list = list.filter(item => item.color === this.filterColor);
	}
	//排序
	if(this.order !== ''){
		if(this.order === 'sales'){
			list = list.sort((a, b) => b.sales - a.sales);
		}else if(this.order === 'cost-desc'){
			list = list.sort((a, b) => b.cost - a.cost);
		}else if(this.order === 'cost-asc'){
			list = list.sort((a, b) => a.cost - b.cost);
		}
	}
	return list;
}
```

**实时显示应付总额与商品数**
```javascript
//购物车商品总数
countAll(){
	let count = 0;
	this.cartList.forEach(item => {
		count += item.count;
	});
	return count;
},
//购物车商品总价
costAll(){
	let cost = 0;
	this.cartList.forEach(item => {
		cost += this.productDictList[item.id].cost * item.count;
	});
	return cost;
}
```

**购物车结算处理**
```javascript
//通知Vuex,完成下单
handleOrder(){
	this.$store.dispatch('buy').then(() => {
		window.alert('购买成功');
	})
},
```

## vue-router & vuex
**vue-router路由管理**`/src/views/`目录下的`vue`组件进行设置，`router-views`挂载所有路由，登录界面与商品列表页面之间header做隐藏显示处理，登录状态下刷新页面跳转至列表页，其他页面设置默认跳转

**跳转处理**

```javascript
const router = new VueRouter(RouterConfig);

//跳转前设置title
router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title;
    next();
});
//跳转后设置scroll为原点
router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
});
```

**routers配置**

```javascript
//商品列表路由配置
const routers = [
    {
        path: '/list',
        meta: {
            title: '商品列表'
        },
        component: (resolve) => require(['./views/list.vue'], resolve)
    },
    {
        path: '/product/:id',
        meta: {
            title: '商品详情'
        },
        component: (resolve) => require(['./views/product.vue'], resolve)
    },
    {
        path: '/cart',
        meta: {
            title: '购物车'
        },
        component: (resolve) => require(['./views/cart.vue'], resolve)
    },
    {
        path: '/login/:loginStatus',
        meta: {
            title: '登录注册'
        },
        component: (resolve) => require(['./views/login.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/login/login'
    }
];
export default routers;
```

**vuex**状态管理，各组件共享数据在`state`中设置，`mutation`实现数据同步，`action`异步加载

```javascript
//配置Vuex状态管理
const store = new Vuex.Store({
    state: {
        //商品列表信息
        productList: [],
        //购物车数据，数组形式，数据元素为对象（商品id，购买数量count）
        cartList: [],
        //当前用户账号
        username: window.localStorage.getItem('username'),
        //登录状态
        loginStatus: !!window.localStorage.getItem('loginStatus'),
    },
	getters: {
        //品牌、颜色筛选
        brands: state => {
            const brands = state.productList.map(item => item.brand);
            return util.getFilterArray(brands);
        },
        colors: state => {
            const colors = state.productList.map(item => item.color);
            return util.getFilterArray(colors);
        }
    },
    //mutations只能以同步方式
    mutations: {
        //添加商品列表
        setProductList(state, data){
            state.productList = data;
        },
        //添加购物车
        addCart(state, id){
            const isAdded = state.cartList.find(item => item.id === id);
            //如果不存在设置购物车为1，存在count++
            if(isAdded){
                isAdded.count++;
            }else{
                state.cartList.push({
                    id: id,
                    count: 1
                })
            }
        },
		//修改购物车商品数量
        editCartCount(state, payload){
            const product = state.cartList.find(item => item.id === payload.id);
            product.count += payload.count;
        },
        //删除购物车商品
        deleteCart(state, id){
            const index = state.cartList.findIndex(item => item.id === id);
            state.cartList.splice(index, 1)
        },
        //清空购物车
        emptyCart(state){
            state.cartList = [];
        },
        getUser(state, username){
            console.log('username',username)
            state.username = username;
        },
        getLoginStatus(state, flag){
            state.loginStatus = flag;
        }
    },
	actions: {
        //异步请求商品列表，暂且使用setTimeout
        getProductList(context){
            setTimeout(() => {
                context.commit('setProductList', product_data)
            }, 500);
        },
        //购买
        buy(context){
            //生产环境使用ajax请求服务端响应后再清空购物车
            return new Promise(resolve => {
                setTimeout(() => {
                    context.commit('emptyCart');
                    resolve();
                }, 500);
            });
        },
    }
});
```

## 后记

项目地址: [github](https://github.com/chenchangyuan/shopping) 
如果对你有所帮助，请start

笔者个人微信 `gm4118679254` 欢迎加好友，一起沟通交流

## 参考资料
[Vue.js实战](https://item.jd.com/12215519.html 'Vue.js实战')
[Vue.js](https://cn.vuejs.org/ 'Vue.js')
