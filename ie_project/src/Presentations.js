import React, { Component } from 'react';
import './Presentations.css';
import axios from "axios";
import Table from "react-bootstrap/Table";
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import {createBrowserHistory} from 'history';

function sortByDate(a,b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}

class Presentations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            presentations: [],
            sessions: [],
            schedules: [],
            searchString: "",
            filtered: [],
            isLoading: false,
            data: [],
        };

        this.mapSchedules= this.mapSchedules.bind(this);
        this.handleChange = this.handleChange.bind(this);


    }

    mapSchedules(jsonData){
        let key1, key2, key3;
        let jsonSessions = jsonData.sessions;
        let jsonPresentations = jsonData.presentation;
        let jsonRooms = jsonData.rooms;
        let temp;
        for (key1 in jsonPresentations) {
            temp = jsonPresentations[key1].session;
            for (key2 in jsonSessions) {
                if (key2 === temp) {
                    jsonPresentations[key1].sessionName = jsonSessions[key2].name;
                    jsonPresentations[key1].localization = jsonSessions[key2].localization;
                }
            }

            for (key3 in jsonRooms) {
                temp = jsonPresentations[key1].localization;
                if (key3 === temp) {
                    jsonPresentations[key1].roomName = jsonRooms[key3].name;
                    jsonPresentations[key1].lat = jsonRooms[key3].lat;
                    jsonPresentations[key1].lng = jsonRooms[key3].lng;
                }
            }

            temp = jsonPresentations[key1].date.split("T");
            switch(temp[0]) {
                case '2019-09-02':
                    jsonPresentations[key1].day = 'MONDAY';
                    break;
                case '2019-09-03':
                    jsonPresentations[key1].day = 'TUESDAY';
                    break;
                case '2019-09-04':
                    jsonPresentations[key1].day = 'WEDNESDAY';
                    break;
                case '2019-09-05':
                    jsonPresentations[key1].day = 'THURSDAY';
                    break;
                case '2019-09-06':
                    jsonPresentations[key1].day = 'FRIDAY';
                    break;
                default: break;
            }
        }
        return jsonPresentations;
    }

    handleChange(e) {
        let value = e.target.value;
        this.setState({
            searchString: value,
            filtered: this.state.data.filter(e =>
                Object.values(e)
                    .join(" ")
                    .toLowerCase()
                    .match(value)
            )
        });
    }

    componentDidMount() {
        document.title="YIC Schedule";
        const presentationsPromise = axios.get('https://ie2020.kisim.eu.org/api/presentations');
        const schedulesPromise = axios.get('https://ie2020.kisim.eu.org/api/schedules');
        const roomsPromise = axios.get('https://ie2020.kisim.eu.org/api/rooms');
        const sessionsPromise = axios.get('https://ie2020.kisim.eu.org/api/sessions');

        Promise.all([schedulesPromise, roomsPromise, sessionsPromise, presentationsPromise])
            .then(([schedules, rooms, sessions, presentation]) => {
            let responseData = {
                schedules: schedules.data,
                sessions: sessions.data,
                rooms: rooms.data,
                presentation: presentation.data,
            };

            let sesions = Object.keys(responseData.sessions);
            responseData = this.mapSchedules(responseData);
            this.setState({presentations: responseData});
            this.setState({sessions: sesions});
            this.setState({schedules: schedules.data});
        }).catch(error => console.log(error));

    };

    render() {
        const {presentations = []} = this.state;
        const {schedules = []} = this.state;
        presentations.sort(sortByDate);
        const history = createBrowserHistory();
        const currentDay = (history.location.pathname).toString().substring(1).toUpperCase();
        let currSessions = [];

        if((schedules[currentDay])!==undefined){
            for(let i in schedules[currentDay])
                currSessions.push(schedules[currentDay][i].sessions);
        }

        const searchString = this.state.searchString.trim().toLowerCase();
        let data = this.state.presentations;

        if (searchString.length > 0) {
            data = data.filter(pres => {
                let titles =  pres.title.toLowerCase().match(searchString);
                let sess = pres.sessionName.toLowerCase().match(searchString);

                if(titles!=null) return titles;
                else if(sess!=null) return sess;
                return 0;
            });
        }

        data=data.filter(pres=>{
            return pres.day.match(currentDay);
        });

        return(
            <div>
                <ul className="nav nav-pills">
                    <Navbar bg="dark" variant="light">
                        <Nav className="mr-auto">
                            <Nav.Link href="/monday">Monday</Nav.Link>
                            <Nav.Link href="/tuesday">Tuesday</Nav.Link>
                            <Nav.Link href="/wednesday">Wednesday</Nav.Link>
                            <Nav.Link href="/thursday">Thursday</Nav.Link>
                            <Nav.Link href="/friday">Friday</Nav.Link>
                        </Nav>
                    </Navbar>
                </ul>
                <input className={"inputClass"} placeholder={"Search presentations by title or session name"}
                    value={this.state.searchString} onChange={this.handleChange}/>

            <h1>ECCOMAS YIC2019</h1>
                {data.map((presDetail) => {
                        return <div key={presDetail.id}>
                            <b className={'sessions'}>{presDetail.sessionName}</b>
                            <Table striped>
                                 <tbody>
                                 <tr>
                                     <td  width="20%">{new Intl.DateTimeFormat('en-PL', {
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                second: 'numeric',
                                                timeZone: 'UTC'
                                            }).format(new Date(presDetail.date))}</td>
                                     <td >
                                                <Nav.Link className={'link'} href = {presDetail.filename!=="" ? 'https://ie2020.kisim.eu.org/api/abstracts/'
                                                + presDetail.filename: ""} disabled={this.href === ""}>{presDetail.title}</Nav.Link>
                                     </td>
                                 </tr>
                                 <tr>
                                     <td>
                                            <Nav.Link className={'link'} href={'https://www.google.pl/maps/place/'
                                            +presDetail.lat+','+presDetail.lng}>{presDetail.roomName}</Nav.Link>
                                     </td>
                                     <td>{presDetail.authors.join(", ")}</td>
                                 </tr>
                                 </tbody>
                            </Table>
                        </div>
            })} </div>
        )}
}

export default Presentations;