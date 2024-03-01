import { VariantImageObj } from "@/interfaces/IArtiBot";

export class VariantImageMap {
    private _imageObj: VariantImageObj;
    private _liveImageObj: VariantImageObj;
    
    public get baseImageObj(): VariantImageObj {
        return this._imageObj;
    }

    public set imageObj(value: VariantImageObj) {
        this._liveImageObj = value;
    }

    public get imageObj(): VariantImageObj {
        return this._liveImageObj;
    }

    constructor(imageObj: VariantImageObj | string) {
        if(typeof imageObj === 'string') {
            this._imageObj = this.prepareObj(imageObj);
            this._liveImageObj = this._imageObj;
            return;
        }
        this._imageObj = imageObj;
        this._liveImageObj = imageObj;
    }

    public update(imageObj: VariantImageObj) {
        this._liveImageObj = imageObj;
        return this;
    }

    public resetImageObj() {
        this._liveImageObj = this._imageObj;
    }

    private prepareObj(url: string) {
        return {
            url,
            bgImage: url,
            timestamp: new Date().toISOString()
        };
    }

    public set(key: keyof VariantImageObj, value: VariantImageObj[keyof VariantImageObj]) {
        this._liveImageObj[key] = value as string;
    }

    public get(key: keyof VariantImageObj) {
        return this._liveImageObj[key];
    }

    public clone() {
        return new VariantImageMap(this._imageObj);
    }
}