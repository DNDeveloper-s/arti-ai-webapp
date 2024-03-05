import axios from 'axios';

export const base64ToBlob = (base64: string, type: string = '') => {
    console.log('Error exporting the image - ', base64);
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type });
}

export const blobUrlToBlobObject = async (blobUrl: string) => {
    return fetch(blobUrl).then(res => res.blob());
}
