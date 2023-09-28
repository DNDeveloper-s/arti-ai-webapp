'use client';

import {layoutMultilineText, PDFDocument, rgb, TextAlignment} from 'pdf-lib';
import fontKit from '@pdf-lib/fontkit';
import {PDFFont, PDFImage, RGB} from 'pdf-lib/es';

interface AdVariant {
	'Variant': number;
	'Ad Type': "Instagram Story Ad" | "LinkedIn Sponsored Content" | "Google Display Ad" | "YouTube Pre-roll Ad";
	'Image Url': string;
	'Text': string;
	'One liner': string;
	'Image Description': string;
	'Ad orientation': string;
	'Rationale': string;
}

interface JSONInput {
	Confidence: string;
	'Token Count': number;
	'Disclaimer': string;
	'Company Name': string;
	'Date_Time': string;
	'Ad Objective': string;
	'Summary': string;
	'Ads': AdVariant[]
}
interface ColorsConfig {
	'primary': RGB,
	'secondary': RGB,
	'text': RGB,
	[key: string]: RGB
}
interface FontsConfig {
	introFont: PDFFont,
	headerFont: PDFFont,
	subHeaderFont: PDFFont,
	paraFont: PDFFont,
	[key: string]: PDFFont
}
interface PageSize {
	width: number;
	height: number;
}

interface AdVariantParams {
	oneLiner: string;
	imageUrl: string;
	rationale: string;
	adOrientation: string;
	imageDescription: string;
}

export const IS_SERVER = typeof window === "undefined";
export function getProtocol() {
	const isProd = process.env.VERCEL_ENV === "production";
	if (isProd) return "https://";
	return "http://";
}
export function getAbsoluteUrl() {
	//get absolute url in client/browser
	if (!IS_SERVER) {
		return location.origin;
	}
	//get absolute url in server.
	const protocol = getProtocol();
	if (process.env.VERCEL_URL) {
		return `${protocol}${process.env.VERCEL_URL}`;
	}
}

const baseUrl =  getAbsoluteUrl() + "/assets/CAMELLIAS";

const config = {
	font: {
		// lobsterUrl: window.location.origin + "/Lobster-Regular.ttf",
		// inriaSansRegularUrl: window.location.origin + "/InriaSans-Regular.ttf",
		// inriaSansBoldUrl: window.location.origin + "/InriaSans-Bold.ttf",
		// sackerBoldUrl: baseUrl + "/fonts/SackersGothicStd-Heavy.woff2",
		// sackerMediumUrl: baseUrl + "/fonts/SackersGothicStd-Medium.woff2",
		// sackerLightUrl: baseUrl + "/fonts/SackersGothicStd-Medium.woff2",
		// classicRomanUrl: baseUrl + "/fonts/Classic-Roman-Std-Regular.woff2",
		// garamondPremierUrl: baseUrl + "/fonts/Garamond-Premier-Pro-Medium-Caption.woff2",
		// nanumMyeRegularUrl: baseUrl + "/fonts/NanumMyeongjo-Regular.ttf",
		// nanumMyeBoldUrl: baseUrl + "/fonts/NanumMyeongjo-Bold.ttf",
		// nanumMyeExtraBoldUrl: baseUrl + "/fonts/NanumMyeongjo-ExtraBold.ttf",
		// rokkitLightUrl: baseUrl + "/fonts/Rokkitt-Light.ttf",
		// rokkitMediumUrl: baseUrl + "/fonts/Rokkitt-Medium.ttf",
		// rokkitBoldUrl: baseUrl + "/fonts/Rokkitt-Regular.ttf",
		// archivoUrl: baseUrl + "/fonts/ArchivoBlack-Regular.ttf",
		// oswaldLightUrl: baseUrl + "/fonts/Oswald-Light.ttf",
		// oswaldMediumUrl: baseUrl + "/fonts/Oswald-Medium.ttf",
		// oswaldRegularUrl: baseUrl + "/fonts/Oswald-Regular.ttf",
		// montLightUrl: baseUrl + "/fonts/Montserrat-Light.ttf",
		// montMediumUrl: baseUrl + "/fonts/Montserrat-Medium.ttf",
		// montRegularUrl: baseUrl + "/fonts/Montserrat-Regular.ttf",
		// ebGaramondMediumUrl: baseUrl + "/fonts/EBGaramond-Medium.ttf",
		// ebGaramondRegularUrl: baseUrl + "/fonts/EBGaramond-Regular.ttf",
		intro: {
			family: baseUrl + "/fonts/NanumMyeongjo-Regular.ttf",
			size: 20
		},
		header: {
			family: baseUrl + "/fonts/Montserrat-Medium.ttf",
			size: 18
		},
		subHeader: {
			family: baseUrl + "/fonts/Montserrat-Medium.ttf",
			size: 13
		},
		para: {
			family: baseUrl + "/fonts/EBGaramond-Medium.ttf",
			size: 12
		}
	},
	pageSize: {
		width: 976,
		height: 600
	},
	logo: {
		white: baseUrl + "/images/Logo-white.png",
		coloured: baseUrl + "/images/Logo-coloured.png",
		width: 45,
		height: 45
	},
	backgroundColors: {
		main: rgb(239 / 255, 64 / 255, 128 / 255),
		variant: rgb(221 / 255, 230 / 255, 237 / 255),
	},
	dimensions: {
		'Facebook Ad' : 1 / 1,
		'Instagram Story Ad': 9 / 16,
		'LinkedIn Sponsored Content': 1.91 / 1,
		'Google Display Ad': 1 / 2,
		'YouTube Pre-roll Ad': 16 / 9
	}
}

