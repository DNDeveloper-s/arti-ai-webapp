export class StringUtils {
	str;
	private _computed: boolean = false;

	constructor(str: string) {
		this.str = str;
	}

	isNotEmpty(str?: string): StringUtils {
		this.str = str ?? this.str;
		this._computed = Boolean(this.str) && this.str.length > 0;
		return this;
	}

	isMinLength(length: number, str?: string): StringUtils {
		this.str = str ?? this.str;
		this._computed = Boolean(this.str) && this.str.length >= length;
		return this;
	}

	isMaxLength(length: number, str?: string): StringUtils {
		this.str = str ?? this.str;
		this._computed = Boolean(this.str) && this.str.length <= length;
		return this;
	}

	get(): boolean {
		return this._computed;
	}
}
