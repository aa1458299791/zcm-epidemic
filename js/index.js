//头部标题   实时显示时间
//定义一个函数 来获取显示时间
function showTime() {
	//获取当前时间
	var time = new Date();
	//获取里面的年月日时分秒
	var year = time.getFullYear(); //年
	// 使用指定字符串填充到目标字符串前面，使其达到目标长度；第一个参数是几位数，不足补什么
	var month = (time.getMonth() + 1 + '').padStart(2, '0'); //月
	var day = (time.getDate() + '').padStart(2, '0'); //日
	var hour = (time.getHours() + '').padStart(2, '0'); //时
	var minute = (time.getMinutes() + '').padStart(2, '0'); //分
	var second = (time.getSeconds() + '').padStart(2, '0'); //秒
	//使用es6模板字符串
	var content = `${year}年${month}月${day}日 : ${hour}:${minute}:${second}`;
	//定义数据显示在哪里 
	$('#title .time').text(content)
}
//调用函数
showTime();
setInterval(showTime, 1000); //每秒执行一次


// 发送请求  ，获取数据  累计的数据
var data;

function getData() {
	$.ajax({
		url: 'https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=localCityNCOVDataList,diseaseh5Shelf',
		data: {
			modules: 'localCityNCOVDataList,diseaseh5Shelf',
		},
		dataType: 'json', //jsonp改成json，您正在发出JSONP请求，但服务器正在以JSON进行响应。浏览器拒绝尝试将JSON视为JSONP，因为这将带来安全风险。
		success: function(res) {
			console.log(res.data);
			//将所获取的数据字符串转换成 json
			//data =  JSON.parse(res.data)
			//console.log(data);
			//把数据传给函数调用
			center1(res);
			center2(res);
			right1(res);
			right2(res);
			//left1(res);
			//left2(res);

		}
	});
	//*****  新增的数据
	$.ajax({
		type: 'post',
		url: 'https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list',
		data: {
			modules: 'chinaDayList,chinaDayAddList,cityStatis,nowConfirmStatis,provinceCompare'//请求接口要返回什么数据
		},
		dataType: 'json',
		success: function(res) {
			//console.log(res);
			//var data = res.data;
			//console.log(res.data);
			left1(res);
			left2(res);

			console.log(res)
		}
	});
	//****
}
//调用函数
getData();
setInterval(getData,5*60*1000);   //每5min查询获取一次数据  5分钟   setInterval定时器

//中1数据把总数据放进容器内显示   接受从接口获取的数据
function center1(res) {
	$('#confirm').text(res.data.diseaseh5Shelf.chinaTotal.confirm);
	$('#heal').text(res.data.diseaseh5Shelf.chinaTotal.heal);
	$('#dead').text(res.data.diseaseh5Shelf.chinaTotal.dead);
	$('#nowConfirm').text(res.data.diseaseh5Shelf.chinaTotal.nowConfirm);
	$('#noInfect').text(res.data.diseaseh5Shelf.chinaTotal.noInfect);
	$('#importedCase').text(res.data.diseaseh5Shelf.chinaTotal.importedCase);
};

//中二数据
function center2(res) {
	//var myChart = echarts.init($('#center2')[0],'dark'); //转化成dom对象
	//var myChart = echarts.init($('#center2')[0], 'dark');
	var myChart = echarts.init(document.getElementById('center2'), 'dark');

	// ----------中2的配置项-------------------
	// ----------中2的配置项-------------------
	var option = {
		backgroundColor:'',//设置背景颜色
		title: {
			text: '',
		},
		tooltip: {
			trigger: 'item'
		},
		visualMap: { // 左侧小导航图标
			show: true,
			x: 'left',
			y: 'bottom',
			textStyle: {
				fontSize: 8,
			},
			splitList: [{
					start: 1,
					end: 9
				},
				{
					start: 10,
					end: 99
				},
				{
					start: 100,
					end: 999
				},
				{
					start: 1000,
					end: 9999
				},
				{
					start: 10000
				}
			],
			color: ['#8A3310', '#C64918', '#E55B25', '#F2AD92', '#F9DCD1']
		},
		series: [{
			name: '累计确诊人数',
			type: 'map',
			mapType: 'china',
			roam: false, // 禁用拖动和缩放
			itemStyle: { // 图形样式
				normal: {
					borderWidth: .5, //区域边框宽度
					borderColor: '#009fe8', //区域边框颜色
					areaColor: "#ffefd5", //区域颜色
				},
				emphasis: { // 鼠标滑过地图高亮的相关设置
					borderWidth: .5,
					borderColor: '#4b0082',
					areaColor: "#fff",
				}
			},
			label: { // 图形上的文本标签
				normal: {
					show: true, //省份名称
					fontSize: 8,
				},
				emphasis: {
					show: true,
					fontSize: 8,
				}
			},
			data: [] // [{'name': '上海', 'value': 318}, {'name': '云南', 'value': 162}]
		}]
	};
	//定义series要显示的数据，  新建一个对象里面是从后台接口获取数据的路径数组
	var provinces = res.data.diseaseh5Shelf.areaTree[0].children; //获取数值要改
	//通过循环赋值给series，循环每个省份
	for (var province of provinces) {
		//赋值添加给谁，  option变量里面的series属性的data，往data这个数据里面添加数据
		option.series[0].data.push({
			'name': province.name, //省份
			'value': province.total.confirm //确诊总数量
		});
	}

	myChart.setOption(option);
	//******

}

