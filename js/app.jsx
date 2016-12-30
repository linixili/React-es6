//可以通过闭包实现模块化开发
(function ($, React, ReactRouter) {
// 定义一些变量
var BANNER_NUM = 2;
var ITEM_NUM = 33;
var app = $('#app')
// 定义数据容器
var DataBase;

// 第一步 定义typeaction
var TypeAction = Reflux.createActions(['changeType'])
// 第二步 定义store
var TypeStore = Reflux.createStore({
	// 关联action
	listenables: [TypeAction],
	onChangeType: function (query) {
		// 通过query去过滤数据
		var result = [];
		DataBase.forEach(function (obj) {
			// 判断是否query类型的网站
			if (obj.type === query) {
				// 将该对象保留
				result.push(obj)
			}
		})
		// console.log(result, query)
		// console.log(123, query)
		// 工作中常常在store中将结果保留
		// this.list = result;
		// 将结果传递给组件
		this.trigger(result)
	}
})

// 第一步 创建action
var SearchAction = Reflux.createActions(['changeSearch'])
// 第二步 定义store
var SearchStore = Reflux.createStore({
	// 监听action
	listenables: [SearchAction],
	// 注册action方法
	onChangeSearch: function (query) {
		// 定义检索结果
		var result = [];
		// 搜索
		DataBase.forEach(function (obj) {
			// 检索属性值是否包含query
			for (var i in obj) {
				// 如果该属性值包含query
				if (obj[i].indexOf(query) >= 0) {
					// 缓存对象
					result.push(obj)
					return;
				}
			}
		})
		// console.log(result, query)
		// 通知组件
		this.trigger(result)
	}
})


// 定义Header组件
var Header = React.createClass({
	// 点击logo图片进入首页
	goIndex: function () {
		// 切换hash
		ReactRouter.HashLocation.replace('/')
	},
	// 输入回车进入搜索页面
	goSearch: function (e) {
		// console.log(e.keyCode, e.target.value)
		// 回车键是13
		if (e.keyCode === 13) {
			var value = e.target.value;
			// 判断输入的文案是否合法，
			// 去除首位空白符
			value = value.replace(/^\s+|\s+$/g, '');
			// 判断是否是空字符串
			if (value === '') {
				alert('请输入正确的搜索关键字！')
				return ;
			}
			value = encodeURIComponent(value)
			// 输入的内容要编码
			ReactRouter.HashLocation.replace('/search/' + value)
		}
	},
	render: function () {
		return (
			<div>
				<header className="header">
					<div className="container">
						<input onKeyUp={this.goSearch} type="text" className="pull-right"/>
						<img onClick={this.goIndex} src="img/logo.png" alt="" className="pull-left"/>
						<ul className="nav nav-pills nav-justified">
							<li>
								<a href="#/type/movie">视频</a>
							</li>
							<li>
								<a href="#/type/games">游戏</a>
							</li>
							<li>
								<a href="#/type/news">新闻</a>
							</li>
							<li>
								<a href="#/type/sports">体育</a>
							</li>
							<li>
								<a href="#/type/buy">购物</a>
							</li>
							<li>
								<a href="#/type/friends">社交</a>
							</li>
						</ul>
					</div>
				</header>
				<div className="banner"></div>
			</div>
		)
	}
})

// 将可以被复用的方法放在一个对象中，通过混合让每一个组件继承
var Methods = {
	// 随机一张图片
	getBackgroundImageUrl: function () {
		// 定义随机整数
		var num = parseInt(Math.random() * ITEM_NUM);
		return 'url(img/item/item' + num + '.jpg)';
	},
	// 渲染列表
	createList: function () {
		var me = this;
		// {
		// 	"site": "http://www.iqiyi.com/?vfm=f_328_hao1",
		// 	"name": "爱奇艺高清",
		// 	"company": "爱奇艺",
		// 	"type": "movie",
		// 	"description": "看电影网站"
		// },
		return this.state.list.map(function (value, index) {
			var style = {
				backgroundImage: me.getBackgroundImageUrl()
			}
			return (
				<li key={index} style={style}>
					<a href={value.site} target="_blank">
						<div className="content">
							<h1>{value.name}</h1>
						</div>
						<div className="layer">
							<p>
								<span>公司：</span>
								<span>{value.company}</span>
							</p>
							<p>
								<span>类型：</span>
								<span>{value.type}</span>
							</p>
							<p>
								<span>描述信息：</span>
								<span>{value.description}</span>
							</p>
						</div>
					</a>
				</li>
			)
		})
	}
}


// 定义首页组件
var IndexPage = React.createClass({
	mixins: [Methods],
	// 定义初始化状态
	getInitialState: function() {
		return {
			list: DataBase
		}
	},
	render: function () {
		return (
			<div className="main">
				<ul className="clearfix">{this.createList()}</ul>
			</div>
		)
	}
})

// 定义分类列表页组件
var TypePage = React.createClass({
	// 第三步关联store与组件
	mixins: [Reflux.connect(TypeStore, 'list'), Methods],
	// 初始化状态
	getInitialState: function() {
		return {
			list: []
		}
	},
	render: function () {
		// console.log(this.state.list, 666)
		return (
			<div className="main">
				<ul className="clearfix">{this.createList()}</ul>
			</div>
		)
	}
})

// 定义搜索页面组件
var SearchPage = React.createClass({
	// 第三步绑定组件
	mixins: [Reflux.connect(SearchStore, 'list'), Methods],
	// 初始化状态
	getInitialState: function() {
		return {
			list: []
		}
	},
	render: function () {
		return (
			<div className="main">
				<ul className="clearfix">{this.createList()}</ul>
			</div>
		)
	}
})


var App = React.createClass({
	render: function () {
		// 查看属性中的路由参数对象
		// console.log(this.props.params)
		return (
			<div>
				<Header></Header>
				{/*定义定义容器元素*/}
				<ReactRouter.RouteHandler></ReactRouter.RouteHandler>
			</div>
		)
	},
	// 发送消息
	sendAction: function () {
		// 获取query
		var query = decodeURIComponent(this.props.params.params.query)
		var page = this.props.params.path
		// 如果是type页面
		if (page.indexOf('/type/') >= 0) {
			//  此时向typeaction发出消息，通知store更新数据 
			TypeAction.changeType(query)
		} else if(page.indexOf('/search/') >= 0) {
			SearchAction.changeSearch(query)
		}
		// console.log(this.props.params)
	},
	// 组件构架完成发送消息
	componentDidUpdate: function() {
		// TypeAction.changeType('app')
		this.sendAction()
	},
	componentDidMount: function() {
		this.sendAction()
	}
})

// 第二步 定义路由组件
var Route = React.createFactory(ReactRouter.Route)
var DefaultRoute = React.createFactory(ReactRouter.DefaultRoute)

// 第三步 定义规则
var routes = (
	<Route path="/" handler={App}>
		<Route path="/type/:query" handler={TypePage}></Route>
		<Route path="/search/:query" handler={SearchPage}></Route>
		<DefaultRoute handler={IndexPage}></DefaultRoute>
	</Route>
)

/**
 * 定义图片加载器
 * @step 	每张图片加载成功时候的回调函数
 * @success 加载成功时候的回调函数
 * @fail	加载失败时候执行的回调函数
 **/ 

var ImageLoader = function (step, success, fail) {
	this.step = step;
	this.success = success;
	this.fail = fail;
	this.init();
}
ImageLoader.prototype = {
	// 初始化一些数据的
	init: function () {
		// item图片总数，以及当前图片数
		this.totalNum = this.num = ITEM_NUM;
		// banner图片的总数，以及当前banner图片数
		this.totalBannerNum = this.bannerNum = BANNER_NUM;
		// 加载这些图片
		this.loader()
	},
	// 加载图片
	loader: function () {
		// 加载banner
		while(--this.bannerNum >= 0) {
			// 加载banner图片
			this.loadImage(this.bannerNum, true)
		}
		this.bannerNum++;
		// 加载item图片
		while(--this.num >= 0) {
			// 加载图片
			this.loadImage(this.num)
		}
		this.num++;
	},
	/**
	 * 处理加载的图片数据
	 * @isBanner 	是否是bannner图片
	 ***/ 
	dealNum: function (isBanner) {
		// 判断是否是banner图片
		if (isBanner) {
			// 加bannerNum
			this.bannerNum++;
		} else {
			// 加num
			this.num++;
		}
	},
	/**
	 * 执行回调函数
	 * @isFail 	是否是失败的
	 **/ 
	isReady: function (isFail) {
		// 已经加载完成的图片
		var num = this.num + this.bannerNum;
		// 图片总数
		var total = this.totalNum + this.totalBannerNum;
		// 都要执行一次step,传入已经加载完成的图片，以及图片总数
		if (isFail) {
			this.fail()
		} else {
			this.step(num, total);
		}
		// 加载完成
		if (num === total) {
			this.success()
		}
	},
	/**
	 * 加载一张图片的
	 * @num 		图片索引值
	 * @isBanner 	是否是banner图片
	 **/
	loadImage: function (num, isBanner) {
		var img = new Image();
		// 图片加载成功回调
		img.onload = function () {
			// 处理加载的图片数据
			this.dealNum(isBanner);
			// 执行回调函数
			this.isReady();
		}.bind(this)
		// 图片加载失败执行fail
		img.onerror = function () {
			// 处理加载的图片数据
			this.dealNum(isBanner);
			// 执行回调函数
			this.isReady(true);
		}.bind(this)
		// 加载图片
		img.src = this.getImageUrl(num, isBanner)
	},
	/**
	 * 获取图片地址的
	 * @num 		图片索引值
	 * @isBanner 	是否是banner图片
	 * return 		图片地址
	 **/
	getImageUrl: function (num, isBanner) {
		if (isBanner) {
			return 'img/banner/banner' + num + '.jpg';
		} else {
			return 'img/item/item' + num + '.jpg';
		}
	}
}

$.get('data/sites.json', function (res) {
	if (res && res.errno === 0) {
		// 存储数据
		DataBase = res.data;
		// 加载图片
		new ImageLoader(
			function (num, total) {
				// console.log('step', num, total)
				app.find('.loader-text span').html((num / total * 100).toFixed(2))
			},
			function () {
				// 第四步 启动路由
				ReactRouter.run(routes, function (Handler, params) {
					// 渲染组件
					React.render(<Handler params={params}></Handler>, app[0])
				})
			}
		)
	}
})


})(jQuery, React, ReactRouter);