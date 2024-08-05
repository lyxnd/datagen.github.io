<script setup>
import {ref, watch, reactive} from 'vue';
import {CirclePlus} from "@element-plus/icons-vue";
import ItemLootTable from "@/components/module/ItemLootTable.vue";

const jsonOutput = ref('')
const exportFile = ref('')
const selectedType = ref(null)
const sequence = ref(null)
const pools = ref([])
import { saveAs } from 'file-saver';
const typeOptions = [
  //label : 选择的查找键,value 选择后会赋予变量的值
  {label: 'Empty', value: 'minecraft:empty'},
  {label: 'Advancement Reward', value: 'minecraft:advancement_reward'},
  {label: 'Archaeology', value: 'minecraft:archaeology'},
  {label: 'Barter', value: 'minecraft:barter'},
  {label: 'Block', value: 'minecraft:block'},
  {label: 'Chest', value: 'minecraft:chest'},
  {label: 'Entity', value: 'minecraft:entity'},
  {label: 'Fishing', value: 'minecraft:fishing'},
  {label: 'Gift', value: 'minecraft:gift'},
]

const functionType =[
  {label: 'Enchant With Levels', value: 'minecraft:enchant_with_levels'},
  {label: 'Set Count', value: 'minecraft:set_count'},
]

const updateItem = (poolIndex, itemIndex, itemData) => {
  if(itemData.item){
    itemData.item = processItem(itemData.item)
  }
  if(itemData.function==='minecraft:enchant_with_levels'){
    itemData.type='minecraft:uniform'
  }else{
    if(itemData.type){
      itemData.type='minecraft:uniform'
    }
  }
  pools.value[poolIndex].value.items[itemIndex] = itemData
}

const removeItem = (poolIndex, itemIndex) => {
  console.log(pools)
  pools.value[poolIndex].value.items.splice(itemIndex, 1)
}
const addNewPool=()=>{
  let pool = ref({
    items: [],
    bonus_rolls: 0,
    rolls: 0,
  });
  pools.value.push(pool);
}
const addItem = (pool) => {
  let item=reactive({
    item:null,
    type:'',
    function:'minecraft:enchant_with_levels',
    treasure:false,
    min:0,
    max:1,
    count:1,
    add:false,
  })

  pool.value.items.push(item)
}
const processItem = (item,name) => {
  if(!item){
    return
  }
  // if (!icon) {
  //   if(modName.value!=='') {
  //     if(name==='')
  //       return modName.value+':'
  //     else
  //       return modName.value+':' + name
  //   }else {
  //     if(name==='')
  //       return ''
  //     else
  //       return name;
  //   }
  // }
  let fileName = item.split('/').pop();
  let i = fileName.lastIndexOf('.');
  fileName = fileName.substring(0, i);
  // 查找映射表中的物品名称
  return 'minecraft:' + fileName;
}

const generateJson = () => {
  let lootTable = {
    type: selectedType.value,
    pools: pools.value.map(pool => {
      return {
        bonus_rolls: pool.value.bonus_rolls,
        rolls: pool.value.rolls,
        entries: pool.value.items.map(item => {
          return {
            type: 'minecraft:item',
            name: item.item,
          };
        }),
        functions: pool.value.items.map(item => {
          let func = {
            function: item.function,
          };
          if (item.function === 'minecraft:enchant_with_levels') {
            func.levels = {
              type: item.type,
              min: item.min,
              max: item.max,
            };
            func.treasure = item.treasure;
          } else if (item.function === 'minecraft:set_count') {
            func.count = item.type === 'minecraft:uniform' ? { type: item.type, min: item.min, max: item.max } : item.count;
            func.add = item.add;
          }
          return func;
        }),
      };
    }),
  };
  jsonOutput.value = JSON.stringify(lootTable, null, 2);
};

watch([selectedType, pools], generateJson, { deep: true });
const exportJson = () => {
  const blob = new Blob([jsonOutput.value], { type: "application/json" });
  if(exportFile.value){
    saveAs(blob, exportFile.value+'.json');
  }else{
    saveAs(blob, sequence.value||'lootTable.json');
  }
};
</script>

<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <el-aside width="440px" style="box-shadow: aqua 2px 0">
        <div style="display: flex;flex-direction: column">
          <div class="pool">
            <el-input v-model="exportFile" placeholder="导出Json命名(选填)" style="width:60%"/>
          </div>
          <div style="display: flex;flex-direction: row;width: 100%">
            <span style="align-items: center;padding-right:10px">Type :  </span>
            <el-select v-model="selectedType" style="width: 60%">
              <el-option v-for="type in typeOptions" :key="type.value" :label="type.label"
                         :value="type.value"></el-option>
            </el-select>
          </div>

          <div class="pool">
            <span style="align-items: center;padding-right:10px">Random Sequence :</span>
            <el-input v-model="sequence" placeholder="命名空间ID(选填) (eg: minecraft:archaeology/desert_pyramid)" style="width: 50%"/>
          </div>

          <div>
            <span style="font-weight: bolder;font-size: large;padding-right: 10px">Pools :</span>
            <el-button type="success" round :icon="CirclePlus" @click="addNewPool">添加新的Pool</el-button>

            <el-button type="primary" round @click="generateJSON" style="margin-left: 120px" size="default">生成Json</el-button>
          </div>

          <div v-for="(pool,index) in pools" :key="index">
            <div class="pool" style="border-left: 1px dashed black">
              <div class="pool">
                <span style="font-weight: bold;padding-right: 10px">entries :</span>
                <el-button type="info" round plain @click="addItem(pool,index)" style="padding-left: 15px">添加物品</el-button>
              </div>

              <div class="pool">
                <span style="padding-right: 10px">bonus_rolls :</span>
                <el-input-number v-model="pool.value.bonus_rolls" :precision="2" :step="0.1" />
              </div>

              <div class="pool">
                <span style="padding-right: 10px">rolls :</span>
                <el-input-number v-model="pool.value.rolls" :min="1" :precision="2" :step="0.1" />
              </div>
              <ItemLootTable v-for="(item,itemIndex) in pool.value.items" :key="itemIndex"
                             @update-item="updateItem(index, itemIndex, $event)"
                             @remove-item="removeItem(index, itemIndex)"/>

            </div>
          </div>
        </div>
      </el-aside>


      <el-main>
        <el-card style="background-color: #282828;color: white;height: 100vh;overflow: auto">
          <div style="width: 100%;display: flex;justify-content: flex-end;">
            <el-button type="success" round @click="exportJson" style="z-index: 1;">导出</el-button>
          </div>
          <pre>{{ jsonOutput }}</pre>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.pool {
  margin: 10px 5px;
  padding-left: 5px;
}
</style>
