<script lang="ts">
	import { browser } from '$app/environment';
	import { Editor, mergeAttributes } from '@tiptap/core';
	import Blockquote from '@tiptap/extension-blockquote';
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import Document from '@tiptap/extension-document';
	import BaseHeading from '@tiptap/extension-heading';
	import HorizontalRule from '@tiptap/extension-horizontal-rule';
	import Mention from '@tiptap/extension-mention';
	import Paragraph from '@tiptap/extension-paragraph';
	import Table from '@tiptap/extension-table';
	import TableCell from '@tiptap/extension-table-cell';
	import TableHeader from '@tiptap/extension-table-header';
	import TableRow from '@tiptap/extension-table-row';
	import TaskItem from '@tiptap/extension-task-item';
	import TaskList from '@tiptap/extension-task-list';
	import Text from '@tiptap/extension-text';
	import Youtube from '@tiptap/extension-youtube';
	import { common, createLowlight } from 'lowlight';
	import { onDestroy, onMount } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import EditorMenubar from './editor-menubar.svelte';

	type $$Props = HTMLInputAttributes;
	export let value: $$Props['value'] = undefined;
	export let userSuggestions: string[] = [];
	let element: Element;
	let editor: Editor;

	const headingClass: Record<number, string> = {
		1: 'scroll-m-20 text-4xl font-extrabold lg:text-5xl',
		2: 'scroll-m-20 text-3xl font-semibold lg:text-4xl',
		3: 'scroll-m-20 text-2xl font-semibold lg:text-3xl'
	};

	onMount(() => {
		const lowlight = createLowlight(common);

		editor = new Editor({
			element: element ?? '<p>Hello World! 🌍️ </p>',
			content: value,
			extensions: [
				Document.configure({}),
				BaseHeading.configure({
					levels: [1, 2, 3]
				}).extend({
					renderHTML({ node, HTMLAttributes }) {
						const hasLevel = this.options.levels.includes(node.attrs.level);
						const level: number = hasLevel ? node.attrs.level : this.options.levels[0];

						return [
							`h${level}`,
							mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
								class: `${headingClass[level]}`
							}),
							0
						];
					}
				}),
				Paragraph.configure({
					HTMLAttributes: {
						class: 'leading-7'
					}
				}),
				Blockquote.configure({
					HTMLAttributes: {
						class: 'mt-6 border-l-2 pl-6 italic'
					}
				}),
				Table.configure({
					HTMLAttributes: {
						class: 'w-full'
					}
				}),
				TableRow.configure({
					HTMLAttributes: {
						class: 'm-0 border-t p-0 even:bg-muted'
					}
				}),
				TableHeader.configure({
					HTMLAttributes: {
						class:
							'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right'
					}
				}),
				TableCell.configure({
					HTMLAttributes: {
						class:
							'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right'
					}
				}),
				TaskList.configure({
					HTMLAttributes: {
						class: 'my-6 ml-6 list-disc [&>li]:mt-2'
					}
				}),
				TaskItem.configure({
					nested: true
				}),
				Text,
				CodeBlockLowlight.configure({
					lowlight
				}),
				// Image.configure({
				// 	inline: true
				// }),
				Mention.configure({
					renderText({ options, node }) {
						return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
					},
					HTMLAttributes: {
						class: 'text-blue-500'
					},
					renderHTML({ options, node }) {
						return [
							'a',
							{ href: '/profile/1' },
							`${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
						];
					},
					suggestion: {
						char: '@',
						startOfLine: false,
						items: ({ query }) => {
							return userSuggestions.filter((item) =>
								item.toLowerCase().startsWith(query.toLowerCase())
							);
						}
					}
				}),
				HorizontalRule.configure({
					HTMLAttributes: {
						class: 'my-6 border-t'
					}
				}),
				Youtube.configure({
					inline: false
				})
			],
			onTransaction: () => {
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	$: {
		if (editor && browser) {
			value = editor.getJSON();
		}
	}
</script>

<div class="border rounded-lg">
	{#if editor}
		<EditorMenubar {editor} className="border rounded-lg" />
	{/if}
	<div bind:this={element} class="p-4 min-h-24 focus:outline-none" {...$$restProps} />
</div>
