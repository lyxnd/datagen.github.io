<script setup>

import {Box, Grid} from "@element-plus/icons-vue";
</script>

<template>
  <div style="width: 100%;height:100%;left:0;top:0;position: fixed">
    <el-container style="width: 100%;height:100%;">
      <el-aside width="200px">
        <el-menu
            :default-active="$route.path" background-color="#001529" text-color="rgba(255,255,255,0.65)"
            active-text-color="#fff" style="border: none;height: 100%" router
        >
          <el-menu-item index="/mc/recipes">
            <el-icon>
              <Grid/>
            </el-icon>
            <template #title>配方生成</template>
          </el-menu-item>
          <el-menu-item index="/mc/lootTables">
            <el-icon>
              <Box/>
            </el-icon>
            <template #title>战利品表</template>
          </el-menu-item>
        </el-menu>
      </el-aside>


      <el-main>
        <router-view/>
      </el-main>

    </el-container>
  </div>
</template>

<style scoped>
.el-menu-item.is-active {
  background-color: #40a9ff;
  border-radius: 5px;
  margin: 4px;
}

.el-menu-item {
  height: 60px;
  line-height: 40px;
  margin: 4px;
}

.el-menu-item:hover {
  color: #fff;
}

.el-menu--inline .el-menu-item {
  background-color: #000c17;
}

.el-menu--inline .el-menu-item.is-active {
  background-color: #40a9ff;
}

.el-menu--inline {
  background-color: #000c17;
}
</style>