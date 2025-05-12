import React, { Component } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { RiFileInfoLine } from "react-icons/ri";

export class AvailablePosts extends Component {
    jobList = [
        {
            company: "Match Company Limited",
            title: "Développeur Full Stack Sénior HIF (7 Year Exp.)",
            location: "Rabat",
            type: "Full Time"
        },
        {
            company: "Tech Innovators Inc.",
            title: "Frontend Developer React (3+ Years)",
            location: "Casablanca",
            type: "Part Time"
        },
        {
            company: "Data Solutions SARL",
            title: "Data Analyst Junior",
            location: "Marrakech",
            type: "Full Time"
        },
        {
            company: "AI Future Labs",
            title: "Machine Learning Engineer",
            location: "Fès",
            type: "Remote"
        },
        {
            company: "NextGen Web Studio",
            title: "UI/UX Designer",
            location: "Agadir",
            type: "Full Time"
        }
    ];

    render() {
        return (
            <div className='min-h-screen p-10'>
                <div className="flex justify-between items-end px-4">
                    <h1 className="text-5xl font-bold">Recent Jobs Available</h1>
                    <a href="#" className='text-emerald-600 underline'>View all</a>
                </div>

                <div className="offers space-y-6 mt-10">
                    {this.jobList.map((job, index) => (
                        <div
                            key={index}
                            className="offer flex justify-between items-center border p-5 rounded-2xl hover:bg-blue-50 transition-colors duration-200"
                        >
                            <div className="details">
                                <p className="text-gray-500">{job.company}</p>
                                <h1 className='text-2xl font-bold text-gray-800'>{job.title}</h1>
                                <div className="flex gap-5 py-2 text-gray-600">
                                    <p><FaLocationDot className='inline mr-1' /> {job.location}</p>
                                    <p><RiFileInfoLine className='inline mr-1' /> {job.type}</p>
                                </div>
                            </div>
                            <button className='bg-[#514BEE] hover:bg-[#3e39c9] transition duration-200 text-white font-semibold px-5 py-2 rounded-full shadow-md'>
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default AvailablePosts;
