import axios from 'axios';
// 引入进度条
import nprogress from 'nprogress'
// 引入进度条样式
import "nprogress/nprogress.css"

export function request(config){
	const instance = axios.create({
		baseURL:'http://localhost:3000',
		timeout:100000,
		withCredentials: true,
	})
	
	instance.interceptors.request.use(config =>{
		// 进度条开始动
		nprogress.start()
		return config
	},err=>{
		// return Promise.reject(new Error(err))
	})
	
	instance.interceptors.response.use(res =>{
		// 进度条停止
		nprogress.done()
		return res.data
	},err=>{
		return Promise.reject(new Error(err))
	})
	instance.defaults.withCredentials = true;
	return instance(config)
}