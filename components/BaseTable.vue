<script setup lang="ts" generic="T">
type Props = {
  headers: {
    title: string;
    key: keyof T;
    width?: string;
  }[];
  items: T[];
  itemKey: keyof T;
  trailing?: {
    title: string;
    width?: string;
  };
};

defineProps<Props>();
</script>

<template>
  <div class="w-full overflow-auto rounded-3xl bg-surface-container">
    <table class="w-full border-collapse table-fixed">
      <colgroup>
        <col
          v-for="header in headers"
          :key="header.key"
          :style="{
            width: header.width,
          }"
        />
        <col
          v-if="trailing"
          :key="'trailing'"
          class="!text-end"
          :style="{
            width: trailing.width,
          }"
        />
      </colgroup>
      <thead
        class="sticky top-0 z-10 [&>tr>th]:whitespace-nowrap [&>tr>th]:px-0 [&>tr>th]:py-3 [&>tr>th:first-child]:pl-6 [&>tr>th:last-child]:pr-6 [&>tr>th]:text-start [&>tr>th]:text-base"
      >
        <tr class="from-primary to-secondary bg-gradient-to-r">
          <th v-for="header in headers" :key="header.key">
            {{ header.title }}
          </th>
          <th v-if="trailing" :key="'trailing'" class="!text-end">
            {{ trailing.title }}
          </th>
        </tr>
      </thead>
      <tbody
        class="[&>tr>td]:px-0 [&>tr>td]:py-0 [&>tr>th]:px-0 [&>tr>th]:py-0 [&>tr>th]:pl-6 [&>tr>td]:text-base"
        :class="{
          '[&>tr>th]:text-start [&>tr>th]:font-normal [&>tr>td]:text-start [&>tr:not(:has(button:hover))]:cursor-pointer [&>tr:not(:has(button:hover)):hover]:bg-outline/20':
            items.length > 0,
        }"
      >
        <tr
          v-for="(item, idx) in items"
          :key="(item as any)[itemKey]"
          :class="{
            'border-b-1 border-b-outline/50 border-b-solid':
              idx !== items.length - 1,
          }"
        >
          <template v-for="(header, index) in headers" :key="header.key">
            <th v-if="index === 0">
              <slot :item="item" :name="`item[${header.key as string}]`">
                {{ item[header.key] }}
              </slot>
            </th>
            <td v-else>
              <slot :item="item" :name="`item[${header.key as string}]`">
                {{ item[header.key] }}
              </slot>
            </td>
          </template>
          <td v-if="trailing" class="!px-0 !text-end">
            <slot :item="item" name="item[trailing]" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
