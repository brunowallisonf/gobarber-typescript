import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';

interface Request {
    date: Date;
    provider_id: string;
}

export default class CreateAppointmentService {
    public async execute({ date, provider_id }: Request): Promise<Appointment> {
        const appointmentDate = startOfHour(date);
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );
        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
        );
        if (findAppointmentInSameDate) {
            throw Error('this appointment is already booked');
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });
        await appointmentsRepository.save(appointment);
        return appointment;
    }
}
