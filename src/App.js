import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
    const [data, setData] = useState([]);
    const [item, setItem] = useState("");
    const [changes, setChanges] = useState(0);
    useEffect(
        function getData() {
            axios
                .get("http://127.0.0.1:5000/data/get")
                .then((response) => {
                    setData(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        [changes]
    );
    return (
        <>
            <div>
                <form>
                    <input
                        placeholder="Add Todo"
                        onChange={(e) => setItem(e.target.value)}
                        value={item}
                    />
                    <button onClick={postData}>Add</button>
                </form>
            </div>
            {data.map((item, index) => (
                <div key={index}>
                    <h1
                        style={
                            item.pending
                                ? null
                                : { textDecoration: "line-through" }
                        }
                    >
                        Todo: {item.todo}
                    </h1>
                    <h3>Pending: {item.pending ? "True" : "False"}</h3>
                    <h3>Added On: {item.addedon}</h3>
                    <button onClick={() => handlePending(item._id, false)}>
                        Done
                    </button>
                    <button onClick={() => handlePending(item._id, true)}>
                        Doing
                    </button>
                    <button onClick={() => handleDelete(item._id)}>
                        Delete
                    </button>
                </div>
            ))}
        </>
    );
    function postData() {
        axios
            .post("http://127.0.0.1:5000/data/post", {
                todo: item,
                pending: true,
            })
            .then(
                (response) => setData(response.data),
                setItem(""),
                setChanges(changes + 1)
            );
    }
    function handleDelete(id) {
        axios
            .post("http://127.0.0.1:5000/data/delete", {
                _id: id,
            })
            .then(
                (response) => setData(response.data),
                setItem(""),
                setChanges(changes + 1)
            );
    }
    function handlePending(id, pending) {
        axios
            .post("http://127.0.0.1:5000/data/update", {
                _id: id,
                pending: pending,
            })
            .then(
                (response) => setData(response.data),
                setItem(""),
                setChanges(changes + 1)
            );
    }
}
