// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Public from '../static/js/public.js'


// require styles
import 'swiper/dist/css/swiper.css';
Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(VueAwesomeSwiper)

// 设置全局
const store = new Vuex.Store({
    state: {
        albumIndex:0,
        // 专辑
        album: [],
        // 热歌列表
        recommend: [],
        // 是否显示专辑界面
        albumShow: false,
        // 单曲播放界面有关数据
        audio: {
          album: {},
          albumIndex: null,
          audioShow: false,
          index: null,
          audioOrigins: [],
          info:{
            playerbg: "",
            albumImg: "",
            albumList:[]
          },
          // 歌词数据
          lyc: []
        },
        // 单曲是否正在播放
        bofang: true,
        geciShow: false

    },
    mutations: {
        // 获取data.json中所有数据
        GETDATA(state,{mapList}) {
            state.album = mapList.album;
            state.recommend = mapList.recommend;
        },
        // 控制专辑界面是否显示
        CHANGEALBUMSHOW(state,{status}) {
          state.albumShow = status;
        },
        // 改变专辑索引
        CHANGEALBUMINDEX(state,{albumIndex}) {
          state.albumIndex = albumIndex;
        },
        // 控制播放界面是否显示
        CHANGEADIOSHOW(state,{status}) {
          state.audio.audioShow = status;
        },
        // 改变单曲播放状态
        CHANGEADIOBOFANG(state,{bofang}) {
          state.bofang = bofang;
        },
        // 【通过专辑点击播放】改变单曲对应专辑、对应专辑序号、正处列表的序号、界面是否显示、单曲数据
        CHANGEAUDIO(state,{album,audioIndex,audioShow,albumIndex}) {
          state.audio.album = album;
          state.audio.albumIndex = albumIndex;
          state.audio.index = audioIndex;
          state.audio.audioShow = audioShow;
          state.audio.info = state.album[state.audio.albumIndex];
          // // 更新歌词
          // state.audio.lyc = state.audio.info.musicLyric;
        },
        // 【通过热门列表点击播放】改变单曲对应专辑（null）、对应专辑序号（null）、正处列表的序号、界面是否显示、单曲数据
        CHANGERECOMMENDAUDIO(state,{album,audioIndex,audioShow,albumIndex}) {
          state.audio.album = album;
          state.audio.albumIndex = albumIndex;
          state.audio.index = audioIndex;
          state.audio.audioShow = audioShow;
          state.audio.info = state.recommend[audioIndex];
          // // 更新歌词
          // state.audio.lyc = state.audio.musicLyric;
        },
        // 改变正在播放的单曲列表的序号
        CHANGEAUDIOINDEX(state,{audioIndex}) {
          state.audio.index = audioIndex;
        },
        // 统一获取单曲的数据
        GETAUDIOINFO(state,payload) {
          if(payload.isAlbum) {
            state.audio.info = state.audio.album;
          } else {
            state.audio.info = state.recommend[payload.index];
          }
        },
        // 获取歌曲列表来源
        GETAUDIOSORIGIN(state) {
          var album = state.audio.album;
          // 歌曲来源热歌列表
          if(album == null) {
            state.audio.audioOrigins = state.recommend;
          } else if(JSON.stringify(album) != "{}") {
            // 歌曲来源于专辑
            state.audio.audioOrigins = state.audio.album[state.albumIndex].albumList;
          }
        },
        // 改变歌词展示
        CHANGELYCSHOW(state,{geciShow}) {
          state.geciShow = geciShow;
        }


    },
    actions: {
        async GETDATA({commit},payload) {
            //获取json中的数据
            var data = await fetch('static/data.json').then(data => data.json());
            commit("GETDATA", data);
        },
        // 歌曲切换
        SWITCHAUDIO({commit,state},{way}) {
            commit("GETAUDIOSORIGIN");
            var _this = this,
                audiosLength = state.audio.audioOrigins.length,
                nowIndex = state.audio.index,
                album = state.audio.album;
            switch(way) {
              // 如果是点击上一首
              case "pre":
                var audioIndex = nowIndex <= 0 ? audiosLength - 1 : nowIndex - 1;
                break;
              // 如果点击下一首
              case "next":
                var audioIndex = nowIndex+1 >= audiosLength ? 0 : nowIndex+1;
                break;
              // 当前播放首
              case "now":
                var audioIndex = nowIndex;
                break;
              // 随机播放
              case "random":
                var audioIndex = Math.floor(Math.random()*audiosLength) ;
                audioIndex = audioIndex == nowIndex ? Math.floor(Math.random()*audiosLength) : audioIndex;
              break;
            }
            commit("CHANGEAUDIOINDEX",{audioIndex: audioIndex});
            //改变单曲资源
            if(album == null) {
              var isAlbum = false;
              commit("GETAUDIOINFO",{isAlbum:isAlbum,index:state.audio.index});
            }
            //判断album不为空对象即单曲来源是专辑
            else if(JSON.stringify(album) != "{}") {
              var isAlbum = true;
              commit("GETAUDIOINFO",{isAlbum:isAlbum,index:state.audio.index});
            }
        },
        // 获取当前单曲的歌词
        // 获取歌词并展示歌词界面
        async getLyc({commit,state}) {
            Vue.axios.get(state.audio.info.musicLyric).then(res => {
                state.audio.lyc = res.data;
                state.audio.lyc = Public.getGeciArr(res.data);
            });
        },

    }
})


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