export class PDF {
	pdfDoc: PDFDocument | undefined;
	colors: ColorsConfig;
	fonts: FontsConfig | undefined;
	private pageSize: PageSize;
	inputJSON: JSONInput;

	constructor(json: string) {
		this.colors = {
			primary: rgb(255 / 255, 255 / 255, 255 / 255),
			secondary: rgb(239 / 255, 64 / 255, 128 / 255),
			// text: rgb(37 / 255, 43 / 255, 72 / 255),
			text: rgb(82 / 255, 109 / 255, 130 / 255),
		}

		this.pageSize = {
			width: config.pageSize.width,
			height: config.pageSize.height
		}
		this.inputJSON = JSON.parse(json);
	}

	async init() {
		this.pdfDoc = await PDFDocument.create();
		this.pdfDoc.registerFontkit(fontKit);
		this.fonts = {
			introFont: await this.loadFont(config.font.intro.family),
			headerFont: await this.loadFont(config.font.header.family),
			subHeaderFont: await this.loadFont(config.font.subHeader.family),
			paraFont: await this.loadFont(config.font.para.family),
		}
	}

	async loadFont(url: string): Promise<PDFFont> {
		if(!this.pdfDoc) throw new Error('Make sure to call init method first')
		console.log('url - ', url);
		const fontBytes = await fetch(url).then((res) => res.arrayBuffer());
		return this.pdfDoc.embedFont(fontBytes, {features: {liga: false}});
	}

	async loadPng(url: string): Promise<PDFImage> {
		if(!this.pdfDoc) throw new Error('Make sure to call init method first')
		const pngImageBytes = await fetch(url).then((res) => res.arrayBuffer())
		return this.pdfDoc.embedPng(pngImageBytes);
	}

	async loadJpg(url: string): Promise<PDFImage> {
		if(!this.pdfDoc) throw new Error('Make sure to call init method first')
		const jpImageBytes = await fetch(url).then((res) => res.arrayBuffer())
		return this.pdfDoc.embedJpg(jpImageBytes);
	}

	async loadLogo(coloured = false) {
		return await this.loadPng(coloured ? config.logo.coloured : config.logo.white);
	}

	private async drawThemePage(forVariant = false) {
		if(!this.pdfDoc) throw new Error('Make sure to call init method first')
		const page = this.pdfDoc.addPage([this.pageSize.width, this.pageSize.height]);
		// const pngUrl = 'https://i.ibb.co/ft4JHH3/pngwing-5.png';
		const url = getAbsoluteUrl() + '/assets/images/background-pattern-2.jpg';
		console.log('url 0 ', url);
		const image = await this.loadJpg(url);
		const dims = image.scale(1);

		page.drawImage(image, {
			width: this.pageSize.width,
			height: this.pageSize.height,
			opacity: 0.7
		})

		page.drawRectangle({
			width: this.pageSize.width,
			height: this.pageSize.height,
			color: forVariant ? config.backgroundColors.variant : config.backgroundColors.main,
			opacity: 0.8
		})

		return page;
	}

