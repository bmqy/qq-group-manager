<template>
  <el-card class="box-card bmqyQQGroupManagerBox">
    <div slot="header" class="clearfix">
      <span class="title">{{$app.getName()}}</span>
      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
    </div>
    <div v-for="o in 4" :key="o" class="text item">
      {{'列表内容 ' + o }}
    </div>
  </el-card>
</template>

<script>
export default {
  data(){
    return {
      name: 'adfdfjdsdf'
    }
  }
}
</script>

<style lang="scss" scoped>
  .bmqyQQGroupManagerBox {
    width: 300px;
    position:fixed;
    top:30px;
    left:30px;
    border-radius: 10px;
    .el-card__header{        
      .title {
        font-size: 14px;
        font-weight: 600;
        position: relative;
      }
    }
  }
  
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

</style>