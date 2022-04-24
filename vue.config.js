module.exports = {
	configureWebpack:{
		resolve:{
			extensions:[],
			alias:{
				'assets':'@/assets',
				'components':'@/components',
				'views':'@/views',
				'api':'@/api',
				'store':'@/store',
				'utils':'@/utils',
			}
		}
	},
	devServer: {
	    proxy: {
	        '/api': {  //触发匹配路径
	            target: 'http://www.codeman.ink:3000/',  // 代理跳转到的站点
	            changeOrigin: true, // 允许跨域
	            ws: true,
				secure:false,
	            pathRewrite: {  // 重写路径：去掉路径中开头的'/api'
	                '^/api': ''
	            }
	        },
		}
	},
}