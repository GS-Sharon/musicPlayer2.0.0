<template>
  <div id="app">
    <!-- 导航开始 -->
    <div class="header">
        <span class="iconfont icon-caidan menu"></span>
        <header>
            <ul>
                <li class="iconfont" v-for="item in navs" :class="[item.fontClass,{cur:item.fontClass == $route.name}]" @click="routerGo(item.url)">
                </li>
            </ul>
        </header>
        <span class="iconfont icon-zhuanjiguangpan" @click="changAudioShow"></span>
    </div>
    <router-view/>
    <transition name="box">
      <Audio v-show="audioShow"></Audio>
    </transition>
  </div>
</template>

<script>
import Audio from './components/audio.vue'
export default {
  created() {
     this.$store.dispatch('GETDATA');
  },
  data() {
    return {
      navs: [
        {fontClass:"icon-music",url: "/indexmusic"},
        {fontClass:"icon-wangyiyunyinlezizhi-copy",url: "faxianmusic"},
        {fontClass:"icon-diantai",url: "radiomusic"}
      ]
    }
  },
  methods: {
    routerGo(url) {
      this.$router.push({path: url});
    },
// 显示单曲页面并改变单曲数据
    changAudioShow() {
      // 当前专辑
      var album = this.$store.state.audio.album;
      var index = this.$store.state.audio.index;
      this.$store.commit("CHANGEADIOSHOW",{status:true});
      if(album == null) {
        var isAlbum = false;
        this.$store.commit("CHANGEAUDIOINDEX",{audioIndex:index});
        this.$store.commit("GETAUDIOINFO",{isAlbum:isAlbum,index:index});
      }
      //判断album不为空对象即单曲来源是专辑
      else if(JSON.stringify(album) != "{}") {
        var isAlbum = true;
        this.$store.commit("CHANGEAUDIOINDEX",{audioIndex:index});
        this.$store.commit("GETAUDIOINFO",{isAlbum:isAlbum,index:index});
      }
    }
  },
  computed: {
    audioShow() {
      return this.$store.state.audio.audioShow;
    },
    audioInfos() {
      return this.$store.state.audio.info;
    }
  },
  components: {
    Audio
  }
}
</script>

<style lang='stylus'>
  .header{
        position:relative;color:#fff;
        .menu,.icon-zhuanjiguangpan{
            width:50px;height:50px;line-height:50px;font-size:26px;position: absolute;
            top:0;left:0;text-align: center;
        }
        header{
            height:50px;line-height:50px;background:#c20c0c;
            ul{
                overflow:hidden;width:60%;margin:0 auto;
                li{font-size:26px;width:33.333%;float:left;text-align:center;}
                li.cur{background:#9b0909;}
            }
        }
        .icon-zhuanjiguangpan{right:0;left:auto;}

    }
    /* album组件动画 */
    /* 动画即将开始和已经结束的状态 */
     .box-enter-to, .box-leave {
        opacity: 1;
        -webkit-transform: rotate(360deg);
           -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
             -o-transform: rotate(360deg);
                transform: rotate(360deg);
    }
     /* 出现时和将要离开的状态 */
    .box-enter-active, .box-leave-active {
        transition: all .5s ease;
    }
    .box-enter, .box-leave-to {
        opacity: 0;
    }
</style>