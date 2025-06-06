import React, { useEffect, useState } from "react";
import {
    Bell,
    LayoutDashboard,
    User,
    Settings,
    Mail,
    Users,
    FileText,
    Pencil,
    Trash2,
    Trash,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";




const Sidebar = () => (
    <aside className="bg-[#121826] md:w-64 p-6 h-screen flex flex-col justify-between shadow-md border-r border-gray-700">
        <nav className="space-y-5 text-gray-300 font-medium">
            <Link to="/dashboard" className="flex items-center gap-3 hover:text-blue-400">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
            </Link>
            <Link to="/users" className="flex items-center gap-3 hover:text-blue-400">
                <Users className="w-5 h-5" />
                Utilisateurs
            </Link>
            <Link to="/settings" className="flex items-center gap-3 hover:text-blue-400">
                <Settings className="w-5 h-5" />
                Paramètres
            </Link>
            <Link to="/contact" className="flex items-center gap-3 hover:text-blue-400">
                <Mail className="w-5 h-5" />
                Contact
            </Link>
            <Link to="/events" className="flex items-center gap-3 hover:text-blue-400">
                <Mail className="w-5 h-5" />
                events
            </Link>
        </nav>
    </aside>
);



function Events() {
    const resetForm = () => {
        setForm({
            date: "",
            name: "",
            description: ""
        });
    };
    const handleCancel = () => {
        setIsDialogOpen(false);
        setSelectedEventIndex(null);
        resetForm();
    };
    const today = new Date();
    const [events, setEvents] = useState([]);
    const Navigate = useNavigate()
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [form, setForm] = useState({
        date: "",
        name: "",
        description: ""
    });
    const [selectedEventIndex, setSelectedEventIndex] = useState(null);
    const [showEventDetails, setShowEventDetails] = useState(null);
    const handleEditEvent = (index) => {
        setForm(events[index]);
        setSelectedEventIndex(index);
        setIsDialogOpen(true);
    };
    const handleSaveEvent = async () => {
        if (!form.name || !form.description || !form.date) {
            alert("Please fill in all required fields");
            return;
        }
        const method = selectedEventIndex == null ? 'POST' : "PUT"
        const link = selectedEventIndex == null ? 'http://localhost:5000/api/admin/events/' : "http://localhost:5000/api/admin/events/" + form._id
        try {
            const response = await fetch(link, {
                method: method,
                headers: { 'Content-Type': 'application/json', "authorization": 'Bearer ' + localStorage.getItem("token") },
                body: JSON.stringify(form)
            });
            const data = await response.json();
            if (response.ok) {
                console.log("form created successfully");
                toast.success('form created successfully');
                setTimeout(() => Navigate('/dashboard'), 2000);
            } else {
                toast.error(data.message || 'Erreur lors de creation.');
            }
        } catch (err) {
            toast.error('Erreur de réseau.');
        }
        const eventData = {
            ...form,
            color: form.platform === "other" ? form.color : platformColors[form.platform]
        };
        const updatedEvents = [...events];
        if (selectedEventIndex !== null) {
            updatedEvents[selectedEventIndex] = eventData;
        } else {
            updatedEvents.push(eventData);
        }
        setEvents(updatedEvents);
        setForm({
            date: "",
            name: "",
            description: ""
        });
        setIsDialogOpen(false);
        setSelectedEventIndex(null);
    };
    const handleDeleteEvent = async (index) => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/events/" + index, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json', "authorization": 'Bearer ' + localStorage.getItem("token") }
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('form deleted successfully');
                setTimeout(() => Navigate('/dashboard'), 2000);
            } else {
                toast.error(data.message || 'Erreur lors de delete.');
            }
        } catch (err) {
            toast.error('Erreur de réseau.');
        }
        const updatedEvents = events.filter((_, i) => i !== index);
        setEvents(updatedEvents);
        setShowEventDetails(null);
    };
    const EventForm = () => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 border border-gray-700 text-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4">
                        {selectedEventIndex !== null ? "Edit Event" : "Create New Event"}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1">Date *</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">event name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
                                placeholder="Enter event name"
                            />
                        </div>
                        <div>
                            <label className="block mb-1" >description *</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white h-24"
                                placeholder="Write your event description here..."
                            />
                        </div>

                    </div>

                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            onClick={handleSaveEvent}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                        >
                            {selectedEventIndex !== null ? "Update Event" : "Create Event"}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/admin/events", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        "authorization": 'Bearer ' + localStorage.getItem("token")
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setEvents(data);
                } else {
                    toast.error(data.message || 'Erreur de fetch.');
                }
            } catch (err) {
                toast.error('Erreur de réseau.');
            }
        };

        fetchEvents();
    }, [])
    return (
        <>
            {isDialogOpen && <EventForm />}
            <div className="min-h-screen flex flex-col bg-[#1e1e2f]">
                <header className="bg-[#1e1e2f] shadow-md p-4 flex justify-between items-center border-b border-gray-700">
                    <img src="/Images/Planifya-v2.png" alt="Logo" className="h-15" />
                    <div className="flex">
                        <button className="text-gray-300 hover:text-blue-400">
                            <Bell className="w-6 h-6" />
                        </button>
                        <button className="mx-3 bg-blue-600 hover:bg-blue-700 transition-all duration-200 px-5 py-2.5 rounded-full shadow-md hover:shadow-lg text-sm font-medium"
                            onClick={() => setIsDialogOpen(true)}>create event</button>
                    </div>
                </header>
                <div className="flex flex-1">
                    <Sidebar />
                    <div className="flex-grow">
                        <main className="flex justify-center items-start py-10 px-4 bg-[#1e1e2f] min-h-screen">
                            <div className="w-full max-w-6xl flex flex-col gap-8">
                                <div className="space-y-4">
                                    {events.length == 0 ? "no events" : events.map((event, index) => (
                                        <div key={index} className="bg-gray-700 rounded-lg p-4 flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="font-semibold text-lg">{event.name}</h3>
                                                    <div className="flex space-x-2 ml-4">
                                                        <button
                                                            onClick={() => handleEditEvent(events.findIndex(p => p == event))}
                                                            className="text-blue-400 hover:text-blue-300"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteEvent(event._id)}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-300 mb-2">
                                                    {new Date(event.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-sm text-gray-100">{event.description}</p>
                                            </div>
                                        </div>
                                    )
                                    )}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Events