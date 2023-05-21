import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
const endpoint = "http://localhost/meetings-crud/public/api/";
const Update = () => {
    let history = useNavigate();
    let location = useLocation();
    const [data, setData] = useState({
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
            data.initial_date === "" ||
            data.end_date === "" ||
            data.room_id === "" ||
            data.room_id === "0"
        )
            alert("Bro fill all the fields");
        else {
            compareDates(dateReferenceFirst, dateReferenceSecond, data.room_id);
        }
    };

    const compareDates = (initial_date, end_date, room) => {
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

            formData.append("name_user", location.state.name_user);
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
            <h1>Update a meeting</h1>
            <Form.Group className="mb-3">
                <Form.Label>Full name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Please type your name"
                    value={location.state.name_user}
                    disabled={true}
                    name="name_user"
                    onLoad={onChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>New room</Form.Label>
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
                <Form.Label>Old starting date</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={location.state.initial_date}
                    name="initial_date_old"
                    disabled={true}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Old finish date</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={location.state.end_date}
                    name="end_date_old"
                    disabled={true}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>New starting date</Form.Label>
                <Form.Control
                    type="datetime-local"
                    name="initial_date"
                    onChange={onChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>New finish date</Form.Label>
                <Form.Control
                    type="datetime-local"
                    name="end_date"
                    onChange={onChange}
                />
            </Form.Group>
            <Button variant="primary" onClick={handleSubmit}>
                Update
            </Button>
            <Button variant="danger" onClick={() => history("/")}>
                Cancel
            </Button>
        </Form>
    );
};
export default Update;
