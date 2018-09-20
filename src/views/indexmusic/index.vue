<template>
    <div class="indexmusic">
        <!-- 轮播组件 -->
        <Swiper :slideEles="slideEles.map(item => item.imgSrc)"></Swiper>
        <!-- 专辑区域 -->
        <div class="album">
            <h3>推荐专辑</h3>
            <ul>
                <li v-for="(item,index) in getAlbum" @click="showAlbumDetail(index)">
                    <img :src="item.albumImg">
                    <p>{{item.albumTitle}}</p>
                </li>
            </ul>
        </div>
        <transition name="box">
            <Album v-if="albumShow" :albumIndex="albumIndex"></Album>
        </transition>
        <div class="recommend">
            <h3>热歌列表</h3>
            <!-- {{recommend}} -->
            <ul>
                <li v-for="(item,index) in getRecommend" @click="changeAudio(index)">
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
//引入轮播组件
import Swiper from '../../components/swiper.vue'
import Album from '../../components/album.vue'
export default{
    data() {
        return {
            slideEles: [
            {
                imgSrc:
                "http://p1.music.126.net/TJu1Rwbv-NJ6L6tQk-Sb9Q==/109951163459876072.jpg"
            },
            {
                imgSrc:
                "http://p1.music.126.net/fWAfYctPDbUlbdanKuGCkg==/109951163459718599.jpg"
            },
            {
                imgSrc:
                "http://p1.music.126.net/Io3YShsa0l0TwOPCf4M-SQ==/109951163459705298.jpg"
            },
            {
                imgSrc:
                "http://p1.music.126.net/UTKOeNMpx7Fm9-vZ6-yesA==/109951163459741228.jpg"
            }],
            albumIndex: 0,

        }
    },
    methods: {
        showAlbumDetail(index) {
            this.albumIndex = index;
            this.$store.commit("CHANGEALBUMSHOW",{status:true});
            this.$store.commit("CHANGEALBUMINDEX",{albumIndex:index})
        },
        changeAudio(index) {
            this.$store.commit("CHANGERECOMMENDAUDIO",{album: null,albumIndex:null,audioIndex:index,audioShow:true});
            //将播放界面的歌词隐藏
            this.$store.commit("CHANGELYCSHOW",{geciShow:false});
        }
    },
    computed: {
        // 专辑数据
        getAlbum() {
            return this.$store.state.album;
        },
        // 热歌列表数据
        getRecommend() {
            return this.$store.state.recommend;
        },
        albumShow() {
            return this.$store.state.albumShow;
        }
    },
    components: {
        Swiper,
        Album
    }
}
</script>

<style lang='stylus' scoped>
.indexmusic {
    h3 {
        font-weight: normal;
        font-size: 18px;
        height: 40px;
        line-height: 40px;
    }
    h3:before {
        content: '|';
        color: #c20c0c;
        background: #c20c0c;
        font-size: 15px;
        margin: 0 6px;
    }
    .album {
        ul {
            overflow: hidden;
            li {
                float: left;
                width: 33.333%;
                text-align: center;
                img {
                    width: 99%;
                    display: block;
                    padding: 1%;
                }
            }
        }
    }
        .recommend {
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