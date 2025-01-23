"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { Card, CardContent } from "@/components/ui/Card";

const DoctorAnalytics = () => {
    const appointments = useSelector((state: RootState) => state.appointments.list);

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter((a) => a.status === "completed").length;
    const upcomingAppointments = appointments.filter((a) => a.status === "upcoming").length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardContent className="p-4">
                    <h3 className="font-bold">Total Appointments</h3>
                    <p className="text-2xl">{totalAppointments}</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <h3 className="font-bold">Completed Appointments</h3>
                    <p className="text-2xl">{completedAppointments}</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <h3 className="font-bold">Upcoming Appointments</h3>
                    <p className="text-2xl">{upcomingAppointments}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default DoctorAnalytics;
