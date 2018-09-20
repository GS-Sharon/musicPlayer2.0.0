<template>
    <div>
        <swiper :options="swiperOption">
            <swiper-slide v-for="(slide, index) in swiperSlides" :key="index">
                 <div class="slideImg" :style='{background: "url("+slide+") center center no-repeat",backgroundSize: "contain"}'></div>
            </swiper-slide>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>

</template>


<script>
  export default {
    props: ['slideEles'],
      name: 'carrousel',
      data() {
          return {
              swiperOption: {
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false, //用户操作swiper之后，是否禁止autoplay。
                },
                pagination: {
                    el: '.swiper-pagination'
                },
                // 前后退按钮
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                }
              },
              swiperSlides: this.slideEles
          }
      }
  }
</script>

<style scoped lang='stylus'>
$allW = 100vw;
.swiper-slide {
    background-color: black;
    .slideImg {
        width: 100%;
        height: $allW * 0.46;
      }
}
</style>