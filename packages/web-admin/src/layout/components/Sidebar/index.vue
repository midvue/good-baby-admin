<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        unique-opened
        :default-active="activePath"
        :collapse="isCollapse"
        :text-color="variables.menuText"
        :background-color="variables.menuBg"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <template v-for="route in routes" :key="route.path">
          <sidebar-item v-if="!route.hidden" :item="route" />
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import sidebarClr from '@/styles/sidebar.module.scss'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { usePermitStore } from '@/store/modules/permit'
import { useAppStore } from '@/store/modules/app'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'

export default defineComponent({
  components: { SidebarItem, Logo },
  setup() {
    const permission = usePermitStore()
    const appStore = useAppStore()
    const route = useRoute()

    const showLogo = import.meta.env.VITE_APP_SHOW_LOGO

    const routes = computed(() => {
      return permission.asyncRouters.filter((route) => !!route.meta)
    })

    const sidebar = computed(() => {
      return appStore.sidebar
    })

    const isCollapse = computed(() => {
      return !sidebar.value.opened
    })

    const activePath = computed(() => route.path)

    const variables = computed(() => {
      return sidebarClr as any
    })

    return { sidebar, routes, showLogo, isCollapse, variables, activePath }
  }
})
</script>
