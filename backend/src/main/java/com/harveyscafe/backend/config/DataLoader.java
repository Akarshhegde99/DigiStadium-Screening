package com.harveyscafe.backend.config;

import com.harveyscafe.backend.model.MatchSession;
import com.harveyscafe.backend.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private MatchRepository matchRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Checking/Loading initial match data...");
        List<MatchSession> existing = matchRepository.findAll();

        // Seed original IPL matches
        saveIfNotExist("LSG", "RCB", LocalDate.of(2026, 4, 15), LocalTime.of(19, 30), "COMPLETED", "/rcb-poster.jpg", existing);
        saveIfNotExist("RCB", "DC", LocalDate.of(2026, 4, 18), LocalTime.of(15, 30), "UPCOMING", "/rcb-poster.jpg", existing);
        saveIfNotExist("RCB", "GT", LocalDate.of(2026, 4, 24), LocalTime.of(19, 30), "UPCOMING", "/rcb-poster.jpg", existing);
        saveIfNotExist("DC", "RCB", LocalDate.of(2026, 4, 27), LocalTime.of(19, 30), "UPCOMING", "/rcb-poster.jpg", existing);
        saveIfNotExist("GT", "RCB", LocalDate.of(2026, 4, 30), LocalTime.of(19, 30), "UPCOMING", "/rcb-poster.jpg", existing);
        saveIfNotExist("LSG", "RCB", LocalDate.of(2026, 5, 7), LocalTime.of(19, 30), "UPCOMING", "/rcb-poster.jpg", existing);

        // Seed new upcoming India T20 matches (June/July 2026)
        saveIfNotExist("IND", "IRE", LocalDate.of(2026, 6, 26), LocalTime.of(19, 30), "UPCOMING", "/india-poster.png", existing);
        saveIfNotExist("IND", "IRE", LocalDate.of(2026, 6, 28), LocalTime.of(19, 30), "UPCOMING", "/india-poster.png", existing);
        saveIfNotExist("IND", "ENG", LocalDate.of(2026, 7, 1), LocalTime.of(19, 30), "UPCOMING", "/india-poster.png", existing);
        saveIfNotExist("IND", "ENG", LocalDate.of(2026, 7, 4), LocalTime.of(19, 30), "UPCOMING", "/india-poster.png", existing);
        saveIfNotExist("IND", "ENG", LocalDate.of(2026, 7, 7), LocalTime.of(19, 30), "UPCOMING", "/india-poster.png", existing);
        saveIfNotExist("IND", "ENG", LocalDate.of(2026, 7, 9), LocalTime.of(19, 30), "UPCOMING", "/india-poster.png", existing);
        saveIfNotExist("IND", "ENG", LocalDate.of(2026, 7, 11), LocalTime.of(19, 30), "UPCOMING", "/india-poster.png", existing);
        saveIfNotExist("IND", "ZIM", LocalDate.of(2026, 7, 23), LocalTime.of(19, 30), "UPCOMING", "/india-poster.png", existing);
        saveIfNotExist("IND", "ZIM", LocalDate.of(2026, 7, 25), LocalTime.of(19, 30), "UPCOMING", "/india-poster.png", existing);
        saveIfNotExist("IND", "ZIM", LocalDate.of(2026, 7, 26), LocalTime.of(19, 30), "UPCOMING", "/india-poster.png", existing);

        System.out.println("Match data check and seeding complete.");
    }

    private void saveIfNotExist(String team1, String team2, LocalDate date, LocalTime time, String status, String posterUrl, List<MatchSession> existing) {
        boolean exists = existing.stream().anyMatch(m -> 
            m.getTeam1().equalsIgnoreCase(team1) && 
            m.getTeam2().equalsIgnoreCase(team2) && 
            m.getMatchDate().equals(date)
        );
        if (!exists) {
            matchRepository.save(new MatchSession(null, team1, team2, date, time, status, posterUrl));
            System.out.println("Saved new match: " + team1 + " vs " + team2 + " on " + date);
        }
    }
}
