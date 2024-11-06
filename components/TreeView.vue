<template>
  <div class="flex justify-between p-5 m-5 border rounded-lg bg-gray-50">
      <h2 class="text-3xl font-medium">Catalog</h2>
      <select class="mb-2 rounded-lg border px-4 py-1" v-model="selectedLocale" @change="changeLanguage">
        <option value="ru">RU</option>
        <option value="en">EN</option>
        <option value="fr">FR</option>
      </select>
  </div>
  <div class="rounded-lg py-5 pr-5 border m-5 bg-gray-50">
    <div
        class="-ml-5"
        v-for="branch in treeData" :key="branch.id"
    >
      <TreeBranch :treeData="treeData" :branch="branch" :selected-locale="selectedLocale" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useFetch } from '#app';
import type {ITreeData} from "~/types/global";
import TreeBranch from "~/components/TreeBranch.vue";

const treeData = ref<ITreeData[]>([]);
const selectedLocale = ref<string>('ru');

const fetchData = async (): Promise<void> => {
  const { data } = await useFetch<ITreeData[]>('/api/get-data');
  if (data.value) {
    treeData.value = data.value;
  }
};

fetchData();


const changeLanguage = (): void => {
  treeData.value = treeData.value.map(branch => updateBranchLocale(branch, selectedLocale.value));
};

const updateBranchLocale = (branch: ITreeData, locale: string): ITreeData => {
  const localeData = branch.locale[locale] || branch.locale['ru'];
  return {
    ...branch,
    cg_name: localeData?.cg_name || branch.cg_name,
    link: localeData?.link || branch.link,
    childs: branch.childs?.map(child => updateBranchLocale(child, locale))
  };
};
</script>
