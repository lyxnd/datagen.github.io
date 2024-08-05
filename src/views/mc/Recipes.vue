<script setup>
import { ref, computed } from 'vue';
import { ArrowRight } from "@element-plus/icons-vue";


// 配方类型和类别选项
const types = [
  { label: 'Shaped Crafting', value: 'minecraft:crafting_shaped' },
  { label: 'Shapeless Crafting', value: 'minecraft:crafting_shapeless' },
  { label: 'Smelting', value: 'minecraft:smelting' },
  { label: 'Blasting', value: 'minecraft:blasting' },
  { label: 'Smoking', value: 'minecraft:smoking' },
  { label: 'Campfire Cooking', value: 'minecraft:campfire_cooking' },
  { label: 'Stone Cutting', value: 'minecraft:stonecutting' },
  // { label: 'Smithing', value: 'minecraft:smithing' },
];
const categories = [
  { label: 'Misc', value: 'misc' },
  { label: 'Misc', value: 'building_blocks' },
  { label: 'Misc', value: 'decorations' },
  { label: 'Misc', value: 'redstone' },
  { label: 'Misc', value: 'transportation' },
  { label: 'Misc', value: 'brewing' },
  { label: 'Tools', value: 'tools' },
  { label: 'Combat', value: 'combat' },
  { label: 'Food', value: 'food' },
];

const imageFiles = ref([]);

// 映射表
const itemMappings = {

  // 其他映射
};

// 使用 Vite 的 import.meta.glob 读取 images 目录下的所有图片
const importAllImages = () => {
  const images = import.meta.glob('/src/assets/items/*.{png,jpeg,jpg,svg}');
  for (const [path, importer] of Object.entries(images)) {
    importer().then(module => {
      let fileName = path.split('/').pop();
      let i = fileName.lastIndexOf('.');
      fileName = fileName.substring(0, i);
      imageFiles.value.push({ label: fileName, path: module.default,value: module.default});
    });
  }
};

// 初始化
importAllImages();

const num = ref(1);
const cookingTime = ref(1);
const experience = ref(1);
const materialCount = ref(1);
const type = ref('minecraft:crafting_shapeless');
const category = ref('misc');
const dialogVisible = ref(false);
const resultDialogVisible = ref(false); // 控制结果图标选择对话框的显示
const selectedGrid = ref(null);
const selectedFile = ref(null);
const resultIcon = ref(null); // 存储结果图标
const buttonIcons = ref(Array(9).fill(null)); // 存储每个按钮的图标
const inputName = ref(Array(9).fill('')); // 存储每个按钮的图标
const resultName=ref('')
const modName=ref('')
const jsonOutput = ref('');

// 处理选项卡选择
const confirmSelection = () => {
  if (selectedFile.value && selectedGrid.value) {
    buttonIcons.value[selectedGrid.value - 1] = selectedFile.value; // 更新网格图标
  } else if (selectedFile.value && !selectedGrid.value) {
    resultIcon.value = selectedFile.value; // 更新结果图标
  }
  dialogVisible.value = false;
  resultDialogVisible.value = false; // 隐藏对话框
  generateJSON()
};

