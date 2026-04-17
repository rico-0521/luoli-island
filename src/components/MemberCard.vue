<script setup lang="ts">
type Benefit = { icon: string; title: string }
type Plan = {
  key: string
  titleImg: string
  price: number
  originPrice: number
  benefits: Benefit[]
}

defineProps<{
  plan: Plan
  memberTitleImg: string
}>()
</script>

<template>
  <section class="card">
    <img class="card-title" :src="plan.titleImg" :alt="plan.key" />

    <div class="price-row">
      <span class="price">
        <span class="yen">¥</span>
        <span class="num">{{ plan.price }}</span>
      </span>
      <span class="sep" aria-hidden="true">×</span>
      <span class="origin">{{ plan.originPrice }}</span>
    </div>

    <div class="divider" aria-hidden="true"></div>

    <div class="member-title">
      <img :src="memberTitleImg" alt="" aria-hidden="true" />
      <div class="member-text">会员特权</div>
    </div>

    <div class="benefits">
      <div v-for="b in plan.benefits" :key="b.title" class="benefit">
        <img class="icon" :src="b.icon" :alt="b.title" />
        <div class="text">{{ b.title }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  margin-top: calc(18px * var(--s));
  --card-pad-x: calc(40px * var(--s));
  padding: calc(30px * var(--s)) var(--card-pad-x) calc(34px * var(--s));
  border-radius: calc(20px * var(--s));
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.12));
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  inset: -60px -80px auto -80px;
  height: 180px;
  background: radial-gradient(closest-side, rgba(255, 255, 255, 0.26), transparent);
  transform: rotate(-6deg);
}

.card-title {
  position: relative;
  width: calc(400px * var(--s));
  height: auto;
  display: block;
  margin: 0 auto;
}

.price-row {
  position: relative;
  margin-top: calc(24px * var(--s));
  width: calc(400px * var(--s));
  height: calc(76px * var(--s));
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(16px * var(--s));
  background: #00418426;
  border-radius: calc(38px * var(--s));
}

.price {
  display: inline-flex;
  align-items: center;
  font-family: 'PingFang SC', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: #f1ff5d;
}
.yen {
  font-size: calc(30px * var(--s));
  font-weight: 500;
  line-height: calc(62px * var(--s));
  margin-right: calc(2px * var(--s));
}
.num {
  font-size: calc(48px * var(--s));
  font-weight: 600;
  line-height: calc(62px * var(--s));
  letter-spacing: 0;
}
.sep {
  font-family: 'PingFang SC', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: calc(30px * var(--s));
  font-weight: 500;
  line-height: calc(62px * var(--s));
  color: #f1ff5d;
}
.origin {
  font-family: 'PingFang SC', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: calc(30px * var(--s));
  font-weight: 500;
  line-height: calc(62px * var(--s));
  color: #f1ff5d;
  text-decoration: line-through;
}

.divider {
  height: 1px;
  margin-top: calc(40px * var(--s));
  margin-bottom: calc(20px * var(--s));
  margin-left: calc(-1 * var(--card-pad-x));
  margin-right: calc(-1 * var(--card-pad-x));
  background: rgba(255, 255, 255, 0.38);
}

.member-title {
  margin-top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.member-title img {
  width: calc(512px * var(--s));
  height: calc(70px * var(--s));
  display: block;
  filter: none;
}
.member-text {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: 'PingFang SC', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
  font-size: calc(36px * var(--s));
  line-height: calc(62px * var(--s));
  letter-spacing: 0;
  color: #f1ff5d;
}

.benefits {
  margin-top: calc(20px * var(--s));
  display: grid;
  grid-template-columns: max-content max-content;
  justify-content: space-between;
  row-gap: calc(15px * var(--s));
  position: relative;
}
.benefit {
  display: grid;
  grid-template-columns: calc(88px * var(--s)) 1fr;
  align-items: center;
  gap: calc(8px * var(--s));
  padding: 0;
  border-radius: 0;
  background: transparent;
  border: 0;
  text-align: left;
}
.icon {
  width: calc(88px * var(--s));
  height: calc(88px * var(--s));
}
.text {
  font-family: 'PingFang SC', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: calc(26px * var(--s));
  font-weight: 500;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 0;
  text-align: left;
}
</style>

