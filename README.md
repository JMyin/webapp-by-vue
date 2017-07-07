仿某外卖APP小结

##### 1.用到的工具
- Vue-cli：脚手架工具，搭建基本代码框架
- Vue-router：官方插件管理路由
- Vue-resource：与后台做ajax通信
- Webpack：构建工具
- Es6+eslint：es6的代码风格检查工具
- Stylus：css预处理器

##### 2.Vue：轻量级框架，数据驱动+组件化
###### MVVM框架：view(视图Dom)、viewmodel（通讯 观察者）、model（数据js对象）
- 针对具有复杂交互逻辑的前端应用 提供基础的架构抽象
- 通过AJAX数据持久化，保证前端用户体验。使用ajax的好处是当页面需要更新某些部分时，不需要重新加载整个页面，而是改变相应的部分，这对移动端来说的非常重要的，因为移动端重新加载整个页面的代价太大，虽然有缓存，但是仍会加载dom及js等。
######  核心思想：
- 数据驱动：DOM是数据的一种自然映射
- 数据响应原理：数据改变驱动视图自动更新
- 组件化：扩展HTML元素，封装可重用的代码
- 组件设计原则：页面上每个独立的可视/可交互区域视为一个组件，每个组件对应一个工程目录，组件所需要的各种资源在这个目录下就近维护（通过.Vue文件将页面依赖的组件、样式等都写在一个文件中）；页面是组件的容器，组件可以嵌套自由组合形成完整的页面。

##### 3.实现真正的移动端1px：伪类after(before) +媒体查询@media缩放

		
```
border-1px($color)
	position: relative
	&:after
		display: block
		position: absolute
		left: 0
		bottom: 0
		width: 100%
		border-top: 1px solid $color
		content: ' '

@media (-webkit-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)
	.border-1px
		&::after
			-webkit-transform: scaleY(0.7)
			transform: scaleY(0.7)

@media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2)
	.border-1px
		&::after
			-webkit-transform: scaleY(0.5)
			transform: scaleY(0.5)
```


实现方式：首先是在要定义边框的元素上使用伪类after（上边框用before），这个伪类相当于元素是一个绝对定位的底边框，通过伪类画了一个1px的边框，定位到下面 就是1px的下边框；
然后使用@media：通过应用一个class对这个伪类进行一个缩放，这个缩放是根据设备的最小dpr来设定的；如果设备的dpr是1.5 就进行0.7的缩放，如果设备的dpr是2 就进行0.5倍的缩放；就是对y轴进行一个缩放。

4.better-scroll相关点

		
```
created: {
    this.$nextTick(() => {
		this._initScroll();
		this._calculateHeight();
	});
},
methods: {
	_initScroll() {
		this.menuScroll = neBScroll(this.$refs.menuwrapper, {
			click: true
		});
		this.foodsScroll = neBScroll(this.$refs.foodswrapper, {
			probeType: 3,
			click: true
		});
	},
}
```
		
- 当初始化BScroll的时候（即执行this.menuScroll = new BScroll(this.$els.menuWarpper, {});的时候），它是个DOM，虽然在vue里 我们更改数据DOM也会跟着数据做映射，但是vue在更新DOM的时候是个异步的过程， 所以DOM数据没有变化的时候去初始化计算BScroll的时候ul高度的计算就会有问题。所以要用vue的一个接口 
this.$nextTick(()=>{  this._initScroll()  })
这样才能正确的计算ul高度。

---
在移动端 BScroll监听touch事件，阻止默认的，设置这个属性使之可以点击。但是在PC端，是不会阻止默认的点击事件的，原生点击也会被监听到。当初始化BScroll的时候设置click: true是默认去派发一个点击事件，所以在PC端的时候就会派发两个点击事件 回调函数会执行2次。考虑到浏览器的原生属性是没有event._constructed这个属性的，在方法避免在PC端的问题。
if (!event._constructed) { return;  };
###### 注：如果是 vue2.x，注意 v-el 已经废弃了，要使用 ref代替。
在vue写应用的时候，遇到与原生DOM做交互的时候，要注意：
在模板中定义v-ref（替代1.x的v-el），可以用this.$refs.element去访问他，就相当于拿到了一个原生DOM
想要去计算跟DOM相关的东西的时候 一定要保证DOM已经渲染了，因为在vue里 虽然说DOM是数据的自然映射，但是DOM真正发生变化 实在this.$nextTick(()=>{})这个回调函数之后，虽有在操作原生DOM的时候，一定要调用$nextTIck()这个接口，然后在这个接口的回调里去做任何事情，这样可以保证DOM已经渲染好了，操作DOM的一些相关属性的值得时候就不会出现错误。
##### 5.父子组件之间通信
Vue中，父子组件之间通信：子组件向父组件传递信息，改变父组件中的某些信息。对于把子组件信息传递给父组件，之前1.0的版本是用的$dispatch，但是vue在2.x版本废除了$dispatch，所以不能使用原来的方法了。因为现行项目是一个小项目，目前还没有使用vuex的打算，通过看vue官方文档，通过使用emit、on成功实现了通信，如下所示：
	
```
//在父组件里通过created钩子监听子组件自定义的事件
created:{
	this.$on('change', (el) => {
		this.selectType = el;
		// 当状态改变的时候，要等到DOM发生变化之后执行this.scroll。refresh()重新计算页面高度
		this.$nextTick(() => {
			this.scroll.refresh();
		});
	});
},


//在子组件里这样触发事件,可使父组件去监听子组件，当父组件监听到这个事件的时候，就可以去改变selectType，即完成了父子组件之间的通信

	this.$parent.$emit('change', type);
```


   
			"# webapp-by-vue" 