const handleButtonClick = (index) => {
  console.log('showGrid' + showGrid.value)
  if(!showGrid.value){
    buttonIcons.value.length = 0
    inputName.value.length = 0
  }
  selectedFile.value = null
  selectedGrid.value = index;
  dialogVisible.value = true;
};
const openResultDialog=()=>{
  resultName.value=''
  resultIcon.value=null
  resultDialogVisible.value = true;
}
// 计算属性，用于控制九宫格的显示
const showGrid = computed(() => type.value === 'minecraft:crafting_shaped');
const shapeless = computed(()=>type.value==='minecraft:crafting_shapeless')
const cutting = computed(()=>(type.value==='minecraft:stonecutting'))
// 生成 JSON
let pattern=['#','*','~','X','Y','Z','A','B','C']
let patternBack =[]
const generateJSON = () => {
  let recipe = {};
  if (type.value === 'minecraft:crafting_shaped') {
    recipe = {
      type: 'minecraft:crafting_shaped',
      category:category.value,
      key: handleKeys(),
      pattern: [
        patternBack[0]+patternBack[1]+patternBack[2],
        patternBack[3]+patternBack[4]+patternBack[5],
        patternBack[6]+patternBack[7]+patternBack[8],
      ],
      result: {
        item: processSingleInput(resultIcon.value),
        count: num.value
      },
      show_notification:true
    };
  } else if (type.value === 'minecraft:crafting_shapeless') {
    recipe = {
      type: 'minecraft:crafting_shapeless',
      category:category.value,
      ingredients:{
        item: processSingleInput(buttonIcons.value[0],inputName.value[0]),
        count:materialCount.value
      },
      result: {
        item: processSingleInput(resultIcon.value,resultName.value),
        count: num.value
      }
    };
  } else if(type.value==='minecraft:stonecutting'){
    recipe = {
      type: type.value,
      ingredient: {
        item: processSingleInput(buttonIcons.value[0],inputName.value[0]), // Example, update according to buttonIcons
      },
      result: processSingleInput(resultIcon.value,resultName.value),
      count: num.value
    };
  }else {
    recipe = {
      type: type.value,
      category:category.value,
      ingredient: {
        item: processSingleInput(buttonIcons.value[0],inputName.value[0]) // Example, update according to buttonIcons
      },
      result: processSingleInput(resultIcon.value,resultName.value),
      experience: experience.value,
      cookingtime: cookingTime.value*20
    };
  }
  jsonOutput.value = JSON.stringify(recipe, null, 2);
};

const handleKeys=()=>{
  patternBack = JSON.parse(JSON.stringify(pattern))
  for(let i=0;i<buttonIcons.value.length;i++){
    if(!buttonIcons.value[i]){
      patternBack[i]=' '
    }else{
      for(let j=i+1;j<buttonIcons.value.length;j++){
        if(buttonIcons.value[j]===buttonIcons.value[i]){
          patternBack[j]=patternBack[i]
        }
      }
    }
  }
  const keys={}
  for(let i=0;i<buttonIcons.value.length;i++){
    if(buttonIcons.value[i]){
      let name =processSingleInput(buttonIcons.value[i],' ')
      keys[patternBack[i]]={}
      keys[patternBack[i]].item=name
    }
  }
return keys
}
const processSingleInput = (icon,name) => {
  if (!icon) {
    if(modName.value!=='') {
      if(name==='')
        return modName.value+':'
      else
        return modName.value+':' + name
    }else {
      if(name==='')
        return ''
      else
        return name;
    }
  }
  let fileName = icon.split('/').pop();
  let i = fileName.lastIndexOf('.');
  fileName = fileName.substring(0, i);
  // 查找映射表中的物品名称
  return itemMappings[fileName] || 'minecraft:' + fileName;
}
</script>

