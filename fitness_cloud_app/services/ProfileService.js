/**
 * API for managing user profiles
 */
import React, {useContext} from 'react';

import ProxyService from './ProxyService';

class ProfileService {

    static async getMyProfile(token, isCoach,){
        let url = '/workout_manager/' + (isCoach ? 'coach' : 'client') + '/me/'
        return ProxyService.get(url, token)
    }

    static async createProfile(data, token, isCoach,){
        let url = '/workout_manager/' + (isCoach ? 'coach/' : 'client/')
        return ProxyService.post(url, {
            "membership": null,
            "first_name": data.first_name,
            "last_name": data.last_name
        }, token )
    }

    static async updateProfile(data, token, isCoach,) {
        let url = '/workout_manager/' + (isCoach ? 'coach/' : 'client/')
        return ProxyService.put(url, {
            "membership": null,
            "first_name": data.first_name,
            "last_name": data.last_name
        }, token)
    }

    static async getClients(token, clientId=null, coachId=null, searchValue=null) {
        let url = '/workout_manager/client/';

        // Gets specific client
        if (clientId) {
            url += `${clientId}/`
        // Gets clients for provided coach
        } else if (coachId) {
            url += `?coach_id=${coachId}`
        //Get clients with search value in their username, first_name or last_name
        } else if (searchValue.length) {
            url += `?search_value=${searchValue}`
        }

        return ProxyService.get(url, token)
    }

    static async getCoaches(token, clientId = null, coachId = null, searchValue = null) {
        let url = '/workout_manager/coach/'

         // Gets specific coach
        if (coachId) {
            url += `${coachId}/`
        // Gets coaches for provided client
        } else if (clientId) {
            url += `?client_id=${clientId}`
        //Get coaches with search value in their username, first_name or last_name
        } else if (searchValue.length) {
            url += `?search_value=${searchValue}`
        }
        

        return ProxyService.get(url, token)
    }

    static async addContact(token, coachId, clientId) {
        let url = '/workout_manager/coach-client/'

        return ProxyService.post(url, {
            "coach_id": coachId,
            "client_id": clientId
        }, token)
    }

    static async getCochClient(token, coachId, clientId) {
        let url = `/workout_manager/coach-client/?client_id=${clientId}&coach_id=${coachId}`

        return ProxyService.get(url, token)
    }

    static async deleteContact(token, coachId, clientId) {
        let url = `/workout_manager/coach-client/?client_id=${clientId}&coach_id=${coachId}`

        return ProxyService.delete(url, token)
    }





}



export default ProfileService