<template>
  <div
    class="message-box"
    :class="{
      [`message-box--${type}`]: type,
    }"
  >
    <div
      v-if="hasDismiss"
      class="message-box__dismiss"
      @click="$emit('dismiss')"
    />

    <slot />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: null
    }
  },
  computed: {
    hasDismiss () {
      return !!(this.$listeners && this.$listeners.dismiss)
    }
  }
}
</script>

<style lang="scss" scoped>
.message-box {
  --color: #000;
  --color-bg: #fff;
  --color-text: #000;
  --shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.2);

  position: relative;
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 32px 0;
  padding: 16px;
  font-size: 18px;
  color: var(--color-text);
  border: 2px solid var(--color);
  border-radius: 8px;
  box-shadow: var(--shadow);
  background-color: var(--color-bg);
}

.message-box--success {
  --color: #55c00d;
  --color-bg: #edf7e7;
  --color-text: #376816;
  --shadow: 0 3px 8px 3px #55c00d31;
}

.message-box--info {
  --color: #3496e7;
  --color-bg: #f5faff;
  --color-text: #174061;
  --shadow: 0 3px 8px 3px #0d6fc02c;
}

.message-box__dismiss {
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 100%;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.message-box__dismiss:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.message-box__dismiss:before,
.message-box__dismiss:after {
  position: absolute;
  left: calc(50% - 1px);
  top: 19px;
  content: ' ';
  height: 16px;
  width: 2px;
  background-color: var(--color);
}
.message-box__dismiss:before {
  transform: rotate(45deg);
}
.message-box__dismiss:after {
  transform: rotate(-45deg);
}
</style>
