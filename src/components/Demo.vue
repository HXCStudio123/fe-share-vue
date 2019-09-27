<template functional>
    <div>
        <hr/>
        <h2>{{props.title}}</h2>
          <div class='hello' :style='{color:props.color}'>
            <div class='title'>{{props.name}}内部</div>
            <div class='demo' :style='{borderColor:props.color}'>     
                <slot></slot>
            </div>
          </div>
    </div>
</template>

<style scopded>
.hello{
  color:black;
  border:1px solid black;
  margin: 20px;
}
.title{
  margin:10px;
  text-align:left;
}
.demo{
  border:1px solid rgb(0, 153, 255);
  margin: 20px;
}
</style>