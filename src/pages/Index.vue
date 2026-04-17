<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { postJson } from '../api/http'

import imgBanner from '../assets/imgs/banner.png'
import imgNotice from '../assets/imgs/notice.png'
import imgVipTitle from '../assets/imgs/vip.png'
import imgSvipTitle from '../assets/imgs/svip.png'
import imgMemberTitle from '../assets/imgs/png_hytq.png'
import imgBtnOk from '../assets/imgs/btn-ok.png'

import MemberCard from '../components/MemberCard.vue'
import MemberTabs from '../components/MemberTabs.vue'

type MayDayRight = {
  id: number
  name: string
  sub_name?: string
  desc?: string
  img_url?: string
}
type MayDayCard = {
  id: number
  pname: string
  sname: string
  img: string
  op: number
  p: number
  coins: number
  free_coins: number
  description: string
  valid_date: number
  vip_level: number
  pw: string[]
  pw_new: { type: string; name: string; icon: string }[]
  is_a: number
  limit_h: number
  card_type: number
  right: MayDayRight[]
  limit_num_str: string
  channel_show: number
  is_repeat: number
}
type MayDayDetailData = {
  title: string
  sub_title: string
  start_time: string
  end_time: string
  is_started: 0 | 1
  is_ended: 0 | 1
  show_countdown: 0 | 1
  remaining_seconds: number
  cards: MayDayCard[]
  bought_product_id: number
  rules: string
}

type Benefit = { icon: string; title: string }
type Plan = {
  key: string
  titleImg: string
  price: number
  originPrice: number
  benefits: Benefit[]
}

const detail = ref<MayDayDetailData | null>(null)
const loading = ref(false)
const toastText = ref('')
let toastTimer: number | null = null

const toast = (text: string) => {
  toastText.value = text
  if (toastTimer != null) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toastText.value = ''
    toastTimer = null
  }, 2200)
}

const cards = computed(() => detail.value?.cards ?? [])
const activeCardKey = ref<string>('')

const activeIndex = computed(() => Math.max(0, cards.value.findIndex((c) => String(c.id) === activeCardKey.value)))
const activeCard = computed(() => cards.value[activeIndex.value] ?? null)

const tabs = computed(() => {
  const list = cards.value.slice(0, 2)
  return list.map((c, idx) => ({
    key: String(c.id),
    label: c.pname || (idx === 0 ? '普通会员' : '高级会员'),
  }))
})

const activePlan = computed<Plan>(() => {
  const c = activeCard.value
  const titleImg = activeIndex.value === 0 ? imgVipTitle : imgSvipTitle
  return {
    key: c ? String(c.id) : 'loading',
    titleImg,
    price: c?.p ?? 0,
    originPrice: c?.op ?? 0,
    benefits: (c?.right ?? []).map((r) => ({
      icon: r.img_url || '',
      title: r.name,
    })),
  }
})

