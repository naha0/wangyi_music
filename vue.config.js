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
				'mock':'@/mock',
				'utils':'@/utils',
			}
		}
	},
	devServer: {
		// host:'http://localhost',
		port:8080,
		https:false,
	    proxy: {
	        '/api': {
	            target: 'https://neteasecloudmusicapi.vercel.app/#/',
	            changeOrigin: true,
	            ws: true,
				secure:false,
	            pathRewrite: {
	                '^/api': ''
	            }
	        },
			
	    }
	},
}