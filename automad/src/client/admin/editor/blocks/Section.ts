/*
 *                    ....
 *                  .:   '':.
 *                  ::::     ':..
 *                  ::.         ''..
 *       .:'.. ..':.:::'    . :.   '':.
 *      :.   ''     ''     '. ::::.. ..:
 *      ::::.        ..':.. .''':::::  .
 *      :::::::..    '..::::  :. ::::  :
 *      ::'':::::::.    ':::.'':.::::  :
 *      :..   ''::::::....':     ''::  :
 *      :::::.    ':::::   :     .. '' .
 *   .''::::::::... ':::.''   ..''  :.''''.
 *   :..:::'':::::  :::::...:''        :..:
 *   ::::::. '::::  ::::::::  ..::        .
 *   ::::::::.::::  ::::::::  :'':.::   .''
 *   ::: '::::::::.' '':::::  :.' '':  :
 *   :::   :::::::::..' ::::  ::...'   .
 *   :::  .::::::::::   ::::  ::::  .:'
 *    '::'  '':::::::   ::::  : ::  :
 *              '::::   ::::  :''  .:
 *               ::::   ::::    ..''
 *               :::: ..:::: .:''
 *                 ''''  '''''
 *
 *
 * AUTOMAD
 *
 * Copyright (c) 2023 by Marc Anton Dahmen
 * https://marcdahmen.de
 *
 * Licensed under the MIT license.
 */

import {
	App,
	Attr,
	Bindings,
	collectFieldData,
	create,
	createEditor,
	createField,
	createSelect,
	CSS,
	FieldTag,
	getComponentTargetContainer,
	html,
	listen,
	query,
	queryAll,
	resolveFileUrl,
	uniqueId,
} from '@/core';
import {
	EditorOutputData,
	SectionAlignItemsOption,
	SectionBlockData,
	SectionJustifyContentOption,
	SectionStyle,
	SelectComponentOption,
} from '@/types';
import { BaseBlock } from './BaseBlock';
import iconFlexGap from '@/svg/icons/flex-gap.svg';
import iconMinWidth from '@/svg/icons/min-width.svg';
import iconFlexJustyifyContent from '@/svg/icons/flex-justify-content.svg';
import iconFlexAlignItems from '@/svg/icons/flex-align-items.svg';
import { EditorJSComponent } from '@/components/Editor/EditorJS';
import { ModalComponent } from '@/components/Modal/Modal';
import { EditorPortalComponent } from '@/components/Editor/EditorPortal';

/**
 * The flexbox option for "justify-content".
 */
export const sectionJustifyContentOptions = {
	start: 'Start',
	end: 'End',
	center: 'Center',
	'space-between': 'Space Between',
	'space-evenly': 'Space Evenly',
	'fill-row': 'Fill Row',
} as const;

/**
 * The flexbox option for "align-items".
 */
export const sectionAlignItemsOptions = {
	normal: 'Normal',
	stretch: 'Stretch',
	center: 'Center',
	start: 'Start',
	end: 'End',
} as const;

/**
 * Background blend modes for the section's background image.
 */
export const sectionBackgroundBlendModes = [
	'normal',
	'multiply',
	'screen',
	'overlay',
	'darken',
	'lighten',
	'color-dodge',
	'color-burn',
	'hard-light',
	'soft-light',
	'difference',
	'exclusion',
	'hue',
	'saturation',
	'color',
	'luminosity',
] as const;

/**
 * Border styles for sections.
 */
export const sectionBorderStyles = [
	'solid',
	'dashed',
	'dotted',
	'double',
	'groove',
	'ridge',
] as const;

/**
 * Section style defaults.
 */
export const styleDefaults: SectionStyle = {
	card: false,
	shadow: false,
	matchRowHeight: false,
	color: '',
	backgroundColor: '',
	backgroundBlendMode: 'normal',
	borderColor: '',
	borderWidth: '0',
	borderRadius: '0',
	borderStyle: 'solid',
	backgroundImage: '',
	paddingTop: '0',
	paddingBottom: '0',
	overflowHidden: false,
} as const;

/**
 * Section style defaults that are used for the editor UI.
 */
const editorStyleDefaults = Object.assign({}, styleDefaults, {
	color: 'inherit',
	backgroundColor: 'transparent',
	borderColor: 'transparent',
});

