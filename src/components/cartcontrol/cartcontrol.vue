<template>
<div class="cartcontrol">
	<div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCount"></div>
	<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
	<div class="cart-add  icon-add_circle" @click.stop.prevent="addCount"></div>
</div>

</template>  

<script>
import Vue from 'vue';
export default{
	props: {
		food: {
			type: Object
		}
	},
	created() {
	},
	methods: {
		addCount() {
			if (!event._constructed) {
				return;
			};
			if (!this.food.count) {
				Vue.set(this.food, 'count', 1);
			} else {
				this.food.count++;
			}
		},
		decreaseCount() {
			if (!event._constructed) {
				return;
			};
			if (this.food.count) {
				this.food.count--;
			}
		}
	}
};

</script>  

<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
	font-size: 0
	.cart-decrease, .cart-add
		display: inline-block
		padding: 6px
		line-height: 24px
		font-size: 24px
		color: rgb(0,160,220)
	.cart-count
		display: inline-block
		vertical-align: top
		width: 12px
		padding-top: 6px
		line-height: 24px
		text-align: center
		font-size: 10px 
		color: rgb(27, 153, 159)
	.cart-add
		display: inline-block

</style>