	private async renderIntroPage() {
		if(!this.fonts) throw new Error('Make sure to call init method first')
		const page = await this.drawThemePage();
		const pageWidth = this.pageSize.width, pageHeight = this.pageSize.height;
		const lineLength = 30;
		const x = (pageWidth / 2) - (lineLength / 2)
		const y = (pageHeight / 2) - 0.5
		page.drawLine({
			start: {x, y},
			end: {x: x+lineLength, y},
			color: this.colors.primary,
			thickness: 1
		})

		const pngImage = await this.loadLogo();

		const imageDim = {width: config.logo.width, height: config.logo.height}
		{
			const x = (pageWidth / 2) - (imageDim.width / 2)
			page.drawImage(pngImage, {
				width: imageDim.width,
				height: imageDim.height,
				x: x,
				y: y + 15,
			})
		}

		{
			const text = this.inputJSON['Company Name'].toUpperCase();
			const textWidth = this.fonts.introFont.widthOfTextAtSize(text, 20);
			const x = (pageWidth / 2) - (textWidth / 2);
			const textHeight = this.fonts.introFont.heightAtSize(20);
			page.drawText(text, {
				font: this.fonts.introFont,
				size: config.font.intro.size,
				x,
				y: y - textHeight - 10,
				color: this.colors.primary
			})
		}
	}

	private async loadVerticalAdContent(params: AdVariantParams, index: number, dimensions: number, margin = 100) {

		const load = async (calculateLayout = false, top = 0) => {
			if(!this.fonts) throw new Error('Make sure to call init method first')
			const page = await this.drawThemePage(true);
			const pageWidth = this.pageSize.width, pageHeight = this.pageSize.height;
			const imageDims = {
				width: dimensions * pageHeight,
				height: pageHeight,
			}
			const offset = margin * 2;

			const mainImage = await this.loadJpg(params.imageUrl);

			page.drawImage(mainImage,{
				y: 0,
				x: pageWidth - imageDims.width,
				width: imageDims.width,
				height: imageDims.height,
			})

			const remainingWidth = pageWidth - imageDims.width;

			const lineLength = 30;
			const x = (remainingWidth / 2) - (lineLength / 2)
			const y = calculateLayout ? pageHeight : pageHeight - top;

			const pngImage = await this.loadLogo(true);

			const logoDim = {width: config.logo.width, height: config.logo.height}
			{
				const x = (remainingWidth / 2) - (logoDim.width / 2)
				page.moveTo(x, y - logoDim.height);
				page.drawImage(pngImage, {
					y: page.getY(),
					width: logoDim.width,
					height: logoDim.height,
				})
			}

			page.drawLine({
				start: {x, y: page.getY() - 15},
				end: {x: x+lineLength, y: page.getY() - 15},
				color: this.colors.secondary,
				thickness: 1
			})

			{
				const text = params.oneLiner.toUpperCase();

				const multiText = layoutMultilineText(text, {
					alignment: TextAlignment.Center,
					font: this.fonts.headerFont,
					fontSize: config.font.header.size,
					bounds: {x: 50, y: pageHeight - 100, width: remainingWidth - offset, height: pageHeight - 150}
				});

				let startingPosition = page.getY();
				for(let i = 0; i < multiText.lines.length; i++) {
					let textWidth = this.fonts.headerFont.widthOfTextAtSize(`${multiText.lines[i].text}`, config.font.header.size);
					page.drawText(`${multiText.lines[i].text}`, {
						x: (remainingWidth / 2) - (textWidth / 2),
						size: config.font.header.size,
						maxWidth: remainingWidth - offset,
						font: this.fonts.headerFont,
						color: this.colors.secondary,
						y: startingPosition - 45
					})
					// move position down
					// pageTwo.moveDown(28);
					startingPosition = startingPosition - 28;
				}

				const loadTitle = async (iconUrl: string, title: string) => {
					if(!this.fonts) throw new Error('Make sure to call init method first')
					const icon = await this.loadPng(iconUrl);
					page.drawImage(icon, {
						x: margin,
						width: 17,
						height: 19
					})
					page.moveUp(19)
					page.drawLine({
						start: {x: page.getX() + 25, y: page.getY()},
						end: {x: page.getX() + 50, y: page.getY()},
						color: this.colors.text
					})

					page.moveDown(16)
					page.drawText(title, {
						x: margin + 25,
						size: config.font.subHeader.size,
						font: this.fonts.subHeaderFont,
						color: this.colors.text
					})
				}
				const loadPara = (text = 'Bold and eye-catching layout with a focus on the spaciousness and connectivity', isLast = false) => {
					if(!this.fonts) throw new Error('Make sure to call init method first')
					const multiText = layoutMultilineText(text, {
						alignment: TextAlignment.Center,
						font: this.fonts.paraFont,
						fontSize: config.font.para.size,
						bounds: {x: margin, y: pageHeight - 100, width: remainingWidth - offset, height: pageHeight - 150}
					});

					let startingPosition = page.getY() - 5;
					for(let i = 0; i < multiText.lines.length; i++) {
						let textWidth = this.fonts.paraFont.widthOfTextAtSize(`${multiText.lines[i].text}`, config.font.para.size);
						page.drawText(`${multiText.lines[i].text}`, {
							size: config.font.para.size,
							maxWidth: remainingWidth - offset,
							font: this.fonts.paraFont,
							color: this.colors.text,
							y: startingPosition - 18
						})
						// move position down
						// pageTwo.moveDown(28);
						startingPosition = startingPosition - 18;
					}

					if(!isLast) page.moveTo(margin, startingPosition - 60)
					else page.moveTo(margin, startingPosition)
				}

				page.moveTo(margin, startingPosition - 80)

				await loadTitle('https://i.ibb.co/k6w488m/Group.png', 'Ad Orientation');
				loadPara(params.adOrientation);

				await loadTitle('https://i.ibb.co/G3vnpyr/Vector.png', 'Image Description');
				loadPara(params.imageDescription);

				await loadTitle('https://i.ibb.co/0KHd6P3/Vector.png', 'Rationale');
				loadPara(params.rationale, true);

				if(calculateLayout) {
					const heightOfContent = (pageHeight) - page.getY();
					this.pdfDoc?.removePage(index);
					return {
						top: (pageHeight / 2) - (heightOfContent / 2)
					}
				}
			}
		}

		const {top} = await load(true);

		await load(false, top);
	}

