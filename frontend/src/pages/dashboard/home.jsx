import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  Chip,
  Button,
  CardFooter,
  Divider,
  Input,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
  authorsTableData
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

export function Home() {

  const [userSuggestions, setUserSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [startPosition, setStartPosition] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const startInputRef = useRef(null);
  const destinationInputRef = useRef(null);

  useEffect(() => {
    // read JSON file and store in userSuggestions
    fetch("../../public/userSuggestions.json")
      .then((response) => response.json())
      .then((data) => {
        setUserSuggestions(data["Sheet1"]);
      });

    console.log("userSuggestions", userSuggestions);

    // Load Google Places Autocomplete for Start Point
    if (window.google) {
      const startAutocomplete = new window.google.maps.places.Autocomplete(
        startInputRef.current,
        { types: ["geocode"] }
      );
      startAutocomplete.addListener("place_changed", () => {
        const place = startAutocomplete.getPlace();
        setStartPosition(place.formatted_address || "");
      });

      // Load Google Places Autocomplete for Destination
      const destinationAutocomplete = new window.google.maps.places.Autocomplete(
        destinationInputRef.current,
        { types: ["geocode"] }
      );
      destinationAutocomplete.addListener("place_changed", () => {
        const place = destinationAutocomplete.getPlace();
        setDestination(place.formatted_address || "");
      });
    }
  }, []);

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.get("start")) {
      errors.start = "Start point is required";
    }
    if (!formData.get("destination")) {
      errors.destination = "Destination is required";
    }
    if (!formData.get("time")) {
      errors.time = "Time is required";
    }
    if (!formData.get("date")) {
      errors.date = "Date is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const isValid = validateForm(formData);
    if (isValid) {
      const start = formData.get("start");
      const destination = formData.get("destination");
      const time = formData.get("time");
      const date = formData.get("date");
      console.log("Start:", start);
      console.log("Destination:", destination);
      console.log("Time:", time);
      console.log("Date:", date);
      setStartPosition(start);
      setDestination(destination);
      setTime(time);
      setDate(date);

      setShowSuggestions(true);
    }
  };

  return (
    <div className="flex max-w-screen-lg flex-col ">

      <div className="mt-12">
        <Card >
          <CardHeader variant="gradient" color="gray" className=" p-6">
            <Typography variant="h6" color="white">
              Enter the Details
            </Typography>
          </CardHeader>
          <CardBody>
            <form
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="start">Start Point</label>
                <Input
                  type="text"
                  id="start"
                  name="start"
                  placeholder="e.g. New York"
                  ref={startInputRef}
                  className={formErrors.start ? "border-red-500" : ""}
                />
                {formErrors.start && (
                  <Typography className="text-xs text-red-500">
                    {formErrors.start}
                  </Typography>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="destination">Destination</label>
                <Input
                  type="text"
                  id="destination"
                  name="destination"
                  placeholder="e.g. London"
                  ref={destinationInputRef}
                  className={formErrors.destination ? "border-red-500" : ""}
                />
                {formErrors.destination && (
                  <Typography className="text-xs text-red-500">
                    {formErrors.destination}
                  </Typography>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="time">Time</label>
                <Input
                  type="time"
                  id="time"
                  name="time"
                  className={formErrors.time ? "border-red-500" : ""}
                />
                {formErrors.time && (
                  <Typography className="text-xs text-red-500">
                    {formErrors.time}
                  </Typography>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="date">Date</label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  className={formErrors.date ? "border-red-500" : ""}
                />
                {formErrors.date && (
                  <Typography className="text-xs text-red-500">
                    {formErrors.date}
                  </Typography>
                )}
              </div>
              <div className="md:col-span-2">
                <Button type="submit" variant="gradient" fullWidth>
                  Submit
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>

      {showSuggestions && (
        <div className="mt-12" id="suggested-people">
          <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <Typography variant="h6" color="white">
                Suggested People to walk with
              </Typography>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Name", "Start and Destination", "Arrive By", "Referred", "Introduced", ""].map((el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userSuggestions.slice(0, 5).map(
                    ({ id, starting_pos, destination, arrive_by, rating, referred, introduced }, key) => {
                      const className = `py-3 px-5 ${
                        key === authorsTableData.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;

                      return (
                        <tr key={id}>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <Avatar src={"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"} alt={id} size="sm" variant="rounded" />
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
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {referred}
                            </Typography>
                          </td>

                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {introduced}
                            </Typography>
                          </td>

                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      )}
                    
    </div>
  );
}

