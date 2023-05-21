import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const endpoint = "http://localhost/meetings-app/meetings-crud/public/api/";
const App = (props) => {
    let history = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [schedules2, setSchedules2] = useState([]);

    useEffect(() => {
        getAllSchedules();
    }, []);

    const getAllSchedules = async () => {
        let today = new Date();
        const response = await axios.post(`${endpoint}show`);
        const filteredSchedules = response.data.filter(
            (data) => new Date(data.end_date) > today
        );
        setSchedules(filteredSchedules);
        setSchedules2(response.data);
    };

    const verifyDeleteAction = () => {
        let today = new Date();

        const scheduleToDelete = schedules2.filter(
            (data) => new Date(data.initial_date) <= today
        );
        if (scheduleToDelete.length > 0)
            handleDelete(scheduleToDelete[0].idMeet);
    };

    const handleDelete = async (id) => {
        const formData = new FormData();
        formData.append("idMeet", id);

        axios
            .post(`${endpoint}delete`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Accept: "application/json",
                },
            })
            .then((response) => {
                getAllSchedules();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const updateSchedules = (
        idMeet,
        name_user,
        room_id,
        initial_date,
        end_date,
        room_name
    ) => {
        history("/updateMeeting", {
            state: {
                idMeet: idMeet,
                name_user: name_user,
                room_id: room_id,
                initial_date: initial_date,
                end_date: end_date,
                room_name: room_name,
            },
        });
    };

    return (
        <div className="container-fluid">
            <div className=" d-grid gap-2">
                <Link
                    to="/newMeeting"
                    className="btn btn-success btn-lg mt-2 mb-2 text-white"
                    onClick={verifyDeleteAction}
                >
                    New meeting
                </Link>
            </div>
            <table className="table table-light table-striped">
                <thead>
                    <tr>
                        <th>Room's name</th>
                        <th>Start</th>
                        <th>Finish</th>
                        <th>Assigned to</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map((schedule) => (
                        <tr key={schedule.idMeet}>
                            <td>{schedule.room_name}</td>
                            <td>{schedule.initial_date}</td>
                            <td>{schedule.end_date}</td>
                            <td>{schedule.name_user}</td>
                            <td>
                                <button
                                    onClick={() =>
                                        updateSchedules(
                                            schedule.idMeet,
                                            schedule.name_user,
                                            schedule.room_id,
                                            schedule.initial_date,
                                            schedule.end_date
                                        )
                                    }
                                    className="btn btn-warning  m-1"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() =>
                                        handleDelete(schedule.idMeet)
                                    }
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default App;
