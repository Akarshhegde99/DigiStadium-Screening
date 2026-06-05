package com.harveyscafe.backend.service;

import com.harveyscafe.backend.dto.BookingRequestDTO;
import com.harveyscafe.backend.model.Booking;
import com.harveyscafe.backend.model.MatchSession;
import com.harveyscafe.backend.model.User;
import com.harveyscafe.backend.repository.BookingRepository;
import com.harveyscafe.backend.repository.MatchRepository;
import com.harveyscafe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private QrCodeService qrCodeService;

    public final static double PRICE_PER_TABLE = 499.0;

    @Transactional
    public Booking createBooking(BookingRequestDTO request, User user) {

        MatchSession match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found"));

        double total = request.getTables() * PRICE_PER_TABLE;

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setMatchSession(match);
        booking.setTables(request.getTables());
        booking.setTotalPrice(total);
        booking.setStatus("BOOKED");
        
        // Failsafe mechanism: always accept the booking even if payment fails
        if (request.getPaymentStatus() != null && request.getPaymentStatus().equalsIgnoreCase("PAID")) {
            booking.setPaymentStatus("PAID");
        } else {
            booking.setPaymentStatus("PENDING");
        }

        // Save initially to generate UUID
        booking = bookingRepository.save(booking);

        // Generate QR code containing the raw UUID
        String qrData = booking.getId();
        String qrCodeBase64 = qrCodeService.generateQrCodeBase64(qrData);
        booking.setQrCodeData(qrCodeBase64);

        return bookingRepository.save(booking);
    }
}
