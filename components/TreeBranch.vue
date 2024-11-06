<template>
  <div class="ml-10">
    <div :class="[branch.childs?.length ? 'cursor-pointer active:bg-gray-200': 'cursor-no-drop']" @click="toggle" class="mt-4 border bg-white p-2 rounded-lg flex justify-between items-center hover:bg-gray-50 w-full">
      <div>
      <div class="flex gap-x-4 items-center">
          <h2 class="text-xl font-medium whitespace-nowrap truncate max-w-[300px]">{{ getBranchName  }}</h2>
          <div class="text-gray-500 text-sm">{{
              branch.path_to_top?.length ? (getBreadcrumbs(branch.path_to_top) + ' -> ' + getBranchName) : ''
            }}
          </div>
      </div>
        <a :href="getBranchLink" class="-pt-4 text-blue-500 text-xs whitespace-nowrap truncate">
          {{ getBranchLink }}
        </a>
      </div>
      <div v-if="branch.childs?.length">
        <img :class="{'rotate-180': isOpen}" class="w-6 h-6 min-w-6" src="@/assets/chevron-up.png" alt="chevron">
      </div>
    </div>
    <div v-if="isOpen" v-for="child in branch.childs" :key="child.id">
      <TreeBranch :treeData="treeData" :branch="child" :selected-locale="selectedLocale" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type {ITreeData} from "~/types/global";

const props = defineProps<{
  branch: ITreeData;
  treeData: ITreeData[];
  selectedLocale: string;
}>();

const isOpen = ref(false);

const toggle = (): void => {
  if(!props.branch.childs?.length) return
  isOpen.value = !isOpen.value;
};

const getBranchName = computed((): string => {
  const localeData = props.branch.locale[props.selectedLocale] || props.branch.locale['ru'];
  return localeData?.cg_name || 'Неизвестно';
});

const getBranchLink = computed((): string => {
  const localeData = props.branch.locale[props.selectedLocale] || props.branch.locale['ru'];
  return `${localeData?.link}${localeData.id}`
});

const getBreadcrumbs = (path_to_top: number[]): string => {
  const pathNames = path_to_top?.map(id => {
    const foundBranch = findBranchById(id);
    return foundBranch ? getBranchNameFromBranch(foundBranch) : '';
  });
  return pathNames.reverse().join(' -> ');
};

const getBranchNameFromBranch = (branch: ITreeData): string => {
  const localeData = branch.locale[props.selectedLocale] || branch.locale['ru'];
  return localeData?.cg_name || 'Неизвестно';
};

const findBranchById = (id: number): ITreeData | undefined => {
    const traverse = (nodes: ITreeData[]): ITreeData | undefined => {
      for (const node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.childs) {
          const found = traverse(node.childs);
          if (found) {
            return found;
          }
        }
      }
      return undefined;
    };
    return traverse(props.treeData);
};
</script>