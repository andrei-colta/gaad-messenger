import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccessService } from '../access/access.service';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    rootURL = 'https://node.startupskylab.com/medical/';
    getProfileURL = this.rootURL + 'gd_getProfile';
    updateProfileURL = this.rootURL + 'gd_updateProfile';
    getAllCountriesURL = this.rootURL + 'allCountries';
    getCitiesURL = this.rootURL + 'cities';
    uploadPictureJS = this.rootURL + 'gd_uploadPicture';
    getFriendsURL = this.rootURL + 'gd_getFriends';

    primaryColor = '#ad2f44';
    secondaryColor = '#862031';
    tertiaryColor = '#8d2435';

    alertTimeout = 2000;

    constructor(private http: HttpClient, private accessService: AccessService) { }

    getEditProfile() {
        return new Promise<any>(resolve => {
            this.http.get(this.getProfileURL)
                .subscribe((response: any) => {
                    if (response.status === 'DataRetrieved') {
                        localStorage.setItem('firstName', response.data.firstName);
                        this.accessService.loggedObservable.next(true);
                    }
                    resolve(response);
                });
        });
    }

    getProfile(profileID) {
        return new Promise<any>(resolve => {
            this.http.get(this.getProfileURL, { params: { profileID: profileID } })
                .subscribe((response: any) => {
                    // if (response.status === 'DataRetrieved') {
                        // localStorage.setItem('firstName', response.data.firstName);
                        // this.accessService.loggedObservable.next(true);
                    // }
                    resolve(response);
                });
        });
    }

    getFriends(profileID) {
        return new Promise<any>(resolve => {
            this.http.get(this.getFriendsURL, { params: { profileID: profileID } })
                .subscribe((response) => {
                    resolve(response);
                });
        });
    }

    updateProfile(input) {
        return new Promise<any>(resolve => {
            this.http.post(this.updateProfileURL, input)
                .subscribe((response) => {
                    resolve(response);
                });
        });
    }

    getAllCountries() {
        return new Promise<any>(resolve => {
            this.http.get(this.getAllCountriesURL)
                .subscribe((response: any) => {
                    console.log(response);
                    resolve(response);
                });
        });
    }

    getCities(country) {
        return new Promise<any>(resolve => {
            this.http.get(this.getCitiesURL, { params: { country: country } })
                .subscribe((response: any) => {
                    console.log(response);
                    resolve(response);
                });
        });
    }

    uploadPicture(formData: any, profileID: any) {
        return new Promise<any>(resolve => {
            this.http.post(this.uploadPictureJS, formData, { params: { profileID: profileID } })
                .subscribe((response: any) => {
                    if (response.status === 'NotLogged' || response.status === 'FakeToken' || response.status === 'FailedDecrypt') {
                        localStorage.clear();
                        localStorage.setItem('logoutMessage', 'FakeToken');
                        // this.router.navigate(['./login']);
                    } else {
                        console.log(response.url);
                        if (response.url) {
                            localStorage.setItem('picture', response.url);
                        }
                        this.accessService.loggedObservable.next(true);
                        resolve(response);
                    }
                });
        });
    }
}
