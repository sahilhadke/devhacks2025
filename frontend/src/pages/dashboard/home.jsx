import React from "react";
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
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const start = formData.get("start");
                      const destination = formData.get("destination");
                      const time = formData.get("time");
                      const date = formData.get("date");
                      alert(`Start: ${start}, Destination: ${destination}, Time: ${time}, Date: ${date}`);
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <label htmlFor="start">Start Point</label>
                      <Input
                        type="text"
                        id="start"
                        name="start"
                        placeholder="e.g. New York"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="destination">Destination</label>
                      <Input
                        type="text"
                        id="destination"
                        name="destination"
                        placeholder="e.g. London"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="time">Time</label>
                      <Input type="time" id="time" name="time" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="date">Date</label>
                      <Input type="date" id="date" name="date" />
                    </div>
                    <Button type="submit" variant="gradient" fullWidth>
                      Submit
                    </Button>
                  </form>
                </CardBody>
</Card>
    </div>

    <div className="mt-12">

  


            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                  <Typography variant="h6" color="white">
                    Authors Table
                  </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                  <table className="w-full min-w-[640px] table-auto">
                    <thead>
                      <tr>
                        {["author", "function", "status", "employed", ""].map((el) => (
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
                      {authorsTableData.map(
                        ({ img, name, email, job, online, date }, key) => {
                          const className = `py-3 px-5 ${
                            key === authorsTableData.length - 1
                              ? ""
                              : "border-b border-blue-gray-50"
                          }`;
        
                          return (
                            <tr key={name}>
                              <td className={className}>
                                <div className="flex items-center gap-4">
                                  <Avatar src={img} alt={name} size="sm" variant="rounded" />
                                  <div>
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="font-semibold"
                                    >
                                      {name}
                                    </Typography>
                                    <Typography className="text-xs font-normal text-blue-gray-500">
                                      {email}
                                    </Typography>
                                  </div>
                                </div>
                              </td>
                              <td className={className}>
                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                  {job[0]}
                                </Typography>
                                <Typography className="text-xs font-normal text-blue-gray-500">
                                  {job[1]}
                                </Typography>
                              </td>
                              <td className={className}>
                                <Chip
                                  variant="gradient"
                                  color={online ? "green" : "blue-gray"}
                                  value={online ? "online" : "offline"}
                                  className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                />
                              </td>
                              <td className={className}>
                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                  {date}
                                </Typography>
                              </td>
                              <td className={className}>
                                <Typography
                                  as="a"
                                  href="#"
                                  className="text-xs font-semibold text-blue-gray-600"
                                >
                                  Edit
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

   
                      
    </div>
  );
}

export default Home;

