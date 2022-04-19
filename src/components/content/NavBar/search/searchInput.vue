<template>
	<div class="search">
		<el-input placeholder="音乐/视频/电台/用户" v-model="keywords" @focus="focus"  @keydown.enter.native="keyEnter()" @input="input"
			@blur="leave()">
			<i slot="prefix" class="el-input__icon el-icon-search"></i>
		</el-input>
		<search-hot v-show="searchhotShow"></search-hot>
		<search-suggest v-show="searchsuggestShow" :keyword="keywords"></search-suggest>
	</div>
</template>

<script>
	import searchHot from './searchHot.vue'
	import searchSuggest from './searchSuggest.vue'
	export default {
		name: 'searchInput',
		components: {
			searchHot,
			searchSuggest
		},
		data() {
			return {
				searchhotShow: false,
				keywords: "",
				searchsuggestShow: false
			}
		},
		watch: {
			keywords: {
				handler(newValue, oldValue) {
					if (newValue !== "") {
						this.searchhotShow = false
						this.searchsuggestShow = true
						this.keySuggestForm()
					}
				}
			}
		},
		methods: {
			leave() {
				this.searchhotShow = false
			},
			focus(){
				this.searchhotShow = true
			},
			input(){
				this.searchhotShow = true
				if(this.keywords == "" || this.keywords == null){
					this.searchsuggestShow = false
				}
			},
			keyEnter() {
				if (this.keywords == "" || this.keywords == null) return;
				this.$router.push({name:'search',query:{keywords:this.keywords}})
				this.searchhotShow = false
				this.searchsuggestShow = false
				this.$store.dispatch('getSearch',{
					keywords: this.keywords,
					limit:100,
				})
			},
			keySuggestForm() {
				this.$store.dispatch('getSearchSuggest', {
					keywords: this.keywords
				})
			},
		},
	}
</script>

<style scoped>
	.search {
		display: flex;
		justify-content: center;
		position: absolute;
		left: 550px;
	}

	.icon {
		vertical-align: text-bottom;
	}

	/deep/ .el-input__inner {
		width: 180px;
		height: 30px;
		border-radius: 20px;
		margin-top: 15px;
	}

	.el-icon-search {
		margin-top: 10px;
	}
</style>
