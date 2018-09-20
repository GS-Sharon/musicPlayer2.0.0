<template>
    <div class="albumPage">
        <div class="header" :style='{background:"url("+ currentAlbum.albumbg +") center center/100% no-repeat"}'>
            <header>
                <span class="iconfont icon-houtui1" @click="goBack()"></span>
                {{currentAlbum.albumTitle}}
            </header>
            <div class="content">
                <div class="albumImg">
                    <img :src="currentAlbum.albumImg">
                </div>
                <div class="albumDetail">
                    <p class="albumTitle">专辑:{{currentAlbum.albumTitle}}</p>
                    <p class="singer">
                        <img width="30" :src="currentAlbum.albumImg">
                        <span>歌手：{{currentAlbum.albumSinger}}</span>
                    </p>
                </div>
            </div>
            <ul class="setting">
                <li class="iconfont icon-addfile"></li>
                <li class="iconfont icon-BAI-pinglun"></li>
                <li class="iconfont icon-fenxiang1"></li>
                <li class="iconfont icon-icon--"></li>
            </ul>
        </div>
        <div class="albumList">
            <ul>
                <li v-for="(item,index) in currentAlbum.albumList" :class="{cur: index==getAudioData.index && getAudioData.albumIndex == albumIndex}" @click="changeAudio(index)">
                    <span class="index">{{index+1}}</span>
                    <div>
                        <p>{{item.musicName}}</p>
                        <p>{{item.musicSinger}}</p>
                    </div>
                    <span class="iconfont icon-laba"></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    // 接收当前专辑索引
    props: ["albumIndex"],
    data() {
        return {

        }
    },
    methods: {
        goBack() {
            this.$store.commit("CHANGEALBUMSHOW",{status:false});
        },
        changeAudio(index) {
            var albumIndex = this.albumIndex;
            this.$store.commit("CHANGEAUDIO",{album: this.currentAlbum,albumIndex:albumIndex,audioIndex:index,audioShow:true});
        }
    },
    computed: {
        currentAlbum() {
            //请求当前专辑的有关信息
            return this.$store.state.album[this.albumIndex];
        },
        // 获取当前播放单曲数据
        getAudioData() {
            return this.$store.state.audio;
        }
    }
}
</script>

<style scoped lang='stylus'>
.albumPage {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 1;
    .header {
        height: 280px;
        header {
            position: relative;
            color: #fff;
            height: 50px;
            line-height: 50px;
            text-align: center;
            span.icon-houtui1 {
                position: absolute;
                top: 0;
                left: 0;
                width: 50px;
                height: 50px;
                font-size: 26px;
            }
        }
        .content{
            padding:5% 3.5%;
            overflow hidden;
            .albumImg{
                width 35%;
                float left
                img{
                    width 100%
                }
            }
            .albumDetail{
                width 65%
                padding-left:3%;
                float left
                color:#fff;
                p.albumTitle{
                    height 30px
                    line-height 30px
                    margin:3px 0;
                }
                p.singer{
                    height 30px
                    img{
                        width 30px
                        border-radius:50%;
                        float left
                        margin-right 10px;
                    }
                    span{
                        float left
                        line-height 30px
                    }
                }
            }
        }
        .setting{
            overflow hidden
            li{
                float left
                width 25%
                height 50px
                line-height 50px
                text-align center
                font-size 36px
                color #fff
                overflow hidden

            }
        }
    }
    .albumList {
        ul {
            li {
                overflow: hidden;
                padding-top: 5px;
                .index {
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    float: left;
                }
                div {
                    float: left;
                    p {
                        height: 25px;
                        line-height: 25px;
                    }
                    p:nth-child(1) {
                        font-size: 16px;
                        color: #4b4c4d;
                    }
                    p:nth-child(2) {
                        font-size: 14px;
                        color: #888;
                    }
                }
                .icon-laba {
                    height: 50px;
                    width: 50px;
                    line-height: 50px;
                    text-align: center;
                    float: right;
                    font-size: 26px;
                }
            }
            li.cur {
                color: red;
                div {
                    p {
                        color: red;
                    }
                }
            }
        }
    }
}
</style>