const rulesList = computed(() => {
  const raw = (detail.value?.rules ?? '').trim()
  if (!raw) return []
  if (raw.includes('\n')) {
    return raw
      .split(/\n+/g)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  const splitByNumber = raw.split(/(?=\d+\.)/g).map((s) => s.trim())
  const list = splitByNumber.filter(Boolean)
  return list.length >= 2 ? list : [raw]
})

const remainingSeconds = ref(0)
let countdownTimer: number | null = null
const showCountdown = computed(() => detail.value?.show_countdown === 1 && remainingSeconds.value > 0)
const countdownText = computed(() => {
  const s = Math.max(0, remainingSeconds.value)
  const hh = String(Math.floor(s / 3600)).padStart(2, '0')
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
})

const startCountdown = (initial: number) => {
  remainingSeconds.value = Math.max(0, Math.floor(initial))
  if (countdownTimer != null) window.clearInterval(countdownTimer)
  countdownTimer = window.setInterval(() => {
    remainingSeconds.value = Math.max(0, remainingSeconds.value - 1)
    if (remainingSeconds.value <= 0 && countdownTimer != null) {
      window.clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

const fetchDetail = async () => {
  loading.value = true
  try {
    const res = await postJson<MayDayDetailData>('api/product/may_day_detail', {})
    if (res.status !== 1) throw new Error(res.msg || res.message || '接口返回失败')
    detail.value = res.data

    const first = res.data.cards?.[0]
    if (!activeCardKey.value && first) activeCardKey.value = String(first.id)

    if (res.data.show_countdown === 1) startCountdown(res.data.remaining_seconds)
    else startCountdown(0)

    if (res.data.title) document.title = res.data.title
  } catch (e) {
    toast('活动数据加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const vw = ref(375)
const refreshVw = () => {
  vw.value = window.innerWidth || 375
}

onMounted(() => {
  refreshVw()
  window.addEventListener('resize', refreshVw, { passive: true })
  fetchDetail()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', refreshVw)
  if (toastTimer != null) window.clearTimeout(toastTimer)
  if (countdownTimer != null) window.clearInterval(countdownTimer)
})

const scale = computed(() => Math.min(700, Math.max(320, vw.value)) / 700)
</script>

<template>
  <div class="h5-activity" :style="{ '--scale': String(scale) }">
    <main class="content">
      <section class="hero">
        <img class="banner" :src="imgBanner" :alt="detail?.title || '五一活动'" />
      </section>

      <section class="notice">
        <img :src="imgNotice" :alt="detail?.sub_title || '五一专属会员卡｜限时开卡享多重权益'" />
      </section>

      <MemberCard :plan="activePlan" :member-title-img="imgMemberTitle" />

      <section class="tabs-wrap">
        <MemberTabs
          v-if="tabs.length === 2"
          v-model="activeCardKey"
          :tabs="tabs"
        />
      </section>

      <section v-if="detail" class="meta">
        <div class="meta-title">{{ detail.title }}</div>
        <div class="meta-sub">{{ detail.sub_title }}</div>
        <div v-if="showCountdown" class="countdown" aria-label="活动倒计时">
          <span class="countdown-label">距结束</span>
          <span class="countdown-time">{{ countdownText }}</span>
        </div>
      </section>

      <section class="rules">
        <div class="rules-title">规则说明</div>
        <ul v-if="rulesList.length" class="rules-list">
          <li v-for="(r, idx) in rulesList" :key="idx">{{ r }}</li>
        </ul>
        <div v-else class="rules-empty">加载中…</div>
      </section>
    </main>

    <div class="bottom-space" aria-hidden="true"></div>

    <footer class="cta">
      <button class="cta-btn" type="button">
        <img :src="imgBtnOk" alt="立即开通" />
      </button>
      <div class="cta-tip">支付问题反馈，点击联系<span class="link">在线客服</span></div>
    </footer>

    <div v-if="toastText" class="toast" role="status" aria-live="polite">{{ toastText }}</div>
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

.meta {
  margin-top: calc(10px * var(--s));
  padding: 0 calc(20px * var(--s));
  text-align: left;
}
.meta-title {
  font-family: 'PingFang SC', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: calc(32px * var(--s));
  font-weight: 600;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.96);
}
.meta-sub {
  margin-top: calc(6px * var(--s));
  font-family: 'PingFang SC', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: calc(24px * var(--s));
  font-weight: 400;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.88);
}
.countdown {
  margin-top: calc(10px * var(--s));
  display: inline-flex;
  align-items: center;
  gap: calc(10px * var(--s));
  padding: calc(8px * var(--s)) calc(14px * var(--s));
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: calc(999px * var(--s));
}
.countdown-label {
  font-size: calc(22px * var(--s));
  color: rgba(255, 255, 255, 0.9);
}
.countdown-time {
  font-variant-numeric: tabular-nums;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: calc(22px * var(--s));
  font-weight: 700;
  color: #f1ff5d;
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
.rules-empty {
  font-family: 'PingFang SC', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: rgba(255, 255, 255, 0.78);
  font-size: calc(24px * var(--s));
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
.cta-btn:disabled {
  cursor: not-allowed;
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

.toast {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(180px * var(--s));
  max-width: min(640px, 92vw);
  padding: calc(14px * var(--s)) calc(18px * var(--s));
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.96);
  font-size: calc(24px * var(--s));
  line-height: 1.35;
  border-radius: calc(16px * var(--s));
  z-index: 50;
}
</style>