<template>
  <el-container>
    <el-header>
      <div style="display: flex;align-items: center;justify-content: flex-start">
        <span>Type:</span>
        <el-select v-model="type" placeholder="Select type">
          <el-option v-for="option in types" :key="option.value" :label="option.label"
                     :value="option.value"></el-option>
        </el-select>

        <span>Category:</span>
        <el-select v-model="category" placeholder="Select category" style="margin-left: 10px;">
          <el-option v-for="option in categories" :key="option.value" :label="option.label"
                     :value="option.value"></el-option>
        </el-select>
      </div>
      <el-input v-model="modName" placeholder="在此输入mod名称，则在选择时只需输入物品名" style="margin: 15px 0"/>
    </el-header>

    <el-main style="margin: 15px 0">

      <div class="container">

        <el-input-number v-model="materialCount" :min="1" v-if="shapeless" @change="confirmSelection"/>

        <!-- 九宫格布局（仅当type为shaped时显示） -->
        <div v-if="showGrid" class="grid">
          <div v-for="i in 9" :key="i" class="grid-item">
            <el-button @click="handleButtonClick(i)" class="grid-button">
              <el-image v-if="buttonIcons[i - 1]" :src="buttonIcons[i - 1]" alt="" style="width: 80px; height: 80px;"/>
              <span v-else>{{ inputName[i] }}</span>
            </el-button>
          </div>
        </div>


        <!-- 单一方格布局（当type为shapeless时显示） -->
        <div v-else class="single-item">

          <button @click="handleButtonClick(1)" class="grid-button">
            <img v-if="buttonIcons[0]" :src="buttonIcons[0]" alt="" style="width: 80px; height: 80px;"/>
            <span v-else>{{inputName[0]}}</span>
          </button>
        </div>

        <!-- 右边箭头和方格 -->
        <div class="side-container">
          <span class="arrow" style="display: flex;margin-top: -4px">—————</span>
          <el-icon>
            <ArrowRight/>
          </el-icon>
          <el-button @click="openResultDialog" class="grid-button">
            <el-image v-if="resultIcon" :src="resultIcon" alt="" style="width: 80px; height: 80px;"/>
            <span v-else>{{resultName}}</span>
          </el-button>
          <span v-if="showGrid||cutting||shapeless">amount:  <el-input-number v-model="num" :min="1" @change="confirmSelection"/></span>

          <template v-if="!shapeless&&!showGrid&&!cutting">
            <span>experience: </span><el-input-number v-model="experience" :precision="2" :step="0.1" @change="confirmSelection" />
            <span>cooking Time: </span><el-input-number v-model="cookingTime"  :step="1" @change="confirmSelection"/>(秒/s)
          </template>
          <el-button type="success" round @click="generateJSON">生成</el-button>
        </div>
      </div>
    </el-main>

    <!-- JSON 显示区域 -->
    <el-main>
      <el-card style="background-color: #282828;color: white">
        <pre>{{ jsonOutput }}</pre>
      </el-card>
    </el-main>

    <!-- 图标选择对话框 -->
    <el-dialog v-model="dialogVisible" title="Select Items" style="height: 40%">
      <div>
        <el-select-v2 v-model="selectedFile" :options="imageFiles" placeholder="Select Items" filterable clearable :item-height="60"
                      @change="confirmSelection" size="large" :props="{checkStrictly:true}">
          <template #default="{ item }" class="selector">
            <el-image :src="item.path" style="width: 50px; height: 50px; margin-right: 10px;"/>
            <span style="align-items: center;height: 100%;padding-left: 20px;font-weight: bold;font-size: 30px">
              {{ item.label }}
            </span>
          </template>
        </el-select-v2>

        <el-input placeholder="上方未找到，可在此输入，自定义mod内容也需在此输入(格式: minecraft:stick)" style="margin: 15px 0"
                   v-model="inputName[selectedGrid-1]" />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmSelection">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- 结果图标选择框 -->
    <el-dialog v-model="resultDialogVisible" title="Select Result Item" style="height: 40%">
      <div>
        <el-select-v2 v-model="resultIcon" :options="imageFiles" placeholder="Select Result" filterable clearable :item-height="60"
                      @change="confirmSelection" size="large">
          <template #default="{ item }" class="selector">
            <el-image :src="item.path" style="width: 50px; height: 50px; "/>
            <span style="height: 100%;font-weight: bold;padding-left: 30px;font-size: 30px;">
              {{ item.label }}
            </span>
          </template>
        </el-select-v2>
        <el-input placeholder="上方未找到，可在此输入，自定义mod内容也需在此输入(格式: minecraft:stick)" style="margin: 15px 0"
                   v-model="resultName" />

      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resultDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmSelection">Confirm</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
}
.selector{
  display: flex;
  height: 100%;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 10px;
  margin-right: 20px;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}

.grid-button {
  width: 80px;
  height: 80px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.side-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.arrow {
  font-size: 24px;
  cursor: pointer;
}

.single-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

el-card {
  margin-top: 20px;
}
</style>
