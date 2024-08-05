<script setup>

import {ref,watch,reactive} from "vue";
import {Close} from "@element-plus/icons-vue";


const item1 = reactive({
  item:null,
  type:true,
  function:'minecraft:enchant_with_levels',
  treasure:false,
  min:0,
  max:1,
  count:1,
  add:false,
})
const imageFiles = ref([]);
const enchantLevelType = ref('minecraft:uniform')
const confirmSelection = () => {
  emit("update-item", { ...item1});
};

const emit = defineEmits(['update-item', 'remove-item'])
const removeItem=()=> {
  emit('remove-item')
}
watch(item1, confirmSelection, { deep: true });
const importAllImages = async () => {
  try {
    const response = await fetch('/image-paths.json');
    const paths = await response.json();

    imageFiles.value = paths.map(path => {
      const fileName = path.split('/').pop().split('.')[0];
      return { label: fileName, path: path, value: path };
    });
  } catch (error) {
    console.error('Error loading image paths:', error);
  }
};
importAllImages()
const functionType = [
  {label: 'Enchant With Levels', value: 'minecraft:enchant_with_levels'},
  {label: 'Set Count', value: 'minecraft:set_count'},
]
</script>

<template>
  <div>
    <div class="pool" style="border-left: 2px dashed black">
      <div class="pool" style="align-items: center;display: flex">
        <span style="padding-right: 10px">Item :</span>
        <!--  选择物品    -->
        <el-select-v2 v-model="item1.item" :options="imageFiles" placeholder="Select Items"
                      filterable clearable :item-height="60" style="width: 50%;margin-left: 25px"
                      @change="confirmSelection" size="large" :props="{checkStrictly:true}">
          <template #default="{ item }" class="selector">
            <el-image :src="item.value" style="width: 50px; height: 50px; margin-right: 10px;"/>
            <span style="align-items: center;height: 100%;padding-left: 20px;font-weight: bold;font-size: 30px">
              {{ item.label }}
            </span>
          </template>
        </el-select-v2>
        <el-image :src="item1.item" style="width: 40px;height: 40px;margin-left: 10px" />
        <el-button type="danger" round @click="removeItem" :icon="Close" size="small" style="margin-left: 10px"/>
      </div>

      <div class="pool">
        <!--   选择物品的Function 附魔等级 或者 数量     -->
        <span style="padding-right: 10px">function: </span>
        <el-select style="width: 60%" v-model="item1.function">
          <el-option v-for="type in functionType" :key="type.value" :label="type.label" :value="type.value"></el-option>
        </el-select>
      </div>

      <div class="pool" v-if="item1.function==='minecraft:enchant_with_levels'"> <!-- 可附魔的Item -->
        <h5 style="padding-right: 10px;font-weight: bold;font-size: larger">levels :</h5>
        <span style="padding-right: 10px">Min :</span>
        <el-input-number v-model="item1.min" :min="0" @change="confirmSelection" style="width: 35%"/>
        <span style="padding:0 10px">Max :</span>
        <el-input-number v-model="item1.max" :min="0" @change="confirmSelection" style="width:35%"/>
        <span style="padding-right: 5px">Treasure :</span>
        <el-switch
            v-model="item1.treasure"
            class="ml-2"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-text="Y"
            inactive-text="N"
        />
      </div>

      <div class="pool" v-else> <!-- 不可附魔的Item -->
        <h5 style="font-weight: bold;font-size: larger">count :</h5>
        <el-switch
            v-model="item1.type"
            class="mb-2"
            active-text="uniform"
            inactive-text="aptotic"/>
        <br>
        <div v-if="item1.type">
          <span style="padding-right: 10px">Min :</span>
          <el-input-number v-model="item1.min" :min="1" @change="confirmSelection" style="width: 35%"/>
          <span style="padding:0 10px">Max :</span>
          <el-input-number v-model="item1.max" :min="1" @change="confirmSelection" style="width:35%"/>
        </div>
        <div v-else>
          <span style="padding:0 10px">Count :</span>
          <el-input-number v-model="item1.count" :min="1" :max="10" @change="confirmSelection"/>
        </div>
        <span style="padding-right: 10px">Add :</span>
        <el-switch
            v-model="item1.add"
            class="ml-2"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-text="Y"
            inactive-text="N"
        />
      </div>

    </div>
  </div>
</template>

<style scoped>
.selector{
  display: flex;
  height: 100%;
}
.pool {
  margin: 10px 5px;
  padding-left: 5px;
}
</style>
