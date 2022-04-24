<template>
	<div>
		<div ref="login" v-if="!login.profile.userId">
			<el-dialog title="手机号登录" :visible.sync="loginVisible" width="30%" :modal="false" :show-close="true"
				:close-on-click-modal="false" @open="openDialog">
				<el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm" label-width="80px">
					<el-form-item prop="phone" label="手机号">
						<el-input v-model="loginForm.phone" autocomplete="off" prefix-icon="el-icon-mobile-phone"
							placeholder="请输入手机号">
						</el-input>
					</el-form-item>
					<el-form-item prop="password" label="密码">
						<el-input v-model="loginForm.password" autocomplete="off" prefix-icon="el-icon-lock"
							type="password" placeholder="请输入密码" :show-password="true">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="getlogin" class="register_next">登录</el-button>
					</el-form-item>
				</el-form>
				<div slot="footer" class="footer">
					<span @click="nextClick">返回注册</span>
					<span @click="qrKey" class="qr">二维码登录</span>
				</div>
			</el-dialog>
		</div>

		<div>
			<div>
				<el-dialog title="手机号注册" :visible.sync="registerVisible" width="30%" :modal="false" :show-close="true"
					:close-on-click-modal="false" @open="openDialog">
					<el-form :model="registerForm" :rules="rules" ref="registerForm" class="demo-ruleForm"
						label-width="80px">
						<el-form-item prop="phone" label="手机号">
							<el-input v-model="registerForm.phone" autocomplete="off" prefix-icon="el-icon-mobile-phone"
								placeholder="请输入手机号">
							</el-input>
						</el-form-item>
						<el-form-item prop="password" label="密码">
							<el-input type="password" v-model="registerForm.password" autocomplete="off"
								prefix-icon="el-icon-lock" placeholder="请设置密码" :show-password="true">
							</el-input>
						</el-form-item>
						<el-form-item>
							<el-button @click="getPhoneCaptcha" class="register_next">下一步</el-button>
						</el-form-item>
					</el-form>
					<span slot="footer" @click="nextClick">返回登录</span>
				</el-dialog>

				<el-dialog :visible.sync="nextdialogVisible" width="30%" :modal="false" :show-close="true"
					:close-on-click-modal="false" @open="openDialog">
					<el-form :model="registerForm" :rules="rules" ref="regitserForm" class="demo-ruleForm"
						label-width="80px">
						<el-form-item prop="captcha" label="验证码">
							<el-input v-model="registerForm.captcha" autocomplete="off" prefix-icon="el-icon-key"
								placeholder="请输入验证码">
							</el-input>
						</el-form-item>
						<el-form-item>
							<el-button @click="checkPhoneCaptcha" class="register_next">完成</el-button>
						</el-form-item>
					</el-form>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import QRCode from 'qrcode'
	export default {
		name: 'login',
		data() {
			var validatePhone = (rule, value, callback) => {
				const RegPhone = /^[1][3,4,5,7,8,9][0-9]{9}$/
				if (RegPhone.test(value)) {
					return callback()
				}
				callback(new Error('请输入正确的手机号'))
			}
			var validatePassword = (rule, value, callback) => {
				const RegPassword = /(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/
				if (RegPassword.test(value)) {
					return callback()
				}
				callback(new Error('6-16个字符,不包含空格,必须包含数字,字母或字符至少两种'))
			}
			return {
				loginVisible: false,
				loginForm: {
					phone: '',
					password: '',
				},
				registerVisible: false,
				nextdialogVisible: false,
				registerForm: {
					phone: '',
					password: '',
					captcha: ''
				},
				loginInfo:{},
				timer:null,
				userCookie:'',
				rules: {
					phone: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}, {
						validator: validatePhone,
						trigger: 'blur'
					}],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							validator: validatePassword,
							trigger: 'blur'
						}
					],
				}
			}
		},
		methods: {
			getlogin() {
				try {
					this.$refs.loginForm.validate(async valid => {
						if (!valid) return false
						let timestamp = Date.parse(new Date());
						await this.$store.dispatch('getLogin', {
							phone:this.loginForm.phone,
							password:this.loginForm.password,
							withCredentials:true,
							timestamp
						})
						this.$store.dispatch('getLoginState')
						this.loginVisible = false
						this.$message.success('成功登录')
						this.$api.reqLoginState()
					})
				} catch (e) {
					alert(e.message)
				}

			},
			openDialog() {
				this.loginForm.phone = ''
				this.loginForm.password = ''
				this.registerForm.phone = ''
				this.registerForm.password = ''
				this.registerForm.captcha = ''
			},
			async getPhoneCaptcha() {
				try {
					this.$refs.registerForm.validate(async valid => {
						if (!valid) return false
						this.registerVisible = false
						let res = await this.$api.reqExistenceCheckPhone(this.registerForm.phone)
						if (res.code == 200 && res.exist == 1) {
							this.nextdialogVisible = false
							this.$message.error('该手机号已被注册')
							return false
						}
						if (res.code == 200 && res.exist == -1) {
							this.nextdialogVisible = true
							let res1 = await this.$api.reqCaptcha(this.registerForm.phone)
							if (res1.code !== 200) {
								this.$message.error(res1.message)
								return false
							}
						}
					})

				} catch (e) {
					alert(e.message)
					//TODO handle the exception
				}

			},
			async checkPhoneCaptcha() {
				let res2 = await this.$api.reqCaptchaVerify({
					phone: this.registerForm.phone,
					captcha: this.registerForm.captcha
				})
				console.log(res2)
				if (res2.code == 200) {
					this.$message.success('注册成功')
					this.nextdialogVisible = false
				} else {
					this.$message.error(res2.message)
				}
			},
			nextClick() {
				this.loginVisible = !this.loginVisible
				this.registerVisible = !this.registerVisible
			},
			async qrKey(){
				let res = await this.$api.reqLoginKey()
				console.log(res)
				if(res.code == 200){
					this.loginInfo = res.data
					this.getQrKey()
				}
			},
			async getQrKey(){
				let timestamp = Date.parse(new Date());
				let res = await this.$api.reqQrCreate({
					key:this.loginInfo.unikey,
					timestamp
				})
				console.log(res)
				let qrurl = await QRCode.toDataURL(res.data.qrurl)
				
				this.$alert(`<img src=${qrurl} />`, '二维码登录', {
					dangerouslyUseHTMLString: true,
					center: true,
					showCancelButton: true,
					showClose:false,
					cancelButtonText: '取消',
					beforeClose: (action, instance, done) => {
						if (action === 'cancel') {
							alert("取消登录")
							// 关闭弹出框
							done()
						}else{
							this.timer = setInterval(async () => {
								let res1 = await this.$api.reqQrCheck({
									key:this.loginInfo.unikey,
									timestamp
								})
								console.log();
								console.log(res1)
								if(res1.code == 800){
									clearInterval(this.timer)
									this.timer = null
									// 关闭弹出框
									this.$msgbox.close()
									this.$message.warning('二维码过期，请刷新重试')
								}
								if (res1.code == 803) {
									this.userCookie = res1.cookie
									this.$store.dispatch('getQrLogin',{
										cookie:this.userCookie
									})
									this.loginVisible = false
									clearInterval(this.timer)
									this.timer = null
									// 关闭弹出框
									this.$msgbox.close()
									this.$message.success('登录成功')
								}
							}, 1000)
						}
					}
				})
			}
		},
		computed: {
			...mapState({
				login: (state) => state.home.login
			})
		},

	}
</script>

<style scoped="">
	/deep/ .el-dialog__footer {
		padding: 0px 20px 20px;
		text-align: left;
		font-size: 14px;
	}
	.footer{
		display: flex;
		justify-content: space-between;
	}
	.qr{
		color: #b0b9b4;
	}
</style>
