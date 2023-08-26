import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-reusable-crop-image',
  templateUrl: './reusable-crop-image.component.html',
  styleUrls: ['./reusable-crop-image.component.css']
})
export class ReusableCropImageComponent {
  title = 'ngImageCrop';
  
  imageChangedEvent: any = '';
    croppedImage: any = '';
  @Input() image:any;
  @Output() afterImageCropped = new EventEmitter<any>();
  fileName: any;


  ngOnInit(){
    this.fileChangeEvent(this.image);
  }
    fileChangeEvent(event: any): void {
      this.fileName= event.target.files[0].name;
        this.imageChangedEvent = event;
    }
    imageCropped(event: any) {
      let self= this;
        var reader:any = new FileReader();
          reader.readAsDataURL(event?.blob);
          reader.onloadend = function() {
            
            self.croppedImage = reader.result;
            var file = new File([event.blob], self.fileName, { type: "image/jpeg", lastModified: Date.now() })
              self.afterImageCropped.emit({'base64': self.croppedImage , 'file': file});
          }
      
          setTimeout(function(){

          })
    }
    imageLoaded() {
        /* show cropper */
    }
    cropperReady() {
        /* cropper ready */
    }
    loadImageFailed() {
        /* show message */
    }
}
