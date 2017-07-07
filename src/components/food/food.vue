<template>
<div v-show="showFlag" class="food" ref="food">
	<div class="food-content">
		<div class="image-header">
			<img :src="food.image">
			<div class="back" @click="hide">
				<i class="icon-arrow_lift"></i>
			</div>
		</div>
		<div class="content">
			<h1 class="title">{{food.name}}</h1>
			<div class="detail">
				<span class="sell-count">月售{{food.sellCount}}</span>
				<span class="rating">好评率{{food.rating}}%</span>
			</div>
			<div class="price">
				<span class="now">¥{{food.price}}</span>
				<span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
			</div>
			<div class="cartcontrol-wrapper">
				<cartcontrol :food="food"></cartcontrol>
			</div>
			<div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst">加入购物车</div>
		</div>
		<split v-show="food.info"></split>
		<div class="info" v-show="food.info">
			<div class="title">商品信息</div>
			<div class="text">{{food.info}}</div>
		</div>
		<split></split>
		<div class="rating">
			<h1 class="title">商品评价</h1>
			 <!-- @change="change"@changecont='changecont'  -->
			<ratingselect  :onlyContent="onlyContent" :selectType="selectType" :desc="desc" :ratings="food.ratings"></ratingselect>
			<div class="rating-wrapper">
				<ul v-show="food.ratings &&food.ratings.length">
					<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
						<div class="user">
							<span class="name">{{rating.username}}</span>
							<img class="avatar" :src="rating.avatar" width="12" height="12">
						</div>
						<div class="time">{{rating.rateTime | formatDate}}</div>
						<p class="text">
							<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
							{{rating.text}}
						</p>
					</li>
				</ul>
				<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
			</div>
		</div>
	</div>
</div>

</template>  

<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol.vue';
import split from '../split/split.vue';
import ratingselect from '../ratingselect/ratingselect.vue';
import {formatDate} from '../../common/js/date.js';
const ALL = 2;
export default {
	props: {
		food: {
			type: Object
		}
	},
	data() {
		return {
			showFlag: false,
			selectType: ALL,
			onlyContent: false,
			desc: {
				all: '全部',
				positive: '推荐',
				negative: '吐槽'
			}
		};
	},

	// 在父组件里的created勾子进行监听子组件自定义的事件
	created() {
		this.$on('change', (el) => {
			this.selectType = el;
			// 当状态改变的时候，要等到DOM发生变化之后执行this.scroll。refresh()重新计算页面高度
			this.$nextTick(() => {
				this.scroll.refresh();
			});
		});
		this.$on('changecont', (el) => {
			this.onlyContent = el;
			this.$nextTick(() => {
				this.scroll.refresh();
			});
		});
	},
	methods: {
		show() {
			this.showFlag = true;
			// eventHub.$emit('select', this.selectType);
			this.selectType = ALL;
			// eventHub.$emit('toggle-content', this.onlyContent);
			this.onlyContent = false;
			this.$nextTick(() => {
				if (!this.scroll) {
					this.scroll = new BScroll(this.$refs.food, {click: true});
				} else {
					this.scroll.refresh();
				}
			});
		},
		hide() {
			this.showFlag = false;
		},
		addFirst(event) {
			if (!event._constructed) {
				return;
			}
			Vue.set(this.food, 'count', 1);
			// this.food.count = 1;
		},
		needShow(type, text) {
			if (this.onlyContent && !text) {
				return false;
			};
			if (this.selectType === ALL) {
				return true;
			} else {
				return type === this.selectType;
			}
		}
	},
	filters: {
		formatDate(time) {
			let date = new Date(time);
			return formatDate(date, 'yyyy-MM-dd hh:mm');
		}
	},
	components: {
		cartcontrol,
		split,
		ratingselect
	}
};

</script>  

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';

.food
	position: fixed
	left: 0
	top: 0
	bottom: 48px
	z-index: 30
	width: 100%
	background: #fff
	.image-header
		position: relative
		width: 100%
		height: 0
		padding-top: 100%
		img
			position: absolute
			top: 0
			left: 0
			width: 100%
			height: 100%
		.back
			position: absolute
			top: 10px
			left: 0
			.icon-arrow_lift
				display: block
				padding: 10px
				font-size: 20px
				color: #fff
	.content
		position: relative
		padding: 18px
		border-1px(rgba(7,17,27,.1))
		.title
			/* height: 14px */
			line-height: 14px
			font-size: 14px
			color: rgb(7,17,27)
			font-weight: 700
		.detail
			height: 10px
			line-height: 10px
			margin: 8px 0 18px 0
			font-size: 0
			.sell-count, .rating
				font-size: 10px
				color: rgb(147,153,159)
			.sell-count
				margin-right: 12px
		.price
			line-height: 24px
			font-weight: 700
			.now
				font-size: 14px
				color: rgb(240,20,20)
				margin-right: 8px
			.old
				font-size: 10px
				color: rgb(147,153,159)
				text-decoration: line-through
		.cartcontrol-wrapper
			position: absolute
			right: 12px
			bottom: 12px
		.buy
			position: absolute
			right: 18px
			bottom: 18px
			z-index: 10
			height: 24px
			line-height: 24px
			padding: 0 12px
			border-sizing: border-box
			font-size: 10px
			color: #fff
			border-radius: 12px
			background-color: rgb(0, 160, 220)
	.info
		padding: 18px
		.title
			line-height: 14px
			margin-bottom: 6px
			font-size: 14px
			color: rgb(7,17,27)
		.text
			line-height: 24px
			padding: 0 8px
			font-size: 12px
			color: rgb(77,86,93)
	.rating
		padding-top: 18px
		.title
			line-height: 14px
			margin-left: 18px
			font-size: 14px
			color: rgb(7,17,27)
		.rating-wrapper
			padding: 0 18px
			.rating-item
				padding: 16px 0
				position: relative
				border-1px(rgba(7,17,27,.1))
				.user
					position: absolute
					top: 16px
					right: 0
					line-height: 12px
					font-size: 0
					.name
						display: inline-block
						margin-right: 6px
						vertical-align: top
						line-height: 12px
						font-size: 10px
						color: rgb(147,153,159)
					.avatar
						border-radius: 50%
				.time
					line-height: 12px
					margin-bottom: 6px
					font-size: 10px
					color: rgb(147,153,159)
				.text
					line-height: 16px
					font-size: 12px
					color: rgb(7,17,27)
					.icon-thumb_up, .icon-thumb_down
						line-height: 16px
						color: rgb(0,160,220)
						margin-right: 4px
						font-size: 12px
					.icon-thumb_down
						color: rgb(147,153,159)
			
			.no-rating
				padding: 16px 0
				font-size: 12px
				color: rgb(147,153,159)
</style>
