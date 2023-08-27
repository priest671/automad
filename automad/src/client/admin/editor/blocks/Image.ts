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

import { ImgComponent } from '@/components/Img';
import { ModalComponent } from '@/components/Modal/Modal';
import {
	App,
	Attr,
	collectFieldData,
	create,
	createField,
	createImagePickerModal,
	CSS,
	FieldTag,
	getComponentTargetContainer,
	html,
	listen,
	query,
	resolveFileUrl,
	uniqueId,
} from '@/core';
import { ImageBlockData } from '@/types';
import { BaseBlock } from './BaseBlock';

export class ImageBlock extends BaseBlock<ImageBlockData> {
	/**
	 * Sanitizer settings.
	 *
	 * @static
	 */
	static get sanitize() {
		return {
			url: false,
			link: false,
			openInNewTab: false,
			caption: true,
		};
	}

	/**
	 * Paste configuration
	 */
	static get pasteConfig() {
		return {
			patterns: {
				image: /(https?:\/\/)?\S+\.(gif|jpe?g|tiff|png)$/i,
			},
		};
	}

	/**
	 * Toolbox settings.
	 */
	static get toolbox() {
		return {
			title: App.text('imageTool'),
			icon: '<i class="bi bi-image"></i>',
		};
	}

	/**
	 * The image element.
	 */
	private img: ImgComponent;

	/**
	 * The caption element.
	 */
	private caption: HTMLDivElement;

	/**
	 * Prepare block data.
	 *
	 * @param data
	 * @param data.url
	 * @param data.link
	 * @param data.openInNewTab
	 * @param data.caption
	 * @return the image block data
	 */
	protected prepareData(data: ImageBlockData): ImageBlockData {
		return {
			url: data.url || '',
			link: data.link || '',
			openInNewTab: data.openInNewTab || false,
			caption: data.caption || '',
		};
	}

	/**
	 * Set the url property and update the preview.
	 *
	 * @param url
	 */
	private setImage(url: string): void {
		this.data.url = url;
		this.img.src = resolveFileUrl(url);
	}

	/**
	 * Render the main block element.
	 *
	 * @return the rendered block
	 */
	render(): HTMLElement {
		this.wrapper.classList.add(CSS.editorBlockImage);
		this.img = create(
			ImgComponent.TAG_NAME,
			[],
			{},
			this.wrapper
		) as ImgComponent;

		this.setImage(this.data.url);

		const buttons = create(
			'div',
			[CSS.editorBlockImageButtons, CSS.formGroup],
			{},
			this.wrapper
		);

		const select = create(
			'button',
			[CSS.button, CSS.buttonIcon, CSS.formGroupItem],
			{ [Attr.tooltip]: App.text('selectImage') },
			buttons,
			'<i class="bi bi-folder2"></i>'
		);

		const link = create(
			'button',
			[CSS.button, CSS.buttonIcon, CSS.formGroupItem],
			{ [Attr.tooltip]: App.text('link') },
			buttons,
			'<i class="bi bi-link-45deg"></i>'
		);

		this.caption = create(
			'div',
			['cdx-block', 'ce-paragraph'],
			{ contenteditable: 'true', placeholder: App.text('fileCaption') },
			this.wrapper,
			this.data.caption
		);

		listen(select, 'click', this.pickImage.bind(this));
		listen(link, 'click', this.createLinkModal.bind(this));

		return this.wrapper;
	}

	/**
	 * Called when block is added.
	 */
	appendCallback(): void {
		this.pickImage();
	}

	/**
	 * Add image when pasting a valid image url.
	 */
	onPaste(event: CustomEvent) {
		if (event.type == 'pattern') {
			this.setImage(event.detail.data);
		}
	}

	/**
	 * Pick an image.
	 */
	private pickImage(): void {
		createImagePickerModal(
			this.setImage.bind(this),
			App.text('selectImage'),
			this.data.url
		);
	}

	/**
	 * Create the link modal.
	 */
	private createLinkModal(): void {
		const modal = create(
			ModalComponent.TAG_NAME,
			[],
			{ [Attr.destroy]: '' },
			getComponentTargetContainer(),
			html`
				<div class="${CSS.modalDialog}">
					<div class="${CSS.modalHeader}">
						<span>${App.text('link')}</span>
						<am-modal-close
							class="${CSS.modalClose}"
						></am-modal-close>
					</div>
					<div class="${CSS.modalBody}"></div>
					<div class="${CSS.modalFooter}">
						<button class="${CSS.button}">
							${App.text('save')}
						</button>
					</div>
				</div>
			`
		);

		const body = query(`.${CSS.modalBody}`, modal);

		createField(FieldTag.url, body, {
			value: this.data.link,
			name: 'link',
			key: uniqueId(),
			label: App.text('link'),
		});

		createField(FieldTag.toggle, body, {
			value: this.data.openInNewTab,
			name: 'newTab',
			key: uniqueId(),
			label: App.text('openInNewTab'),
		});

		listen(query('button', modal), 'click', () => {
			const data = collectFieldData(modal);

			this.data.link = data.link;
			this.data.openInNewTab = data.newTab ? true : false;

			this.blockAPI.dispatchChange();

			modal.close();
		});

		setTimeout(() => {
			modal.open();
		});
	}

	/**
	 * Return the section block data.
	 *
	 * @return the saved data
	 */
	save(): ImageBlockData {
		this.data.caption = this.caption.innerHTML || '';

		return this.data;
	}
}