/**
 * The Section block that create a new editor inside a parent editor
 * in order to create nested flexbox layouts.
 *
 * @extends BaseBlock
 */
export class SectionBlock extends BaseBlock<SectionBlockData> {
	/**
	 * The editor holder element.
	 */
	private holder: EditorJSComponent = null;

	/**
	 * Enable linebreaks.
	 *
	 * @static
	 */
	static get enableLineBreaks() {
		return true;
	}

	/**
	 * Sanitizer settings.
	 *
	 * @static
	 */
	static get sanitize() {
		return {
			content: true,
			style: false,
		};
	}

	/**
	 * Toolbox settings.
	 */
	static get toolbox() {
		return {
			title: App.text('editorBlockSection'),
			icon: '<i class="bi bi-layout-three-columns"></i>',
		};
	}

	/**
	 * Prepare block data.
	 *
	 * @param data
	 * @return the section block data
	 */
	protected prepareData(data: SectionBlockData): SectionBlockData {
		return {
			content: data.content || {},
			style: Object.assign({}, styleDefaults, data.style),
			justify: data.justify || 'start',
			align: data.align || 'normal',
			gap: data.gap !== undefined ? data.gap : '',
			minBlockWidth:
				data.minBlockWidth !== undefined ? data.minBlockWidth : '',
		};
	}

	/**
	 * Render the main block element.
	 *
	 * @return the rendered block
	 */
	render(): HTMLElement {
		this.wrapper.classList.add(CSS.editorBlockSection);

		create(
			'span',
			[CSS.flex],
			{},
			this.wrapper,
			html`
				<span class="${CSS.editorBlockSectionLabel}">
					${App.text('editorBlockSection')}
				</span>
			`
		);

		const portal = create(
			EditorPortalComponent.TAG_NAME,
			[],
			{},
			this.wrapper
		);

		this.holder = createEditor(
			portal,
			this.data.content as EditorOutputData,
			{
				onChange: async (api) => {
					const { blocks } = await api.saver.save();

					this.data.content = { blocks };
					this.blockAPI.dispatchChange();
				},
			},
			true
		);

		listen(this.holder, 'paste', (event: Event) => {
			event.stopPropagation();
		});

		this.renderToolbar();
		this.setStyle();

		return this.wrapper;
	}

	/**
	 * Return the section block data.
	 *
	 * @return the saved data
	 */
	save(): SectionBlockData {
		return this.data;
	}

	/**
	 * Render the layout toolbox and append it to the main wrapper.
	 */
	private renderToolbar(): void {
		const toolbar = create(
			'div',
			[CSS.editorBlockSectionToolbar],
			{},
			this.wrapper
		);

		this.renderStylesButton(toolbar);
		this.renderJustifySelect(toolbar);
		this.renderAlignSelect(toolbar);
		this.renderNumberUnitInput(toolbar, 'gap', iconFlexGap);
		this.renderNumberUnitInput(toolbar, 'minBlockWidth', iconMinWidth);

		// Add this hidden input in order to catch the focus after a block has been dragged around.
		create('input', [CSS.displayNone], {}, toolbar);

		listen(toolbar, 'change', () => {
			this.setStyle();
		});

		const setToolbarPosition = () => {
			toolbar.style.transform = 'translateX(0)';

			setTimeout(() => {
				const rect = toolbar.getBoundingClientRect();
				const docWidth = document.body.offsetWidth;

				if (docWidth < rect.right) {
					const shift = docWidth - rect.right - 10;

					toolbar.style.transform = `translateX(${shift}px)`;
				}
			}, 0);
		};

		listen(this.wrapper, 'click', (event: Event) => {
			event.stopPropagation();

			queryAll(`.${CSS.editorBlockSectionToolbar}`).forEach(
				(_toolbar) => {
					_toolbar.classList.toggle(CSS.active, _toolbar == toolbar);
				}
			);

			setToolbarPosition();
		});
	}

	/**
	 * Render the styles button.
	 *
	 * @param toolbar
	 */
	private renderStylesButton(toolbar: HTMLElement): void {
		const button = create(
			'am-modal-toggle',
			[CSS.button, CSS.buttonIcon, CSS.buttonAccent],
			{ [Attr.tooltip]: App.text('editStyle') },
			toolbar,
			'<i class="bi bi-palette2"></i>'
		);

		listen(button, 'click', () => {
			this.renderStylesModal();
		});
	}

