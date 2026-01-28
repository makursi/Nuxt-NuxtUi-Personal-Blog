<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { generateHTML } from '@tiptap/html'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const editor = new Editor({
  extensions: [StarterKit],
  content: props.modelValue,
  onUpdate: () => {
    // ✅ 关键：把 JSON 转成 HTML 字符串再 emit
    const html = editor.getHTML()
    emit('update:modelValue', html)
  }
})

onBeforeUnmount(() => {
  editor.destroy()
})
</script>



<template>
  <div class="tiptap-editor border rounded">
    <EditorContent :editor="editor"/>
  </div>
</template>


<style lang="scss" scoped>

</style>