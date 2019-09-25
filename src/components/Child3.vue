<template>
  <div class="hello">
        <div style="margin:10px">Child3内部</div>
            <div class="demo">        
                <div>父组件传递的 $attrs:{{$attrs}}</div>
                <div>coo:{{coo}}</div>
                <div>当前页面接收的 $props:{{$props}}</div>
         </div>
  </div>
</template>

<script>

export default {
    name:'child2',
    props: {
      coo: String // foo作为props属性绑定
    },
    inject:['name'],
    components:{
        
    },
    created() {
        this.$log(this.name);
        window.console.log('child2',this.$attrs)
    }
}
</script>

<style scoped>
    .demo{
        color:blueviolet;
        text-align:left;
        border:1px solid blueviolet;
        margin: 20px;
    }
    .hello{
  border:1px solid black;
  margin: 20px;
}
</style>