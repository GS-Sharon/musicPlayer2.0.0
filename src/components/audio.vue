<template>
    <div class="audioplayerPage" :style='{background: "#000 url("+ getBgImg +") 0 0/contain no-repeat"}' >
        <div class="popwindow" :class="{cur:showPlayList}" @click="changePlayList"></div>
        <header>
            <span class="iconfont icon-houtui1" @click="goBack()" ></span>
            {{(typeof getAudioData.index) == "number" ? getAudioMess.musicName : "播放器"}}
        </header>
        <span v-if="typeof getAudioData.index == 'number'">
            <audio :src="getAudioMess.musicUrl" ref="audioEle" class="audioEl" autoplay @loadedmetadata="getDuration()" @timeupdate="playAudio()"></audio>
        </span>
        <div class="content">
            <div class="cd" @click="showLyc()" v-if="!getGeciIfShow">
                <img src="../../static/img/cd.png">
                <div class="singerbg" :class="{cur:bofang}">
                    <img :src="getSingerImg">
                </div>
            </div>
            <div class="swith">
                <img src="../../static/img/swith.png">
            </div>

            <!-- 歌词盒子 -->
            <div class="lyric" @click="changeGeci()" v-if="getGeciIfShow">
                <ul>
                    <li v-for= "(item,index) in getGeci" :class="{cur: currentTime > item.time && currentTime <= getGeci[index+1 >= getGeci.length ? index : (index+1)].time}">
                        <span class="animationLyric_origin">{{item.content}}
                            <span class="animationLyric_current" :style="{'animation-duration': (getGeci[index+1 >= getGeci.length ? index : (index+1)].time - getGeci[index].time) +'s'}">{{item.content}}</span>
                        </span>
                    </li>
                </ul>
            </div>
            <!-- 歌词盒子 -->

            <!-- 分割线 -->
            <ul class="setting">
                <li class="iconfont icon-xin1"></li>
                <li class="iconfont icon-icon--"></li>
                <li class="iconfont icon-BAI-pinglun"></li>
                <li class="iconfont icon-more-vert"></li>
            </ul>
            <div class="progressBar">
                <p class="start">{{currentTime | zhuanhuan}}</p>
                <p class="range" @click="changeProgress($event)">
                    <span class="duration"><span class="currentTime"></span></span>
                </p>
                <p class="end">{{duration | zhuanhuan}}</p>
            </div>
            <div class="controller">
                <p class="playmodebtn iconfont"
                    :class="[
                      {'icon-xunhuan': playState === 'all'},
                      {'icon-singlecycle': playState === 'once'},
                      {'icon-bofangye-caozuolan-suijibofang': playState === 'random'}
                   ]" @click="changePlayMode()">

                </p>
                <ul>
                    <li class="iconfont icon-previous" @click="toForward()"></li>
                    <li class="iconfont icon-pause-20" :class="{'icon-bofang': !getBofang}" @click="changeBofang()"></li>
                    <li class="iconfont icon-next" @click="toNext()"></li>
                </ul>
                <p class="playlistbtn iconfont icon-zhankaicaidan" @click="changePlayList"></p>
            </div>
        </div>
        <div class="playlist" :class="{cur:showPlayList}">
            <ul>
                <li v-for="(item,index) in getAudioData.audioOrigins" :class="{cur: index == getAudioMess.index}" @click="">
                    <span class="iconfont icon-laba"></span>
                    <span>{{item.musicName}}</span>
                </li>

            </ul>
            <footer>
                <span class="iconfont icon-guanbi" @click="changePlayList"></span>
            </footer>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                showPlayList: false,
                // 播放状态
                bofang : true,
                //播放总时长
                duration: 0,
                // 正在播放时长
                currentTime: 0,
                //循环模式
                playState: "all",
                // 歌词信息
                geciArr: [],
            }
        },
        updated() {
            //updated事件是当页面发生dom变化的时候触发，页面一开始生成的时候会默认先执行一次
            //这里可以通过判断是否处于播放页面进行控制播放还是停止
            if(this.$store.state.audio.audioShow) {
                var bofang = this.$store.state.bofang;
                if (bofang) {
                    $(".audioEl")[0].play();
                    this.duration = $(".audioEl")[0].duration;
                } else {
                    $(".audioEl")[0].pause();
                }
            }
        },
        methods: {
            changePlayList() {
                this.$store.dispatch("SWITCHAUDIO",{way: "now"})
                this.showPlayList = !this.showPlayList;
            },
            // 播放按钮切换
            changeBofang() {
                this.bofang = !this.bofang;
                var _this = this;
                this.$store.commit("CHANGEADIOBOFANG",{bofang: _this.bofang});

            },
            // 返回页面
            goBack() {
                this.$store.commit("CHANGEADIOSHOW",{status: false});
            },
            // 获取单曲总时长
            getDuration() {
                this.duration = $(".audioEl")[0].duration;
            },
            // 监听单曲播放进度
            playAudio() {
                this.currentTime = $(".audioEl")[0].currentTime;
                var per = this.currentTime / this.duration * 100 + "%";
                $(".range .currentTime").width(per);
                // 歌词滚动
                var arr = this.getGeci;
                this.getGeci.forEach((item,index) => {
                    if(this.currentTime >= item.time && this.currentTime <= arr[index+1 >= arr.length ? index : index+1].time) {
                        $(".lyric ul").css("top",$(".lyric").height() / 2 -index*26 + "px");
                    }
                });
                // 歌曲播放完后判断播放模式进行切换
                if($(".audioEl")[0].ended) {
                    console.log("yes")
                    switch(this.playState) {
                        case "all":
                            this.$store.dispatch("SWITCHAUDIO",{way: "next"});
                            break;
                        // 单曲循环
                        case "once":
                            this.$store.dispatch("SWITCHAUDIO",{way: "now"});
                            break;
                        // 随机播放
                        case "random":
                            this.$store.dispatch("SWITCHAUDIO",{way: "random"});
                            break;
                    }
                }
            },
            // 改变播放进度条
            changeProgress(e) {
                var per = parseFloat(e.clientX - $(".range")[0].offsetLeft) / $(".range").width();
                this.currentTime = $(".audioEl")[0].duration * per;
                $(".audioEl")[0].currentTime = this.currentTime;
            },
            // 循环模式切换
            changePlayMode() {
                switch(this.playState) {
                    case "all":
                        this.playState = "once";
                        break;
                    case "once":
                        this.playState = "random";
                        break;
                    case "random":
                        this.playState = "all";
                        break;
                }
            },
            // 上一首切换
            toForward() {
                this.$store.dispatch("SWITCHAUDIO",{way:"pre"});
                // 歌词更新
                this.$store.dispatch("getLyc");
                // 统一显示唱片
                this.$store.commit("CHANGELYCSHOW",{geciShow:false});
            },
            // 下一首切换
            toNext() {
                this.$store.dispatch("SWITCHAUDIO",{way:"next"});
                // 歌词更新
                this.$store.dispatch("getLyc");
                // 统一显示唱片
                this.$store.commit("CHANGELYCSHOW",{geciShow:false});
            },
            // 是否展示歌词
            changeGeci() {
                var _this = this;
                this.$store.commit("CHANGELYCSHOW",{geciShow:!_this.getGeciIfShow});
            },
            showLyc() {
                this.$store.dispatch("getLyc");
                this.changeGeci();
            }
        },
        computed: {
            getAudioData() {
                return this.$store.state.audio;
            },
            getAudioMess() {
                var audioIndex = this.getAudioData.index;
                var albumIndex = this.getAudioData.albumIndex;
                // 点击热歌单曲并返回单曲数据
                if(albumIndex == null) {
                    return this.$store.state.audio.info;
                } else {
                // 点击专辑中的歌曲并返回单曲数据
                    return this.$store.state.audio.info.albumList[audioIndex];
                }
            },
            getBgImg() {
                return (this.getAudioData.albumIndex == null ? this.getAudioMess.playerbg : this.getAudioData.info.playerbg);
            },
            getSingerImg() {
                return (this.getAudioData.albumIndex == null ? this.getAudioMess.singerImg : this.getAudioData.info.albumImg);
            },
            getBofang() {
                var bofang = this.$store.state.bofang;
                return bofang;
            },
            // 獲取歌詞
            getGeci() {
                return this.getAudioData.lyc;
            },
            // 获取歌词展示状态
            getGeciIfShow() {
                return this.$store.state.geciShow;
            }
        },
        // 过滤器
        filters: {
            // s为要计算的秒数
            zhuanhuan(s) {
                var t = '';
                // 计算分钟数
                var min = Math.floor(s/60) % 60;
                // 计算秒数
                var ss = s % 60;

                if(min < 10)  t += "0";
                t += min + ":";
                if(ss < 10) t += "0";
                t += ~~ss;
                return t;
            }
        }
    };
</script>
<style scoped lang='stylus' src="./audio.styl">

</style>