import { useEffect, useState } from "react";
import InputGroup from "./components/InputGroup";
import UserContainer from "./components/UserContainer";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./contexts/UserContext";
import { css } from "@emotion/react";
import BarLoader from "react-spinners/BarLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 20px auto;
  border-color: blue;
`;

function App() {
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    date_of_birth: "",
  });
  useEffect(() => {
    setIsLoading(true);
    Axios({
      method: "GET",
      url: "https://fathomless-bastion-81493.herokuapp.com/api/users",
    })
      .then((res) => {
        setUsers(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [setIsLoading]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevValue) => {
      if (name === "first_name") {
        return {
          first_name: value,
          last_name: prevValue.last_name,
          username: prevValue.username,
          date_of_birth: prevValue.date_of_birth,
        };
      } else if (name === "last_name") {
        return {
          first_name: prevValue.first_name,
          last_name: value,
          username: prevValue.username,
          date_of_birth: prevValue.date_of_birth,
        };
      } else if (name === "username") {
        return {
          first_name: prevValue.first_name,
          last_name: prevValue.last_name,
          username: value,
          date_of_birth: prevValue.date_of_birth,
        };
      } else if (name === "date_of_birth") {
        return {
          first_name: prevValue.first_name,
          last_name: prevValue.last_name,
          username: prevValue.username,
          date_of_birth: value,
        };
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    Axios({
      method: "POST",
      data: formData,
      url: "https://fathomless-bastion-81493.herokuapp.com/api/user",
    })
      .then((res) => {
        if (res.data.message) {
          toast.error(res.data.message);
          setIsSubmitting(false);
        } else {
          setIsSubmitting(false);
          toast.success("Successfully added a new user!");
          setFormData({
            first_name: "",
            last_name: "",
            username: "",
            date_of_birth: "",
          });
          Axios({
            method: "GET",
            url: "https://fathomless-bastion-81493.herokuapp.com/api/users",
          })
            .then((res) => {
              setUsers(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        toast.error("An error has occurred");
        console.log(err);
      });
  };
  function order(a, b) {
    return a < b ? 1 : a > b ? 0 : -1;
  }
  return (
    <UserContext.Provider value={{ users, setUsers }}>
      <div className="wrapper flex flex-col h-screen justify-center items-center">
        <ToastContainer />
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          method="POST"
          action="/api/user"
          className="form basis-2/5 w-full h-full grid grid-cols-3 grid-rows-2 gap-6"
        >
          <InputGroup
            change={(e) => {
              handleChange(e);
            }}
            label="First Name"
            name="first_name"
            value={formData.first_name}
          />
          <InputGroup
            change={(e) => {
              handleChange(e);
            }}
            label="Last Name"
            name="last_name"
            value={formData.last_name}
          />
          <InputGroup
            change={(e) => {
              handleChange(e);
            }}
            label="Username"
            name="username"
            value={formData.username}
          />
          <InputGroup
            change={(e) => {
              handleChange(e);
            }}
            label="Date of Birth"
            name="date_of_birth"
            value={formData.date_of_birth}
          />
          <button
            className="outline-none rounded-lg px-4 py-3 bg-blue-800 text-white self-end col-start-3 col-end-4 row-start-1 row-end-2 hover:bg-blue-600 cursor-pointer disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
            disabled={isSubmitting ? true : false}
          >
            {isSubmitting ? "Submitting..." : "SUBMIT"}
          </button>
        </form>
        <div className="users basis-3/5 w-full h-full mt-6 relative overflow-scroll">
          <div className="users absolute w-full bg-gray-200 rounded-lg px-4 py-2">
            Users
          </div>
          <div className="users-container h-full pt-8">
            <BarLoader loading={isLoading} css={override} size={150} />
            {users
              .map((user) => (
                <UserContainer
                  key={user._id}
                  name_prefix={user.name_prefix}
                  username={user.username}
                  full_name={`${user.first_name} ${user.last_name}`}
                  date_of_birth={user.date_of_birth}
                />
              ))
              .sort(order)}
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;
