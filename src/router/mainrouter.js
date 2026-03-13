import {createRouter, createWebHashHistory} from 'vue-router'
import LoginView from "@views/LoginView.vue";
import ArgoInfo from "@views/ArgoInfo.vue";
import mainview from "@views/mainview.vue";
import useStore from "@stores/mainstore.js";
import SignIn from "@views/SignIn.vue";

// 定义路由
// const loginview = {
//     path: '/',
//     component: LoginView,
//     name: 'loginview',
//     meta: {}
// };
// const argoinfoview = {
//     path: '/argo/info.html',
//     component: ArgoInfo,
//     name: 'argoinfo',
//     meta: {}
// };
// const mainviewer = {
//     path: '/mainview',
//     component: mainview,
//     name: 'mainviewer',
//     meta: {}
// };

const loginview = {
    path: '/',
    name: 'loginview',
    component: LoginView,
};
const SignInView = {
    path: '/signinview',
    name: 'signinview',
    component: SignIn,
}
const mainviewer = {
    path: '/mainview',
    component: mainview,
    name: 'mainviewer',
    children: [
        {
            path: '', // 默认显示Mainview内容
            component: () => import("@views/mainview.vue"),
            name: 'maincontent',
        },
        {
            path: 'argoinfo',
            component: ArgoInfo,
            name: 'argoinfo',
        },
    ]
}

const routes = [loginview, mainviewer, SignInView];

const history = createWebHashHistory();

const mainrouter = createRouter({
    routes,
    history,
});

mainrouter.beforeEach((to, from, next) => {
    const store = useStore();
    if (!store.logined && to.name !== 'loginview') {
        next({name: 'loginview'});
    } else {
        next();
    }
});

export default mainrouter;