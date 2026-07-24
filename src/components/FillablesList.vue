<script setup lang="ts">
import { computed } from 'vue'
import { FillableTypes, getFillableConstructor } from '@/fillables/Fillables'
import type { Fillable } from '@/fillables/Fillable'

const fillables = computed(() => {
  const result: Array<{ name: string; levels: [Fillable, Fillable, Fillable] }> = []

  for (const type in FillableTypes) {
    const constructor = getFillableConstructor(FillableTypes[type as keyof typeof FillableTypes])

    const capacity = 10

    const empty = new constructor({ capacity })
    const half = new constructor({ capacity })
    const full = new constructor({ capacity })

    half.fill(capacity / 2)
    full.fill(capacity)

    result.push({ name: type.toLowerCase(), levels: [empty, half, full] })
  }

  return result
})
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Description</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of fillables" :key="item.name">
          <td>{{ item.name }}</td>
          <td style="width: 200px">{{ item.levels[0].description }}</td>
          <td style="width: 150px">
            <div v-html="item.levels[0].css()"></div>
            <div v-for="(fillable, index) of item.levels" :key="index" v-html="fillable.render()"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
