import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const endpoint = "http://localhost/meetings-crud/public/api/";
const Create = () => {
    let history = useNavigate();
    const [data, setData] = useState({
        name_user: "",
        room_id: "",
        initial_date: "",
        end_date: "",
    });
    const [schedules, setSchedules] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        getAllRooms();
        getAllSchedules();
    }, []);

    const onChange = (e) => {
        e.persist();
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const getAllRooms = async () => {
        const response = await axios.post(`${endpoint}room`);
        setRooms(response.data);
    };

    const getAllSchedules = async () => {
        const response = await axios.post(`${endpoint}show`);
        setSchedules(response.data);
    };

    const handleSubmit = () => {
        let today = new Date();
        const yesterday = new Date(today);
        yesterday.setMinutes(yesterday.getMinutes() - 1);
        const dateReferenceFirst = new Date(data.initial_date);
        const dateReferenceSecond = new Date(data.end_date);
        if (dateReferenceFirst < yesterday || dateReferenceSecond < yesterday)
            alert("Bro plz don't use the past");
        else if (dateReferenceFirst > dateReferenceSecond)
            alert("Bro the future can't be before the past");
        else if (
            dateReferenceSecond.getHours() - dateReferenceFirst.getHours() ===
                0 &&
            dateReferenceFirst.getDate() === dateReferenceSecond.getDate() &&
            dateReferenceFirst.getMonth() === dateReferenceSecond.getMonth()
        )
            alert("Bro it has to last at least one hour");
        else if (
            dateReferenceSecond.getHours() - dateReferenceFirst.getHours() >
                2 ||
            dateReferenceFirst.getDate() < dateReferenceSecond.getDate() ||
            dateReferenceFirst.getMonth() < dateReferenceSecond.getMonth()
        )
            alert("Bro it has to last at most two hours");
        else if (
            data.name_user === "" ||
            data.initial_date === "" ||
            data.end_date === "" ||
            data.room_id === "" ||
            data.room_id === "0"
        )
            alert("Bro fill all the fields");
        else {
            compareDates(
                dateReferenceFirst,
                dateReferenceSecond,
                data.room_id,
                data.name_user
            );
        }
    };

    const compareDates = (initial_date, end_date, room, user) => {
        let bool = true;
        schedules.forEach((element) => {
            const dateReferenceFirst = new Date(element.initial_date);
            const dateReferenceSecond = new Date(element.end_date);
            const roomReference = element.room_id;
            if (roomReference === parseInt(room)) {
                if (
                    (initial_date >= dateReferenceFirst &&
                        end_date <= dateReferenceSecond) ||
                    (initial_date <= dateReferenceFirst &&
                        end_date <= dateReferenceSecond) ||
                    (initial_date >= dateReferenceFirst &&
                        initial_date < dateReferenceSecond &&
                        end_date >= dateReferenceSecond) ||
                    (initial_date <= dateReferenceFirst &&
                        end_date >= dateReferenceSecond)
                ) {
                    alert("Bro at that moment the room is scheduled");
                    bool = false;
                }
            }
        });
        if (bool) {
            const formData = new FormData();
            let date1 =
                initial_date.getFullYear() +
                "-" +
                (initial_date.getMonth() + 1) +
                "-" +
                initial_date.getDate() +
                "T" +
                initial_date.getHours() +
                ":" +
                initial_date.getMinutes() +
                ":" +
                initial_date.getSeconds();

            let date2 =
                end_date.getFullYear() +
                "-" +
                (end_date.getMonth() + 1) +
                "-" +
                end_date.getDate() +
                "T" +
                end_date.getHours() +
                ":" +
                end_date.getMinutes() +
                ":" +
                end_date.getSeconds();

            formData.append("name_user", user);
            formData.append("room_id", room);
            formData.append("initial_date", date1);
            formData.append("end_date", date2);
            axios
                .post(`${endpoint}add`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    history("/");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    return (
        <Form>
            <h1>Schedule a meeting</h1>
            <Form.Group className="mb-3">
                <Form.Label>Full name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Please type your name"
                    name="name_user"
                    onChange={onChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Room</Form.Label>
                <select
                    className="form-select"
                    aria-label="Default select example"
                    onChange={(e) => {
                        setData({ ...data, ["room_id"]: e.target.value });
                    }}
                >
                    <option value={0}>Choose room</option>
                    {rooms.map((room) => {
                        return (
                            <option key={room.id} value={room.id}>
                                {room.room_name}
                            </option>
                        );
                    })}
                </select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Starting date</Form.Label>
                <Form.Control
                    type="datetime-local"
                    placeholder="date"
                    name="initial_date"
                    onChange={onChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Finish date</Form.Label>
                <Form.Control
                    type="datetime-local"
                    placeholder="date"
                    name="end_date"
                    onChange={onChange}
                />
            </Form.Group>
            <Button variant="primary" onClick={handleSubmit}>
                Add
            </Button>
            <Button variant="danger" onClick={() => history("/")}>
                Cancel
            </Button>
        </Form>
    );
};
export default Create;