	/**
	 * Render the justify setting select button.
	 *
	 * @param toolbar
	 */
	private renderJustifySelect(toolbar: HTMLElement): void {
		const justifySelectOptions = Object.keys(
			sectionJustifyContentOptions
		).reduce((result, key: SectionJustifyContentOption) => {
			result.push({
				text: sectionJustifyContentOptions[key],
				value: key,
			});

			return result;
		}, []);
		const formGroup = create(
			'span',
			[CSS.formGroup],
			{},
			toolbar,
			html`
				<span class="${CSS.formGroupItem} ${CSS.formGroupIcon}">
					${iconFlexJustyifyContent}
				</span>
			`
		);

		const justify = createSelect(
			justifySelectOptions,
			this.data.justify,
			formGroup,
			null,
			null,
			'',
			[CSS.formGroupItem, CSS.selectInline]
		);

		listen(justify.select, 'change', () => {
			this.data.justify = justify.value as SectionJustifyContentOption;
			this.blockAPI.dispatchChange();
		});
	}

	/**
	 * Render the align setting select button.
	 *
	 * @param toolbar
	 */
	private renderAlignSelect(toolbar: HTMLElement): void {
		const alignSelectOptions = Object.keys(sectionAlignItemsOptions).reduce(
			(result, key: SectionAlignItemsOption) => {
				result.push({
					text: sectionAlignItemsOptions[key],
					value: key,
				});

				return result;
			},
			[]
		);
		const formGroup = create(
			'span',
			[CSS.formGroup],
			{},
			toolbar,
			html`
				<span class="${CSS.formGroupItem} ${CSS.formGroupIcon}">
					${iconFlexAlignItems}
				</span>
			`
		);

		const align = createSelect(
			alignSelectOptions,
			this.data.align,
			formGroup,
			null,
			null,
			'',
			[CSS.formGroupItem, CSS.selectInline]
		);

		listen(align.select, 'change', () => {
			this.data.align = align.value as SectionAlignItemsOption;
			this.blockAPI.dispatchChange();
		});
	}

	/**
	 * Render a number unit input.
	 *
	 * @param toolbar
	 * @param key
	 * @param icon
	 */
	private renderNumberUnitInput(
		toolbar: HTMLElement,
		key: 'gap' | 'minBlockWidth',
		icon: string
	): void {
		const group = create(
			'span',
			[CSS.formGroup],
			{},
			toolbar,
			html`
				<span class="${CSS.formGroupItem} ${CSS.formGroupIcon}">
					${icon}
				</span>
			`
		);

		const input = create(
			'am-number-unit-input',
			[CSS.formGroupItem],
			{ value: this.data[key] },
			group
		);

		listen(input, 'change', () => {
			this.data[key] = input.value;
			this.blockAPI.dispatchChange();
		});
	}

