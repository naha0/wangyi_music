import options from "./options.js"
export default {
	// 补0方法
	formatZero(num, len) {
	  if (String(num).length > len) return num
	  return (Array(len).join(0) + num).slice(-len)
	},
	
	// 日期格式化
	dateFormat(str, type) {
		if(str){
			let date = new Date(str)
			let year = date.getFullYear()
			let month = this.formatZero(date.getMonth() + 1, 2)
			let day = this.formatZero(date.getDate(), 2)
			let hour = this.formatZero(date.getHours(), 2)
			let minute = this.formatZero(date.getMinutes(), 2)
			let seconds = this.formatZero(date.getSeconds(), 2)
			if (type == 'YYYY-MM-DD') {
			  return `${year}-${month}-${day}`
			} else if (type == 'YYYY-MM-DD HH:MM:SS') {
			  return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
			} else if (type == 'MM/DD  HH:MM:SS') {
			  return `${month}/${day} ${hour}:${minute}:${seconds}`
			}
		}else{
			return false
		}
	  
	},
	// 分秒转毫秒
	formatMiner(min, seconds) {
	    let miner;
	    miner = min * (60 * 1000) + seconds * 1000;
	    return miner;
	},
	// 格式化时间毫秒转分秒
	formatTime(time) {
		if(time){
			const hour = parseInt(time / 3600) < 10 ? '0' + parseInt(time / 3600) : parseInt(time / 3600)
			const min = parseInt(time % 3600 / 60) < 10 ? '0' + parseInt(time % 3600 / 60) : parseInt(time % 3600 / 60)
			const sec = parseInt(time % 3600 % 60) < 10 ? '0' + parseInt(time % 3600 % 60) : parseInt(time % 3600 % 60)
			return hour + ':' + min + ':' + sec
		}
	},
	
	// 秒转00:00
	formatSecondTime(interval) {
	  interval = interval | 0
	  const m = (interval / 60) | 0 // 获取 分数
	  const s = interval % 60 //获取 秒数
	  //补零返回
	  return `${this.formatZero(m, 2)}:${this.formatZero(s, 2)}`
	},
	// 时间戳转换成几分钟前，几小时前，几天前
	formatMsgTime(dateTimeStamp) {
	  var result = ''
	  var minute = 1000 * 60
	  var hour = minute * 60
	  var day = hour * 24
	  var month = day * 30
	  var now = new Date().getTime()
	  var diffValue = now - dateTimeStamp
	  if (diffValue < 0) return
	  var monthC = diffValue / month
	  var weekC = diffValue / (7 * day)
	  var dayC = diffValue / day
	  var hourC = diffValue / hour
	  var minC = diffValue / minute
	  if (monthC >= 1) {
	    result = '' + parseInt(monthC) + '月前'
	  } else if (weekC >= 1) {
	    result = '' + parseInt(weekC) + '周前'
	  } else if (dayC >= 1) {
	    result = '' + parseInt(dayC) + '天前'
	  } else if (hourC >= 1) {
	    result = '' + parseInt(hourC) + '小时前'
	  } else if (minC >= 1) {
	    result = '' + parseInt(minC) + '分钟前'
	  } else {
	    result = '刚刚'
	  }
	  return result
	},
	// 数值过万处理
	tenThousand(num){
		return num > 9999 ? (Math.floor(num/1000)/10) + '万' : num
	},
	// 处理音乐时长的时间
	handleMusicTime(time) {
	    // 如果超过了100000 基本都是毫秒为单位的了 先转成秒的
	    time = parseInt(time)
	    if (time > 10000) {
	        time = Math.round(time / 1000);
	    } else {
	        time = Math.round(time)
	    }
	    let m = Math.round(time / 60);
	    let s = Math.round(time % 60);
	    m = m < 10 ? '0' + m : m;
	    s = s < 10 ? '0' + s : s;
	    return m + ':' + s;
	},
	// 寻找编码城市
	findRegion(pro,cit){
		if(pro){
			let province = options.map(item=>item).filter(item=>item.value===pro)
			if(province){
				let city = province[0].children.map(item=>item).find(item=>{
					if(item.value===cit){
						return item
					}else{
						let smallitem = item.children.find(item=>item.value===cit)
						if(smallitem){
							return smallitem
						}else{
							return '暂无';
						}
					}
				})
				return province[0].label +' '+ city.label
			}else{
				return province[0].label
			}
		}else{
			return '暂无';
		}
		
		
	}
	
}