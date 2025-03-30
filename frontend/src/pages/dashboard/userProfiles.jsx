import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import { useEffect, useState } from "react";



export function UserProfiles() {


  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [userToShow, setUserToShow] = useState(null);

  const [userSuggestions, setUserSuggestions] = useState([]);
  useEffect(() => {
    // print the user from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
    }
    // console.log("User data:", user);
    console.log("User data:", user);


    // fetch suggested users from the json file
    // find the user which has id same as the id in the url
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    fetch("../../public/userSuggestions.json")

      .then((response) => response.json())
      .then((data) => {
        setUserSuggestions(data["Sheet1"]);
        const user = data["Sheet1"].find((user) => user.id === id);
        setUserToShow(user);
        console.log("User to show:", user);
      }); 





  }, []);

  
  return (
    <>
      <div className={"relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center"}>
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                // src={userToShow?.profile_picture}
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                }
                alt={userToShow?.name}
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {userToShow?.id}
                </Typography>
              </div>
            </div>
          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1">
           
            <ProfileInfoCard
              description={userToShow?.biography}
              details={{
                major: userToShow?.major ? userToShow.major.replace(",", " / ") : "N/A",
                gender: userToShow?.gender || "N/A",
                ethnicity: userToShow?.ethnicity || "N/A",
                interests: userToShow?.interests || "N/A",
                languages: userToShow?.languages || "N/A",
                social: (
                  <div className="flex items-center gap-4">
                    <i className="fa-brands fa-facebook text-blue-700" />
                    <i className="fa-brands fa-twitter text-blue-400" />
                    <i className="fa-brands fa-instagram text-purple-500" />
                  </div>
                ),
              }}
              // action={
              //   <Tooltip content="Edit Profile">
              //     <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500" />
              //   </Tooltip>
              // }
            />
           
          </div>
          <div className="px-4 pb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Achievements
            </Typography>
            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {projectsData.map(
                ({ img, title, description, tag, route, members }) => (
                  <Card key={title} color="transparent" shadow={false}>
                    <CardHeader
                      floated={false}
                      color="gray"
                      className="mx-0 mt-0 mb-4"
                    >
                      <img
                        src={img}
                        alt={title}
                        className="h-full w-full"
                      />
                    </CardHeader>
                    <CardBody className="py-0 px-1">
                      
                      <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mt-1 mb-2"
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        {description}
                      </Typography>
                    </CardBody>
                    
                  </Card>
                )
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default UserProfiles;
