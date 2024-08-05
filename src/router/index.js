import { createRouter, createWebHistory } from 'vue-router';
const routes = [
    { path: '/', redirect: '/mc' },
    {
        path:'/mc',redirect: 'mc/recipes',
        children:[
            {
                path:'recipes',component:()=> import('@/views/mc/Recipes.vue')
            },
            {
                path:'lootTables',component:()=> import('@/views/mc/LootTables.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


export default router;
