import { useContext } from "react";
import { TrashIcon } from "@heroicons/react/outline";
import Axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../contexts/UserContext";
function UserContainer(props) {
  const { setUsers } = useContext(UserContext);
  let message = "";
  const handleDelete = () => {
    Axios({
      method: "DELETE",
      url: `https://fathomless-bastion-81493.herokuapp.com/api/${props.username}`,
    })
      .then((res) => {
        message = res.data.message;
        Axios({
          method: "GET",
          url: "https://fathomless-bastion-81493.herokuapp.com/api/users",
        })
          .then((res) => {
            toast.success(message);
            setUsers(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        toast.err("An err has occurred");
        console.log(err);
      });
  };
  return (
    <div className="flex w-full justify-between items-center mt-8 pb-2 border-b-2">
      <div className="grid grid-cols-3 justify-start items-center w-3/5">
        <div className="name-prefix mx-10 flex justify-center items-center bg-blue-800 text-white font-bold rounded-full h-14 w-14">
          <span className="text-xl">{props.name_prefix}</span>
        </div>
        <div className="username">{props.username}</div>
        <div className="full-name">{props.full_name}</div>
      </div>
      <div className="flex justify-around items-baseline">
        <div className="date-of-birth mx-5">{props.date_of_birth}</div>
        <TrashIcon
          onClick={handleDelete}
          className="h-5 w-5 mx-5 text-red-600 cursor-pointer hover:text-red-900"
        />
      </div>
    </div>
  );
}

export default UserContainer;
