import axios from 'axios';

export class RoomsService {

    getRooms() {
        return axios.get('https://ie2020.kisim.eu.org/api/rooms')
            .then(res => res.data);
    }

}