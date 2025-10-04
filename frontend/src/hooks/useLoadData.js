import { useEffect, useState } from "react";
import { getUserData } from "../https";
import { useDispatch } from "react-redux";
import { setUser, removeUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const useLoadData = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        const fetchUser = async () => {
            try {
                const { data } = await getUserData();
                const { _id, name, email, role, schedule } = data.data;
                dispatch(setUser({ _id, name, email, schedule, role }));
            } catch (error) {
                dispatch(removeUser());
                navigate("/auth");
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUser();
    }, [dispatch,navigate]);

    return isLoading;
}

export default useLoadData;