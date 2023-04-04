import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

    profileData: any = {
        id: '',
        firstName: '',
        lastName: '',
        birthday: '',
        country: '',
        picture: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
        city: '',
        gender: ''
    };

    hasAlert;
    alertText;
    alertType;

    selectedFile = null; // poza
    fd = new FormData();
    uploadPic = true;
    picAlert;
    myPicture;
    oldPicture;
    firstPicChange = true;
    picURL;

    // fields for image cropper
    imageChangedEvent: any = '';
    croppedImage: any = '';
    CropTitleVisible: any;
    cropperReady = false;
    croppedfile;
    pTooltip: any;

    today = new Date();

    allCountries = [];
    cities;
    selectedCountry;
    selectedCity;

    constructor(private profileService: ProfileService) { }

    ngOnInit() {
        this.getProfile();
    }

    getProfile() {
        this.profileService.getEditProfile().then((response) => {
            console.log(response);
            if (response.status === 'DataRetrieved') {
                response.data.birthday = new Date(response.data.birthday);
                this.profileData = response.data;

                this.myPicture = response.data.picture;
            }
        });
    }

    updateProfile() {
        if (this.profileData.firstName && this.profileData.lastName) {
            this.profileService.updateProfile(this.profileData).then((response) => {
                console.log(response);
                if (response.status === 'DataUpdated') {
                    this.getProfile();
                }
            });
        }
    }

    loadCountries() {
        if (this.allCountries.length === 0) {
            this.profileService.getAllCountries()
                .then((response: any) => {
                    this.allCountries = response.data;
                });
        }
    }

    selectCountry() {
        this.profileData.city = null;
        this.cities = [];
        this.loadCities(true);
        // if (this.selectedCountry && this.selectedCountry.phone_code) {
        //     this.phoneCode.setValue('+' + this.selectedCountry.phone_code);
        // }
    }

    loadCities(changedCountry) {
        if (this.profileData.country) {

            if (!this.cities || this.cities.length === 0 || changedCountry) {
                this.profileService.getCities(this.profileData.country)
                    .then((response: any) => {
                        if (response.status === 'DataRetrieved') {
                            this.cities = response.data;
                        }
                    });
            }
        }
    }

    searchCity(term, item) {
        if (item.toString().toLowerCase().startsWith(term.toLowerCase())) {
            return true;
        }
        return false;
    }

    searchCountry(term, item) {
        if (item.name.toString().toLowerCase().startsWith(term.toLowerCase())) {
            return true;
        }
        return false;
    }

    upload() {
        this.createFormData(this.croppedfile);
        // console.log(this.croppedFile);
        // console.log('this.croppedFile');
        // console.log(this.fd);
        this.CropTitleVisible = false;
        this.profileService.uploadPicture(this.fd, this.profileData.id)
            .then((response: any) => {
                if (response.status === 'PictureUploaded') {
                    this.hasAlert = true;
                    this.alertType = 'alert-success';
                    this.alertText = 'Picture Uploaded successfully.';

                    setTimeout(() => {
                        this.hasAlert = false;
                    }, this.profileService.alertTimeout);
                }
                console.log(response);
            });

        this.uploadPic = true;
        this.selectedFile = null;
        this.imageChangedEvent = null;
        this.picURL = null;
    }

    createFormData(file) {
        if (file) {
            this.imageChangedEvent = file;
            this.CropTitleVisible = true;
            this.fd = new FormData();
            console.log('file object before upload' + this.croppedfile);
            if (!this.selectedFile) {
                console.log('intra prin if');
                this.selectedFile = <File>file.target.files[0];
            } else {
                this.selectedFile = this.croppedfile;
            }
            const len = this.selectedFile.name.toString().length;
            const extension = this.selectedFile.name.toString().substr(len - 4, len);
            this.fd.append('file', this.selectedFile, this.profileData.id + extension);
            if (this.selectedFile.size > 1000000) {
                this.picAlert = 'Image size cannot be over 1MB!';
            } else {
                this.picAlert = null;
            }
        }
    }

    // ---------- image crop functions
    imageCropped(image: string) {
        this.myPicture = image;
    }

    imageCroppedBase64(image: string) {
        //    this.myPicture = image;
    }

    imageCroppedFile(croppedFile: Blob) {
        // Emits the cropped image as a file each time it is cropped
        this.croppedfile = new File([croppedFile], this.selectedFile.name);
        console.log('crop ', this.selectedFile);

        // this.selectedIcon = file;
        // this.myPicture = file;
        // this.imageChangedEvent = file;
        // this.selectedFile = <File>file;
    }

    imageLoaded() {
        // show cropper
        if (this.firstPicChange) {
            this.oldPicture = this.myPicture;
            this.firstPicChange = false;
        }
        this.cropperReady = true;
    }

    loadImageFailed() {
        // show message
        console.log('FAIL');
    }

    cancelEditPicture() {
        this.firstPicChange = true;
        this.imageChangedEvent = null;
        this.selectedFile = null;
        this.myPicture = this.oldPicture;
        this.cropperReady = false;
    }
}
