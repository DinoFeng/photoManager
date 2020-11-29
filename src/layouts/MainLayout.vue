<template lang="pug">
q-layout(view='hHh lpR fFf')
  q-header.bg-primary.text-white(elevated height-hint='98')
    q-toolbar
      q-btn(dense flat round icon='menu' @click='left = !left')
      q-toolbar-title
        //- q-avatar
        //-   img(src='https://cdn.quasar.dev/logo/svg/quasar-logo.svg')
        | Photo Manager App
      | Quasar v{{ $q.version }}
      //- q-btn(dense flat round icon='menu' @click='right = !right')
  q-drawer(show-if-above v-model='left' side='left' bordered)
    q-list
      q-item-label.text-grey-8(header)
        | Essential Links
      essential-link(v-for='link in essentialLinks' :key='link.title' v-bind='link')

  //- q-drawer(show-if-above v-model='right' side='right' bordered)
    //- drawer content
  q-page-container
    router-view
  q-footer.bg-grey-8.text-white(elevated)
    q-toolbar
      q-toolbar-title
        //- q-avatar
        //-   img(src='https://cdn.quasar.dev/logo/svg/quasar-logo.svg')
        | Build No.

</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      left: false,
      right: false
    }
  }
}
</script>
