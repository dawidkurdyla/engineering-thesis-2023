import { makeObservable, observable, computed, action, runInAction } from "mobx"

import ProfileService from "../services/ProfileService"

import TrainingService from "../services/TrainingService";

class ProfileStore {

    myProfile = null;
    profiles = [];
    contacts = [];
    coachClient = null;
    choosedContact = null;

    constructor() {
        makeObservable(this, {
            myProfile: observable,
            profiles: observable,
            contacts: observable,
            coachClient: observable,
            choosedContact: observable,
            loadMyProfile: action,
            loadContacts: action,
            loadProfiles: action,
            setProfiles: action,
            setCoachClient: action,
            setChoosedContact: action,
            addContact: action,
        })
    }

    // --- Set Functions ---//
    setProfiles(profiles) {
        this.profiles = profiles
    }

    setCoachClient(coachClient) {
        this.coachClient = coachClient
    }

    setChoosedContact(choosedContact) {
        this.choosedContact = choosedContact;
    }


    // --- Load functions --- //
    async loadMyProfile(token, isCoach, callBack=null) {
        try {
            const myProfile = await ProfileService.getMyProfile(token, isCoach);
            runInAction(() => {
                this.myProfile = myProfile;
                if (callBack) {
                    callBack();
                }
                console.log(myProfile);
            })

        } catch (e) {
            console.log(e);
        }
    }

    async loadProfiles(token, searchValue) {
        try {
            const profiles = this.myProfile.is_coach
                ? await ProfileService.getClients(token, null, null, searchValue)
                : await ProfileService.getCoaches(token, null, null, searchValue);

            runInAction(() => {
                this.profiles = profiles;
            });

        } catch (e) {
            console.log(e);
        }
    }

    async loadContacts(token, profileId) {
        try {
            const contacts = this.myProfile.is_coach
                ? await ProfileService.getClients(token, null, profileId)
                : await ProfileService.getCoaches(token, profileId, null);
                
            runInAction(() => {
                this.contacts = contacts;
            });

        } catch (e) {
            console.log(e);
        }
    }

    async loadCochClient(token, profileId, contactId) {
        try {
            const coachClient = this.myProfile.is_coach
                ? await ProfileService.getCochClient(token, profileId, contactId)
                : await ProfileService.getCochClient(token, contactId, profileId);

            runInAction(() => {
                this.setCoachClient(coachClient);
            });
        } catch (e) {
            console.log(e);
        }
    }



    // --- Update functions --- //

    async addContact(token, profileId, contactId) {
        try{
            const addedContact = this.myProfile.is_coach 
                ? await ProfileService.addContact(token, profileId, contactId)
                : await ProfileService.addContact(token, contactId, profileId);

            runInAction(() => {
                this.loadContacts(token, profileId);
            });
        } catch (e) {
            console.log(e);
        }
    }

    async deleteContact(token, profileId, contactId) {
        try{
            const deleted = this.myProfile.is_coach
                ? await ProfileService.deleteContact(token, profileId, contactId)
                : await ProfileService.deleteContact(token, contactId, profileId);

            runInAction(() => {
                this.loadContacts(token, profileId);
            });
        } catch (e) {
            console.log(e);
        }
    }


    // --- Cleanup functions --- //
    
    clearProfiles() {
        this.setProfiles([]);
    }


    // --- Other functions --- //
    isContact(user) {
        if (this.myProfile.is_coach) {
            return this.myProfile.clients?.includes(user.id);
        } else {
            return this.myProfile.coaches?.includes(user.id);
        }

    }
}

export default ProfileStore = new ProfileStore();