	private async loadHorizontalAdContent(params: AdVariantParams, index: number, dimensions: number, heightPerc = .63, margin = 20) {
		if(!this.fonts) throw new Error('Make sure to call init method first')
		const page = await this.drawThemePage(true);
		const pageWidth = this.pageSize.width, pageHeight = this.pageSize.height;
		const imageDims = {
			width: dimensions * pageHeight * heightPerc,
			height: pageHeight * heightPerc,
		}
		const offset = margin * 2;

		const mainImage = await this.loadJpg(params.imageUrl);

		page.drawImage(mainImage,{
			y: pageHeight - imageDims.height,
			x: 0,
			width: imageDims.width,
			height: imageDims.height,
		})

		const remainingWidth = pageWidth - imageDims.width;
		const remainingHeight = pageHeight - imageDims.height;

		const lineLength = 30;
		const x = pageWidth - (remainingWidth / 2) - (lineLength / 2)
		const y = pageHeight - (imageDims.height / 2.3);
		page.drawLine({
			start: {x, y},
			end: {x: x+lineLength, y},
			color: this.colors.secondary,
			thickness: 1
		})

		const pngImage = await this.loadLogo(true);

		const imageDim = {width: config.logo.width, height: config.logo.height}
		{
			const x = pageWidth - (remainingWidth / 2) - (imageDim.width / 2)
			page.moveTo(x, y + 15);
			page.drawImage(pngImage, {
				width: imageDim.width,
				height: imageDim.height,
			})
		}

		const text = params.oneLiner.toUpperCase();

		const multiText = layoutMultilineText(text, {
			alignment: TextAlignment.Center,
			font: this.fonts.headerFont,
			fontSize: config.font.header.size,
			bounds: {x: 50, y: pageHeight - 100, width: remainingWidth - offset, height: pageHeight - 150}
		});

		let startingPosition = page.getY();
		for(let i = 0; i < multiText.lines.length; i++) {
			let textWidth = this.fonts.headerFont.widthOfTextAtSize(`${multiText.lines[i].text}`, config.font.header.size);
			page.drawText(`${multiText.lines[i].text}`, {
				x: pageWidth - (remainingWidth / 2) - (textWidth / 2),
				size: config.font.header.size,
				maxWidth: remainingWidth - offset,
				font: this.fonts.headerFont,
				color: this.colors.secondary,
				y: startingPosition - 45
			})
			// move position down
			// pageTwo.moveDown(28);
			startingPosition = startingPosition - 28;
		}

		const gap = 25;
		const widthOfPara = (pageWidth - (5 * gap)) / 3;
		const paraY = pageHeight - imageDims.height - 60;

		page.moveTo(gap * 1.5, paraY);

		const loadTitle = async (iconUrl: string, title: string) => {
			if(!this.fonts) throw new Error('Make sure to call init method first')
			const icon = await this.loadPng(iconUrl);
			page.drawImage(icon, {
				width: 17,
				height: 19
			})
			page.moveUp(19)
			page.drawLine({
				start: {x: page.getX() + 25, y: page.getY()},
				end: {x: page.getX() + 50, y: page.getY()},
				color: this.colors.text
			})

			page.moveDown(16)
			page.drawText(title.toUpperCase(), {
				x: page.getX() + 25,
				size: config.font.subHeader.size,
				font: this.fonts.subHeaderFont,
				color: this.colors.text
			})
		}
		const loadPara = (x = page.getX(), text = 'Bold and eye-catching layout with a focus on the spaciousness and connectivity.') => {
			if(!this.fonts) throw new Error('Make sure to call init method first')
			const multiText = layoutMultilineText(text, {
				alignment: TextAlignment.Center,
				font: this.fonts.paraFont,
				fontSize: config.font.para.size,
				bounds: {x: gap * 1.5, y: page.getY(), width: widthOfPara, height: 200}
			});

			let startingPosition = page.getY() - 5;
			for(let i = 0; i < multiText.lines.length; i++) {
				let textWidth = this.fonts.paraFont.widthOfTextAtSize(`${multiText.lines[i].text}`, config.font.para.size);
				page.drawText(`${multiText.lines[i].text}`, {
					size: config.font.para.size,
					maxWidth: widthOfPara,
					font: this.fonts.paraFont,
					color: this.colors.text,
					y: startingPosition - 18
				})
				// move position down
				// pageTwo.moveDown(28);
				startingPosition = startingPosition - 18;
			}

			page.moveTo(x, paraY)
		}

		await loadTitle('https://i.ibb.co/k6w488m/Group.png', 'Ad Orientation');
		loadPara(gap * 1.5 + widthOfPara + gap, params.adOrientation);

		await loadTitle('https://i.ibb.co/G3vnpyr/Vector.png', 'Image Description');
		loadPara(gap * 1.5 + widthOfPara + gap + widthOfPara + gap, params.imageDescription);

		await loadTitle('https://i.ibb.co/0KHd6P3/Vector.png', 'Rationale');
		loadPara(page.getX(), params.rationale);

	}

	async render(): Promise<string> {
		await this.init();
		if(!this.pdfDoc) throw new Error('Make sure to call init method first')
		await this.renderIntroPage();

		for(let i = 0; i < this.inputJSON.Ads.length; i++) {
			const ad = this.inputJSON.Ads[i];
			const dimensions = config.dimensions[ad['Ad Type']];
			const params = {
				rationale: ad.Rationale,
				imageDescription: ad['Image Description'],
				adOrientation: ad['Ad orientation'],
				oneLiner: ad['One liner'],
				imageUrl: ad['Image Url']
			}
			if(dimensions > 1) {
				await this.loadHorizontalAdContent(params, i + 1, dimensions, )
			} else {
				await this.loadVerticalAdContent(params, i + 1, dimensions, dimensions === 1 ? 30 : 100)
			}
		}
		const pdfBytes = await this.pdfDoc.save();
		return URL.createObjectURL(
			new Blob([pdfBytes], { type: "application/pdf" })
		);
	}
}









































