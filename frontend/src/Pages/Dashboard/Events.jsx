import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    LayoutDashboard, PartyPopper,
    Plus, Calendar, Pencil, Trash, X, Loader2, Wand2,
    Bell, ChevronLeft, ChevronRight
} from "lucide-react";
import {
    fetchAllEvents, createEvent, updateEvent, deleteEvent, seedEventsFromCalendarific
} from "../../features/adminSlice";
import SideBar from "./SideBar";

const EventCard = ({ event, onEdit, onDelete }) => (
    <div className="bg-[#121826] border border-gray-700/50 rounded-lg p-5 flex flex-col justify-between shadow-lg hover:border-blue-600/50 transition-all duration-300">
        <div>
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-white mb-2">{event.name}</h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(event)} className="p-1.5 text-gray-400 hover:text-blue-400"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(event._id)} className="p-1.5 text-gray-400 hover:text-red-400"><Trash className="w-4 h-4" /></button>
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>
        </div>
    </div>
);

const EventFormModal = ({ isOpen, onClose, onSave, eventToEdit, loading }) => {
    const [form, setForm] = useState({ date: '', name: '', description: '' });

    useEffect(() => {
        if (eventToEdit) {
            const dateForInput = eventToEdit.date ? new Date(eventToEdit.date).toISOString().split('T')[0] : '';
            setForm({ ...eventToEdit, date: dateForInput });
        } else {
            setForm({ date: '', name: '', description: '' });
        }
    }, [eventToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };


    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e1e2f] border border-gray-700 text-white p-6 rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{eventToEdit ? "Edit Event" : "Create New Event"}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Event Name *</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Date *</label>
                        <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none" required />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 font-semibold text-sm">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold text-sm flex items-center gap-2 disabled:bg-blue-800">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {loading ? 'Saving...' : (eventToEdit ? 'Update Event' : 'Create Event')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`w-8 h-8 rounded-md transition-colors ${currentPage === number
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};


const Navbar = () => (
    <header className="bg-[#1e1e2f] shadow-md p-4 flex justify-between items-center border-b border-gray-700">
        <img src="/Images/Planifya-v2.png" alt="Logo" className="h-10" />
        <button className="text-gray-300 hover:text-blue-400">
            <Bell className="w-6 h-6" />
        </button>
    </header>
);

function EventsPage() {
    const dispatch = useDispatch();
    const { events, loading, error } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const EVENTS_PER_PAGE = 5;

    useEffect(() => {
        dispatch(fetchAllEvents());
    }, [dispatch]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const handleOpenModal = (event = null) => {
        setEventToEdit(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEventToEdit(null);
        setIsModalOpen(false);
    };

    const handleSave = (formData) => {
        const action = formData._id
            ? updateEvent({ id: formData._id, eventData: formData })
            : createEvent(formData);

        dispatch(action).unwrap().then(() => {
            toast.success(`Event ${formData._id ? 'updated' : 'created'} successfully!`);
            handleCloseModal();
        }).catch((err) => {
            toast.error(err.message || "Failed to save event.");
        });
    };

    const handleDelete = (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            dispatch(deleteEvent(eventId)).unwrap().then(() => {
                toast.success("Event deleted successfully.");
            }).catch((err) => {
                toast.error(err.message || "Failed to delete event.");
            });
        }
    };

    const handleSeed = () => {
        if (window.confirm("This will add this year's public holidays for Morocco. Proceed?")) {
            dispatch(seedEventsFromCalendarific()).unwrap().then((response) => {
                toast.success(`${response.count} events seeded successfully!`);
                dispatch(fetchAllEvents());
            }).catch((err) => {
                toast.error(err.message || "Failed to seed events.");
            });
        }
    };

    const handleLogoutCancel = () => {
        setIsLogoutConfirmOpen(false);
    };

    const handleLogoutConfirm = () => {
        setIsLogoutConfirmOpen(false);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    // Pagination Logic
    const indexOfLastEvent = currentPage * EVENTS_PER_PAGE;
    const indexOfFirstEvent = indexOfLastEvent - EVENTS_PER_PAGE;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);

    return (
        <>
            <Navbar />

            <div className="min-h-screen flex bg-[#1e1e2f] text-white">
                <SideBar activePage="events" />

                {isLogoutConfirmOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 max-w-full text-center">
                            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
                            <p className="mb-6">Are you sure you want to log out?</p>
                            <div className="flex justify-center space-x-4">
                                <button onClick={handleLogoutCancel} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors">Cancel</button>
                                <button onClick={handleLogoutConfirm} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-white">Logout</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex-1 flex flex-col">
                    <main className="flex-grow p-6">
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white">Event Management</h1>
                                <p className="text-gray-400 mt-1">Create, edit, and manage global events for all users.</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleSeed} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                                    <Wand2 className="w-5 h-5" /> Seed Holidays
                                </button>
                                <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                                    <Plus className="w-5 h-5" /> Create Event
                                </button>
                            </div>
                        </header>

                        {loading && events.length === 0 ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                            </div>
                        ) : !loading && events.length === 0 ? (
                            <div className="text-center py-20 bg-[#121826] rounded-lg border-2 border-dashed border-gray-700">
                                <PartyPopper className="mx-auto h-12 w-12 text-gray-500" />
                                <h3 className="mt-2 text-xl font-semibold text-white">No Events Found</h3>
                                <p className="mt-1 text-sm text-gray-400">Get started by creating a new event or seeding holidays.</p>
                                <button onClick={() => handleOpenModal()} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors mx-auto">
                                    <Plus className="w-5 h-5" /> Create Event
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {currentEvents.map((event) => (
                                        <EventCard key={event._id} event={event} onEdit={handleOpenModal} onDelete={handleDelete} />
                                    ))}
                                </div>
                                <div className="mt-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={(page) => setCurrentPage(page)}
                                    />
                                </div>
                            </>
                        )}
                    </main>
                </div>
                <EventFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    eventToEdit={eventToEdit}
                    loading={loading}
                />
            </div>
        </>
    );
}

export default EventsPage;
