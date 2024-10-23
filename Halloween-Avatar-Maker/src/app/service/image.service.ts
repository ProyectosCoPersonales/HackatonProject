
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class ImageService {

    constructor(private http: HttpClient) { }

    isCloudinaryUrl(imageUrl: string): boolean {
        return imageUrl.includes('res.cloudinary.com');
    }

    uploadToCloudinary(imageUrl: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.isCloudinaryUrl(imageUrl)) {
                resolve(null);
            } else {
                const uploadUrl = `https://api.cloudinary.com/v1_1/dwnaqwgjk/image/upload`;
                const uploadPreset = 'test-angular';
                this.http.post(uploadUrl, {
                    file: imageUrl,
                    upload_preset: uploadPreset
                }).subscribe({
                    next: (response) => resolve(response),
                    error: (error) => reject(error)
                });
            }
        });
    }
}