	/**
	 * Render the styles modal and append it to root.
	 */
	private renderStylesModal(): void {
		const modal = create(
			ModalComponent.TAG_NAME,
			[],
			{ [Attr.destroy]: '' },
			getComponentTargetContainer(),
			html`
				<div class="${CSS.modalDialog}">
					<am-modal-header>
						${App.text('editStyle')}
					</am-modal-header>
					<am-modal-body></am-modal-body>
					<div class="${CSS.modalFooter}">
						<button class="${CSS.button} ${CSS.buttonAccent}">
							${App.text('ok')}
						</button>
					</div>
				</div>
			`
		);

		const body = query('am-modal-body', modal);
		const button = query(`.${CSS.modalFooter} button`, modal);

		const field = (
			type: FieldTag,
			name: keyof SectionStyle,
			text: string,
			parent: HTMLElement
		): void => {
			createField(type, parent, {
				name: name,
				value: this.data.style[name],
				key: uniqueId(),
				label: App.text(text),
			});
		};

		field(FieldTag.toggle, 'card', 'optimizeContentForCards', body);
		field(FieldTag.toggle, 'matchRowHeight', 'matchRowHeight', body);

		const group1 = create('div', [CSS.grid, CSS.gridAuto], {}, body);

		field(FieldTag.toggle, 'overflowHidden', 'overflowHidden', group1);
		field(FieldTag.toggle, 'shadow', 'addShadow', group1);
		const group2 = create('div', [CSS.grid, CSS.gridAuto], {}, body);

		field(FieldTag.color, 'color', 'textColor', group2);
		field(FieldTag.color, 'backgroundColor', 'backgroundColor', group2);

		const group3 = create('div', [CSS.grid, CSS.gridAuto], {}, body);

		const borderStyleId = uniqueId();
		const borderStyle = create(
			'div',
			[CSS.field],
			{},
			group3,
			html`<div>
				<label for="${borderStyleId}" class="${CSS.fieldLabel}">
					${App.text('borderStyle')}
				</label>
			</div>`
		);

		createSelect(
			sectionBorderStyles.reduce(
				(
					res: SelectComponentOption[],
					style: string
				): SelectComponentOption[] => {
					return [...res, { value: style }];
				},
				[]
			),
			this.data.style.borderStyle,
			borderStyle,
			'borderStyle',
			borderStyleId
		);

		field(FieldTag.color, 'borderColor', 'borderColor', group3);

		field(FieldTag.imageSelect, 'backgroundImage', 'backgroundImage', body);

		const blendModeId = uniqueId();
		const blendMode = create(
			'div',
			[CSS.field],
			{},
			body,
			html`
				<div>
					<label for="${blendModeId}" class="${CSS.fieldLabel}">
						Background Blendmode
					</label>
				</div>
			`
		);

		createSelect(
			sectionBackgroundBlendModes.reduce(
				(
					res: SelectComponentOption[],
					mode: string
				): SelectComponentOption[] => {
					return [...res, { value: mode }];
				},
				[]
			),
			this.data.style.backgroundBlendMode,
			blendMode,
			'backgroundBlendMode',
			blendModeId
		);

		const group4 = create('div', [CSS.grid, CSS.gridAuto], {}, body);
		field(FieldTag.numberUnit, 'borderWidth', 'borderWidth', group4);
		field(FieldTag.numberUnit, 'borderRadius', 'borderRadius', group4);
		const group5 = create('div', [CSS.grid, CSS.gridAuto], {}, body);

		field(FieldTag.numberUnit, 'paddingTop', 'paddingTop', group5);
		field(FieldTag.numberUnit, 'paddingBottom', 'paddingBottom', group5);

		Bindings.connectElements(body);

		listen(button, 'click', () => {
			this.data.style = collectFieldData(body) as SectionStyle;
			this.setStyle();
			this.blockAPI.dispatchChange();

			modal.close();
		});

		setTimeout(() => {
			modal.open();
		});
	}

	/**
	 * Set the section styles.
	 */
	private setStyle(): void {
		const { style, gap, justify, align, minBlockWidth } = this.data;
		const baseClass = CSS.editorStyleBase;
		const classes: string[] = [CSS.editorBlockSectionEditor];

		classes.push(`${baseClass}--justify-${justify}`);
		classes.push(`${baseClass}--align-${align}`);

		if (style.card) {
			classes.push(`${baseClass}--card`);
		}

		if (style.shadow) {
			classes.push(`${baseClass}--shadow`);
		}

		if (style.overflowHidden) {
			classes.push(`${baseClass}--overflow-hidden`);
		}

		if (style.matchRowHeight) {
			classes.push(`${baseClass}--match-height`);
		}

		this.holder.className = classes.join(' ');

		const inline: string[] = [];

		[
			'color',
			'backgroundColor',
			'backgroundBlendMode',
			'borderColor',
			'borderWidth',
			'borderRadius',
			'borderStyle',
			'paddingTop',
			'paddingBottom',
		].forEach((prop: string) => {
			const value = style[prop as keyof SectionStyle];

			inline.push(
				`--${prop}: ${
					value || editorStyleDefaults[prop as keyof SectionStyle]
				};`
			);
		});

		if (style['backgroundImage']) {
			const url = resolveFileUrl(style['backgroundImage']);

			inline.push(`--backgroundImage: url(${url});`);
		} else {
			inline.push(`--backgroundImage: none;`);
		}

		if (gap) {
			inline.push(`--gap: ${gap};`);
		}

		if (minBlockWidth) {
			inline.push(`--minBlockWidth: ${minBlockWidth};`);
		}

		this.holder.setAttribute('style', inline.join(' '));
	}
}
