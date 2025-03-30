import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  Button,
  CardBody,
  Link,
  Alert,
} from "@material-tailwind/react";
import { InformationCircleIcon, CheckIcon, BeakerIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Notifications() {
  const [showAlerts, setShowAlerts] = React.useState({
    blue: false,
    green: false,
    orange: false,
    red: false,
  });
  const [showAlertsWithIcon, setShowAlertsWithIcon] = React.useState({
    blue: false,
    green: false,
    orange: false,
    red: false,
  });
  const alerts = ["gray", "green", "orange", "red"];

  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // fetch suggested users from the json file
    fetch("../../public/userSuggestions.json")
      .then((response) => response.json())
      .then((data) => {
        setSuggestedUsers(data["Sheet1"]);
      });

  }, []);

  const handleViewProfile = (id) => {
    navigate(`/dashboard/user-profiles?id=${id}`);
  };

  const filteredUsers = suggestedUsers.filter((user) =>
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.starting_pos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAccept = (id) => {
    setSuggestedUsers(suggestedUsers.filter((user) => user.id !== id));
    setShowAlerts((prev) => ({
      ...prev,
      green: true,
    }));
    setTimeout(() => {
      setShowAlerts((prev) => ({
        ...prev,
        green: false,
      }));
    }, 3000);
  };

  const handleDecline = (id) => {
    setSuggestedUsers(suggestedUsers.filter((user) => user.id !== id));
    setShowAlerts((prev) => ({
      ...prev,
      red: true,
    }));
    setTimeout(() => {
      setShowAlerts((prev) => ({
        ...prev,
        red: false,
      }));
    }, 3000);
  };

  return (
    <div className="mx-auto my-20 flex flex-col gap-8">
      {showAlerts.green && (
        <Alert
          color="green"
          className="mb-4"
          onClose={() => setShowAlerts((prev) => ({ ...prev, green: false }))}
        >
          <Typography variant="small">User accepted!</Typography>
        </Alert>
      )}
      {showAlerts.red && (
        <Alert
          color="red"
          className="mb-4"
          onClose={() => setShowAlerts((prev) => ({ ...prev, red: false }))}
        >
          <Typography variant="small">User declined!</Typography>
        </Alert>
      )}
      <Card>
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="m-0 p-4"
        >
          <Typography variant="h5" color="blue-gray">
            Connections
          </Typography>
          {/* <input
            type="text"
            placeholder="Search user profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-4 w-full rounded border border-gray-300 p-2"
          /> */}
        </CardHeader>
        <CardBody className="px-4 pb-4">
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left">
              <tbody>
                {filteredUsers.slice(0, 5).map(
                  ({ id, starting_pos, destination, arrive_by, rating, referred, introduced }, key) => {
                    const className = `py-3 px-5 ${
                      key === filteredUsers.length - 1 ? "" : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={id}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                              }
                              alt={id}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {id}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500">
                                {rating}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-600">
                            {starting_pos} to
                          </Typography>
                          <Typography className="text-xs font-bold text-blue-gray-500">
                            {destination}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {arrive_by}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Button
                              variant="contained"
                              color="green"
                              className="px-4 py-2"
                              onClick={() => handleAccept(id)}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="contained"
                              color="red"
                              className="px-4 py-2"
                              onClick={() => handleDecline(id)}
                            >
                              Decline
                            </Button>
                            <Button
                              variant="contained"
                              color="blue"
                              className="px-4 py-2"
                              onClick={() => handleViewProfile(id)}
                            >
                              View Profile
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Notifications;