// 右一数据，全国确诊前10的省市（柱状图）
function right1(res) {
	var myChart = echarts.init($('#right1')[0],'bark');

	var option = {
		backgroundColor:'',//设置背景颜色
		title: {
			text: "全国确诊省市TOP10",
			textStyle: {
				color: 'white',
			},
			left: 'left'
		},
		color: ['#3398DB'],
		tooltip: {
			trigger: 'axis',
			//指示器
			axisPointer: {
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		xAxis: {
			type: 'category',
			data: [] // ['湖北','广州','北京']
		},
		yAxis: {
			type: 'value',
			//y轴字体设置
			axisLabel: {
				show: true,
				color: 'white',
				fontSize: 12,
				//对y轴的数据作一个转换，以千k为单位
				formatter: function(value) {
					//判断value数值是不是大于1000
					if (value >= 1000) {
						//是侧除以1000  然后加上k
						value = value / 1000 + 'k';
					}
					//返回转换后的value
					return value;
				}
			},
		},
		series: [{
			data: [], // [582, 300, 100]
			type: 'bar',
			barMaxWidth: "50%"
		}]
	};

	var provinces = res.data.diseaseh5Shelf.areaTree[0].children;
	//定义一个数组存储省会名跟累计确诊数量
	var topData = [];
	for (var province of provinces) {
		topData.push({
			'name': province.name,
			'value': province.total.confirm
		});
	}
	//然后对topData数组降序排列   sort() 方法用于对数组的元素进行排序。传入两个函数对象  a，b  返回   value是上面定义的
	topData.sort(function(a, b) {
		return b.value - a.value;
	});
	//topData数组长度只保留前10个
	topData.length = 10;
	//console.log(topData);
	//分别取出省份名称和数值  重新循环赋值
	for (var province of topData) {
		option.xAxis.data.push(province.name);
		option.series[0].data.push(province.value);
	}
	myChart.setOption(option);
}

//右二，境外输入前5省市（饼状图）
function right2(res) {
	var myChart = echarts.init($('#right2')[0],'dark'); //,'dark'

	var option = {
		backgroundColor:'',//设置背景颜色
		title: {
			text: '境外输入确诊省市TOP5',
			textStyle: {
				color: 'white',
			},
			left: 'center'
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b} : {c} ({d}%)'
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			data: [],
		},
		series: [{
			name: '省市名称',
			type: 'pie',
			radius: '55%',
			center: ['50%', '60%'],
			data: [],
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};

	var provinces = res.data.diseaseh5Shelf.areaTree[0].children; //境外输入的判断
	var topData = [];
	//循环嵌套
	for (var province of provinces) {
		//第二次循环是因为有的境外输入并不是在第一个，所以要再循环一次
		for (var item of province.children) {
			//对境外输入的省份判定
			if (item.name === '境外输入') {
				topData.push({
					'name': province.name,
					'value': item.total.confirm
				});
				break;//循环退出结束
			}
		}

	}
	//降序的排列
	topData.sort(function(a, b) {
		return b.value - a.value;
	});
	//只保留前5个
	topData.length = 5;
	//分别取出省份名称和数据
	for (var province of topData) {
		option.legend.data.push(province.name);
		option.series[0].data.push(province);
	}

	//console.log(topData);


	myChart.setOption(option);
}

//左一
function left1(res) {
	var myChart = echarts.init($('#left1')[0],'dark'); //,'dark'

	// ----------左1的配置项-------------------
	var option = {
		backgroundColor:'',//设置背景颜色
		title: {
			text: "全国累计趋势",
			textStyle: {
				color: 'white',
			},
			left: 'left',
		},
		tooltip: {
			trigger: 'axis',
			//指示器
			axisPointer: {
				type: 'line',
				lineStyle: {
					color: '#7171C6'
				}
			},
		},
		//图例
		legend: {
			data: ['累计确诊', "累计治愈", "累计死亡"],
			left: "right"
		},
		//图形位置
		grid: {
			left: '4%',
			right: '6%',
			bottom: '4%',
			top: 50,
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			data: [] //['03.20', '03.21', '03.22']
		}],
		yAxis: [{
			type: 'value',
			//y轴字体设置
			axisLabel: {
				show: true,
				color: 'white',
				fontSize: 12,
				formatter: function(value) {
					if (value >= 1000) {
						value = value / 1000 + 'k';
					}
					return value;
				}
			},
			//y轴线设置显示
			axisLine: {
				show: true
			},
			//与x轴平行的线样式
			splitLine: {
				show: true,
				lineStyle: {
					color: '#17273B',
					width: 1,
					type: 'solid',
				}
			}
		}],
		series: [{
			name: "累计确诊",
			type: 'line',
			smooth: true,
			data: [] //[260, 406, 529]
		}, {
			name: "累计治愈",
			type: 'line',
			smooth: true,
			data: [] //[25, 25, 25]
		}, {
			name: "累计死亡",
			type: 'line',
			smooth: true,
			data: [] //[6, 9, 17]
		}]
	};

	// ******

	
	var chinaDayList = res.data.chinaDayList;
	for (var day of chinaDayList) {
		option.xAxis[0].data.push(day.date);
		option.series[0].data.push(day.confirm);
		option.series[1].data.push(day.heal);
		option.series[2].data.push(day.dead);

	}

	//console.log(topData);


	myChart.setOption(option);
}

//左二
function left2(res) {
	var myChart = echarts.init($('#left2')[0],'dark'); //,'dark'

	// ----------左2的配置项-------------------
	var option = {
		backgroundColor:'',//设置背景颜色
		title: {
			text: '全国新增趋势',
			textStyle: {
				color: 'white',
			},
			left: 'left',
		},
		tooltip: {
			trigger: 'axis',
			//指示器
			axisPointer: {
				type: 'line',
				lineStyle: {
					color: '#7171C6'
				}
			},
		},
		//图例
		legend: {
			data: ['新增确诊', '新增疑似','新增境外输入'],
			left: 'right'
		},
		//图形位置
		grid: {
			left: '4%',
			right: '6%',
			bottom: '4%',
			top: 50,
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			data: [] // ['03.20', '03.21', '03.22']
		}],
		yAxis: [{
			type: 'value',
			//y轴字体设置
			axisLabel: {
				show: true,
				color: 'white',
				fontSize: 12,
				formatter: function(value) {
					if (value >= 1000) {
						value = value / 1000 + 'k';
					}
					return value;
				}
			},
			//y轴线设置显示
			axisLine: {
				show: true
			},
			//与x轴平行的线样式
			splitLine: {
				show: true,
				lineStyle: {
					color: '#17273B',
					width: 1,
					type: 'solid',
				}
			}
		}],
		series: [{
			name: '新增确诊',
			type: 'line',
			smooth: true,
			data: [] // [20, 406, 529]
		}, {
			name: '新增疑似',
			type: 'line',
			smooth: true,
			data: [] // [25, 75, 122]
		}, {
			name: '新增境外输入',
			type: 'line',
			smooth: true,
			data: [] // [25, 75, 122]
		}],
	};

	// ******

	var chinaDayAddList = res.data.chinaDayAddList;
	for (var day of chinaDayAddList) {
		// option.xAxis[0].data.push(day.dead);
		// option.series[0].data.push(day.confirm);
		// option.series[1].data.push(day.suspect);
		//option.xAxis[0].data.push(day.dead);
		option.xAxis[0].data.push(day.date);
		option.series[0].data.push(day.confirm);
		option.series[1].data.push(day.suspect);
		option.series[2].data.push(day.importedCase);
	}

	//console.log(topData);


	myChart.setOption(option);
}
