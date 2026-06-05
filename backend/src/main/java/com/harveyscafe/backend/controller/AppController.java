package com.harveyscafe.backend.controller;

import com.harveyscafe.backend.dto.BookingRequestDTO;
import com.harveyscafe.backend.model.Booking;
import com.harveyscafe.backend.model.MatchSession;
import com.harveyscafe.backend.repository.BookingRepository;
import com.harveyscafe.backend.repository.MatchRepository;
import com.harveyscafe.backend.service.BookingService;
import com.harveyscafe.backend.service.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AppController {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private StripeService stripeService;

    @GetMapping("/matches")
    public List<MatchSession> getUpcomingMatches() {
        return matchRepository.findAll();
    }

    @GetMapping("/bookings/my-bookings")
    public ResponseEntity<?> getMyBookings() {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof com.harveyscafe.backend.model.User) {
            com.harveyscafe.backend.model.User user = (com.harveyscafe.backend.model.User) principal;
            List<Booking> bookings = bookingRepository.findByUserId(user.getId());
            return ResponseEntity.ok(bookings);
        }
        return ResponseEntity.status(401).body("Unauthorized: Please log in to view bookings.");
    }

    @PostMapping("/bookings/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDTO request) {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof com.harveyscafe.backend.model.User) {
            com.harveyscafe.backend.model.User user = (com.harveyscafe.backend.model.User) principal;
            Booking booking = bookingService.createBooking(request, user);
            return ResponseEntity.ok(booking);
        }
        return ResponseEntity.status(401).body("Unauthorized: Please log in to book.");
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<?> getBooking(@PathVariable String id) {
        List<Booking> bookings = bookingRepository.findByIdStartingWithIgnoreCase(id);
        if (!bookings.isEmpty()) {
            return ResponseEntity.ok(bookings.get(0));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/bookings/{id}/check-in")
    public ResponseEntity<?> checkInBooking(@PathVariable String id) {
        List<Booking> bookings = bookingRepository.findByIdStartingWithIgnoreCase(id);
        if (bookings.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Booking booking = bookings.get(0);
        booking.setStatus("CHECKED_IN");
        booking.setPaymentStatus("PAID");
        bookingRepository.save(booking);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/payment/create-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> body) {
        Double amount = Double.parseDouble(body.get("amount").toString());
        Map<String, String> result = stripeService.createPaymentIntent(amount);
        return ResponseEntity.ok(result);
    }
}
