import axios from "axios";

export const getUsers = async () => {
    try {
        const res = await axios.get("http://localhost:5000/users/");
        return res.data;
    } catch (err) {
        console.log(err);
        return err;
    }
};

export const getUsersByUsername = async (username) => {
    try {
        const res = await axios.get("http://localhost:5000/users/" + username);
        return res.data
    } catch (err) {
        return {error: err.message}
    }
}