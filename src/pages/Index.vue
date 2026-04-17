<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import imgBanner from '../assets/imgs/banner.png'
import imgNotice from '../assets/imgs/notice.png'
import imgVipTitle from '../assets/imgs/vip.png'
import imgSvipTitle from '../assets/imgs/svip.png'
import imgMemberTitle from '../assets/imgs/png_hytq.png'
import imgBtnOk from '../assets/imgs/btn-ok.png'
import imgBtnDisable from '../assets/imgs/btn-disable.png'

import iconAiTy from '../assets/imgs/icon-aity.png'
import iconAiCloth from '../assets/imgs/icon-vip.png'
import iconCoins from '../assets/imgs/icon-coins.png'
import iconTv from '../assets/imgs/icon-tv.png'
import iconHeart from '../assets/imgs/icon-heart.png'
import iconPlayer from '../assets/imgs/icon-player.png'
import iconMsg from '../assets/imgs/icon-msg.png'

import MemberCard from '../components/MemberCard.vue'
import MemberTabs from '../components/MemberTabs.vue'

type Benefit = { icon: string; title: string }
type PlanKey = 'normal' | 'pro'
type Plan = {
  key: PlanKey
  titleImg: string
  price: number
  originPrice: number
  benefits: Benefit[]
}

const plans: Plan[] = [
  {
    key: 'normal',
    titleImg: imgVipTitle,
    price: 299,
    originPrice: 999,
    benefits: [
      { icon: iconAiTy, title: 'AI换脸15次' },
      { icon: iconAiCloth, title: 'AI去衣15次' },
      { icon: iconCoins, title: '金币视频5次解锁' },
      { icon: iconTv, title: '成人视频无限看' },
      { icon: iconHeart, title: '社区帖子无限看' },
      { icon: iconPlayer, title: '视频下载100部' },
      { icon: iconMsg, title: '专属客服优先服务' },
    ],
  },
  {
    key: 'pro',
    titleImg: imgSvipTitle,
    price: 999,
    originPrice: 2000,
    benefits: [
      { icon: iconAiTy, title: 'AI换脸55次' },
      { icon: iconAiCloth, title: 'AI去衣55次' },
      { icon: iconPlayer, title: 'AI图生视频2次' },
      { icon: iconMsg, title: 'AI绘画2次' },
      { icon: iconCoins, title: 'AI小说2次' },
      { icon: iconTv, title: '暗网视频无限看' },
      { icon: iconPlayer, title: '全站视频无限看' },
      { icon: iconHeart, title: '全站帖子无限看' },
    ],
  },
]

const activePlanKey = ref<PlanKey>('normal')
const activePlan = computed(() => plans.find((p) => p.key === activePlanKey.value) ?? plans[0])

const isOpened = ref(false)

const vw = ref(375)
const refreshVw = () => {
  vw.value = window.innerWidth || 375
}

onMounted(() => {
  refreshVw()
  window.addEventListener('resize', refreshVw, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', refreshVw)
})

const scale = computed(() => Math.min(700, Math.max(320, vw.value)) / 700)

const onOpen = () => {
  if (isOpened.value) return
  isOpened.value = true
}
</script>

<template>
  <div class="h5-activity" :style="{ '--scale': String(scale) }">
    <main class="content">
      <section class="hero">
        <img class="banner" :src="imgBanner" alt="五一放纵夜 会员特权季" />
      </section>

      <section class="notice">
        <img :src="imgNotice" alt="五一专属会员卡｜限时开卡享多重权益" />
      </section>

      <MemberCard :plan="activePlan" :member-title-img="imgMemberTitle" />

      <section class="tabs-wrap">
        <MemberTabs
          v-model="activePlanKey"
          :tabs="[
            { key: 'normal', label: '普通会员' },
            { key: 'pro', label: '高级会员' },
          ]"
        />
      </section>

      <section class="rules">
        <div class="rules-title">规则说明</div>
        <ul class="rules-list">
          <li>购买普通五一专属会员卡的用户，在原有权益基础上，新增免费解锁视频权益。总计可解锁5次。</li>
          <li>购买高级五一专属会员卡的用户，在普通卡全部权益基础上，可额外获得AI生成动感视频权益：自动加速范围、次数或额度，以页面展示及后台实际发放为准。</li>
          <li>活动最终解释权归平台官方所有。</li>
        </ul>
      </section>
    </main>

    <div class="bottom-space" aria-hidden="true"></div>

    <footer class="cta">
      <button class="cta-btn" type="button" @click="onOpen">
        <img :src="isOpened ? imgBtnDisable : imgBtnOk" :alt="isOpened ? '已开通' : '立即开通'" />
      </button>
      <div class="cta-tip">支付问题反馈，点击联系<span class="link">在线客服</span></div>
    </footer>
  </div>
</template>

<style scoped>
.h5-activity {
  --s: var(--scale, 1);
  --text: rgba(255, 255, 255, 0.92);
  --shadow: 0 12px 30px rgba(22, 6, 64, 0.25);
  min-height: 100svh;
  background: linear-gradient(0deg, #d271ff 0%, #2f9aff 100%);
  color: var(--text);
  max-width: 700px;
  margin: 0 auto;
  position: relative;
}

.content {
  padding: 0 calc(15px * var(--s)) 0;
  box-sizing: border-box;
}

.hero {
  margin-left: calc(-15px * var(--s));
  margin-right: calc(-15px * var(--s));
}
.banner {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 16px 28px rgba(8, 10, 55, 0.35));
}

.notice {
  margin-top: calc(12px * var(--s));
  display: flex;
  justify-content: flex-start;
  padding: 0 calc(20px * var(--s));
}
.notice img {
  width: min(100%, calc(546px * var(--s)));
  height: auto;
  display: block;
}

.tabs-wrap {
  margin-top: calc(18px * var(--s));
  margin-bottom: calc(10px * var(--s));
}

.rules {
  margin: calc(22px * var(--s)) 0 calc(10px * var(--s));
  padding: calc(16px * var(--s)) calc(30px * var(--s)) 0;
  border-radius: 0;
  background: transparent;
  border: 0;
  text-align: left;
}
.rules-title {
  font-family: 'PingFang SC', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: calc(36px * var(--s));
  font-weight: 500;
  line-height: calc(62px * var(--s));
  margin-bottom: calc(10px * var(--s));
}
.rules-list {
  font-family: 'PingFang SC', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding-left: calc(28px * var(--s));
  color: rgba(255, 255, 255, 0.92);
  font-size: calc(24px * var(--s));
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0;
}
.rules-list li + li {
  margin-top: calc(10px * var(--s));
}

.bottom-space {
  height: calc(180px * var(--s));
}

.cta {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: min(700px, 100vw);
  padding: calc(20px * var(--s)) calc(50px * var(--s)) calc(22px * var(--s));
  box-sizing: border-box;
  background: #1a1e37;
}

.cta-btn {
  width: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  display: block; 
}
.cta-btn img {
  width: 100%;
  height: 100%;
  display: block;
}

.cta-tip {
  margin-top: calc(10px * var(--s));
  text-align: center;
  font-size: calc(24px * var(--s));
  color: rgba(255, 255, 255, 0.92);
}
.link {
  margin-left: calc(8px * var(--s));
  color: #ffc300;
  font-weight: 400;
}
</style>

